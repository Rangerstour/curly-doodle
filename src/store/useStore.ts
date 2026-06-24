import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Review, Order, UserProfile } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

interface WishlistState {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

interface AuthState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAdmin: () => boolean;
}

interface CheckoutState {
  shippingAddress: any;
  billingAddress: any;
  couponCode: string;
  discount: number;
  setShippingAddress: (address: any) => void;
  setBillingAddress: (address: any) => void;
  setCoupon: (code: string, discount: number) => void;
  resetCheckout: () => void;
}

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

interface AppState extends CartState, WishlistState, AuthState, CheckoutState, ThemeState {}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      },
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      // Cart
      items: [],
      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.product_id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.product_id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { id: crypto.randomUUID(), product_id: product.id, quantity, product }],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      getTax: () => get().getSubtotal() * 0.08,
      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 50 ? 0 : 5.99;
      },
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        const shipping = get().getShipping();
        const discount = get().discount;
        return subtotal + tax + shipping - discount;
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (productId) => {
        set((state) => ({
          wishlist: [...new Set([...state.wishlist, productId])],
        }));
      },
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        }));
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),

      // Auth
      user: null,
      setUser: (user) => set({ user }),
      isAdmin: () => {
        const user = get().user;
        return user?.email?.includes('admin') || false;
      },

      // Checkout
      shippingAddress: null,
      billingAddress: null,
      couponCode: '',
      discount: 0,
      setShippingAddress: (address) => set({ shippingAddress: address }),
      setBillingAddress: (address) => set({ billingAddress: address }),
      setCoupon: (code, discount) => set({ couponCode: code, discount }),
      resetCheckout: () =>
        set({
          shippingAddress: null,
          billingAddress: null,
          couponCode: '',
          discount: 0,
        }),
    }),
    {
      name: 'strongmulticables-store',
      partialize: (state) => ({
        theme: state.theme,
        items: state.items,
        wishlist: state.wishlist,
        user: state.user,
      }),
    }
  )
);
