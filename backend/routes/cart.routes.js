import express from "express";
import { addToCart, getCartItems, removeFromCart } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.post("/add", protect, addToCart);
cartRouter.get("/", protect, getCartItems);
cartRouter.delete("/remove/:id", protect, removeFromCart);

export default cartRouter;