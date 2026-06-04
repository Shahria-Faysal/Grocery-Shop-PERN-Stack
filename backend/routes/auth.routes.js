import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

import { register, login, verifyEmail, forgotPassword, resetPassword, logout } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

// authRouter.get("/me", protect, getMe);

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;