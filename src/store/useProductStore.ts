import { create } from "zustand";
import toast from "react-hot-toast";
import { CreateProductDto } from "./dto/product/CreateProdutc.dto";
import axiosInstance from "../config/axios.config";

interface ProductProps {
  loading: boolean;
  products: any;
  error: string | null;
  isLoading: boolean;
  setProducts: (products: any) => void;
  createProduct: (dto: CreateProductDto) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
}

interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isFeatured: boolean;
  quantity: number;
}

export const useProductStore = create<ProductProps>((set) => ({
  products: [],
  loading: false,
  error: null,
  isLoading: false,

  setProducts: (products: Products) => set({ products }),
  createProduct: async (dto: CreateProductDto) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/products", dto);
      set((prevState: any) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error: any) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error: any) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  fetchProductsByCategory: async (category: string) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `/products/category/${category}`,
      );
      set({ products: response.data.products, loading: false });
    } catch (error: any) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  deleteProduct: async (productId: string) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/products/${productId}`);
      set((prevProducts: any) => ({
        products: prevProducts.products.filter(
          (product: Products) => product.id !== productId,
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },
  toggleFeaturedProduct: async (productId: string) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.patch(`/products/${productId}`);
      // this will update the isFeatured prop of the product
      set((prevProducts: any) => ({
        products: prevProducts.products.map((product: any) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product,
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },
}));
