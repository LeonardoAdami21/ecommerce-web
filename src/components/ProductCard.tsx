// src/components/ProductCard.tsx

import type { Product } from "../interface";
import { useProductStore } from "../store/productStore";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { deleteProduct } = useProductStore();

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

          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Excluir produto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
