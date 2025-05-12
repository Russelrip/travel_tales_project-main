export interface Like {
    id: number;
    blogPostId: number;
    registeredUserId: number;
    hasReacted: boolean;
    createdAt: Date;
}