import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (incoming) => set((state) => {
        const existing = state.items.find((i) => i.productId === incoming.productId);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.productId === incoming.productId
                ? { ...i, quantity: i.quantity + incoming.quantity }
                : i
            ),
          };
        }
        return { items: [...state.items, incoming] };
      }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.productId !== productId)
            : state.items.map((i) => i.productId === productId ? { ...i, quantity } : i),
        })),

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'ferreteria-cart', partialize: (s) => ({ items: s.items }) }
  )
);
