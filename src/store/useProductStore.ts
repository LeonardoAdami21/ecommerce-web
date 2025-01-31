import { create } from "zustand";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";

interface ProductProps {
  products: [Products] | [];
  fetchFeaturedProducts: () => void;
  setProducts: (products: any) => void;
  findAllProducts: () => void;
  createProduct: (formData: FormData) => void;
  deleteProduct: (id: string) => void;
  toggleFeaturedProduct: (id: string) => void;
  fetchProductsByCategory: (category: any) => Promise<any>
  isLoading: boolean;
  loading: boolean;
}

interface Products {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  file: string;
  quantity: number;
  isloading: boolean;
  isFeatured: boolean;
}

export const useProductStore = create<ProductProps>((set: any) => ({
  products: [],
  loading: false,
  isLoading: false,

  setProducts: async (products) => set({ products }),
  fetchAllProducts: async () => {
    try {
      const response = await axiosInstance.get("/products");
      set({ products: response.data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
  createProduct: async (formData: FormData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/products", formData);
      set((state: any) => ({
        products: [...state.products, response.data],
        isLoading: false,
      }));
    } catch (error) {
      toast.error("Failed to create product");
      set({ isLoading: false });
    }
  },
  fetchProductsByCategory: async (category: string) => {
    try {
      const response = await axiosInstance.get(`/products/${category}`);
      set({ products: response.data });
      toast.success("Products fetched successfully");
    } catch (error) {
      console.error("Error fetching products by category:", error);
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
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const products = await axiosInstance.get(`/products/${id}`);
      if (!products) {
        toast.error("Product not found");
        return;
      }
      await axiosInstance.delete(`/products/${id}`);
      set((prevProducts: any) => ({
        products: prevProducts.products.filter(
          (product: any) => product._id !== id,
        ),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },
  toggleFeaturedProduct: async (id: string) => {
    try {
      await axiosInstance.patch(`/products/${id}`);
      set((state: any) => ({
        products: state.products.map((product: any) => {
          if (product.id === id) {
            return { ...product, isFeatured: !product.isFeatured };
          }
          return product;
        }),
      }));
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  },
}));
