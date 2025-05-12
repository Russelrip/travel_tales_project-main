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

// export const getUserById = async (id: number) => {
//     try {
//         const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
//         return response.data;
//     } catch (error: any) {
//         throw new Error(error.response?.data?.message || "Failed to fetch user");
//     }
// };

// export const getAllUsers = async () => {
//     try {
//         const response = await axios.get(API_URL, getAuthHeader());
//         return response.data;
//     } catch (error: any) {
//         throw new Error(error.response?.data?.message || "Failed to fetch users");
//     }
// };

// export const updateUser = async (id: number, userData: { username?: string; email?: string; password?: string }) => {
//     try {
//         const response = await axios.put(`${API_URL}/${id}`, userData, getAuthHeader());
//         return response.data;
//     } catch (error: any) {
//         throw new Error(error.response?.data?.message || "Failed to update user");
//     }
// };

// export const deleteUser = async (id: number) => {
//     try {
//         const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
//         return response.data;
//     } catch (error: any) {
//         throw new Error(error.response?.data?.message || "Failed to delete user");
//     }
// };
