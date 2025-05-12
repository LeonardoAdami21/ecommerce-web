// src/pages/Orders/OrderDetails.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Orders } from "../interface";
import { deleteOrder, getOrderById, updateOrderStatus } from "../services/orders.service";


const OrderDetails = () => {
  const [order, setOrder] = useState<Orders | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
   const orderId = order?.id;
    if (orderId) {
      fetchOrder();
    }
  }, []);

  const fetchOrder = async () => {
    const orderId = order?.id;
    if (!orderId) return;

    try {
      setIsLoading(true);
      setError(null);
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      console.error("Erro ao buscar detalhes do pedido:", err);
      setError("Não foi possível carregar os detalhes do pedido.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: Orders["status"]) => {
    const orderId = order?.id;
    if (!orderId || !order) return;

    try {
      setIsUpdating(true);
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrder(updatedOrder);
    } catch (err) {
      console.error("Erro ao atualizar status do pedido:", err);
      setError("Não foi possível atualizar o status do pedido.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    const orderId = order?.id;
    if (!orderId || !order) return;

    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) {
      return;
    }

    try {
      setIsUpdating(true);
      const updatedOrder: any = await deleteOrder(orderId);
      setOrder(updatedOrder);
    } catch (err) {
      console.error("Erro ao cancelar pedido:", err);
      setError("Não foi possível cancelar o pedido.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status: Orders["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: Orders["status"]) => {
    const statusMap: Record<Orders["status"], string> = {
      pending: "Pendente",
      processing: "Em processamento",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };

    return statusMap[status] || status;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">
          Você precisa estar logado para ver este pedido
        </h2>
        <div className="mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">
            Fazer login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">Carregando detalhes do pedido...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Pedido não encontrado.</div>;
  }

  const isAdmin = user?.userRole.includes("admin");
  const canUpdateStatus =
    isAdmin && order.status !== "cancelled" && order.status !== "delivered";
  const canCancel =
    (isAdmin || user?.id === order.userId) &&
    (order.status === "pending" || order.status === "processing");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/orders" className="text-blue-600 hover:underline">
          &larr; Voltar para a lista de pedidos
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Detalhes do Pedido #{order.id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Realizado em {formatDate(order.created_at.toISOString())}
            </p>
          </div>
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(
              order.status,
            )}`}
          >
            {formatStatus(order.status)}
          </span>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cliente</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {order.customerName}
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Valor Total</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatCurrency(order.totalAmount)}
              </dd>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Última Atualização
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(order.updated_at.toISOString())}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Itens do Pedido
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Produto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Preço Unitário
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantidade
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <th
                  scope="row"
                  colSpan={3}
                  className="px-6 py-3 text-right text-sm font-medium text-gray-900"
                >
                  Total
                </th>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {(canUpdateStatus || canCancel) && (
        <div className="mt-8 flex justify-end space-x-4">
          {canUpdateStatus && (
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">
                Atualizar status:
              </span>
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusUpdate(e.target.value as Orders["status"])
                }
                disabled={isUpdating}
                className="border rounded px-3 py-1"
              >
                <option value="pending">Pendente</option>
                <option value="processing">Em processamento</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
              </select>
            </div>
          )}

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={isUpdating}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded disabled:opacity-50"
            >
              Cancelar Pedido
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
