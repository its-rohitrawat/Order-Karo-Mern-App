import { clerkMiddleware } from "@clerk/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { FRONTEND_URL } from "./src/config/index.js";

import { errorHandler } from "./src/middlewares/error.middleware.js";

import authRoutes from "./src/routes/auth.route.js";
import chatRoutes from "./src/routes/chat.route.js";
import itemRoutes from "./src/routes/item.route.js";
import orderRoutes from "./src/routes/order.route.js";
import shopRoutes from "./src/routes/shop.route.js";
import userRoutes from "./src/routes/user.route.js";
import webhookRouter from "./src/routes/webhook.route.js";

const app = express();
app.use(
  cors({
    origin: FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(clerkMiddleware());
app.use("/webhook", webhookRouter);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/item", itemRoutes);
app.use("/api/v1/order", orderRoutes);

app.use(errorHandler);

export default app;
