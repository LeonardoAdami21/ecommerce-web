import axiosInstance from "../api/api";
import type { AuthResponse, Users } from "../interface";

export const userLogin = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  if (!email) {
    throw new Error("Email is required");
  }

  // Para rotas públicas, pode ser útil usar um axios instance sem interceptors
  // Ou usar api diretamente, já que o interceptor só adiciona token quando ele existe
  const response = await axiosInstance.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  // Opcional: salvar o token aqui mesmo
  if (response.data && response.data.access_token) {
    saveAuthToken(response.data.access_token);
  }

  return response.data;
};

export const getCurrentUser = async (): Promise<Users> => {
  // Esta rota precisa do token, então usamos o api com os interceptors
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }

  const response = await axiosInstance.get<Users>("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const userData: Users = {
    id: response.data.id,
    email: response.data.email,
    name: response.data.name,
    password: response.data.password,
    roles: response.data.roles,
  };
  return userData;
};

export const saveAuthToken = (token: string): void => {
  localStorage.setItem("access_token", token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("access_token");
};

export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem("access_token");
    window.location.href = "/auth/login";
  } catch (error) {
    localStorage.removeItem("access_token");
    window.location.href = "/auth/login";
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Registration failed");
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
