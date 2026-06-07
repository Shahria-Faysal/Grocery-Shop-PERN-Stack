import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./lib/prisma.js";
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import helmet from "helmet";
import userRouter from "./routes/user.routes.js";
import favouriteRouter from "./routes/favourite.routes.js";
import auditRouter from "./routes/audit.routes.js";


const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Auth routes
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter)
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/favourite", favouriteRouter);
app.use("/api/audit", auditRouter);

app.get("/users", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json(result);
  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Keep the process alive and log unhandled errors
server.keepAliveTimeout = 65000;
setInterval(() => {}, 1 << 30); // heartbeat to keep event loop alive
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});
