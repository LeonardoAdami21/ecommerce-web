import axios from "axios";
import { backendUrl, nodeEnv } from "../env/envoriment";

const axiosInstance = axios.create({
  baseURL:
    nodeEnv === "development" ? `${backendUrl}` : `${backendUrl}`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
