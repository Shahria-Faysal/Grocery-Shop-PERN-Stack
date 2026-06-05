import express from "express";
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/add", protect, authorize("admin"),validate(createProductSchema), addProduct);
productRouter.patch("/edit/:id", protect, authorize("admin"),validate(updateProductSchema), updateProduct);
productRouter.delete("/delete/:id", protect, authorize("admin"), deleteProduct);

export default productRouter;
