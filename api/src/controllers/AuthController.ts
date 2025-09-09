import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AuthService } from '../services/AuthService';

export class AuthController extends BaseController {
    private authService: AuthService;

    constructor() {
        super();
        this.authService = new AuthService();
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password, displayName } = req.body;
            
            if (!username || !password || !displayName) {
            this.sendValidationError(res, ['Username, password, and display name are required.']);
                return;
            }

            const result = await this.authService.register(username, password, displayName);
            if (!result) {
                this.sendError(res, 'Username already taken', 400);
                return;
            }
            
            const { user, accessToken, refreshToken } = result;
            const userResponse = {
                id: user.id,
                username: user.username,
                displayName: user.display_name,
                createdAt: user.created_at,
            };

            this.sendSuccess(res, {
                user: userResponse,
                accessToken,
                refreshToken
            }, 'Registration successful', 201);
            } catch (error) {
                if (error instanceof Error) {
                    this.sendError(res, error.message, 500);
                } else {
                    this.sendError(res, 'Unknown error occurred', 500);
                }
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                this.sendValidationError(res, ['Username and password are required.']);
                return;
            }
            const result = await this.authService.login(username, password);
            if (!result) {
                this.sendUnauthorized(res, 'Invalid credentials');
                return;
            }

            const { user, accessToken, refreshToken } = result;
            const userResponse = {
                id: user.id,
                username: user.username,
                displayName: user.display_name,
                createdAt: user.created_at,
            };

            this.sendSuccess(res, {
                user: userResponse,
                accessToken,
                refreshToken
            }, 'Login successful');
        }
        catch (error) {
            if (error instanceof Error) {
                this.sendError(res, error.message, 500);
            } else {
                this.sendError(res, 'Unknown error occurred', 500);
            }
        }
    }
}
