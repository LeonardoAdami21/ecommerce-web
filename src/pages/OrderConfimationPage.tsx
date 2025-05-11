// OrderConfirmationPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrderById, updateOrderStatus } from "../services/orders.service";

interface OrderProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  total_amount: number;
  status: string;
  products: OrderProduct[];
}

const OrderConfirmationPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const { user } = useAuth();
  const { id } = useParams(); // <-- Captura o ID da URL

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = Number(id); // Converte para número
        if (isNaN(orderId)) return;

        const response = await getOrderById(orderId);
        setOrder(response);
      } catch (error) {
        console.error("Erro ao buscar pedido:", error);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-semibold text-gray-600">Carregando...</p>
      </div>
    );
  }

  // Dentro do componente:
  const handleCancel = async () => {
    if (!order) return;

    try {
      await updateOrderStatus(order.id, "Cancelado");
      alert("Pedido cancelado.");
      setOrder({ ...order, status: "Cancelado" });
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      alert("Não foi possível cancelar o pedido.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Pedido Confirmado!
        </h2>

        <p className="text-lg text-gray-600 mb-4">
          <strong>ID do Pedido:</strong> {order.id}
        </p>

        <p className="text-lg text-gray-600 mb-4">
          <strong>Status:</strong> {order.status}
        </p>

        <p className="text-lg text-gray-600 mb-4">
          <strong>Total:</strong> R${order.total_amount}
        </p>

        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">
          Detalhes dos Produtos:
        </h3>

        <ul className="space-y-4">
          {order.products.map((product) => (
            <li key={product.id} className="flex justify-between">
              <span>{product.name}</span>
              <span>
                {product.quantity} x R${product.price}
              </span>
            </li>
          ))}
        </ul>

        {order.status === "Pendente" && (
          <button
            onClick={handleCancel}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Cancelar Pedido
          </button>
        )}

        {order.status === "Cancelado" && (
          <p className="mt-4 text-red-600 font-semibold">
            Este pedido foi cancelado.
          </p>
        )}
        <div className="mt-6 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Obrigado pela sua compra, {user?.name || "Cliente"}!
          </p>
          <p className="text-lg text-gray-600">
            Seu pedido está sendo processado e você será notificado assim que
            ele for enviado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
