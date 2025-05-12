import { Request, Response, NextFunction } from "express";
import { LikeService } from "../services/like-service";
import { AuthRequest } from "../middleware/auth-middleware";

const likeService = new LikeService();

// Like a post
export const likePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const registeredUserId = req.user?.userId;
        const blogPostId = parseInt(req.params.blogPostId, 10);

        if (!registeredUserId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(blogPostId)) {
            res.status(400).json({ success: false, message: "Invalid blogPostId parameter" });
            return;
        }

        const like = await likeService.likePost(registeredUserId, blogPostId);

        res.status(200).json({
            success: true,
            message: "Post liked successfully",
            data: like
        });
    } catch (error: any) {
        next(error);
    }
};

// Unlike a post
export const unlikePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const registeredUserId = req.user?.userId;
        const blogPostId = parseInt(req.params.blogPostId, 10);

        if (!registeredUserId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(blogPostId)) {
            res.status(400).json({ success: false, message: "Invalid blogPostId parameter" });
            return;
        }

        await likeService.unLikePost(registeredUserId, blogPostId);

        res.status(200).json({
            success: true,
            message: "Post unliked successfully"
        });
    } catch (error: any) {
        next(error);
    }
};
