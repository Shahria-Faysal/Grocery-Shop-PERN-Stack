import prisma from "../lib/prisma.js";

//get categories
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany()
        if (!categories) {
            return res.status(404).json({
                message: "No categories found"
            })
        }
        return res.status(200).json({
            message: "Categories fetched successfully",
            categories
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


// add category
export const createCategory = async (req, res) => {
    if(req.user.role !== "admin") {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Please provide category name"
            })
        }
        const category = await prisma.category.create({
            data: {
                name
            }
        })
        return res.status(201).json({
            message: "Category added successfully",
            category
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


// get category by id
export const getCategoryById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const category = await prisma.category.findUnique({
            where: {
                id
            }
        })
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }
        return res.status(200).json({
            message: "Category fetched successfully",
            category
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// delete category
export const deleteCategory = async (req, res) => {
    if(req.user.role !== "admin") {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const id = Number(req.params.id);
        const category = await prisma.category.delete({
            where: {
                id
            }
        })
        return res.status(200).json({
            message: "Category deleted successfully",
            category
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// edit category
export const editCategory = async (req, res) => {
    if(req.user.role !== "admin") {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const id = Number(req.params.id);
        // Fetch existing category for fallback values
        const existingCategory = await prisma.category.findUnique({ where: { id } });
        if (!existingCategory) {
          return res.status(404).json({ message: "Category not found" });
        }
        const { name } = req.body;
        const updateData = {
          name: name ?? existingCategory.name,
        };
        const category = await prisma.category.update({
          where: { id },
          data: updateData,
        })
        return res.status(200).json({
            message: "Category updated successfully",
            category
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}