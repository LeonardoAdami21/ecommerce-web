import { create } from "zustand";
import { LoginUserDto } from "./dto/auth/LoginUser.dto";
import { RegisterUserDto } from "./dto/auth/RegisterUser.dto";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole.USER | UserRole.ADMIN;
}

interface UserProps {
  user: User | any;
  login: (user: any) => void;
  register: (user: any) => void;
  logout: () => void;
  checkAuth: () => void;
  getrefreshToken: () => void;
  loading: boolean;
  checkingAuth: boolean;
  acessToken: string | null;
  refreshToken: string | null;
}

export const useUserStore = create<UserProps>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  acessToken: null,
  refreshToken: null,
  refreshPromise: null,

  login: async ({ email, password }: LoginUserDto) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: email,
        password: password,
      });
      set({
        user: response.data,
        acessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        loading: false,
      });
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      toast.success("Login successfully");
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to login");
    }
  },
  register: async ({
    name,
    email,
    password,
    confirmPassword,
  }: RegisterUserDto) => {
    set({ loading: true });
    try {
      if (password !== confirmPassword) {
        set({ loading: false });
        return;
      }
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      set({
        user: response.data,
        acessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        loading: false,
      });
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to register");
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Access token not found");
      }
      const response = await axiosInstance.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      set({
        user: response.data,
        checkingAuth: false,
      });
    } catch (error: any) {
      console.log(error);
      set({ checkingAuth: false, user: null });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success("Logout successfully");
      set({ user: null, acessToken: null, refreshToken: null });
    } catch (error: any) {
      toast.error(error?.response?.data.error || "Failed to logout");
    }
  },
  getrefreshToken: async () => {
    try {
      if (get().refreshToken) {
        const response = await axiosInstance.post("/auth/refresh", {
          refresh_token: get().refreshToken,
        });
        set({
          acessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        });
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
      }
    } catch (error) {
      toast.error("Failed to refresh token");
    }
  },
}));

let refreshPromise: any = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().getrefreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
