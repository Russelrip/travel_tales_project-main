import { Follow } from "../models/follow";
import { FollowRepository } from "../repositories/follow-repository";

export class FollowService {
    private readonly followRepository: FollowRepository = new FollowRepository();

    // Follow
    async followUser(followerId: number, followingId: number): Promise<Follow> {
        try {
            // Check if the relationship exists
            const existingFollow = await this.followRepository.findSingle({
                where: {
                    followerId: followerId,
                    followingId: followingId
                }
            });

            if (!existingFollow) {
                // Create new follow
                return await this.followRepository.create({
                    followerId: followerId,
                    followingId: followingId,
                    isFollowing: true
                });
            } else {
                // Update existing record to isFollowing = true
                return await this.followRepository.updateById(existingFollow.id, {
                    isFollowing: true
                });
            }
        } catch (error: any) {
            throw new Error(`Failed to follow user: ${error.message}`);
        }
    }

    // UnFollow
    async unfollowUser(followerId: number, followingId: number): Promise<Follow | undefined> {
        try {
            // Check if relationship exists
            const existingFollow = await this.followRepository.findSingle({
                where: {
                    followerId: followerId,
                    followingId: followingId
                }
            });

            if (!existingFollow) {
                // No relationship → do nothing
                return;
            } else {
                // Update to isFollowing = false
                return await this.followRepository.updateById(existingFollow.id, {
                    isFollowing: false
                });
            }
        } catch (error: any) {
            throw new Error(`Failed to unfollow user: ${error.message}`);
        }
    }

}