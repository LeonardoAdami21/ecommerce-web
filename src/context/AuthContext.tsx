import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuthToken,
  getCurrentUser,
  registerUser,
  removeAuthToken,
  saveAuthToken,
  userLogin,
} from "../services/auth.service";
import type { AuthResponse, Users } from "../interface";

interface AuthContextData {
  user: Users | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Carrega o usuário inicialmente se houver um token
  useEffect(() => {
    const loadUser = async () => {
      const token = getAuthToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();

        if (userData && userData.email) {
          setUser({
            email: userData.email,
            name: userData.name || "Usuário",
            id: userData.id,
            roles: userData.roles || [],
          });
          setIsAuthenticated(true);
        } else {
          console.warn("Dados de usuário incompletos ou inválidos");
          removeAuthToken();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Falha ao carregar usuário:", error);
        removeAuthToken();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<any> => {
    try {
      const response = await registerUser(name, email, password);
      return response;
    } catch (error) {
      console.error("Falha no registro:", error);
      throw error;
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    setLoading(true);

    try {
      const response = await userLogin(email, password);

      // O token já é salvo na função userLogin

      try {
        const userData = await getCurrentUser();

        if (userData && userData.email) {
          setUser({
            email: userData.email,
            name: userData.name || "Usuário",
            id: userData.id,
            roles: userData.roles || [],
          });
          setIsAuthenticated(true);
        } else {
          throw new Error("Dados de usuário incompletos");
        }
      } catch (userError) {
        console.error("Falha ao obter dados do usuário após login:", userError);
        removeAuthToken();
        setIsAuthenticated(false);
        throw new Error("Falha ao obter dados do usuário após login");
      }

      return response;
    } catch (error) {
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/auth/login");
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.roles || !isAuthenticated) {
      return false;
    }

    const userRoles = Array.isArray(user.roles) ? user.roles : [];

    if (Array.isArray(role)) {
      return role.some((r) => userRoles.includes(r));
    }

    return userRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
