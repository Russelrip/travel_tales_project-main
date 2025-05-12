import { Router } from "express";
import { likePost, unlikePost } from "../controllers/like-controller";
import { authenticate } from "../middleware/auth-middleware";

const likeRouter = Router();

// Both routes require authentication
likeRouter.post("/:blogPostId", authenticate, likePost);      // Like post
likeRouter.put("/:blogPostId", authenticate, unlikePost);  // Unlike post

export default likeRouter;
