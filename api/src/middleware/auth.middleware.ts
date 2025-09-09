import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { Profile } from '../entities/Profile';
import { AppDataSource } from '../data-source';
import logger from '../utils/logger';

declare global {
    namespace Express {
        interface Request {
            user?: Profile;
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);
        if (!payload) {
            res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
            return;
        }

        const profileRepository = AppDataSource.getRepository(Profile);
        const profile = await profileRepository.findOneBy({ id: payload.profileId });
        if (!profile) {
            res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
            return;
        }

        req.user = profile;

        logger.debug(`Authenticated user: ${profile.username} (ID: ${profile.id})`);
        next();
    } catch (error) {
        logger.error('Authentication Middleware error', { error });
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};