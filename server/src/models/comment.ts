export interface Comment {
    id: number;
    blogPostId: number;
    registeredUserId: number;
    comment: string;
    createdAt: Date;
}

export interface CommentDTO {
    id: number;
    username: string;
    dateWritten: Date;
    commentContent: string;
    isUserOwned: boolean;
}

export interface CommentCreateDTO {
    blogPostId: number;
    registeredUserId: number;
    comment: string;
}