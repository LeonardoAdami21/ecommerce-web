// src/components/FilterBar.tsx
import { useState, useEffect } from "react";
import { useProductStore } from "../store/productStore";

const FilterBar = () => {
  const { products, filters, updateFilter } = useProductStore();
  const [localFilter, setLocalFilter] = useState({
    searchTerm: filters.searchTerm || "",
    minPrice: filters.minPrice === null ? "" : filters.minPrice,
    maxPrice: filters.maxPrice === null ? "" : filters.maxPrice,
  });

  // Para encontrar o preço máximo no conjunto de produtos
  const [maxPriceInProducts, setMaxPriceInProducts] = useState<number>(0);

  // Sincronizar o estado local com as mudanças no estado global
  useEffect(() => {
    setLocalFilter({
      searchTerm: filters.searchTerm || "",
      minPrice: filters.minPrice === null ? "" : filters.minPrice,
      maxPrice: filters.maxPrice === null ? "" : filters.maxPrice,
    });
  }, [filters]);

  // Calcular o preço máximo dos produtos
  useEffect(() => {
    if (products && products.length > 0) {
      const highestPrice = Math.max(
        ...products.map((product) => product.price),
      );
      setMaxPriceInProducts(highestPrice);
    }
  }, [products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalFilter((prev) => ({ ...prev, searchTerm: value }));

    // Aplicar o filtro após um pequeno delay para evitar chamadas constantes
    const timeoutId = setTimeout(() => {
      updateFilter({ searchTerm: value });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numValue = value === "" ? "" : Number(value);

    setLocalFilter((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handlePriceFilter = () => {
    updateFilter({
      minPrice:
        localFilter.minPrice === "" ? null : Number(localFilter.minPrice),
      maxPrice:
        localFilter.maxPrice === "" ? null : Number(localFilter.maxPrice),
    });
  };

  // Aplicar filtro de preço quando pressionar Enter em um dos campos
  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePriceFilter();
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let [sortBy, sortOrder] = value.split("-") as [
      "name" | "price" | "category",
      "asc" | "desc",
    ];

    updateFilter({ sortBy, sortOrder });
  };

  const getCurrentSortValue = () => {
    const { sortBy, sortOrder } = filters;
    return `${sortBy}-${sortOrder}`;
  };

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setLocalFilter({
      searchTerm: "",
      minPrice: "",
      maxPrice: "",
    });

    updateFilter({
      searchTerm: "",
      minPrice: null,
      maxPrice: null,
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Busca por texto */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Buscar produtos
          </label>
          <input
            type="text"
            id="search"
            value={localFilter.searchTerm}
            onChange={handleSearchChange}
            placeholder="Nome, categoria ou descrição..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtro de preço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faixa de preço
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={localFilter.minPrice}
              onChange={handlePriceChange}
              onKeyDown={handlePriceKeyDown}
              min={0}
              max={maxPriceInProducts}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">até</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={localFilter.maxPrice}
              onChange={handlePriceChange}
              onKeyDown={handlePriceKeyDown}
              min={0}
              max={maxPriceInProducts}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handlePriceFilter}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
            >
              Aplicar
            </button>
          </div>
        </div>

        {/* Ordenação */}
        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ordenar por
          </label>
          <select
            id="sort"
            value={getCurrentSortValue()}
            onChange={handleSortChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
            <option value="price-asc">Preço (menor para maior)</option>
            <option value="price-desc">Preço (maior para menor)</option>
            <option value="category-asc">Categoria (A-Z)</option>
            <option value="category-desc">Categoria (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Botão para limpar filtros */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
