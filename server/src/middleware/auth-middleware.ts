import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt-utils';

export interface JwtPayload {
    userId: number;
    email: string;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: No token' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

export function optionalAuthenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = verifyAccessToken(token);
            req.user = decoded;
        } catch (error) {
            // Invalid token → treat as anonymous (do not throw error)
            req.user = undefined;
        }
    }
    next();
}