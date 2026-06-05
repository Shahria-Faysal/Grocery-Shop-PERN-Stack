import express from "express";
import { createOrder, getAllOrders, getOrders, getOrderById, cancelOrder, updateOrderStatus } from "../controllers/order.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.validator.js";

const orderRouter = express.Router();

orderRouter.post("/create", protect,authorize("user"),validate(createOrderSchema), createOrder);
orderRouter.get("/", protect, authorize("user"), getOrders);
orderRouter.get("/all", protect, authorize("admin"), getAllOrders);
orderRouter.get("/:id", protect,authorize("admin"), getOrderById);
orderRouter.patch("/status/:id", protect, authorize("admin"),validate(updateOrderStatusSchema), updateOrderStatus);
orderRouter.delete("/cancel/:id", protect, cancelOrder);

export default orderRouter;