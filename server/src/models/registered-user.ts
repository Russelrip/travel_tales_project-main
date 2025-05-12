import { BlogPostWithDetailsDTO } from "./blog-post";

export interface RegisteredUser {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: Date;
}

export type CreateUserDTO = {
    username: string;
    email: string;
    password: string;
}

export interface UserProfileDTO {
    username: string;
    email: string;
    dateOfJoining: Date;
    totalPosts: number;
    followerCount: number;
    followingCount: number;
    posts: BlogPostWithDetailsDTO[];
    isUserFollowing: boolean;
}