import express from "express";
import { createOrder, getAllOrders, getOrders, getOrderById, cancelOrder } from "../controllers/order.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/create", protect, createOrder);
orderRouter.get("/", protect, authorize("user"), getOrders);
orderRouter.get("/all", protect, authorize("admin"), getAllOrders);
orderRouter.get("/:id", protect,authorize("admin"), getOrderById);
orderRouter.delete("/cancel/:id", protect, cancelOrder);

export default orderRouter;