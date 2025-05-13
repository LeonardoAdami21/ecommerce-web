// components/OrderStatusUpdate.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateOrderStatus } from "../services/orders.service";
import { useAuth } from "../context/AuthContext";

interface OrderStatusUpdateProps {
  id: number;
  currentStatus: string;
}

const OrderStatusUpdate: React.FC<OrderStatusUpdateProps> = ({
  id,
  currentStatus,
}) => {
  const [status, setStatus] = useState(currentStatus);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Função para alterar o status do pedido
  const handleStatusChange = async (newStatus: string) => {
    if (user?.roles.includes("admin")) {
      try {
        await updateOrderStatus(id, newStatus);
        setStatus(newStatus);
        alert(`Status do pedido atualizado para ${newStatus}`);
      } catch (error) {
        console.error("Erro ao atualizar o status:", error);
        alert("Erro ao atualizar o status do pedido.");
      }
    } else {
      alert("Apenas administradores podem alterar o status do pedido.");
    }
  };

  return (
    <div className="order-status-update">
      <h3 className="text-xl font-bold">Status do Pedido #{id}</h3>
      <p className="text-gray-600">Status atual: {status}</p>

      {status !== "Concluído" && (
        <div className="status-actions">
          <button
            className="btn btn-primary"
            onClick={() => handleStatusChange("Enviado")}
          >
            Marcar como Enviado
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleStatusChange("Cancelado")}
          >
            Cancelar Pedido
          </button>
        </div>
      )}

      {status === "Concluído" && (
        <p className="text-green-600">Pedido já concluído!</p>
      )}
    </div>
  );
};

export default OrderStatusUpdate;
