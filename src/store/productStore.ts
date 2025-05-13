import { create } from "zustand";
import type { Product, ProductFormData } from "../interface";
import axiosInstance from "../api/api";
import { createProduct } from "../services/products.service";

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

  // Actions
  fetchProducts: (page?: number) => Promise<void>;
  addProduct: (product: ProductFormData) => Promise<void>;
  setPage: (page: number) => void;
  updateFilter: (newFilters: Partial<ProductState["filters"]>) => void;
  applyFilters: () => void;
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

  addProduct: async (product: ProductFormData) => {
    try {
      const response = await axiosInstance.post("/products/admin/add-product", product);
      console.log(response);
      get().fetchProducts();
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
    }
  },

  // Busca produtos do servidor e aplica filtros localmente
  fetchProducts: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      // Construir URL com parâmetros de consulta para filtros no servidor
      const { filters } = get();
      const params = new URLSearchParams();

      params.append("page", page.toString());

      if (filters.searchTerm) {
        params.append("search", filters.searchTerm);
      }

      if (filters.minPrice !== null) {
        params.append("minPrice", filters.minPrice.toString());
      }

      if (filters.maxPrice !== null) {
        params.append("maxPrice", filters.maxPrice.toString());
      }

      params.append("sortBy", filters.sortBy);
      params.append("sortOrder", filters.sortOrder);

      const response = await axiosInstance.get(
        `/products?${params.toString()}`,
      );

      set({
        products: response.data.data || [],
        filteredProducts: response.data.data || [],
        totalItems: response.data.totalItems || 0,
        totalPages: response.data.totalPages || 1,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Erro ao buscar produtos.", isLoading: false });
      console.error("Error fetching products:", error);
    }
  },

  setPage: (page) => {
    if (page !== get().currentPage) {
      get().fetchProducts(page);
    }
  },

  // Atualiza os filtros no estado e aplica os filtros
  updateFilter: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    }));

    // Aplica os filtros automaticamente após atualizar o estado
    setTimeout(() => {
      get().applyFilters();
    }, 0);
  },

  // Função para aplicar os filtros atuais e buscar produtos novamente
  applyFilters: () => {
    // Sempre volta para a página 1 quando aplicar novos filtros
    get().fetchProducts(1);
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
}));

export default useProductStore;
