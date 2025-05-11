import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart } from "lucide-react";

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {}, [isAuthenticated, user, loading]);

  return (
    <header className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold text-white ml-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Gerenciamento de Produtos
            </h1>
          </div>

          {loading ? (
            <div className="text-white animate-pulse">Carregando...</div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/cart")}
                className="relative text-white hover:text-gray-200"
                title="Ir para o carrinho"
              >
                <ShoppingCart className="w-6 h-6" />
                {/* Badge opcional com quantidade (ex: 3) */}
                {/* <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  3
                </span> */}
              </button>

              <span
                data-testid="user-greeting"
                className="text-white bg-blue-700 px-3 py-1 rounded"
              >
                Olá, {user.name}
              </span>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition duration-200"
                data-testid="logout-button"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/auth/login")}
                className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded transition duration-200"
                data-testid="login-button"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth/register")}
                className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded transition duration-200"
                data-testid="register-button"
              >
                Registrar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
