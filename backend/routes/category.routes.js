import express from "express";
import { createCategory, getCategories, getCategoryById, deleteCategory, editCategory } from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post("/", createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.delete("/:id", deleteCategory);
categoryRouter.put("/:id", editCategory);


export default categoryRouter;