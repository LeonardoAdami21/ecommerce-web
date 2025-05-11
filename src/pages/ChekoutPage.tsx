// pages/Checkout.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orders.service";
import { useCartStore } from "../store/cartStore";

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const submitOrder = async () => {
      try {
        const response = await createOrder({
          products: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          status: "Pendente",
          totalAmount: cart.reduce(
            (total, item) => total + item.quantity * item.price,
            0,
          ),
        });
        console.log("Pedido enviado:" + JSON.stringify(response));
        setStatus("success");
        navigate(`/orders/${response.id}`);
        clearCart();
      } catch (error) {
        console.error("Erro ao enviar pedido:", error);
        setStatus("error");
      }
    };

    if (cart.length > 0) {
      submitOrder();
    } else {
      setStatus("error");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      {status === "loading" && <p>Processando seu pedido...</p>}
      {status === "success" && (
        <>
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            Compra finalizada com sucesso!
          </h1>
          <p className="text-gray-600 mb-6">
            Obrigado por comprar conosco. Seu pedido foi processado.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Voltar para a loja
          </button>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Falha ao finalizar a compra
          </h1>
          <p className="text-gray-500 mb-4">
            Tente novamente ou volte para o carrinho.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Voltar
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
