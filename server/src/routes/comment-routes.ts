import { Router } from "express";
import {
    createComment,
    deleteComment,
    getCommentsForPost
} from "../controllers/comment-controller";

import { authenticate } from "../middleware/auth-middleware";

const commentRouter = Router();

// Public route → get comments for a post
commentRouter.get("/post/:postId", getCommentsForPost);

// Authenticated routes → create + delete
commentRouter.post("/", authenticate, createComment);              // Create comment
commentRouter.delete("/:commentId", authenticate, deleteComment);  // Delete comment

export default commentRouter;
