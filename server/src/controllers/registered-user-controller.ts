import { NextFunction, Request, Response } from "express";
import { RegisteredUserService } from "../services/registered-user-service";
import { CreateUserDTO } from "../models/registered-user";
import { generateAccessToken, verifyRefreshToken } from "../utils/jwt-utils";
import { AuthRequest } from "../middleware/auth-middleware";

const registeredUserService = new RegisteredUserService();


export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const user = await registeredUserService.loginUser(email, password);

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken
            }
        });
    } catch (error: any) {
        res.status(401).json({ message: error.message || 'Authentication failed' });
    }
}

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = req.body as CreateUserDTO;
        // Register the user
        const user = await registeredUserService.registerUser(body);

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken
            }
        });

    } catch (error: any) {
        next(error);
    }
}

export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const profileUserIdParam = req.params.userId;
        const profileUserId = parseInt(profileUserIdParam, 10);

        if (isNaN(profileUserId)) {
            res.status(400).json({ success: false, message: "Invalid user ID parameter" });
            return;
        }

        const currentUserId = req.user?.userId ?? 0;

        const userProfile = await registeredUserService.getUserProfile(profileUserId, currentUserId);

        res.status(200).json({
            success: true,
            data: userProfile
        });
    } catch (error: any) {
        next(error);
    }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token is required" });
            return;
        }

        const decoded = verifyRefreshToken(refreshToken);
        const accessToken = generateAccessToken({ userId: decoded.userId, email: decoded.email });

        res.status(200).json({ accessToken });   //  do NOT return res
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await registeredUserService.getUserById(Number(req.params.id));
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        next(error);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await registeredUserService.getAllUsers();
        res.json({ success: true, data: users });
    } catch (error: any) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await registeredUserService.updateUser(Number(req.params.id), req.body);
        res.json({ success: true, data: updated });
    } catch (error: any) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await registeredUserService.deleteUser(Number(req.params.id));
        res.json({ success: true, data: deleted });
    } catch (error: any) {
        next(error);
    }
};


export const getUserByUsername = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username } = req.params;
        if (!username) {
            res.status(400).json({ success: false, message: "Username is required" });
            return;
        }

        const user = await registeredUserService.getUserByUsername(username);

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error: any) {
        next(error);
    }
};