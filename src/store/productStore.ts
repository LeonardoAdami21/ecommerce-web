// src/store/productStore.ts
import { create } from "zustand";
import { mockProductApi } from "../services/products.service";
import type { Product, ProductFilter, ProductFormData } from "../interface";

// Use a API real em produção e a mockada em desenvolvimento
const api = import.meta.env.PROD
  ? require("../api/productApi")
  : mockProductApi;

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filter: ProductFilter;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;

  // Ações
  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductFormData) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  updateFilter: (filter: Partial<ProductFilter>) => void;
  setPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  filter: {
    searchTerm: "",
    minPrice: null,
    maxPrice: null,
    sortBy: "name",
    sortOrder: "asc",
  },
  currentPage: 1,
  itemsPerPage: 4,
  totalPages: 1,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await api.getProducts();

      // Aplicar filtros e ordenação aos produtos
      const { filter } = get();
      let filteredProducts = [...products];

      // Filtrar por termo de busca
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower),
        );
      }

      // Filtrar por preço
      if (filter.minPrice !== null) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= (filter.minPrice as number),
        );
      }

      if (filter.maxPrice !== null) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= (filter.maxPrice as number),
        );
      }

      // Ordenar produtos
      filteredProducts.sort((a, b) => {
        const sortField = filter.sortBy;
        let result = 0;

        if (sortField === "name") {
          result = a.name.localeCompare(b.name);
        } else if (sortField === "price") {
          result = a.price - b.price;
        } else if (sortField === "category") {
          result = a.category.localeCompare(b.category);
        }

        return filter.sortOrder === "asc" ? result : -result;
      });

      // Calcular paginação
      const { currentPage, itemsPerPage } = get();
      const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

      set({
        products: filteredProducts,
        isLoading: false,
        totalPages,
      });
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      set({
        isLoading: false,
        error: "Falha ao carregar produtos. Tente novamente.",
      });
    }
  },

  addProduct: async (product: ProductFormData) => {
    set({ isLoading: true, error: null });
    try {
      await api.createProduct(product);
      await get().fetchProducts();
      set({ isLoading: false });
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      set({
        isLoading: false,
        error: "Falha ao adicionar produto. Tente novamente.",
      });
    }
  },

  deleteProduct: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteProduct(id);
      await get().fetchProducts();
      set({ isLoading: false });
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      set({
        isLoading: false,
        error: "Falha ao excluir produto. Tente novamente.",
      });
    }
  },

  updateFilter: (newFilter: Partial<ProductFilter>) => {
    const currentFilter = get().filter;
    set({
      filter: { ...currentFilter, ...newFilter },
      currentPage: 1, // Reset para a primeira página ao alterar filtros
    });
    get().fetchProducts();
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchProducts();
  },

  setItemsPerPage: (items: number) => {
    set({
      itemsPerPage: items,
      currentPage: 1, // Reset para a primeira página
    });
    get().fetchProducts();
  },
}));
