import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { errorHandler, notFound } from "./middleware/errorMiddleware";
import { logger } from "./utils/logger";

// Import routes
import ipAssetRoutes from "./routes/ipAssetRoutes";
import alertRoutes from "./routes/alertRoutes";
import disputeRoutes from "./routes/disputeRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import yakoaRoutes from "./routes/yakoaRoutes";
import storyRoutes from "./routes/storyRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "StorySentinel API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/ip-assets", ipAssetRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/yakoa", yakoaRoutes);
app.use("/api/story", storyRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      logger.info("Connected to MongoDB");
    } else {
      logger.warn("MongoDB URI not provided, running without database");
    }
  } catch (error) {
    logger.error("Database connection error:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`StorySentinel API server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

startServer();

export default app;
