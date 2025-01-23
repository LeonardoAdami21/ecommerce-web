import { create } from "zustand";
import axiosInstance from "../config/axios.config";
import { toast } from "react-hot-toast";
import { RegisterUserDto } from "./dto/RegisterUser.dto";

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;
  signup: (dto: RegisterUserDto) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<any>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({
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
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      set({ loading: false, user: response.data });
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ loading: false, user: response.data });
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
      return response.data;
    } catch (error: any) {
      set({ checkingAuth: false, user: null });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },
}));
