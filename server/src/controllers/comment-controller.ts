import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment-service";
import { AuthRequest } from "../middleware/auth-middleware";

const commentService = new CommentService();

// Create a new comment
export const createComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user?.userId;
        const { blogPostId, comment } = req.body;

        if (!currentUserId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (!blogPostId || !comment) {
            res.status(400).json({ success: false, message: "Missing blogPostId or comment" });
            return;
        }

        const newComment = await commentService.createComment({
            blogPostId: Number(blogPostId),
            registeredUserId: currentUserId,
            comment: String(comment)
        });

        res.status(201).json({
            success: true,
            data: newComment
        });
    } catch (error: any) {
        next(error);
    }
};

// Delete a comment
export const deleteComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user?.userId;
        const commentId = parseInt(req.params.commentId, 10);

        if (!currentUserId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(commentId)) {
            res.status(400).json({ success: false, message: "Invalid commentId parameter" });
            return;
        }

        await commentService.deleteComment(commentId, currentUserId);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error: any) {
        next(error);
    }
};

// Get all comments for a post
export const getCommentsForPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId, 10);

        if (isNaN(postId)) {
            res.status(400).json({ success: false, message: "Invalid postId parameter" });
            return;
        }

        const comments = await commentService.getCommentsForPost(postId);

        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error: any) {
        next(error);
    }
};
