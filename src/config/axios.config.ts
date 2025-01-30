import axios from "axios";
import { backendUrl, nodeEnv } from "../env/envoriment";
import { useUserStore } from "../store/useUserStore";

const axiosInstance = axios.create({
  baseURL: nodeEnv === "development" ? `${backendUrl}` : `${backendUrl}`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Evita loop infinito

      try {
        console.warn("Access token expired, trying to refresh...");

        await useUserStore.getState().refreshToken
        const newToken = useUserStore.getState().accessToken;

        if (!newToken) throw new Error("Failed to refresh token");

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Reenvia a requisição original
      } catch (refreshError) {
        console.error("Token refresh failed, logging out...");
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
