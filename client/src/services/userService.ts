import { UserBasicDTO, UserProfileResponse } from "@/types/user";
import { api } from "./axiosInstance";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/user`;
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` }
});

export const getUserProfile = async (userId: number): Promise<UserProfileResponse> => {
    try {
        const response = await api.get(`${API_URL}/profile/${userId}`, getAuthHeader());
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch user profile");
    }
};

export async function getUserByUsername(username: string): Promise<UserBasicDTO> {
    try {
        const token = sessionStorage.getItem("accessToken");

        const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/user/by-username/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.data as UserBasicDTO;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch user by username");
    }
}