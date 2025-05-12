import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  Package,
  AlertTriangle,
} from "lucide-react";
import { getOrders } from "../services/orders.service";

interface Order {
  id: number;
  cliente: string;
  produto: string;
  quantidade: number;
  valor: number;
  status: string;
  data: string;
}

const STATUS = {
  PENDENTE: "Pendente",
  EM_PROCESSAMENTO: "Processando",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

const AdminDashboard = () => {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [modoNovo, setModoNovo] = useState(false);
  const [pedidoAtual, setPedidoAtual] = useState<Order | null>();
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    getOrders().then(() => setPedidos);
  }, [pedidos]);

  // Pedido vazio para novo cadastro
  const pedidoVazio = {
    id: pedidos.length > 0 ? Math.max(...pedidos.map((p) => p.id)) + 1 : 1,
    cliente: "",
    produto: "",
    quantidade: 1,
    valor: 0,
    status: STATUS.PENDENTE,
    data: new Date().toISOString().split("T")[0],
  };

  // Filtrar pedidos por termo de busca e status
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const correspondeAoBusca =
      pedido.cliente.toLowerCase().includes(termoBusca.toLowerCase()) ||
      pedido.produto.toLowerCase().includes(termoBusca.toLowerCase()) ||
      pedido.id.toString().includes(termoBusca);

    const correspondeAoStatus =
      filtroStatus === "todos" || pedido.status === filtroStatus;

    return correspondeAoBusca && correspondeAoStatus;
  });

  // Adicionar novo pedido
  const adicionarPedido = () => {
    const pedidoAtual = { ...pedidoVazio };
    setPedidos([...pedidos, pedidoAtual]);
    setModoNovo(false);
    setPedidoAtual(null);
  };

  // Excluir pedido
  const excluirPedido = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
      setPedidos(pedidos.filter((pedido) => pedido.id !== id));
    }
  };

  // Iniciar edição de pedido
  const editarPedido = (pedido: Order) => {
    const pedidoEditado = { ...pedido };
    setPedidoAtual({ ...pedidoEditado });
    setModoEdicao(true);
  };

  // Cancelar edição ou novo pedido
  const cancelarOperacao = () => {
    setModoEdicao(false);
    setModoNovo(false);
    setPedidoAtual(null);
  };

  // Atualizar campo do pedido atual
  const atualizarCampoPedido = (
    pedidoAtual: any,
    campo: string,
    valor: any,
  ) => {
    setPedidoAtual({ ...pedidoAtual, [campo]: valor });
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

  // Componente do formulário de edição/novo pedido
  const FormularioPedido = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {modoNovo ? "Novo Pedido" : "Editar Pedido"}
          </h2>
          <button
            onClick={cancelarOperacao}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <input
              type="text"
              value={pedidoAtual?.cliente || ""}
              onChange={(e) =>
                atualizarCampoPedido("cliente", e.target.value, pedidoAtual?.id)
              }
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Produto
            </label>
            <input
              type="text"
              value={pedidoAtual?.produto || ""}
              onChange={(e) =>
                atualizarCampoPedido("produto", e.target.value, pedidoAtual?.id)
              }
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                value={pedidoAtual?.quantidade || 1}
                onChange={(e) =>
                  atualizarCampoPedido(
                    "quantidade",
                    e.target.value,
                    pedidoAtual?.id,
                  )
                }
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pedidoAtual?.valor || 0}
                onChange={(e) =>
                  atualizarCampoPedido("valor", e.target.value, pedidoAtual?.id)
                }
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={pedidoAtual?.status || STATUS.PENDENTE}
              onChange={(e) =>
                atualizarCampoPedido("status", e.target.value, pedidoAtual?.id)
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              value={pedidoAtual?.data || ""}
              onChange={(e) =>
                atualizarCampoPedido("data", e.target.value, pedidoAtual?.id)
              }
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={cancelarOperacao}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={adicionarPedido}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Save size={16} className="mr-1" />
            Salvar
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
              Dashboard Administrativo
            </h1>
            <button
              onClick={() => {
                setPedidoAtual({ ...pedidoVazio });
                setModoNovo(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <Plus size={18} className="mr-1" />
              Novo Pedido
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

        {/* Listagem de Pedidos */}
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
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qtd
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
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
                        {pedido.cliente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pedido.produto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pedido.quantidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pedido.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon status={pedido.status} />
                          <span className="ml-2 text-sm text-gray-500">
                            {pedido.status === STATUS.PENDENTE && "Pendente"}
                            {pedido.status === STATUS.EM_PROCESSAMENTO &&
                              "Em Processamento"}
                            {pedido.status === STATUS.ENVIADO && "Enviado"}
                            {pedido.status === STATUS.ENTREGUE && "Entregue"}
                            {pedido.status === STATUS.CANCELADO && "Cancelado"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(pedido.data).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => editarPedido(pedido)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => excluirPedido(pedido.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Nenhum pedido encontrado
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
      </div>

      {/* Modal de Formulário */}
      {(modoEdicao || modoNovo) && <FormularioPedido />}
    </div>
  );
};

export default AdminDashboard;
