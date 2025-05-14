import { BlogPost, BlogPostWithDetailsDTO } from "@/types/blog";
import { api } from "./axiosInstance";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/blog-post`;
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` }
});

export const getOptionalAuthHeader = () => {
    const token = sessionStorage.getItem("accessToken");
    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

export const getFollowingFeed = async (
    page: number = 1,
    pageSize: number = 6,
    shuffle: boolean = false
): Promise<BlogPostWithDetailsDTO[]> => {
    try {
        const response = await api.get(`${API_URL}/following-feed`, {
            headers: getAuthHeader().headers,
            params: { page, pageSize, shuffle }
        });

        return response.data.data;    // your server returns { success, data }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch following feed");
    }
};

export const searchPostsByCountry = async (
    query: string,
    page: number = 1,
    pageSize: number = 10
): Promise<BlogPostWithDetailsDTO[]> => {
    try {
        const response = await api.get(`${API_URL}/country-search`, {
            headers: { ...getOptionalAuthHeader() },
            params: { query, page, pageSize }
        });
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to search posts by country");
    }
};


export const searchPostsByAuthor = async (
    query: string,
    page: number = 1,
    pageSize: number = 10
): Promise<BlogPostWithDetailsDTO[]> => {
    try {
        const response = await api.get(`${API_URL}/author-search`, {
            headers: { ...getOptionalAuthHeader() },
            params: { query, page, pageSize }
        });
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to search posts by author");
    }
};

export const getRecentPosts = async (quantity: number = 6): Promise<BlogPostWithDetailsDTO[]> => {
    try {
        const response = await api.get(`${API_URL}/recent`, {
            headers: { ...getOptionalAuthHeader() },
            params: { quantity }
        });
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch recent posts");
    }
};

export const getMostLikedPosts = async (quantity: number = 10): Promise<BlogPostWithDetailsDTO[]> => {
    try {
        const response = await api.get(`${API_URL}/most-liked`, {
            headers: { ...getOptionalAuthHeader() },
            params: { quantity }
        });
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch most liked posts");
    }
};

export const getMostCommentedPosts = async (quantity: number = 10): Promise<BlogPostWithDetailsDTO[]> => {
    try {
        const response = await api.get(`${API_URL}/most-commented`, {
            headers: { ...getOptionalAuthHeader() },
            params: { quantity }
        });
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch most commented posts");
    }
};

export const createBlogPost = async (
    title: string,
    content: string,
    countryName: string,
    dateOfVisit: string
): Promise<BlogPost> => {
    try {
        const response = await api.post(`${API_URL}`, {
            title,
            content,
            countryName,
            dateOfVisit
        }, getAuthHeader());

        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to create blog post");
    }
};

export const updateBlogPost = async (
    postId: number,
    updateData: {
        title?: string | null;
        content?: string | null;
        countryName?: string | null;
        dateOfVisit?: string | null;
    }
): Promise<BlogPost> => {
    try {
        const response = await api.put(`${API_URL}/${postId}`, updateData, getAuthHeader());
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update blog post");
    }
};

export const deleteBlogPost = async (postId: number): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.delete(`${API_URL}/${postId}`, getAuthHeader());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to delete blog post");
    }
};


export const getBlogPostById = async (postId: number): Promise<BlogPostWithDetailsDTO> => {
    try {
        //const response = await api.get(`${API_URL}/${postId}`, getAuthHeader());
        const response = await api.get(`${API_URL}/${postId}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch blog post");
    }
};