
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/like`;
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` }
});

import type { LikeDTO } from "@/types/like";
import { api } from "./axiosInstance";

export const likePost = async (blogPostId: number): Promise<{ success: boolean; message: string; data: LikeDTO }> => {
    try {
        const response = await api.post(`${API_URL}/${blogPostId}`, {}, getAuthHeader());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to like post");
    }
};

export const unlikePost = async (blogPostId: number): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.put(`${API_URL}/${blogPostId}`, {}, getAuthHeader());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to unlike post");
    }
};