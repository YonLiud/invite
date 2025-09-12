import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import likeRoutes from "./routes/like.routes";
import { setupSwagger } from "./config/swagger";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/error.middleware";
import logger from "./utils/logger";
import morgan from "morgan";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
setupSwagger(app);

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

AppDataSource.initialize()
  .then(async () => {
    logger.info("Data Source has been initialized!");

    // Routes
    app.use("/auth", authRoutes);
    app.use("/profiles", profileRoutes);
    app.use("/posts", postRoutes);
    app.use("/comments", commentRoutes);
    app.use("/likes", likeRoutes);

    app.get("/", (req, res) => {
      res.json({
        message: "All systems go",
      });
    });

    app.use(notFoundHandler);
    app.use(globalErrorHandler);

    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization:", err);
  });