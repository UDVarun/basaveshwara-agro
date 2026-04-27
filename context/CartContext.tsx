"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  variantId: string;
  title: string;
  price: number; // in paise (lowest denomination) to avoid float issues
  currencyCode: string;
  quantity: number; // always a positive integer 1–99
  imageUrl: string | null;
  imageAlt: string | null;
  handle: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity"> & { quantity: number };
    }
  | { type: "REMOVE_ITEM"; payload: { variantId: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { variantId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

// ─── Quantity validator ───────────────────────────────────────────────────────
// Must be a positive integer 1–99. Rejects zero, negative, non-integer.

function validQuantity(q: number): boolean {
  return Number.isInteger(q) && q >= 1 && q <= 99;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        items: action.payload,
        isHydrated: true,
      };

    case "ADD_ITEM": {
      const { quantity, ...itemData } = action.payload;

      // Reject invalid quantity
      if (!validQuantity(quantity)) return state;

      const existing = state.items.find(
        (i) => i.variantId === itemData.variantId
      );

      if (existing) {
        // Merge quantities — cap at 99
        const newQty = Math.min(existing.quantity + quantity, 99);
        return {
          ...state,
          items: state.items.map((i) =>
            i.variantId === itemData.variantId
              ? { ...i, quantity: newQty }
              : i
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...itemData, quantity }],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(
          (i) => i.variantId !== action.payload.variantId
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const { variantId, quantity } = action.payload;

      // Reject invalid quantity — also reject 0 (use REMOVE_ITEM for removal)
      if (!validQuantity(quantity)) return state;

      return {
        ...state,
        items: state.items.map((i) =>
          i.variantId === variantId ? { ...i, quantity } : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalQuantity: number;
  subtotal: number; // in paise
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const CART_STORAGE_KEY = "agro-cart-v1";

// ─── Persist helpers (SSR-safe) ───────────────────────────────────────────────

// CR: runtime guard — validates each stored item before hydrating reducer
// Prevents stale schema / tampered values from corrupting price / quantity math.
function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i["variantId"] === "string" &&
    typeof i["title"] === "string" &&
    typeof i["price"] === "number" &&
    isFinite(i["price"] as number) &&
    typeof i["currencyCode"] === "string" &&
    typeof i["quantity"] === "number" &&
    Number.isInteger(i["quantity"]) &&
    (i["quantity"] as number) >= 1 &&
    (i["quantity"] as number) <= 99 &&
    typeof i["handle"] === "string" &&
    (i["imageUrl"] === null || typeof i["imageUrl"] === "string") &&
    (i["imageAlt"] === null || typeof i["imageAlt"] === "string")
  );
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  isHydrated: false,
};

// ... [initial types and reducer stay same]

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 1. Initial load from localStorage (Guest mode)
  useEffect(() => {
    const items = loadCartFromStorage();
    dispatch({ type: "HYDRATE", payload: items });
  }, []);

  // 2. Server Sync: Load and Push
  useEffect(() => {
    if (status === "loading" || !state.isHydrated) return;

    if (status === "authenticated") {
      // Fetch server cart upon login
      const fetchServerCart = async () => {
        try {
          const res = await fetch("/api/v1/cart");
          if (res.ok) {
            const data = await res.json();
            // User requested: "if user add item to cart and sign outs then the item myst not be vesible... 
            // when user logs back in the item myst vesible".
            // We overwrite the guest cart with the server cart.
            dispatch({ type: "HYDRATE", payload: data.items });
          }
        } catch (err) {
          console.error("[CartContext] Failed to fetch server cart:", err);
        }
      };
      
      fetchServerCart();
    } else if (status === "unauthenticated") {
      // User logged out: Clear the cart state immediately (Isolation requirement)
      dispatch({ type: "CLEAR_CART" });
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [status, state.isHydrated]);

  // 3. Persistent Sync: Push changes to Redis if logged in
  useEffect(() => {
    if (!state.isHydrated) return;

    // LocalStorage sync (for guest or redundancy)
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {}

    // Server-side sync for cross-device persistence
    if (status === "authenticated") {
      const syncWithServer = async () => {
        try {
          await fetch("/api/v1/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: state.items }),
          });
        } catch (err) {
          console.warn("[CartContext] Server sync failed:", err);
        }
      };

      // Debounce sync slightly to avoid spamming Redis during rapid +/- quantity changes
      const timer = setTimeout(syncWithServer, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.items, state.isHydrated, status]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity: number }) => {
      dispatch({ type: "ADD_ITEM", payload: item });
    },
    []
  );

  const removeItem = useCallback((variantId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { variantId } });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { variantId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: "OPEN_CART" });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: "CLOSE_CART" });
  }, []);

  const totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        totalQuantity,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}
