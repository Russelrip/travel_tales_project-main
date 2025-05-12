import axios from "axios";

// ✅ Create axios instance
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// ✅ Add interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Auto logout
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("username");
            sessionStorage.removeItem("email");
            window.location.href = "/login";   // ✅ force logout + redirect
        }
        return Promise.reject(error);
    }
);
