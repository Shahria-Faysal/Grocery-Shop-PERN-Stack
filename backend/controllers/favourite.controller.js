import prisma from "../lib/prisma.js";


//add favourite
export const addToFavourites = async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const favourite = await prisma.favourite.create({
            data: {
                user_id: req.user.id,
                product_id: productId
            }
        });

        res.status(201).json({
            message: "Added to favourites",
            favourite
        });
    } catch (err) {
        if (err.code === "P2002") {
            return res.status(400).json({ message: "Already in favourites" });
        }

        res.status(500).json({ message: err.message });
    }
};


//remove favourite
export const removeFromFavourites = async (req, res) => {
    try {
        const productId = Number(req.params.id);

        await prisma.favourite.delete({
            where: {
                user_id_product_id: {
                    user_id: req.user.id,
                    product_id: productId
                }
            }
        });

        res.json({ message: "Removed from favourites" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



//get favourite items
export const getFavourites = async (req, res) => {
    try {
        const favourites = await prisma.favourite.findMany({
            where: {
                user_id: req.user.id
            },
            include: {
                product: true
            }
        });

        res.json(favourites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};