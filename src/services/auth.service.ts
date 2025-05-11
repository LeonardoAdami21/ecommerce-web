import axiosInstance from "../api/api";
import type { AuthResponse } from "../interface";

// Constante para chave do token para evitar erros de digitação
const TOKEN_KEY = "access_token";

export const userLogin = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  if (!email) {
    throw new Error("Email é obrigatório");
  }

  if (!password) {
    throw new Error("Senha é obrigatória");
  }

  try {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    // Verifique se a resposta contém os dados esperados
    if (!response.data || !response.data.access_token) {
      throw new Error("Resposta de autenticação inválida");
    }

    // Salve o token
    saveAuthToken(response.data.access_token);

    return response.data;
  } catch (error: any) {
    // Verificar se o erro é da resposta da API
    if (error.response) {
      const message = error.response.data?.message || "Falha na autenticação";
      throw new Error(message);
    }
    throw error;
  }
};

export async function getCurrentUser() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Token não encontrado");
  }

  try {
    const response = await axiosInstance.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error("Dados do usuário não recebidos");
    }

    return response.data;
  } catch (error: any) {
    // Se o erro for 401 (não autorizado), remova o token
    if (error.response && error.response.status === 401) {
      removeAuthToken();
    }
    throw error;
  }
}

export const saveAuthToken = (token: string): void => {
  if (!token) {
    console.error("Tentativa de salvar token vazio");
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const logout = async (): Promise<void> => {
  const token = getAuthToken();

  try {
    // Só tenta fazer logout no servidor se tiver um token
    if (token) {
      await axiosInstance.post("/auth/logout");
    }
  } catch (error) {
    console.error("Erro ao fazer logout no servidor:", error);
  } finally {
    // Sempre limpa o token local independentemente da resposta do servidor
    removeAuthToken();
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  if (!name || !email || !password) {
    throw new Error("Nome, email e senha são obrigatórios");
  }

  try {
    const response = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
    });
    return response;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || "Falha no registro";
      throw new Error(message);
    }
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
