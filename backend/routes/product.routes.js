import express from "express";
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/add", protect, authorize("admin"), addProduct);
productRouter.patch("/edit/:id", protect, authorize("admin"), updateProduct);
productRouter.delete("/delete/:id", protect, authorize("admin"), deleteProduct);

export default productRouter;
