import { Like } from "../models/like";
import { prisma } from "../prisma";
import { BaseRepository } from "./base-repository";

export class LikeRepository extends BaseRepository<Like, "id" | "createdAt"> {
    constructor() {
        super(prisma.like)
    }

    async countLikes(postId: number): Promise<number> {
        const likes = await prisma.like.findMany({
            where: {
                blogPostId: postId,
                hasReacted: true
            }
        });
        return likes.length;
    }

    async userLikedPost(userId: number, postId: number): Promise<boolean> {
        if (!userId) {
            return false; // unregistered user cannot have liked
        }

        const like = await prisma.like.findMany({
            where: {
                blogPostId: postId,
                registeredUserId: userId,
                hasReacted: true
            }
        });

        return like.length > 0;
    }

}