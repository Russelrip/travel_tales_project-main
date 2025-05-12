import { Like } from "../models/like";
import { LikeRepository } from "../repositories/like-repository";

export class LikeService {
    private readonly likeRepository: LikeRepository = new LikeRepository();

    // Like A Post
    async likePost(registeredUserId: number, blogPostId: number): Promise<Like> {
        try {
            // Check if the user has already liked the post
            const existingLikeInstance = await this.likeRepository.findSingle({
                where: {
                    registeredUserId: registeredUserId,
                    blogPostId: blogPostId
                }
            });

            if (existingLikeInstance == null) {
                // Instance does not exist.
                // Create a new like instance
                return await this.likeRepository.create({
                    registeredUserId: registeredUserId,
                    blogPostId: blogPostId,
                    hasReacted: true,
                });
            } else {
                // Instance exists.
                // Update the like instance
                return await this.likeRepository.updateById(existingLikeInstance.id, {
                    hasReacted: true,
                });
            }

        } catch (error: any) {
            throw new Error(`Failed to like post: ${error.message}`);
        }
    }

    // Dislike A Post
    async unLikePost(registeredUserId: number, blogPostId: number): Promise<Like | undefined> {
        try {
            // Check if the like instance exists
            const existingLikeInstance = await this.likeRepository.findSingle({
                where: {
                    registeredUserId: registeredUserId,
                    blogPostId: blogPostId
                }
            });

            if (existingLikeInstance == null) {
                // Instance does not exist.
                return;
            } else {
                // Instance exists.
                // Update the like instance to hasReacted false
                return await this.likeRepository.updateById(existingLikeInstance.id, {
                    hasReacted: false,
                });
            }

        } catch (error: any) {
            throw new Error(`Failed to unlike post: ${error.message}`);
        }
    }
}