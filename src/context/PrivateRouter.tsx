import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

type PrivateRouteProps = {
  allowedRoles: ("user" | "admin")[];
  children: React.ReactNode;
};

const PrivateRoute = ({ allowedRoles, children }: PrivateRouteProps) => {
  const { user, loading } = useContext(AuthContext);

  // Para debugging
  useEffect(() => {}, [user, loading]);

  // Se ainda está carregando, mostra o loading
  if (loading) {
    return <p>Loading...</p>;
  }

  // Se não houver usuário após o carregamento, redireciona para login
  if (!user) {
    console.log("Redirecionando para login: usuário não autenticado");
    return <Navigate to="/auth/login" />;
  }

  // Verifica se o usuário tem as roles necessárias
  const hasAccess = allowedRoles.some((role) => user.userRole.includes(role));
  const hasAdminRole = hasAccess && user.userRole.includes("admin");
  const hasUserRole = hasAccess && user.userRole.includes("user");
  const hasUserOrAdminRole = hasAdminRole || hasUserRole;
  // Você pode usar essa verificação manual em vez da função hasRole
  if (!hasUserOrAdminRole) {
    console.log("Acesso negado (verificação manual)");
    return <Navigate to="/access-denied" />;
  }

  // Se passou por todas as verificações, renderiza o conteúdo
  return <>{children}</>;
};

export default PrivateRoute;
