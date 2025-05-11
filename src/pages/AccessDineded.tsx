import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md px-8 py-6 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
        <div className="mt-4">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="mt-4 text-gray-700">
          Você não tem permissão para acessar esta página.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/cart')}
            className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Voltar
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Ir para Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
