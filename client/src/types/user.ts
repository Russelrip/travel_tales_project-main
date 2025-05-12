// src/types/user.ts

import { BlogPostWithDetailsDTO } from "./blog";

export interface UserProfileResponse {
    success: boolean;
    data: UserProfile;
}

export interface UserProfile {
    username: string;
    email: string;
    dateOfJoining: string;          // ISO date string
    totalPosts: number;
    followerCount: number;
    followingCount: number;
    posts: BlogPostWithDetailsDTO[];
    isUserFollowing: boolean;
}

export interface BlogPostSummary {
    authorUsername: string;
    title: string;
    dateOfVisit: string;            // ISO date string
    likeCount: number;
    countryName: string;
    content: string;
    dateBlogWasCreated: string;     // ISO date string
    listOfComments: CommentSummary[];
    didUserLikeThis: boolean;
    isUserFollowingAuthor: boolean;
}

export interface CommentSummary {
    id: number;
    username: string;
    dateWritten: string;            // ISO date string
    commentContent: string;
    isUserOwned: boolean;
}

export interface UserBasicDTO {
    id: number;
    username: string;
    email: string;
}
