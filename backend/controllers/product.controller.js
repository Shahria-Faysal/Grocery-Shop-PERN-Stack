import prisma from "../lib/prisma.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";


// fetch all products
export const getAllProducts = async (req, res) => {
    try {
        const { search, categoryId, minPrice, maxPrice, inStock, page, limit } = req.query;

        const where = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
            ];
        }

        if (categoryId) {
            where.category_id = Number(categoryId);
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) {
                where.price.gte = Number(minPrice);
            }
            if (maxPrice) {
                where.price.lte = Number(maxPrice);
            }
        }

        if (inStock === "true") {
            where.stock = { gt: 0 };
        } else if (inStock === "false") {
            where.stock = 0;
        }

        // Pagination parameters
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;

        // Fetch products and total count concurrently
        const [products, totalProducts] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limitNum,
                include: {
                    category: true
                }
            }),
            prisma.product.count({ where })
        ]);

        if (!products || products.length === 0) {
            return res.status(404).json({
                message: "No products found"
            });
        }

        const totalPages = Math.ceil(totalProducts / limitNum);

        return res.status(200).json({
            message: "Products fetched successfully",
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: pageNum,
                limit: limitNum
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// fetch product by id
export const getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const product = await prisma.product.findUnique({
            where: {
                id
            },
            include: {
                category: {
                    select: {
                        name: true
                    }
                }
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
    try {
        // 1. Validate + coerce req.body first
        const parsed = createProductSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.errors[0].message });
        }
        const { name, description, price, unit, categoryId, stock } = parsed.data;

        // 2. Upload images
        let imageUrl = null;
        if (req.files && req.files.length > 0) {
            imageUrl = await uploadToCloudinary(req.files[0].buffer, "grocery");
        }

        // 3. Save to DB — no manual parseFloat/parseInt needed, parsed.data already has correct types
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                unit,
                category_id: categoryId,
                stock: stock ?? 0,
                image_url: imageUrl || null  // ✅
            }
        });

        // 4. Audit log
        await prisma.auditLog.create({
            data: {
                action: "CREATE",
                table_name: "Product",
                record_id: product.id,
                new_data: product,
                user_id: req.user.id
            }
        });

        return res.status(201).json({ message: "Product added successfully", product });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

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

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: "UPDATE",
                table_name: "Product",
                record_id: product.id,
                old_data: existingProduct,
                new_data: product,
                user_id: req.user.id
            }
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
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: "DELETE",
                table_name: "Product",
                record_id: product.id,
                old_data: product,
                user_id: req.user.id
            }
        });

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