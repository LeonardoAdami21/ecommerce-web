// src/pages/Orders/OrdersList.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Orders } from "../interface";
import { getOrders } from "../services/orders.service";

const OrdersList = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<Orders["status"] | "all">(
    "all",
  );
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const status = statusFilter !== "all" ? statusFilter : undefined;
      const response = await getOrders(page, 10, status);

      setOrders(response.orders);
      setTotalPages(response.pages);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError(
        "Não foi possível carregar os pedidos. Tente novamente mais tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadgeClass = (status: Orders["status"]) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "processando":
        return "bg-blue-100 text-blue-800";
      case "enviado":
        return "bg-indigo-100 text-indigo-800";
      case "entregue":
        return "bg-green-100 text-green-800";
      case "cancelado":
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

  const renderPagination = () => {
    return (
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 mx-1 rounded border disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2 mx-1">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 mx-1 rounded border disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">
          Você precisa estar logado para ver seus pedidos
        </h2>
        <div className="mt-4">
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Fazer login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <div className="flex items-center">
          <label htmlFor="status-filter" className="mr-2">
            Filtrar por status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as Orders["status"] | "all");
              setPage(1); // Reset para primeira página ao mudar filtro
            }}
            className="border rounded px-3 py-1"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendente</option>
            <option value="processing">Em processamento</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando pedidos...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID do Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at.toISOString())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        order.status,
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {renderPagination()}
    </div>
  );
};

export default OrdersList;
