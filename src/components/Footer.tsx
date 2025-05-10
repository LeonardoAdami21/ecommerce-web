import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Sistema de Gerenciamento de Produtos
      </div>
    </footer>
  );
};

export default Footer;
