import { Router } from "express";
import { followUser, unfollowUser } from "../controllers/follow-controller";
import { authenticate } from "../middleware/auth-middleware";

const followRouter = Router();

// Both routes require user to be authenticated
followRouter.post("/:followingId", authenticate, followUser);      // Follow user
followRouter.put("/:followingId", authenticate, unfollowUser);  // Unfollow user

export default followRouter;
