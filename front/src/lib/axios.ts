import { useAuthStore } from "../auth";
import axios from "axios";

export const API_URL =
	import.meta.env.VITE_API_URL || "http://localhost:8080/v1";

export const axiosConfig = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		"Accept-Language": "pt-BR",
	},
});

axiosConfig.interceptors.request.use(
	(config) => {
		const { token } = useAuthStore.getState();

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		} else {
			config.headers.Authorization = undefined;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

axiosConfig.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("Erro na API:", error.response?.data || error.message);
		return Promise.reject(error);
	},
);