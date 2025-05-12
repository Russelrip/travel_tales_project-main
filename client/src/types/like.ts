export interface LikeDTO {
    id: number;
    blogPostId: number;
    registeredUserId: number;
    hasReacted: boolean;
    createdAt: string;          // ISO date string
}