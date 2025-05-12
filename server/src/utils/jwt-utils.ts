import jwt from 'jsonwebtoken';
import { JwtPayload } from '../middleware/auth-middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';
const EXPIRES_IN = '1h';  // token valid for 1 hour

export function generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function generateAccessToken(payload: object): string {
    try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });    // short-lived
    } catch (error) {
        throw new Error("Failed to Generate Access Token.");
    }
}

export function generateRefreshToken(payload: object): string {
    try {
        return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });  // long-lived
    } catch (error) {
        throw new Error("Failed to Generate Refresh Token.");
    }
}

export function verifyAccessToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        throw new Error("Error validating access token.");
    }
}

export function verifyRefreshToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
    } catch (error) {
        throw new Error("Error validating refresh token.");
    }
}