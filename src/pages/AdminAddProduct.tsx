import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { useProductStore } from "../store/productStore";
import type { ProductFormData } from "../interface";

const AdminAddProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addProduct } = useProductStore();
  const navigate = useNavigate();

  const handleSubmit = async (productData: ProductFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await addProduct(productData);
      // Redirecionar para a página de produtos após adicionar com sucesso
      navigate("/");
    } catch (err) {
      setError(
        "Ocorreu um erro ao adicionar o produto. Por favor, tente novamente.",
      );
      console.error("Error adding product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Adicionar Novo Produto
            </h1>
            <button
              onClick={() => navigate("/")}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Voltar para produtos
            </button>
          </div>

          {error && (
            <div
              className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
