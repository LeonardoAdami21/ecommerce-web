// src/pages/Orders/CreateOrder.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../services/products.service";
import { createOrder, type CreateOrderData } from "../services/orders.service";

// Mock da API de produtos - em um cenário real, você importaria isso do arquivo de API de produtos
interface Product {
  id: number;
  name: string;
  price: number;
  quantity_stock: number;
}

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

const CreateOrder = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | number>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();

    // Se o usuário estiver autenticado, preenche o nome do cliente
    if (user?.name) {
      setCustomerName(user.name);
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const productList = await getProducts();
      setProducts(productList);

      if (productList.length > 0) {
        setSelectedProduct(productList.map((p) => p.id)[0]);
      }
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError("Não foi possível carregar a lista de produtos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    // Verifica se o produto já está no carrinho
    const existingItemIndex = cart.findIndex(
      (item) => item.productId === selectedProduct,
    );

    if (existingItemIndex >= 0) {
      // Atualiza a quantidade se o produto já estiver no carrinho
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Adiciona um novo item ao carrinho
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice: product.price,
        },
      ]);
    }

    // Reseta os valores do formulário
    setQuantity(1);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;

    setCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Adicione pelo menos um produto ao carrinho.");
      return;
    }

    if (!customerName.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const orderData: CreateOrderData = {
        status: "Pendente",
        totalAmount: calculateTotal(),
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const newOrder = await createOrder(orderData);
      navigate(`/orders/${newOrder.id}`);
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      setError("Não foi possível criar o pedido. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
    }
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
          Você precisa estar logado para criar um pedido
        </h2>
        <div className="mt-4">
          <button
            onClick={() => navigate("/auth/login")}
            className="text-blue-600 hover:underline"
          >
            Fazer login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/orders")}
          className="text-blue-600 hover:underline"
        >
          &larr; Voltar para a lista de pedidos
        </button>
        <h1 className="text-2xl font-bold mt-2">Criar Novo Pedido</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário para adicionar produtos */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Adicionar Produtos</h2>

          {isLoading ? (
            <div className="text-center py-4">Carregando produtos...</div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="product"
                >
                  Produto
                </label>
                <select
                  id="product"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="quantity"
                >
                  Quantidade
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  min="1"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Adicionar ao Carrinho
              </button>
            </form>
          )}
        </div>

        {/* Resumo do pedido */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="customerName"
            >
              Nome do Cliente
            </label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nome do cliente"
              required
            />
          </div>

          {cart.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              Carrinho vazio. Adicione produtos ao pedido.
            </div>
          ) : (
            <div>
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">Itens no Carrinho:</h3>
                <ul className="divide-y">
                  {cart.map((item) => (
                    <li key={item.productId} className="py-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">
                            {item.productName}
                          </span>
                          <div className="text-sm text-gray-600">
                            {formatCurrency(item.unitPrice)} x
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.productId,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              min="1"
                              className="w-16 mx-2 border rounded text-center"
                            />
                            = {formatCurrency(item.unitPrice * item.quantity)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={cart.length === 0 || !customerName.trim() || isSubmitting}
            className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
          >
            {isSubmitting ? "Processando..." : "Finalizar Pedido"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
