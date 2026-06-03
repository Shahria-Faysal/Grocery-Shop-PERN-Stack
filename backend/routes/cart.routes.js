import express from "express";
import { addToCart, getCartItems, removeFromCart, incrementCartItem, decrementCartItem, removeAllFromCart } from "../controllers/cart.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.post("/add", protect,authorize("user"), addToCart);
cartRouter.get("/", protect,authorize("user"), getCartItems);
cartRouter.delete("/remove/:id", protect,authorize("user"), removeFromCart);
cartRouter.delete("/", protect,authorize("user"), removeAllFromCart);
cartRouter.patch("/increment/:id", protect, authorize("user"), incrementCartItem);
cartRouter.patch("/decrement/:id", protect, authorize("user"), decrementCartItem);

export default cartRouter;