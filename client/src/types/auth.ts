// src/types/auth.ts

export interface AuthResponse {
    success: boolean;
    data: AuthData;
}

export interface AuthData {
    id: number;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
}

export interface TokenRefreshResponse {
    accessToken: string;
}
