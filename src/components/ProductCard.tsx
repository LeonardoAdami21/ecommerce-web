// src/components/ProductCard.tsx

import { useAuth } from "../context/AuthContext";
import type { Product } from "../interface";
import { useProductStore } from "../store/productStore";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { deleteProduct } = useProductStore();
  const { user } = useAuth();

  const isAuthenticated = user?.roles.includes("admin");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleDelete = () => {
    if (
      confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)
    ) {
      deleteProduct(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      <div className="w-full h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://placehold.co/600x400?text=Imagem+Indisponível";
          }}
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h3>

          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {product.category}
          </span>
        </div>

        <p className="mt-2 text-xl font-bold text-gray-900">
          {formatCurrency(product.price)}
        </p>

        <p className="mt-2 text-gray-600 text-sm h-12 overflow-hidden">
          {product.description}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-500">
            Estoque: {product.stockQuantity}
          </div>

          {isAuthenticated && (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDelete}
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
