import { AuthRequest } from "../middleware/auth-middleware";
import { BlogPostWithDetailsDTO, CreateBlogPost } from "../models/blog-post";
import { BlogPostService } from "../services/blog-post-service";
import { NextFunction, Request, Response } from "express";

const blogPostService: BlogPostService = new BlogPostService();

export const createBlogPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user?.userId;

        if (!currentUserId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { title, content, countryName, dateOfVisit } = req.body;

        // Validate basic input
        if (!title || !content || !countryName || !dateOfVisit) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }

        const post = await blogPostService.createBlogPost({
            authorId: currentUserId,
            title: String(title),
            content: String(content),
            countryName: String(countryName),
            dateOfVisit: new Date(dateOfVisit)
        } as CreateBlogPost);

        res.status(201).json({
            success: true,
            data: post
        });
    } catch (error: any) {
        next(error);
    }
};

export const updateBlogPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId, 10);
        const input = req.body as Partial<CreateBlogPost>;

        const updatedPost = await blogPostService.updateBlogPost(postId, input);

        res.status(200).json({
            success: true,
            data: updatedPost
        });
    } catch (error: any) {
        next(error);
    }
};

export const deleteBlogPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId, 10);
        const currentUserId = req.user?.userId;

        if (!currentUserId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        if (isNaN(postId)) {
            res.status(400).json({ success: false, message: "Invalid postId parameter" });
            return;
        }

        await blogPostService.deleteBlogPost(postId, currentUserId);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error: any) {
        next(error);
    }
};

export const getBlogPostById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user?.userId ?? null;
        const postId = Number(req.params.id);

        if (isNaN(postId)) {
            res.status(400).json({ success: false, message: "Invalid post ID" });
            return;
        }

        const post = await blogPostService.getBlogPostById(postId, currentUserId);

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error: any) {
        next(error);
    }
};

export const searchPostsByCountry = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user?.userId ?? null;
        const query = String(req.query.query ?? '');

        let page = Number(req.query.page);
        let pageSize = Number(req.query.pageSize);

        // Sanitize pagination values
        if (!page || page < 1) page = 1;
        if (!pageSize || pageSize < 1) pageSize = 10;

        const posts = await blogPostService.searchBlogPostsByCountry(currentUserId, {
            searchQuery: query,
            page,
            pageSize
        });

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error: any) {
        next(error);
    }
};


export const searchPostsByAuthorUsername = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user?.userId ?? null;
        const query = String(req.query.query ?? '');

        let page = Number(req.query.page);
        let pageSize = Number(req.query.pageSize);

        // Sanitize pagination values
        if (!page || page < 1) page = 1;
        if (!pageSize || pageSize < 1) pageSize = 10;

        const posts = await blogPostService.searchBlogPostsByAuthorUsername(currentUserId, {
            searchQuery: query,
            page,
            pageSize
        });

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error: any) {
        next(error);
    }
};

export const getFollowingFeed = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user?.userId;
        if (!currentUserId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const { page = 1, pageSize = 10, shuffle = "false" } = req.query;

        const posts: BlogPostWithDetailsDTO[] = await blogPostService.getFollowingFeed(
            currentUserId,
            Number(page),
            Number(pageSize),
            String(shuffle).toLowerCase() === "true"
        );

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error: any) {
        next(error);
    }
};


export const getRecentPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user?.userId ?? null;
        const { quantity = 6 } = req.query;

        const posts = await blogPostService.getRecentPosts(
            currentUserId,
            Number(quantity)
        );

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error: any) {
        next(error);
    }
};

export const getMostLikedPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user?.userId ?? null;
        const { quantity = 6 } = req.query;

        const posts = await blogPostService.getMostLikedPosts(
            currentUserId,
            Number(quantity)
        );

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error: any) {
        next(error);
    }
};

export const getMostCommentedPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currentUserId = req.user?.userId ?? null;
        const { quantity = 6 } = req.query;

        const posts = await blogPostService.getMostCommentedPosts(
            currentUserId,
            Number(quantity)
        );

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error: any) {
        next(error);
    }
};



