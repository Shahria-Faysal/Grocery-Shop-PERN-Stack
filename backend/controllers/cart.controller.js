import prisma from "../lib/prisma";


// get cart
export const getCartItems = async (req, res) => {
    try {
        const id = Number(req.user.id)
        const cartItems = await prisma.cartItem.findMany({
            where: {
                userId: id
            }
        })
        return res.status(200).json({
            message: "Cart fetched successfully",
            cartItems
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// add item to cart
export const addToCart = async (req, res) => {
    if(req.user.role !== "user") {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const id = Number(req.user.id)
        const { productId, quantity } = req.body
        if(!productId || !quantity) {
            return res.status(400).json({
                message: "Please provide all the details"
            })
        }
        const cartItem = await prisma.cartItem.create({
            data: {
                quantity: Number(quantity),
                user_id: id,
                product_id: Number(productId)
            }
        })
        return res.status(201).json({
            message: "Item added to cart successfully",
            cartItem
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// remove item from cart
export const removeFromCart = async (req, res) => {
    if(req.user.role !== "user") {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const id = Number(req.params.id)
        const cartItem = await prisma.cartItem.delete({
            where: {
                id
            }
        })
        return res.status(200).json({
            message: "Item removed from cart successfully",
            cartItem
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}