import type { FollowDTO } from "@/types/follow";
import { api } from "./axiosInstance";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/follow`;
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` }
});

export const followUser = async (followingId: number): Promise<{ success: boolean; message: string; data: FollowDTO }> => {
    try {
        const response = await api.post(`${API_URL}/${followingId}`, {}, getAuthHeader());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to follow user");
    }
};

export const unfollowUser = async (followingId: number): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.put(`${API_URL}/${followingId}`, {}, getAuthHeader());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to unfollow user");
    }
};