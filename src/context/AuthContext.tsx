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
  register: (name: string, email: string, password: string) => Promise<void>;
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
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await getCurrentUser();
          console.log("User data:", userData);
          setUser({
            email: userData.email,
            id: userData.id,
            roles: userData.roles,
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.log("Failed to load user:", error);
          removeAuthToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Corrigido para chamar o serviço de registro
  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<any> => {
    try {
      const response = await registerUser(name, email, password);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Registration failed");
    }
  };

  // Corrigido para chamar o serviço de login
  const login = async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await userLogin(email, password);

      // Verificar se access_token existe na resposta
      if (response && response.access_token) {
        saveAuthToken(response.access_token);
        setIsAuthenticated(true);

        // Se a API não retorna o usuário na resposta de login,
        // precisamos fazer uma chamada separada para obter os dados do usuário
        try {
          const userData = await getCurrentUser();
          setUser({
            email: userData.email,
            id: userData.id,
            roles: userData.roles,
          });
        } catch (userError) {
          console.log("Failed to get user data after login:", userError);
          throw new Error("Failed to get user data after login");
        }

        return response;
      } else {
        console.log("No access token found in login response:", response);
        throw new Error("Authentication failed: No token received");
      }
    } catch (error) {
      console.log("Login failed:", error);
      throw new Error("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  // Função para verificar se o usuário possui determinada role
  // Função corrigida para verificar se o usuário possui determinada role
  // Função para verificar se o usuário possui determinada role (com debug adicional)
  const hasRole = (role: string | string[]): boolean => {
    console.log("hasRole - Checking:", {
      user,
      userRoles: user?.roles,
      requiredRoles: role,
    });

    // Se não há usuário ou roles não é um array, retorna false
    if (!user || !user.roles) {
      console.log("hasRole - No user or roles");
      return false;
    }

    // Garante que roles seja tratado como um array
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    console.log("hasRole - User roles:", userRoles);

    if (Array.isArray(role)) {
      const hasPermission = role.some((r) => userRoles.includes(r));
      console.log("hasRole - Multiple roles check:", {
        requiredRoles: role,
        hasPermission,
      });
      return hasPermission;
    }

    const hasPermission = userRoles.includes(role);
    console.log("hasRole - Single role check:", {
      requiredRole: role,
      hasPermission,
    });
    return hasPermission;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
