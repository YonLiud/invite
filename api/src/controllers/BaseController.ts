import { Request, Response } from 'express';

export abstract class BaseController {
    protected sendSuccess(res: Response, data: any, message?: string, statusCode: number = 200) {
        res.status(statusCode).json({
            success: true,
            message: message || 'Request successful',
            data
        });
    }
    protected sendError(res: Response, message: string, statusCode: number = 500, data?: any) {
        res.status(statusCode).json({
            success: false,
            message
        });
    }
    protected sendUnauthorized(res: Response, message: string = 'Unauthorized') {
        res.status(401).json({
            success: false,
            message
        });
    }
    protected sendNotFound(res: Response, message: string = 'Not Found') {
        res.status(404).json({
            success: false,
            message
        });
    }
    protected sendValidationError(res: Response, errors: string[]): void {
        this.sendError(res, 'Validation Error', 422, { errors });
    }
}