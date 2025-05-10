// src/components/FilterBar.tsx
import { useState, useEffect } from "react";
import { useProductStore } from "../store/productStore";

const FilterBar = () => {
  const { products } = useProductStore();
  const { filters, updateFilter } = useProductStore();
  const [localFilter, setLocalFilter] = useState({
    searchTerm: filters.searchTerm,
    minPrice: filters.minPrice === null ? "" : filters.minPrice,
    maxPrice: filters.maxPrice === null ? "" : filters.maxPrice,
  });

  // Para encontrar o preço máximo no conjunto de produtos
  const [maxPriceInProducts, setMaxPriceInProducts] = useState<number>(0);

  useEffect(() => {
    if (products.length > 0) {
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

    setLocalFilter((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sortBy: "name" | "price" | "category" = "name";
    let sortOrder: "asc" | "desc" = "asc";

    if (value === "name-asc") {
      sortBy = "name";
      sortOrder = "asc";
    } else if (value === "name-desc") {
      sortBy = "name";
      sortOrder = "desc";
    } else if (value === "price-asc") {
      sortBy = "price";
      sortOrder = "asc";
    } else if (value === "price-desc") {
      sortBy = "price";
      sortOrder = "desc";
    } else if (value === "category-asc") {
      sortBy = "category";
      sortOrder = "asc";
    } else if (value === "category-desc") {
      sortBy = "category";
      sortOrder = "desc";
    }

    updateFilter({ sortBy, sortOrder });
  };

  const getCurrentSortValue = () => {
    const { sortBy, sortOrder } = filters;
    return `${sortBy}-${sortOrder}`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
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
    </div>
  );
};

export default FilterBar;
