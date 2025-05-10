import type { Product } from "../interface";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axiosInstance from "../api/api";

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
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-6">
        🎮 Bem vindo ao nosso Ecommerce
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Aqui voce comprar varios produtos com desconto
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
