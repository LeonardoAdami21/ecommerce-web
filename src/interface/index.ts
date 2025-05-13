// src/types/index.ts

export interface Users {
  id?: number;
  name: string;
  email: string;
  password?: string;
  userRole: string[];
}

export interface Orders {
  id: number;
  userId?: number;
  status: string;
  price?: number;
  customerName: string;
  total_amount: number;
  createdAt: Date;
  updated_at: Date;
  products: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productName: string;
  productId: number;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
}

export interface Product {
  id: number;
  userId?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  quantity_stock: number;
}

export interface ProductFilter {
  searchTerm: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: "name" | "price" | "category";
  sortOrder: "asc" | "desc";
}

export interface ProductFormData {
  id?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  quantity_stock: number;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user?: Users;
}

export interface ApiError {
  message: string;
  status: number;
}
