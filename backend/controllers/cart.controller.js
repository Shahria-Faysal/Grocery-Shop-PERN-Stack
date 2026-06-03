import prisma from "../lib/prisma.js";


// get cart
export const getCartItems = async (req, res) => {
    try {
        const id = Number(req.user.id)
        const cartItems = await prisma.cartItem.findMany({
            where: {
                user_id: id
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
    try {
        const id = Number(req.user.id)
        const { productId, quantity } = req.body
        if (!productId || !quantity) {
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
    if (req.user.role !== "user") {
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

// increment the number of same product count in cart
export const incrementCartItem = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id,
                user_id: req.user.id
            }
        });

        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        const product = await prisma.product.findUnique({
            where: { id: cartItem.product_id }
        });

        if (cartItem.quantity >= product.stock) {
            return res.status(400).json({
                message: "Cannot exceed available stock"
            });
        }

        const updated = await prisma.cartItem.update({
            where: { id },
            data: {
                quantity: { increment: 1 }
            }
        });

        res.json({
            message: "Item incremented successfully",
            cartItem: updated
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

//decrement the number of same product count in cart
export const decrementCartItem = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id,
                user_id: req.user.id
            }
        });

        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        // If quantity is 1 → remove item
        if (cartItem.quantity === 1) {
            await prisma.cartItem.delete({
                where: { id }
            });

            return res.json({
                message: "Item removed from cart"
            });
        }

        const updated = await prisma.cartItem.update({
            where: { id },
            data: {
                quantity: { decrement: 1 }
            }
        });

        res.json({
            message: "Item decremented successfully",
            cartItem: updated
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

//remove all items from cart
export const removeAllFromCart = async (req, res) => {
    try {
        const result = await prisma.cartItem.deleteMany({
            where: {
                user_id: req.user.id
            }
        });

        res.json({
            message: "All items removed from cart successfully",
            deletedCount: result.count
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};