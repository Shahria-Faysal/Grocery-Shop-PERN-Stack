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
        const { name, description, price, unit, categoryId, stock, image } = req.body;
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
                stock: stock,
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
        // Fetch the current product to use as fallback values
        const existingProduct = await prisma.product.findUnique({
          where: { id },
        });
        if (!existingProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        const { name, description, price, unit, categoryId, stock, image } = req.body;
        const updateData = {
          name: name ?? existingProduct.name,
          description: description ?? existingProduct.description,
          price: price ?? existingProduct.price,
          unit: unit ?? existingProduct.unit,
          category_id: categoryId ? parseInt(categoryId) : existingProduct.category_id,
          stock: stock ?? existingProduct.stock,
          image_url: image ?? existingProduct.image_url,
        };
        const product = await prisma.product.update({
          where: { id },
          data: updateData,
        });
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