import { Router } from "express";
import { BlogPostService } from "../services/blog-post-service";
import * as blogPostController from '../controllers/blog-post-controller';
import { authenticate, optionalAuthenticate } from "../middleware/auth-middleware";

const blogPostRouter = Router();

// Public Routes (no auth or optional auth)
blogPostRouter.get("/country-search", optionalAuthenticate, blogPostController.searchPostsByCountry);
blogPostRouter.get("/author-search", optionalAuthenticate, blogPostController.searchPostsByAuthorUsername);
blogPostRouter.get("/recent", optionalAuthenticate, blogPostController.getRecentPosts);
blogPostRouter.get("/most-liked", optionalAuthenticate, blogPostController.getMostLikedPosts);
blogPostRouter.get("/most-commented", optionalAuthenticate, blogPostController.getMostCommentedPosts);
blogPostRouter.get("/following-feed", authenticate, blogPostController.getFollowingFeed);
blogPostRouter.get("/:id", authenticate, blogPostController.getBlogPostById);

// Authenticated Routes
blogPostRouter.post("/", authenticate, blogPostController.createBlogPost);
blogPostRouter.put("/:postId", authenticate, blogPostController.updateBlogPost);
blogPostRouter.delete("/:postId", authenticate, blogPostController.deleteBlogPost);  // You pass userId manually


export default blogPostRouter;