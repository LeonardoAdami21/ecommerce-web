import axiosInstance from "../api/api";
import type { Product, ProductFormData } from "../interface";

export const getProducts = async (): Promise<Product[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await axiosInstance.get("/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  if (!id) {
    throw new Error("ID not found");
  }
  const response = await axiosInstance.get(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createProduct = async (
  product: ProductFormData,
): Promise<Product> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await axiosInstance.post("/products", product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateProduct = async (
  id: number,
  product: ProductFormData,
): Promise<Product> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  if (!id) {
    throw new Error("ID not found");
  }
  const response = await axiosInstance.put(`/products/${id}`, product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};
