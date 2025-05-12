import type { CountryDTO } from "@/types/country";
import { api } from "./axiosInstance";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/country`;
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` }
});

export const getCountriesByName = async (name: string): Promise<CountryDTO[]> => {
    try {
        const cleanedName = encodeURIComponent(name.trim());
        const response = await api.get(`${API_URL}/${cleanedName}`, getAuthHeader());
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch countries");
    }
};