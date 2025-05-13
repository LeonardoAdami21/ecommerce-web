import { useState, useEffect } from "react";
import type { ProductFormData, Product } from "../interface";

interface ProductFormProps {
  initialData?: Product; // Para edição de produtos existentes
  onSubmit: (data: ProductFormData) => void;
  isSubmitting: boolean;
}

const ProductForm = ({
  initialData,
  onSubmit,
  isSubmitting,
}: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    image: initialData?.image || "",
    category: initialData?.category || "",
    quantity_stock: initialData?.quantity_stock || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null,
  );


  useEffect(() => {
    // Atualiza o formulário se os dados iniciais mudarem (útil para edição)
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        image: initialData.image,
        category: initialData.category,
        quantity_stock: initialData.quantity_stock,
      });
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome do produto é obrigatório";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (formData.price <= 0) {
      newErrors.price = "Preço deve ser maior que zero";
    }

    if (!formData.category) {
      newErrors.category = "Categoria é obrigatória";
    }

    if (formData.quantity_stock < 0) {
      newErrors.quantity_stock = "Estoque não pode ser negativo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Convertendo valores numéricos
    if (name === "price" || name === "stock") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Limpa o erro do campo que está sendo editado
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      imageUrl: value,
    }));

    // Atualiza a prévia da imagem
    if (value) {
      setImagePreview(value);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna da esquerda */}
        <div className="space-y-6">
          {/* Nome do produto */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Produto*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Digite o nome do produto"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Preço */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preço (R$)*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoria*
            </label>
            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Estoque */}
          <div>
            <label
              htmlFor="quantity_stock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estoque*
            </label>
            <input
              type="number"
              id="quantity_stock"
              name="quantity_stock"
              value={formData.quantity_stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border ${
                errors.quantity_stock ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="0"
            />
            {errors.quantity_stock && (
              <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
            )}
          </div>
        </div>

        {/* Coluna da direita */}
        <div className="space-y-6">
          {/* URL da imagem */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              URL da Imagem
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Prévia:</p>
                <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Prévia do produto"
                    className="h-40 object-contain mx-auto"
                    onError={() => setImagePreview("/placeholder-image.jpg")}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`w-full px-3 py-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Descreva o produto detalhadamente"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-medium transition-colors duration-200`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0.5 4.373 0.5 11s4.373 11 11 11v-4a7 7 0 01-7-7z"
                ></path>
              </svg>
              Salvando...
            </span>
          ) : (
            "Salvar Produto"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
