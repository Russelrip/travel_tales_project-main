import { prisma } from "../prisma";
import { BaseRepository } from "./base-repository";
import { Comment } from "../models/comment";

export class CommentRepository extends BaseRepository<Comment, "id" | "createdAt"> {
    constructor() {
        super(prisma.comment)
    }

    async countComments(postId: number): Promise<number> {
        const comments = await prisma.comment.findMany({
            where: {
                blogPostId: postId
            }
        });
        return comments.length;
    }
}