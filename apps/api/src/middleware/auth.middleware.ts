import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@pulsestack/config';

const JWT_SECRET = config.jwt.secret || 'default-secret-do-not-use-in-prod';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        systemRole: string;
    };
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string; systemRole: string };
        (req as AuthRequest).user = {
            id: payload.userId,
            systemRole: payload.systemRole,
        };
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
