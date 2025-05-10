// src/types/index.ts

export interface Users {
  id?: number;
  name?: string;
  email: string;
  password?: string;
  roles: string[];
}

export interface Orders {
  id: number;
  userId?: number;
  status: string;
  total: number;
  created_at: Date;
}

export interface Product {
  id: number;
  userId?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  stockQuantity: number;
}

export interface ProductFilter {
  searchTerm: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: "name" | "price" | "category";
  sortOrder: "asc" | "desc";
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
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
