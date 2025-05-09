import axiosInstance from "../api/api";
import type { Orders } from "../interface";

export const getOrders = async (): Promise<Orders[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await axiosInstance.get("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getOrderById = async (id: number): Promise<Orders> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await axiosInstance.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (order: Orders): Promise<Orders> => {
  const token = localStorage.getItem("token");
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

export const updateOrder = async (
  id: number,
  order: Orders,
): Promise<Orders> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await axiosInstance.put(`/orders/${id}`, order, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};