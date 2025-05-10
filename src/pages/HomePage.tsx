import type { Product } from "../interface";
import { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import ProductList from "../components/ProductList";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        if (!response) {
          throw new Error("Failed to fetch products");
        }
        setProducts(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <header className="text-center py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Bem-vindo ao nosso E-commerce
        </h1>
        <p className="text-gray-600 text-lg">
          Confira nossos produtos disponíveis
        </p>
      </header>
      <ProductList key={products.length} />
    </div>
  );
};

export default Home;
