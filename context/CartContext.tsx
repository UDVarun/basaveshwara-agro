"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";

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
  | { type: "CLOSE_CART" };

// ─── Quantity validator ───────────────────────────────────────────────────────
// Must be a positive integer 1–99. Rejects zero, negative, non-integer.

function validQuantity(q: number): boolean {
  return Number.isInteger(q) && q >= 1 && q <= 99;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
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

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

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
