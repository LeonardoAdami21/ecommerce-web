import { create } from "zustand";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";

interface ProductProps {
  products: Products | [];
  fetchFeaturedProducts: () => void;
  setProducts: (products: any) => void;
  findAllProducts: () => void;
  createProduct: (dto: FormData) => void;
  loading: boolean;
}

interface Products {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  file: File | null;
  quantity: number;
  isFeatured: boolean;
}

export const useProductStore = create<ProductProps>((set: any, get) => ({
  products: [],
  loading: false,

  setProducts: async (products) => set({ products }),
  fetchAllProducts: async () => {
    try {
      const response = await axiosInstance.get("/products");
      set({ products: response.data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
  createProduct: async (dto: FormData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/products", dto, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((prevState: any) => ({
        products: [...prevState.products, response.data],
        isLoading: false,
      }));
    } catch (error) {
      toast.error("Failed to create product");
    }
  },
  fetchFeaturedProducts: async () => {
    try {
      const response = await axiosInstance.get("/products/featured");
      set({ products: response.data });
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  },
  findAllProducts: async () => {
    try {
      const response = await axiosInstance.get("/products");
      set({ products: response.data });
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  },
}));
