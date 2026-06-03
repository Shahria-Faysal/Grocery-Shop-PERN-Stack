import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const protect = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        })

        if(req.user && req.user.isBlocked) {
            return res.status(401).json({
                success: false,
                message: "Your account has been blocked, please contact support"
            })
        }

        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Token Invalid"
        });
    }
}

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