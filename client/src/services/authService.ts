// src/services/authService.ts
import { AuthResponse, TokenRefreshResponse } from "@/types/auth";
import { api } from "./axiosInstance";

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
            email: email,       // backend expects emailPassed
            password,
        });

        const data = response.data?.data;
        if (data) {
            sessionStorage.setItem("accessToken", data.accessToken);
            sessionStorage.setItem("refreshToken", data.refreshToken);
            sessionStorage.setItem("userId", data.id.toString());
            sessionStorage.setItem("username", data.username);
            sessionStorage.setItem("email", data.email);
        }

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

export const registerUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
            username,
            email,
            password,
        });

        const data = response.data?.data;
        if (data) {
            sessionStorage.setItem("accessToken", data.accessToken);
            sessionStorage.setItem("refreshToken", data.refreshToken);
            sessionStorage.setItem("userId", data.id.toString());
            sessionStorage.setItem("username", data.username);
            sessionStorage.setItem("email", data.email);
        }

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

export const refreshAccessToken = async (refreshToken: string): Promise<TokenRefreshResponse> => {
    try {
        const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/refresh-token`, {
            refreshToken,
        });

        const data = response.data;
        if (data?.accessToken) {
            sessionStorage.setItem("accessToken", data.accessToken);
        }

        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Token refresh failed");
    }
};

export const logout = async () => {
    try {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("email");
    } catch (error) {
        console.error("Error logging out:", error);
    }
};