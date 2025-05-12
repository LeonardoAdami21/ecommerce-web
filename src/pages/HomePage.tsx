import { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import FilterBar from "../components/FilterBar";
import { useAuth } from "../context/AuthContext";
import { useProductStore } from "../store/productStore";

const Home = () => {
  const { fetchProducts, products } = useProductStore();
  const { user } = useAuth();

  // Busca produtos ao carregar o componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pb-12">
      <header className="text-center py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Bem-vindo ao nosso E-commerce
        </h1>
        <p className="text-gray-600 text-lg">
          Confira nossos produtos disponíveis
        </p>
      </header>

      {/* Barra de filtros */}
      <div className="container mx-auto px-4 mb-6">
        <FilterBar />
      </div>

      {/* Botão de adicionar produto (para admins) */}
      {user?.userRole?.includes("admin") && (
        <div className="container mx-auto px-4 flex justify-end mb-6">
          <Link
            to="/products"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Adicionar Produto
          </Link>
        </div>
      )}

      {/* Lista de produtos */}
      <div className="container mx-auto px-4">
        {products.length > 0 ? (
          <ProductList />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {products.length === 0
                ? "Carregando produtos..."
                : "Nenhum produto encontrado com os filtros atuais."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
