// Exemplo de implementação recomendada para productStore.ts
import { create } from "zustand";
import type { Product, ProductFormData } from "../interface";
import axiosInstance from "../api/api";

interface ProductState {
  products: Product[];
  filteredProducts: Product[]; // Produtos após aplicação de filtros
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  filters: {
    searchTerm: string;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: "name" | "price" | "category";
    sortOrder: "asc" | "desc";
  };
  updateFilter: (filters: any) => void;

  // Actions
  fetchProducts: (page?: number, filters?: any) => Promise<void>;
  addProduct: (product: ProductFormData) => Promise<void>;
  setPage: (page: number) => void;
  setFilter: (filters: any) => void;
  deleteProduct: (id: number) => Promise<void>;
  updateProduct: (id: number, product: Product) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 12,
  totalItems: 0,
  totalPages: 0,
  filters: {
    searchTerm: "",
    minPrice: null,
    maxPrice: null,
    sortBy: "name",
    sortOrder: "asc",
  },

  addProduct: async (product) => {
    try {
      await axiosInstance.post("/products", {
        ...product,
      });
      get().fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  },
  // Dentro do Zustand store
  fetchProducts: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/products?page=${page}`);
      set({
        products: response.data.data || [],
        totalPages: response.data.totalPages,
        currentPage: page, // ✅ Está atualizando a página aqui!
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Erro ao buscar produtos.", isLoading: false });
    }
  },

  setPage: (page) => {
    if (page !== get().currentPage) {
      get().fetchProducts(page, {}); // ❌ Isso está chamando fetchProducts sem atualizar o estado de forma clara
    }
  },

  setFilter: (filters) => {
    // Reseta para a página 1 quando aplicar novos filtros
    get().fetchProducts(1, filters);
  },

  deleteProduct: async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      get().fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  },

  updateProduct: async (id, product) => {
    try {
      await axiosInstance.put(`/products/${id}`, product);
      get().fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  },
  updateFilter: (filters) => {
    set({ filters });
  },
}));
