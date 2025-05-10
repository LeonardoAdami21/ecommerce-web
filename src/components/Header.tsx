import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <header className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            <h1 className="text-2xl font-bold text-white ml-2">
              Gerenciamento de Produtos
            </h1>
          </div>

          <div className="text-white text-sm">
            <span className="bg-blue-700 px-2 py-1 rounded">
              React + TypeScript + Vite + Tailwind
            </span>
          </div>
          {!user && (
            <div className="flex space-x-2 ">
              <Button onClick={() => navigate("/auth/login")}>Login</Button>
              <Button
                onClick={() => navigate("/auth/register")}
                className="bg-gray-700 hover:bg-gray-800"
              >
                Registrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
