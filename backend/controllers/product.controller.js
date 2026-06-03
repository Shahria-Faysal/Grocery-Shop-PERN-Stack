import prisma from "../lib/prisma.js";


// fetch all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany()
        if (!products) {
            return res.status(404).json({
                message: "No products found"
            })
        }
        return res.status(200).json({
            message: "Products fetched successfully",
            products
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// fetch product by id
export const getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const product = await prisma.product.findUnique({
            where: {
                id
            }
        })
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }
        return res.status(200).json({
            message: "Product fetched successfully",
            product
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// add product
export const addProduct = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const { name, description, price, unit, categoryId, image } = req.body;
        if (!name || !description || !price || !categoryId || !unit ) {
            return res.status(400).json({
                message: "Please provide all the details"
            })
        }
        const product = await prisma.product.create({
            data: {
                name: name,
                description: description,
                price: price,
                unit: unit,
                category_id: parseInt(categoryId),
                image_url: image
            }
        })
        return res.status(201).json({
            message: "Product added successfully",
            product
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// update product
export const updateProduct = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const id = Number(req.params.id);
        const { name, description, price, categoryId, image } = req.body;
        const product = await prisma.product.update({
            where: {
                id
            },
            data: {
                name: name,
                description: description,
                price: price,
                unit: unit,
                category_id: parseInt(categoryId),
                image_url: image
            }
        })
        return res.status(200).json({
            message: "Product updated successfully",
            product
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// delete product
export const deleteProduct = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const id = Number(req.params.id);
        const product = await prisma.product.delete({
            where: {
                id
            }
        })
        return res.status(200).json({
            message: "Product deleted successfully",
            product
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}