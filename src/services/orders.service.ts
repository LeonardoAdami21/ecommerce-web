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
    const params: Record<string, string | number> = {
      skip: (page - 1) * limit,
      take: limit,
    };
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

    const { data, meta } = response.data;

    return {
      orders: data,
      total: meta.total,
      pages: Math.ceil(meta.total / meta.pageSize),
    };
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw new Error("Erro ao buscar pedidos");
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
  const response = await axiosInstance.patch(
    `/orders/${id}/status`,
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
