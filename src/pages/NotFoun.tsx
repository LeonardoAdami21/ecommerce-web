import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <div className="w-24 h-1 mx-auto my-6 bg-blue-600 rounded"></div>
        <h2 className="text-3xl font-medium text-gray-900 mb-4">
          Página não encontrada
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Voltar à página inicial
        </Link>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500">
          Se você acredita que isso é um erro, por favor entre em contato com
          nosso suporte.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
