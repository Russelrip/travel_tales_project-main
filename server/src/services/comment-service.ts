import { Comment, CommentCreateDTO } from "../models/comment";
import { CommentRepository } from "../repositories/comment-repository";

export class CommentService {
    private readonly commentRepository: CommentRepository = new CommentRepository();

    // Create a New Comment for a Post
    async createComment(input: CommentCreateDTO): Promise<Comment> {
        try {
            return await this.commentRepository.create({
                blogPostId: input.blogPostId,
                registeredUserId: input.registeredUserId,
                comment: input.comment
            });
        } catch (error: any) {
            throw new Error(`Failed to create comment: ${error.message}`);
        }
    }

    // Delete a Comment from a Post
    async deleteComment(commentId: number, currentUserId: number): Promise<void> {
        try {
            const existingComment = await this.commentRepository.getById(commentId);
            if (!existingComment) {
                throw new Error("Comment not found");
            }

            // Only comment owner can delete
            if (existingComment.registeredUserId !== currentUserId) {
                throw new Error("Unauthorized: you can only delete your own comment");
            }

            await this.commentRepository.deleteById(commentId);
        } catch (error: any) {
            throw new Error(`Failed to delete comment: ${error.message}`);
        }
    }

    // Get All Comments for a Post
    async getCommentsForPost(postId: number): Promise<Comment[]> {
        try {
            return await this.commentRepository.findMany({
                where: {
                    blogPostId: postId
                }
            });
        } catch (error: any) {
            throw new Error(`Failed to get comments for post: ${error.message}`);
        }
    }
}