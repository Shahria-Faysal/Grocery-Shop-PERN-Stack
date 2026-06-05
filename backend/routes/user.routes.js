import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { getAllUsers, getUserById, getUser, updateUser, deleteUser, updateUserById, setUserBlockStatus } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUser);
userRouter.get("/users", protect, authorize("admin"), getAllUsers);
userRouter.get("/:id", protect, authorize("admin"), getUserById);
userRouter.patch("/edit", protect, updateUser);
userRouter.patch("/edit/:id", protect, authorize("admin"), updateUserById);
userRouter.delete("/delete/:id", protect, authorize("admin"), deleteUser);
userRouter.patch("/block/:id", protect, authorize("admin"), setUserBlockStatus);

export default userRouter;