// components/Cart.tsx
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCartStore();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Carrinho</h2>
      {cart.length === 0 ? (
        <p>Carrinho vazio</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.productId} className="flex justify-between mb-2">
                <span>
                  {item.productName} (x{item.quantity})
                </span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 ml-2"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 font-semibold">Total: R$ {total.toFixed(2)}</div>
          <button
            onClick={clearCart}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          >
            Limpar Carrinho
          </button>
          <Link
            to="/orders"
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
          >
            Finalizar Compra
          </Link>
          <button className="mt-2 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded">
            <Link to="/">Continuar Comprando</Link>
          </button>
          <Link
            to="/orders"
            className="mt-2 bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
          >
            Voltar
          </Link>
        </>
      )}
    </div>
  );
};

export default Cart;
