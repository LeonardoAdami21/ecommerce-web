import axiosInstance from "../config/axios.config";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { RegisterUserDto } from "./dto/auth/RegisterUser.dto";
import { LoginUserDto } from "./dto/auth/LoginUser.dto";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "admin";
}

interface UserProps {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  register: (dto: RegisterUserDto) => void;
  login: (dto: LoginUserDto) => void;
  logout: () => void;
  checkAuth: () => void;
  getRefreshToken: () => void;
}

export const useUserStore = create<UserProps>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  error: null,
  refreshPromise: null,
  accessToken: null,
  refreshToken: null,

  register: async ({
    name,
    email,
    password,
    confirmPassword,
  }: RegisterUserDto) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });

      set({ user: res.data, loading: false });
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  login: async ({ email, password }: LoginUserDto) => {
    set({ loading: true });

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      set({
        user: res.data.data, // Pega apenas os dados do usuário
        accessToken: res.data.access_token, // Salva o access token
        refreshToken: res.data.refresh_token, // Salva o refresh token
        loading: false,
      });
      toast.success("Login successfully");
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout",
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const token = get().accessToken;
      if (!token) {
        console.error("Token not found");
      }
      const response = await axiosInstance.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ user: response.data, checkingAuth: false });
    } catch (error: any) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  getRefreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.post("/auth/refresh-token", {
        refresh_token: get().refreshToken,
      });
      set({
        accessToken: response.data.access_token, // Salva o novo access token
        refreshToken: response.data.refresh_token, // Atualiza o refresh token
        checkingAuth: false,
      });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));
