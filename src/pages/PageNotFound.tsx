import React from "react";

const PageNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md px-8 py-6 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600">
          404 - Página Nao Encontrada
        </h1>
        <p className="text-2xl font-bold text-red-600">
          {" "}
          Entre em contato com o administrador
        </p>
      </div>
    </div>
  );
};

export default PageNotFound;
