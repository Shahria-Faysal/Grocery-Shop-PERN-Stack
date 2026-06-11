import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


//register user
export const register = async (req, res) => {
    try {
        const { name, email, password, user_type, phone, role } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const userExist = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        console.log("TOKEN:", verificationToken);

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                user_type: user_type,
                role: role,
                phone: phone,
                verificationToken: verificationToken,
                verificationTokenExpires: verificationTokenExpires
            }
        })

        try {
            await sendEmail({
                email,
                subject: "Verify your email",
                message: `<p>Your verification token is <strong>${verificationToken}</strong></p><p>Please enter this code in verification page to activate your account</p>`
            })
        } catch (err) {
            console.error("Failed to send verification email", err);
        }

        res.status(201).json({
            message: "User registered successfully. Please check your email to verify your account",
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// verify email
export const verifyEmail = async (req, res) => {
    try {
        const { email, token } = req.body;

        if (!email || !token) {
            return res.status(400).json({ message: "Please provide email and token" });
        }

        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        if (user.verificationToken !== token) {
            return res.status(400).json({ message: "Invalid verification token" });
        }

        if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
            return res.status(400).json({ message: "Verification token has expired. Please register again" });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpires: null
            }
        });

        res.status(200).json({ message: "Email verified successfully. You can now log in" });

    } catch (error) {
        console.error("Verify email error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


// login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            })
        }

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                message: "Please verify your email or contact support"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



//forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "No user found with that email address" });
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpire: resetPasswordExpire
            }
        });
        const clientUrl = "http://localhost:5173";
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
        const message = `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Please click on the link below to reset your password:</p>
            <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
            <p>This link will expire in 15 minutes.</p>
        `;
        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset - Grocery Shop",
                message,
            });
            res.status(200).json({ message: "Password reset email sent", success: true });
        } catch (error) {
            // Cleanup token on email failure
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetPasswordToken: null,
                    resetPasswordExpire: null
                }
            });
            return res.status(500).json({ message: "Could not send email", success: false });
        }
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};

// reset password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpire: { gt: new Date() }
            }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token", success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpire: null
            }
        });
        res.status(200).json({ message: "Password reset successfully", success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// get user data
// export const getMe = async (req, res) => {
//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 id: req.user.id
//             }
//         })
//         return res.status(200).json({
//             message: "User fetched successfully",
//             user
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error"
//         })
//     }
// }

//logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
