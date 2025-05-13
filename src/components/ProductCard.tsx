// components/ProductCard.tsx
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../interface";
import { useCartStore } from "../store/cartStore";
import { deleteProduct, getProducts } from "../services/products.service";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCartStore();
  const { user } = useAuth();
  const isAdmin = user?.userRole?.includes("admin");
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      price: Number(product.price),
      quantity: 1, // ✅ correto
    });
  };

  const onDelete = async (product: Product) => {
    if (!product.id) return;
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este produto?",
    );
    if (!confirmDelete) return;
    await deleteProduct(product.id);
    alert("Produto excluído com sucesso!");
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="text-blue-600 font-bold mt-2">R$ {product.price}</p>
      </div>
      <button
        onClick={() => handleAddToCart()}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Adicionar ao carrinho
      </button>
      {isAdmin && (
        <div className="flex items-center space-x-3">
          <Link to="/products/admin/add-product" title="Adicionar Produto">
            <PlusCircle
              size={36}
              className="text-blue-600 hover:text-blue-800 transition duration-200"
            />
          </Link>
          <button
            onClick={() => navigate(`/products/admin/edit/${product.id}`)}
            className="text-blue-500 hover:text-blue-700 transition"
            title="Editar Produto"
          >
            <Edit size={24} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="text-red-500 hover:text-red-700 transition"
            title="Excluir Produto"
          >
            <Trash2 size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
