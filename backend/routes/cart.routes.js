import express from "express";
import { addToCart, getCartItems, removeFromCart, incrementCartItem, decrementCartItem, removeAllFromCart } from "../controllers/cart.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.post("/add/:id", protect, authorize("user"), addToCart);
cartRouter.get("/", protect, getCartItems);
cartRouter.delete("/:id", protect, removeFromCart);
cartRouter.delete("/", protect, removeAllFromCart);
cartRouter.patch("/increment/:id", protect, incrementCartItem);
cartRouter.patch("/decrement/:id", protect, decrementCartItem);

export default cartRouter;