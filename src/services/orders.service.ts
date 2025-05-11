import axiosInstance from "../api/api";
import type { Orders } from "../interface";

export interface CreateOrderData {
  status: string;
  totalAmount: number;
  products: {
    productId: number;
    quantity: number;
  }[];
}

export const getOrders = async (
  page = 1,
  limit = 10,
  status?: Orders["status"],
): Promise<{ orders: Orders[]; total: number; pages: number }> => {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (status) params.status = status;
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Token not found");
    }
    const response = await axiosInstance.get("/orders", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await axiosInstance.get(`/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createOrder = async (order: CreateOrderData): Promise<Orders> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await axiosInstance.post("/orders", order, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateOrderStatus = async (
  id: number,
  status: string,
): Promise<Orders> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await axiosInstance.put(
    `/orders/${id}`,
    {
      status: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Token not found");
  }
  await axiosInstance.delete(`/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
