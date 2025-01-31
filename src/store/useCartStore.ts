import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../config/axios.config";

interface CartProps {
  cart: [];
  isCouponApplied: boolean;
  loading: boolean;
  error: any;
  total: number;
  coupon: any;
  subtotal: number;
  
  getMyCoupon: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  getCartItems: () => Promise<void>;
  clearCart: () => Promise<void>;
  addToCart: (product: any) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  calculateTotals: () => void;
}

interface Cart {
  coupon: string;
  total: number;
  subtotal: number;
  isCouponApplied: boolean;
}

export const useCartStore = create<CartProps>((set: any, get: any) => ({
  cart: [],
  loading: false,
  error: null,
  total: 0,
  coupon: null,
  subtotal: 0,
  isCouponApplied: false,

  setCart: (cart: Cart) => set({ cart }),

  getMyCoupon: async () => {
    try {
      const response = await axiosInstance.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },
  applyCoupon: async (code: string) => {
    try {
      const response = await axiosInstance.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  getCartItems: async () => {
    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error: any) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },
  addToCart: async (product) => {
    try {
      await axiosInstance.post("/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((prevState: any) => {
        const existingItem = prevState.cart.find(
          (item: any) => item._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item: any) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error: any) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  removeFromCart: async (productId: string) => {
    await axiosInstance.delete(`/cart`, { data: { productId } });
    set((prevState: any) => ({
      cart: prevState.cart.filter((item: any) => item._id !== productId),
    }));
    get().calculateTotals();
  },
  updateQuantity: async (productId: string, quantity: number) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    await axiosInstance.put(`/cart/${productId}`, { quantity });
    set((prevState: any) => ({
      cart: prevState.cart.map((item: any) =>
        item._id === productId ? { ...item, quantity } : item,
      ),
    }));
    get().calculateTotals();
  },
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));
