import type { CreatedComment } from "@/types/comment";
import { api } from "./axiosInstance";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/comments`;
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` }
});

export const createComment = async (
    blogPostId: number,
    comment: string
): Promise<CreatedComment> => {
    try {
        const response = await api.post(API_URL, {
            blogPostId,
            comment
        }, getAuthHeader());

        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to create comment");
    }
};

export const deleteComment = async (commentId: number): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.delete(`${API_URL}/${commentId}`, getAuthHeader());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to delete comment");
    }
};