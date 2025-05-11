import axiosInstance from "../api/api";
import type { Product, ProductFormData } from "../interface";

export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get("/products");
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
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  if (!id) {
    throw new Error("ID not found");
  }
  await axiosInstance.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const mockProductApi = {
  products: [
    {
      id: 1,
      name: "iPhone 13",
      category: "Eletrônicos",
      description: "Smartphone Apple com processador A15 Bionic",
      price: 4999.99,
      image: "https://placehold.co/600x400?text=iPhone+13",
      quantity_stock: 15,
    },
    {
      id: 2,
      name: "MacBook Air M2",
      category: "Computadores",
      description: "Notebook com chip M2 e 8GB de RAM",
      price: 8999.99,
      image: "https://placehold.co/600x400?text=MacBook+Air",
      quantity_stock: 8,
    },
    {
      id: 3,
      name: "Monitor LG UltraWide",
      category: "Periféricos",
      description: "Monitor 34 polegadas com resolução 4K",
      price: 2799.99,
      image: "https://placehold.co/600x400?text=Monitor+LG",
      quantity_stock: 12,
    },
    {
      id: 4,
      name: "Teclado Mecânico Logitech",
      category: "Periféricos",
      description: "Teclado mecânico RGB com switches Cherry MX",
      price: 499.99,
      image: "https://placehold.co/600x400?text=Teclado+Logitech",
      quantity_stock: 20,
    },
    {
      id: 5,
      name: "Mouse Gamer Razer",
      category: "Periféricos",
      description: "Mouse com 8000 DPI e 8 botões programáveis",
      price: 299.99,
      image: "https://placehold.co/600x400?text=Mouse+Razer",
      quantity_stock: 25,
    },
    {
      id: 6,
      name: 'Smart TV Samsung 55"',
      category: "Eletrônicos",
      description: "Smart TV 4K com Tizen OS",
      price: 3499.99,
      image: "https://placehold.co/600x400?text=TV+Samsung",
      quantity_stock: 10,
    },
    {
      id: 7,
      name: "Headphone Sony WH-1000XM4",
      category: "Áudio",
      description: "Headphone com cancelamento de ruído",
      price: 1999.99,
      image: "https://placehold.co/600x400?text=Headphone+Sony",
      quantity_stock: 18,
    },
    {
      id: 8,
      name: "PlayStation 5",
      category: "Consoles",
      description: "Console de última geração da Sony",
      price: 4499.99,
      image: "https://placehold.co/600x400?text=PlayStation+5",
      quantity_stock: 5,
    },
  ] as Product[],

  getProducts: function (): Promise<Product[]> {
    return Promise.resolve([...this.products]);
  },

  getProductById: function (id: number): Promise<Product> {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      return Promise.reject(new Error("Produto não encontrado"));
    }
    return Promise.resolve({ ...product });
  },

  createProduct: function (product: ProductFormData): Promise<Product> {
    const newId = Math.max(...this.products.map((p) => p.id), 0) + 1;
    const newProduct = {
      ...product,
      id: newId,
      quantity_stock: 10, // Valor padrão para mock
    };
    this.products.push(newProduct);
    return Promise.resolve({ ...newProduct });
  },

  updateProduct: function (
    id: number,
    product: ProductFormData,
  ): Promise<Product> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error("Produto não encontrado"));
    }

    const updatedProduct = {
      ...this.products[index],
      ...product,
    };

    this.products[index] = updatedProduct;
    return Promise.resolve({ ...updatedProduct });
  },

  deleteProduct: function (id: number): Promise<void> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error("Produto não encontrado"));
    }
    this.products.splice(index, 1);
    return Promise.resolve();
  },
};
