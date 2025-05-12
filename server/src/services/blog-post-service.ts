import { BlogPost, BlogPostWithDetailsDTO, CreateBlogPost, SearchBlogPosts } from "../models/blog-post";
import { CommentDTO } from "../models/comment";
import { BlogPostRepository } from "../repositories/blog-post-repository";
import { CommentRepository } from "../repositories/comment-repository";
import { FollowRepository } from "../repositories/follow-repository";
import { LikeRepository } from "../repositories/like-repository";
import { RegisteredUserRepository } from "../repositories/registered-user-repository";

export class BlogPostService {
    private readonly blogPostRepository: BlogPostRepository = new BlogPostRepository();

    async getBlogPostById(postId: number, currentUserId: number | null = null): Promise<BlogPostWithDetailsDTO> {
        try {
            // Repositories inside method
            const blogPostRepository = new BlogPostRepository();
            const userRepository = new RegisteredUserRepository();
            const likeRepository = new LikeRepository();
            const followRepository = new FollowRepository();
            const commentRepository = new CommentRepository();

            const post = await blogPostRepository.findSingle({
                where: { id: postId }
            });
            if (!post) throw new Error("Post not found");

            const author = await userRepository.findSingle({
                where: { id: post.authorId }
            });
            if (!author) throw new Error("Author not found");

            const likeCount = await likeRepository.countLikes(post.id);
            const didUserLike = currentUserId
                ? await likeRepository.userLikedPost(currentUserId, post.id)
                : false;
            const isFollowing = currentUserId
                ? await followRepository.isFollowing(currentUserId, post.authorId)
                : false;

            const commentsList = await commentRepository.findMany({
                where: { blogPostId: post.id }
            });

            const comments: CommentDTO[] = await Promise.all(
                commentsList.map(async (comment) => {
                    const user = await userRepository.findSingle({
                        where: { id: comment.registeredUserId }
                    });

                    return {
                        id: comment.id,
                        username: user?.username ?? "",
                        dateWritten: comment.createdAt,
                        commentContent: comment.comment,
                        isUserOwned: comment.registeredUserId === currentUserId
                    };
                })
            );

            return {
                id: post.id,
                authorUsername: author.username,
                title: post.title,
                dateOfVisit: post.dateOfVisit,
                likeCount,
                countryName: post.countryName,
                content: post.content,
                dateBlogWasCreated: post.createdAt,
                listOfComments: comments,
                didUserLikeThis: didUserLike,
                isUserFollowingAuthor: isFollowing
            };
        } catch (error: any) {
            console.error("Error getting blog post by ID:", error);
            throw new Error("Failed to get blog post");
        }
    }


    // Create a New Post.
    async createBlogPost(input: CreateBlogPost): Promise<BlogPost> {
        try {
            const blogPost: BlogPost = await this.blogPostRepository.create({
                authorId: input.authorId,
                title: input.title,
                content: input.content,
                countryName: input.countryName,
                dateOfVisit: input.dateOfVisit,
            });

            return blogPost;

        } catch (error: any) {
            console.error('Error creating blog post', error);
            throw new Error('Failed to create blog post');
        }
    }


    // Update an Existing Post.
    async updateBlogPost(id: number, input: Partial<CreateBlogPost>): Promise<BlogPost> {
        try {
            const existingPost: BlogPost | null = await this.blogPostRepository.getById(id);

            if (!existingPost) {
                throw new Error(`Blog post with ID ${id} not found`);
            }

            const updatedPost: BlogPost = await this.blogPostRepository.updateById(id, {
                authorId: input.authorId ?? existingPost.authorId,
                title: input.title ?? existingPost.title,
                content: input.content ?? existingPost.content,
                countryName: input.countryName ?? existingPost.countryName,
                dateOfVisit: input.dateOfVisit ?? existingPost.dateOfVisit,
            });

            return updatedPost;
        } catch (error: any) {
            console.error(`Error updating blog post ID ${id}`, error);
            throw new Error('Failed to update blog post');
        }
    }

    // Delete an Existing Post.
    async deleteBlogPost(id: number, currentUserId: number): Promise<void> {
        try {
            const existingPost: BlogPost | null = await this.blogPostRepository.getById(id);

            if (!existingPost) {
                throw new Error(`Blog post with ID ${id} not found`);
            }

            // Only the post owner can delete
            if (existingPost.authorId !== currentUserId) {
                throw new Error("Unauthorized: you can only delete your own post");
            }

            await this.blogPostRepository.deleteById(id);
        } catch (error: any) {
            console.error(`Error deleting blog post ID ${id}`, error);
            throw new Error('Failed to delete blog post');
        }
    }

    // Search Post By Country with pagination.
    async searchBlogPostsByCountry(currentUserId: number | null, input: SearchBlogPosts): Promise<BlogPostWithDetailsDTO[]> {
        try {
            const { searchQuery, page, pageSize } = input;

            // Calculate pagination offset
            const offset = (page - 1) * pageSize;

            // Instantitate repositories
            const userRepository = new RegisteredUserRepository();
            const likeRepository = new LikeRepository();
            const followRepository = new FollowRepository();
            const commentRepository = new CommentRepository();

            // Call repository to get matching posts
            const blogPosts: BlogPost[] = await this.blogPostRepository.findMany({
                where: {
                    countryName: {
                        startsWith: searchQuery
                    }
                },
                skip: offset,
                take: pageSize
            });

            const results: BlogPostWithDetailsDTO[] = [];


            for (const post of blogPosts) {
                const author = await userRepository.findSingle({ where: { id: post.authorId } });
                if (!author) {
                    throw new Error(`Author not found for post with ID ${post.id}`);
                }
                const likeCount = await likeRepository.countLikes(post.id);
                const didUserLike = currentUserId ? await likeRepository.userLikedPost(currentUserId, post.id) : false;

                const isFollowing = currentUserId ? await followRepository.isFollowing(currentUserId, post.authorId) : false;

                const commentsList = await commentRepository.findMany({ where: { blogPostId: post.id } });

                const comments: CommentDTO[] = await Promise.all(
                    commentsList.map(async (comment) => {
                        const user = await userRepository.findSingle({ where: { id: comment.registeredUserId } });

                        return {
                            id: comment.id,
                            username: user?.username ?? '',  // fallback to empty string if user not found
                            dateWritten: comment.createdAt,
                            commentContent: comment.comment,
                            isUserOwned: comment.registeredUserId === currentUserId
                        };
                    })
                )

                results.push({
                    id: post.id,
                    authorUsername: author.username,
                    title: post.title,
                    dateOfVisit: post.dateOfVisit,
                    likeCount,
                    countryName: post.countryName,
                    content: post.content,
                    dateBlogWasCreated: post.createdAt,
                    listOfComments: comments,
                    didUserLikeThis: didUserLike,
                    isUserFollowingAuthor: isFollowing
                });
            }

            return results;
        } catch (error: any) {
            console.error('Error searching blog posts by country', error);
            throw new Error('Failed to search blog posts');
        }
    }

    // Search Post By Username with pagination.
    async searchBlogPostsByAuthorUsername(currentUserId: number | null, input: SearchBlogPosts): Promise<BlogPostWithDetailsDTO[]> {
        try {
            const { searchQuery, page, pageSize } = input;
            const offset = (page - 1) * pageSize;

            // Instantiate repositories
            const userRepository = new RegisteredUserRepository();
            const likeRepository = new LikeRepository();
            const followRepository = new FollowRepository();
            const commentRepository = new CommentRepository();

            // First find matching users (authors) whose username starts with the search query
            const authors = await userRepository.findMany({
                where: {
                    username: {
                        startsWith: searchQuery
                    }
                }
            });

            // Extract matching author IDs
            const authorIds = authors.map(author => author.id);

            if (authorIds.length === 0) return []; // No matching authors → return empty result

            // Get posts by these authorIds
            const blogPosts: BlogPost[] = await this.blogPostRepository.findMany({
                where: {
                    authorId: {
                        in: authorIds
                    }
                },
                skip: offset,
                take: pageSize
            });

            const results: BlogPostWithDetailsDTO[] = [];

            for (const post of blogPosts) {
                const author = authors.find(a => a.id === post.authorId);
                if (!author) {
                    throw new Error(`Author not found for post with ID ${post.id}`);
                }

                const likeCount = await likeRepository.countLikes(post.id);
                const didUserLike = currentUserId ? await likeRepository.userLikedPost(currentUserId, post.id) : false;
                const isFollowing = currentUserId ? await followRepository.isFollowing(currentUserId, post.authorId) : false;

                const commentsList = await commentRepository.findMany({ where: { blogPostId: post.id } });

                const comments: CommentDTO[] = await Promise.all(
                    commentsList.map(async (comment) => {
                        const user = await userRepository.findSingle({ where: { id: comment.registeredUserId } });
                        return {
                            id: comment.id,
                            username: user?.username ?? '',
                            dateWritten: comment.createdAt,
                            commentContent: comment.comment,
                            isUserOwned: comment.registeredUserId === currentUserId
                        };
                    })
                );

                results.push({
                    id: post.id,
                    authorUsername: author.username,
                    title: post.title,
                    dateOfVisit: post.dateOfVisit,
                    likeCount,
                    countryName: post.countryName,
                    content: post.content,
                    dateBlogWasCreated: post.createdAt,
                    listOfComments: comments,
                    didUserLikeThis: didUserLike,
                    isUserFollowingAuthor: isFollowing
                });
            }

            return results;
        } catch (error: any) {
            console.error('Error searching blog posts by author username', error);
            throw new Error('Failed to search blog posts');
        }
    }


    // Following Feed with pagination.
    async getFollowingFeed(currentUserId: number, page: number, pageSize: number, shuffle: boolean = false): Promise<BlogPostWithDetailsDTO[]> {
        try {
            const offset = (page - 1) * pageSize;

            // Instantiate repositories
            const userRepository = new RegisteredUserRepository();
            const followRepository = new FollowRepository();
            const likeRepository = new LikeRepository();
            const commentRepository = new CommentRepository();

            // Step 1: Get list of followed user IDs
            const followingRecords = await followRepository.findMany({
                where: {
                    followerId: currentUserId,
                    isFollowing: true
                }
            });

            const followingIds = followingRecords.map(f => f.followingId);
            if (followingIds.length === 0) return [];

            // Step 2: Get blog posts by followed users
            let blogPosts: BlogPost[] = await this.blogPostRepository.findMany({
                where: {
                    authorId: {
                        in: followingIds
                    }
                }
            });

            // Step 3: Optionally shuffle before pagination
            if (shuffle) {
                blogPosts = blogPosts
                    .map(post => ({ post, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ post }) => post);
            }

            // Step 4: Apply pagination after shuffle
            blogPosts = blogPosts.slice(offset, offset + pageSize);

            const results: BlogPostWithDetailsDTO[] = [];

            for (const post of blogPosts) {
                const author = await userRepository.findSingle({ where: { id: post.authorId } });
                if (!author) {
                    throw new Error(`Author not found for post with ID ${post.id}`);
                }

                const likeCount = await likeRepository.countLikes(post.id);
                const didUserLike = await likeRepository.userLikedPost(currentUserId, post.id);
                const isFollowing = true; // we already filtered only followed authors

                const commentsList = await commentRepository.findMany({ where: { blogPostId: post.id } });

                const comments: CommentDTO[] = await Promise.all(
                    commentsList.map(async (comment) => {
                        const user = await userRepository.findSingle({ where: { id: comment.registeredUserId } });
                        return {
                            id: comment.id,
                            username: user?.username ?? '',
                            dateWritten: comment.createdAt,
                            commentContent: comment.comment,
                            isUserOwned: comment.registeredUserId === currentUserId
                        };
                    })
                );

                results.push({
                    id: post.id,
                    authorUsername: author.username,
                    title: post.title,
                    dateOfVisit: post.dateOfVisit,
                    likeCount,
                    countryName: post.countryName,
                    content: post.content,
                    dateBlogWasCreated: post.createdAt,
                    listOfComments: comments,
                    didUserLikeThis: didUserLike,
                    isUserFollowingAuthor: isFollowing
                });
            }

            return results;
        } catch (error: any) {
            console.error('Error getting following feed', error);
            throw new Error('Failed to get following feed');
        }
    }

    // Get Recent 6 Post .
    async getRecentPosts(currentUserId: number | null, quantity: number): Promise<BlogPostWithDetailsDTO[]> {
        try {
            // Instantiate repositories
            const userRepository = new RegisteredUserRepository();
            const likeRepository = new LikeRepository();
            const followRepository = new FollowRepository();
            const commentRepository = new CommentRepository();

            // Get most recent posts
            const blogPosts: BlogPost[] = await this.blogPostRepository.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                take: quantity
            });

            const results: BlogPostWithDetailsDTO[] = [];

            for (const post of blogPosts) {
                const author = await userRepository.findSingle({ where: { id: post.authorId } });
                if (!author) {
                    throw new Error(`Author not found for post with ID ${post.id}`);
                }

                const likeCount = await likeRepository.countLikes(post.id);
                const didUserLike = currentUserId ? await likeRepository.userLikedPost(currentUserId, post.id) : false;
                const isFollowing = currentUserId ? await followRepository.isFollowing(currentUserId, post.authorId) : false;
                const commentsList = await commentRepository.findMany({ where: { blogPostId: post.id } });

                const comments: CommentDTO[] = await Promise.all(
                    commentsList.map(async (comment) => {
                        const user = await userRepository.findSingle({ where: { id: comment.registeredUserId } });
                        return {
                            id: comment.id,
                            username: user?.username ?? '',
                            dateWritten: comment.createdAt,
                            commentContent: comment.comment,
                            isUserOwned: comment.registeredUserId === currentUserId
                        };
                    })
                );

                results.push({
                    id: post.id,
                    authorUsername: author.username,
                    title: post.title,
                    dateOfVisit: post.dateOfVisit,
                    likeCount,
                    countryName: post.countryName,
                    content: post.content,
                    dateBlogWasCreated: post.createdAt,
                    listOfComments: comments,
                    didUserLikeThis: didUserLike,
                    isUserFollowingAuthor: isFollowing
                });
            }

            return results;
        } catch (error: any) {
            console.error('Error getting recent posts', error);
            throw new Error('Failed to get recent posts');
        }
    }


    // Get Most Liked 6 posts.
    async getMostLikedPosts(currentUserId: number | null, quantity: number): Promise<BlogPostWithDetailsDTO[]> {
        try {
            // Instantiate repositories
            const userRepository = new RegisteredUserRepository();
            const likeRepository = new LikeRepository();
            const followRepository = new FollowRepository();
            const commentRepository = new CommentRepository();

            // Step 1: Get all blog posts
            const blogPosts: BlogPost[] = await this.blogPostRepository.findMany();

            // Step 2: Sort posts by like count
            const postsWithLikes = await Promise.all(
                blogPosts.map(async (post) => ({
                    post,
                    likeCount: await likeRepository.countLikes(post.id)
                }))
            );

            // Step 3: Sort descending by likeCount
            postsWithLikes.sort((a, b) => b.likeCount - a.likeCount);

            // Step 4: Take top `quantity`
            const topPosts = postsWithLikes.slice(0, quantity).map(p => p.post);

            // Step 5: Compose DTOs
            const results: BlogPostWithDetailsDTO[] = [];

            for (const post of topPosts) {
                const author = await userRepository.findSingle({ where: { id: post.authorId } });
                if (!author) {
                    throw new Error(`Author not found for post with ID ${post.id}`);
                }

                const likeCount = await likeRepository.countLikes(post.id);
                const didUserLike = currentUserId ? await likeRepository.userLikedPost(currentUserId, post.id) : false;
                const isFollowing = currentUserId ? await followRepository.isFollowing(currentUserId, post.authorId) : false;

                const commentsList = await commentRepository.findMany({ where: { blogPostId: post.id } });

                const comments: CommentDTO[] = await Promise.all(
                    commentsList.map(async (comment) => {
                        const user = await userRepository.findSingle({ where: { id: comment.registeredUserId } });
                        return {
                            id: comment.id,
                            username: user?.username ?? '',
                            dateWritten: comment.createdAt,
                            commentContent: comment.comment,
                            isUserOwned: comment.registeredUserId === currentUserId
                        };
                    })
                );

                results.push({
                    id: post.id,
                    authorUsername: author.username,
                    title: post.title,
                    dateOfVisit: post.dateOfVisit,
                    likeCount,
                    countryName: post.countryName,
                    content: post.content,
                    dateBlogWasCreated: post.createdAt,
                    listOfComments: comments,
                    didUserLikeThis: didUserLike,
                    isUserFollowingAuthor: isFollowing
                });
            }

            return results;
        } catch (error: any) {
            console.error('Error getting most liked posts', error);
            throw new Error('Failed to get most liked posts');
        }
    }


    // Get Most Commented 6 posts.
    async getMostCommentedPosts(currentUserId: number | null, quantity: number): Promise<BlogPostWithDetailsDTO[]> {
        try {
            // Instantiate repositories
            const userRepository = new RegisteredUserRepository();
            const likeRepository = new LikeRepository();
            const followRepository = new FollowRepository();
            const commentRepository = new CommentRepository();

            // Step 1: Get all blog posts
            const blogPosts: BlogPost[] = await this.blogPostRepository.findMany();

            // Step 2: Get comment counts
            const postsWithComments = await Promise.all(
                blogPosts.map(async (post) => ({
                    post,
                    commentCount: await commentRepository.countComments(post.id)
                }))
            );

            // Step 3: Sort by comment count descending
            postsWithComments.sort((a, b) => b.commentCount - a.commentCount);

            // Step 4: Take top `quantity`
            const topPosts = postsWithComments.slice(0, quantity).map(p => p.post);

            // Step 5: Compose DTOs
            const results: BlogPostWithDetailsDTO[] = [];

            for (const post of topPosts) {
                const author = await userRepository.findSingle({ where: { id: post.authorId } });
                if (!author) {
                    throw new Error(`Author not found for post with ID ${post.id}`);
                }

                const likeCount = await likeRepository.countLikes(post.id);
                const didUserLike = currentUserId ? await likeRepository.userLikedPost(currentUserId, post.id) : false;
                const isFollowing = currentUserId ? await followRepository.isFollowing(currentUserId, post.authorId) : false;

                const commentsList = await commentRepository.findMany({ where: { blogPostId: post.id } });

                const comments: CommentDTO[] = await Promise.all(
                    commentsList.map(async (comment) => {
                        const user = await userRepository.findSingle({ where: { id: comment.registeredUserId } });
                        return {
                            id: comment.id,
                            username: user?.username ?? '',
                            dateWritten: comment.createdAt,
                            commentContent: comment.comment,
                            isUserOwned: comment.registeredUserId === currentUserId
                        };
                    })
                );

                results.push({
                    id: post.id,
                    authorUsername: author.username,
                    title: post.title,
                    dateOfVisit: post.dateOfVisit,
                    likeCount,
                    countryName: post.countryName,
                    content: post.content,
                    dateBlogWasCreated: post.createdAt,
                    listOfComments: comments,
                    didUserLikeThis: didUserLike,
                    isUserFollowingAuthor: isFollowing
                });
            }

            return results;
        } catch (error: any) {
            console.error('Error getting most commented posts', error);
            throw new Error('Failed to get most commented posts');
        }
    }

}