import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true,
    public stack?: string,
  ) {
    super(message);
    if (stack) {
      this.stack = stack;
    }
  }
}

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.warn("Global error handler caught:", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers,
  });

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON format in request body",
      error: "Bad Request",
    });
    return;
  }

  // Handle API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: "Validation Error",
      details: err.message,
    });
    return;
  }

  if (err.name === "EntityNotFoundError") {
    res.status(404).json({
      success: false,
      message: "Resource not found",
    });
    return;
  }

  if (err.name === "QueryFailedError") {
    if (err.message.includes("UNIQUE constraint failed")) {
      res.status(409).json({
        success: false,
        message: "Resource already exists",
      });
      return;
    }
    if (err.message.includes("FOREIGN KEY constraint failed")) {
      res.status(400).json({
        success: false,
        message: "Invalid reference",
      });
      return;
    }
  }

  // Default 500 error
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

// 404 handler for unmatched routes
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};
