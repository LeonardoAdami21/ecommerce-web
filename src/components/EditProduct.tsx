// pages/EditProduct.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../services/products.service";
import type { Product } from "../interface";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      const numericId = parseInt(id); // ✅ converte para número
      getProductById(numericId).then((data) => setProduct(data));
    }
  }, [id]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!product) return;
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]:
        name === "price" || name === "quantity_stock" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product && product.id) {
      await updateProduct(product.id, product);
      alert("Produto atualizado!");
      navigate("/");
    }
  };

  if (!product) return <p>Carregando produto...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Editar Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Nome do produto"
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          type="number"
          name="quantity_stock"
          value={product.quantity_stock}
          onChange={handleChange}
          placeholder="Quantidade em estoque"
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Preço"
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Categoria"
          className="w-full border rounded px-4 py-2"
          required
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Descrição"
          className="w-full border rounded px-4 py-2"
          rows={4}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
