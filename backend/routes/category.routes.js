import express from "express";
import { createCategory, getCategories, getCategoryById, deleteCategory, editCategory } from "../controllers/category.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/add",protect, authorize("admin"), createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.delete("/delete/:id",protect, authorize("admin"), deleteCategory);
categoryRouter.put("/edit/:id",protect, authorize("admin"), editCategory);


export default categoryRouter;