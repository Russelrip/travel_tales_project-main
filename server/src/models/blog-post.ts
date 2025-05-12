import { CommentDTO } from "./comment";

export interface BlogPost {
    id: number;
    authorId: number;
    title: string;
    content: string;
    countryName: string;
    dateOfVisit: Date;
    createdAt: Date;
}

export interface CreateBlogPost {
    authorId: number;
    title: string;
    content: string;
    countryName: string;
    dateOfVisit: Date;
}

export interface SearchBlogPosts {
    searchQuery: string;    // user input e.g. "Si"
    page: number;           // current page number
    pageSize: number;       // number of items per page
}

export interface BlogPostWithDetailsDTO {
    id: number;
    authorUsername: string;
    title: string;
    dateOfVisit: Date;
    likeCount: number;
    countryName: string;
    content: string;
    dateBlogWasCreated: Date;
    listOfComments: CommentDTO[];
    didUserLikeThis: boolean;
    isUserFollowingAuthor: boolean;
}