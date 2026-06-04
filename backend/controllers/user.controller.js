import prisma from "../lib/prisma.js";


// get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
    } catch (err) {
        const status = err.status ?? 500;
        return res.status(status).json({ error: err.message });
    }
}


// get user details
export const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (err) {
        const status = err.status ?? 500;
        return res.status(status).json({ error: err.message });
    }
}


// get user by id for admin
export const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id }
        });
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (err) {
        const status = err.status ?? 500;
        return res.status(status).json({ error: err.message });
    }
}


// Edit user
export const updateUser = async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: req.body
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (err) {
        const status = err.status ?? 500;
        return res.status(status).json({ error: err.message });
    }
}

// Edit user by id for admin
export const updateUserById = async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: req.body
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (err) {
        const status = err.status ?? 500;
        return res.status(status).json({ error: err.message });
    }
}


// block / unblock user
export const setUserBlockStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isBlocked } = req.body;

        if (typeof isBlocked !== "boolean") {
            return res.status(400).json({ error: "isBlocked must be boolean" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isBlocked },
        });

        res.json({
            message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
            user: updatedUser,
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// delete user
export const deleteUser = async (req, res) => {
    try {
        const user = await prisma.user.delete({
            where: { id: req.params.id }
        });
        return res.status(200).json(user);
    } catch (err) {
        const status = err.status ?? 500;
        return res.status(status).json({ error: err.message });
    }
}
