import axios from "axios";
import { backendUrl, nodeEnv } from "../env/envoriment";

const axiosInstance = axios.create({
  baseURL:
    nodeEnv === "development" ? `${backendUrl}/api` : `${backendUrl}/api`,
  withCredentials: true,
});

export default axiosInstance;
