import { useEffect, useState } from "react";
import {
  Search,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  Package,
  AlertTriangle,
} from "lucide-react";
import { getOrders, updateOrderStatus } from "../services/orders.service";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price?: number;
}

export interface Orders {
  id: number;
  userId?: number;
  status: string;
  customerName: string;
  total_amount: number;
  createdAt: Date;
  updated_at: Date;
  products: OrderItem[];
}

const STATUS = {
  PENDENTE: "Pendente",
  EM_PROCESSAMENTO: "Em processamento",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

const AdminDashboard = () => {
  const [pedidos, setPedidos] = useState<Orders[]>([]);
  const [termoBusca, setTermoBusca] = useState<string>("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [pedidoAtual, setPedidoAtual] = useState<Orders | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [totalPedidos, setTotalPedidos] = useState(0);

  const carregarPedidos = async () => {
    setCarregando(true);
    setErro(null);

    console.log("Buscando pedidos...");
    getOrders().then((response) => {
      console.log("Resposta da API:", response); // <--- Adicione isso
      if (response && Array.isArray(response.orders)) {
        setPedidos(response.orders);
        setTotalPedidos(response.total || response.orders.length);
      } else {
        console.error("Formato de resposta inesperado:", response);
        setPedidos([]); // <- previne crash
        setTotalPedidos(0);
        setErro("Formato de resposta inesperado da API.");
      }
      setCarregando(false);
    });
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  const pedidosFiltrados = pedidos.filter((pedido: Orders) => {
    const correspondeAoBusca =
      pedido.customerName?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      pedido.id.toString().includes(termoBusca) ||
      pedido.products?.some((item: OrderItem) =>
        item.productName?.toLowerCase().includes(termoBusca.toLowerCase()),
      );

    const correspondeAoStatus =
      filtroStatus === "todos" || pedido.status === filtroStatus;

    return correspondeAoBusca && correspondeAoStatus;
  });

  // Iniciar edição de status do pedido
  const editarPedido = (pedido: Orders) => {
    setPedidoAtual({ ...pedido });
    setModoEdicao(true);
  };

  // Cancelar edição
  const cancelarOperacao = () => {
    setModoEdicao(false);
    setPedidoAtual(null);
  };

  // Salvar as alterações de status
  const salvarAlteracoes = () => {
    if (pedidoAtual) {
      setCarregando(true);

      // Atualizar status no backend
      updateOrderStatus(pedidoAtual.id, pedidoAtual.status)
        .then((pedidoAtualizado) => {
          setPedidos(
            pedidos.map((p) =>
              p.id === pedidoAtual.id ? pedidoAtualizado : p,
            ),
          );
          setModoEdicao(false);
          setPedidoAtual(null);
          setCarregando(false);
        })
        .catch((error) => {
          console.error("Erro ao atualizar status:", error);
          setErro("Erro ao atualizar status do pedido.");
          setCarregando(false);
        });
    }
  };

  // Componente do ícone de status
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case STATUS.PENDENTE:
        return <Clock className="text-yellow-500" size={18} />;
      case STATUS.EM_PROCESSAMENTO:
        return <Package className="text-blue-500" size={18} />;
      case STATUS.ENVIADO:
        return <Package className="text-purple-500" size={18} />;
      case STATUS.ENTREGUE:
        return <CheckCircle className="text-green-500" size={18} />;
      case STATUS.CANCELADO:
        return <AlertTriangle className="text-red-500" size={18} />;
      default:
        return null;
    }
  };

  // Componente do modal de edição de status
  const ModalEdicaoStatus = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Atualizar Status do Pedido</h2>
          <button
            onClick={cancelarOperacao}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="mb-4">
            <p className="font-medium">
              Pedido #{pedidoAtual?.id} - {pedidoAtual?.customerName}
            </p>
            <p className="text-sm text-gray-600">
              Itens: {pedidoAtual?.products?.length || 0}
            </p>
            <p className="text-sm text-gray-600">
              Valor Total:{" "}
              {pedidoAtual?.total_amount?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }) || "R$ 0,00"}
            </p>
            <p className="text-sm text-gray-600">
              Data do pedido:{" "}
              {pedidoAtual?.createdAt instanceof Date
                ? pedidoAtual?.createdAt.toLocaleDateString("pt-BR")
                : pedidoAtual?.createdAt
                  ? new Date(pedidoAtual.createdAt as any).toLocaleDateString(
                      "pt-BR",
                    )
                  : "Data não disponível"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status do Pedido
            </label>
            <select
              value={pedidoAtual?.status || STATUS.PENDENTE}
              onChange={(e) =>
                setPedidoAtual({
                  ...pedidoAtual,
                  status: e.target.value,
                } as Orders)
              }
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value={STATUS.PENDENTE}>Pendente</option>
              <option value={STATUS.EM_PROCESSAMENTO}>Em Processamento</option>
              <option value={STATUS.ENVIADO}>Enviado</option>
              <option value={STATUS.ENTREGUE}>Entregue</option>
              <option value={STATUS.CANCELADO}>Cancelado</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={cancelarOperacao}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            disabled={carregando}
          >
            Cancelar
          </button>
          <button
            onClick={salvarAlteracoes}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={carregando}
          >
            <Save size={16} className="mr-1" />
            {carregando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              Gerenciamento de Pedidos
            </h1>
            <button
              onClick={carregarPedidos}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={carregando}
            >
              {carregando ? "Carregando..." : "Atualizar Pedidos"}
            </button>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar pedidos..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md"
                disabled={carregando}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search size={18} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filtrar por status:</span>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="p-2 border rounded-md"
                disabled={carregando}
              >
                <option value="todos">Todos</option>
                <option value={STATUS.PENDENTE}>Pendente</option>
                <option value={STATUS.EM_PROCESSAMENTO}>
                  Em Processamento
                </option>
                <option value={STATUS.ENVIADO}>Enviado</option>
                <option value={STATUS.ENTREGUE}>Entregue</option>
                <option value={STATUS.CANCELADO}>Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{erro}</span>
            <button onClick={() => setErro(null)} className="font-bold">
              ×
            </button>
          </div>
        )}

        {/* Estado de carregamento */}
        {carregando ? (
          <div className="bg-white shadow-md rounded-lg p-8 flex justify-center items-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <p className="text-gray-600">Carregando pedidos...</p>
            </div>
          </div>
        ) : (
          /* Listagem de Pedidos */
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Itens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pedidosFiltrados.length > 0 ? (
                    pedidosFiltrados.map((pedido) => (
                      <tr key={pedido.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{pedido.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pedido.customerName || "Cliente não identificado"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pedido.products?.length || 0}{" "}
                          {pedido.products?.length === 1 ? "item" : "itens"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pedido.total_amount?.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }) || "R$ 0,00"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon status={pedido.status} />
                            <span className="ml-2 text-sm text-gray-500">
                              {pedido.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pedidos.map((pedido) =>
                            new Date(pedido.createdAt)
                              .toLocaleDateString()
                              .toString(),
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end">
                            <button
                              onClick={() => editarPedido(pedido)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Atualizar Status"
                              disabled={carregando}
                            >
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        {pedidos.length === 0
                          ? "Nenhum pedido encontrado. Tente recarregar a página."
                          : "Nenhum pedido corresponde aos filtros aplicados."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Contagem de pedidos */}
            <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-500">
              Exibindo {pedidosFiltrados.length} de {pedidos.length} pedidos
            </div>
          </div>
        )}
      </div>

      {/* Modal de Edição de Status */}
      {modoEdicao && <ModalEdicaoStatus />}
    </div>
  );
};

export default AdminDashboard;
