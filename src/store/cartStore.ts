// cartStore.ts
import { create } from "zustand";

interface CartItem {
  productName: string;
  productId: number;
  quantity: number;
  price: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartStore>((set, state: any) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const quantity = item.quantity || 1; // ✅ fallback para 1
      const existingItem = state.cart.find(
        (cartItem: CartItem) => cartItem.productId === item.productId,
      );

      if (existingItem) {
        return {
          cart: state.cart.map((cartItem: CartItem) =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem,
          ),
        };
      } else {
        return { cart: [...state.cart, { ...item, quantity }] };
      }
    }),

  removeFromCart: (productId: number) =>
    set((state: any) => ({
      cart: state.cart.filter((item: CartItem) => item.productId !== productId),
    })),
  clearCart: () => set({ cart: [] }),
  getTotalAmount: () =>
    state.cart.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0,
    ),
}));
