import { Request, Response, NextFunction } from "express";
import { FollowService } from "../services/follow-service";
import { AuthRequest } from "../middleware/auth-middleware";

const followService = new FollowService();

// Follow a user
export const followUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const followerId = req.user?.userId;
        const followingId = parseInt(req.params.followingId, 10);

        if (!followerId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(followingId)) {
            res.status(400).json({ success: false, message: "Invalid following user ID" });
            return;
        }

        const follow = await followService.followUser(followerId, followingId);

        res.status(200).json({
            success: true,
            message: "User followed successfully",
            data: follow
        });
    } catch (error: any) {
        next(error);
    }
};

// Unfollow a user
export const unfollowUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const followerId = req.user?.userId;
        const followingId = parseInt(req.params.followingId, 10);

        if (!followerId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(followingId)) {
            res.status(400).json({ success: false, message: "Invalid following user ID" });
            return;
        }

        await followService.unfollowUser(followerId, followingId);

        res.status(200).json({
            success: true,
            message: "User unfollowed successfully"
        });
    } catch (error: any) {
        next(error);
    }
};
