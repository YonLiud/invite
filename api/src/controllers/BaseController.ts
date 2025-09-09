import { Request, Response } from "express";
import logger from "../utils/logger";

export abstract class BaseController {
  protected sendSuccess(
    res: Response,
    data: any,
    message?: string,
    statusCode: number = 200,
  ) {
    logger.http(`Response: ${statusCode} - ${message || "Success"}`, {
      statusCode,
      data,
    });

    res.status(statusCode).json({
      success: true,
      message: message || "Request successful",
      data,
    });
  }
  protected sendError(
    res: Response,
    message: string,
    statusCode: number = 500,
    data?: any,
  ) {
    if (statusCode >= 500) {
      logger.warn(`Error: ${statusCode} - ${message}`, {
        statusCode,
        message,
        data,
      });
    } else {
      logger.info(`Error: ${statusCode} - ${message}`, {
        statusCode,
        message,
        data,
      });
      res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
  protected sendUnauthorized(res: Response, message: string = "Unauthorized") {
    res.status(401).json({
      success: false,
      message,
    });
  }
  protected sendNotFound(res: Response, message: string = "Not Found") {
    res.status(404).json({
      success: false,
      message,
    });
  }
  protected sendValidationError(res: Response, errors: string[]): void {
    this.sendError(res, "Validation Error", 422, { errors });
  }
}
