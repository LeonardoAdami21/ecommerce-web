// components/ProductCard.tsx
import type { Product } from "../interface";
import { useCartStore } from "../store/cartStore";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      price: Number(product.price),
      quantity: 1, // ✅ correto
    });
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
    </div>
  );
};

export default ProductCard;
