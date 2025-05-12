import { Follow } from "../models/follow";
import { prisma } from "../prisma";
import { BaseRepository } from "./base-repository";

export class FollowRepository extends BaseRepository<Follow, "id" | "createdAt"> {
    constructor() {
        super(prisma.follow)
    }

    async isFollowing(currentUserId: number, authorId: number): Promise<boolean> {
        const followRecord = await prisma.follow.findFirst({
            where: {
                followerId: currentUserId,
                followingId: authorId
            }
        });

        if (!followRecord) return false;

        return followRecord.isFollowing === true;
    }

}