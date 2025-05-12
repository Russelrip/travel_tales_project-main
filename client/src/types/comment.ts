export interface CommentDTO {
    id: number;
    username: string;
    dateWritten: string;        // always string in frontend
    commentContent: string;
    isUserOwned: boolean;
}

export interface CreatedComment {
    id: number;
    blogPostId: number;
    registeredUserId: number;
    comment: string;
    createdAt: string;
}