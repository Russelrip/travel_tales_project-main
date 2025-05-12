// src/types/user.ts

export interface CommentDTO {
    id: number;
    username: string;
    dateWritten: string;            // in API it will still arrive as ISO string
    commentContent: string;
    isUserOwned: boolean;
}

export interface BlogPostWithDetailsDTO {
    id: number;
    authorUsername: string;
    title: string;
    dateOfVisit: string;
    likeCount: number;
    countryName: string;
    content: string;
    dateBlogWasCreated: string;
    listOfComments: CommentDTO[];
    didUserLikeThis: boolean;
    isUserFollowingAuthor: boolean;
}

export interface UserProfileDTO {
    username: string;
    email: string;
    dateOfJoining: string;
    totalPosts: number;
    followerCount: number;
    followingCount: number;
    posts: BlogPostWithDetailsDTO[];
}

export interface BlogPost {
    id: number;
    authorId: number;
    title: string;
    content: string;
    countryName: string;
    dateOfVisit: string;
    createdAt: string;
}