import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

import { register, login, verifyEmail, forgotPassword, resetPassword, logout } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register",validate(registerSchema), register);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/login",validate(loginSchema), login);
authRouter.post("/logout", logout);

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

// authRouter.get("/me", protect, getMe);

export default authRouter;