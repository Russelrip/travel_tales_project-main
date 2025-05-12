import { BlogPost } from "../models/blog-post";
import { prisma } from "../prisma";
import { BaseRepository } from "./base-repository";

export class BlogPostRepository extends BaseRepository<BlogPost, 'id' | 'createdAt'> {
    constructor() {
        super(prisma.blogPost)
    }
}