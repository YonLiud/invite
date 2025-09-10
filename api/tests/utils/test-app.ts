import express from "express";
import { AppDataSource } from "../../src/data-source";
import authRoutes from "../../src/routes/auth.routes";
import profileRoutes from "../../src/routes/profile.routes";
import postRoutes from "../../src/routes/post.routes";
import commentRoutes from "../../src/routes/comment.routes";
import likeRoutes from "../../src/routes/like.routes";
import {
  globalErrorHandler,
  notFoundHandler,
} from "../../src/middleware/error.middleware";

export const createTestApp = async () => {
  const app = express();

  // Middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Routes
  app.use("/auth", authRoutes);
  app.use("/profiles", profileRoutes);
  app.use("/posts", postRoutes);
  app.use("/comments", commentRoutes);
  app.use("/likes", likeRoutes);

  // Error handlers
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};
