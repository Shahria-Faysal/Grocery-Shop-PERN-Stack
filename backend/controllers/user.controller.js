import prisma from "../lib/prisma.js";


// get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: {
                        orders: true
                    }
                }
            }
        });
        return res.status(200).json(users);
    } catch (err) {
        const status = err.status ?? 500;
        return res.status(status).json({ error: err.message });
    }
}


// get user details
export const getUser = async (req, res) => {
    try {
        const id = Number(req.user.id);
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        cart_items: true
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({user, cartCount: user._count.cart_items});
    } catch (err) {
        const status = err.status ?? 500;
        return res.status(status).json({ error: err.message });
    }
}


// get user by id for admin
export const getUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await prisma.user.findUnique({
            where: { id }
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


// Edit user
export const updateUser = async (req, res) => {
    try {
        const id = Number(req.user.id);
        const user = await prisma.user.update({
            where: { id },
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
        const id = Number(req.params.id);
        const user = await prisma.user.update({
            where: { id },
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
        if (req.params.id === req.user.id) {
            return res.status(403).json({ error: "You cannot block yourself" });
        }

        const id = Number(req.params.id);
        const { isBlocked } = req.body;

        if (typeof isBlocked !== "boolean") {
            return res.status(400).json({ error: "isBlocked must be boolean" });
        }

        const targetUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!targetUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (targetUser.role === "admin") {
            return res.status(403).json({ error: "Admin cannot be blocked" });
        }


        const updatedUser = await prisma.user.update({
            where: { id },
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
        const id = Number(req.params.id);
        const user = await prisma.user.delete({
            where: { id }
        });
        return res.status(200).json(user);
    } catch (err) {
        const status = err.status ?? 500;
        return res.status(status).json({ error: err.message });
    }
}
