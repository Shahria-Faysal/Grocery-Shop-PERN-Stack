import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 2. Check cookies (IMPORTANT)
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (req.user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked"
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Token invalid"
        });
    }
};

// role based authentication
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role.toLowerCase())) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this route"
            });
        }
        next();
    }
}