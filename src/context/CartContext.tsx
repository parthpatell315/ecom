'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItemType {
  id: string;
  productId: string;
  variantId: string | null;
  title: string;
  variantName: string | null;
  colorHex: string | null;
  unitPriceMinor: number;
  quantity: number;
  totalMinor: number;
  image: string;
  inStock: boolean;
  maxStock: number;
}

interface CartContextType {
  items: CartItemType[];
  totalItems: number;
  subtotalMinor: number;
  isOpen: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, variantId?: string, quantity?: number, optimisticItem?: Partial<CartItemType>) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'flirta_cart_cache_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotalMinor, setSubtotalMinor] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to recompute totals from items
  const computeTotals = (currentItems: CartItemType[]) => {
    const total = currentItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const subtotal = currentItems.reduce((acc, it) => acc + (it.totalMinor || (it.unitPriceMinor * it.quantity)), 0);
    return { total, subtotal };
  };

  // 1. Instant hydration from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: CartItemType[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          const { total, subtotal } = computeTotals(parsed);
          setTotalItems(total);
          setSubtotalMinor(subtotal);
        }
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage whenever items change
  const updateLocalCart = (newItems: CartItemType[]) => {
    setItems(newItems);
    const { total, subtotal } = computeTotals(newItems);
    setTotalItems(total);
    setSubtotalMinor(subtotal);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // Ignore
    }
  };

  // 2. Fetch server cart
  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        if (data.items.length > 0 || isLoaded) {
          updateLocalCart(data.items);
        }
      }
    } catch (err) {
      console.error('Failed to refresh cart:', err);
    } finally {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (
    productId: string,
    variantId?: string,
    quantity = 1,
    optimisticItem?: Partial<CartItemType>
  ): Promise<boolean> => {
    setIsLoading(true);

    // Optimistically add to state if details provided
    if (optimisticItem && optimisticItem.title) {
      const existingIdx = items.findIndex(
        (it) => it.productId === productId && (it.variantId || null) === (variantId || null)
      );
      let updated: CartItemType[];
      if (existingIdx > -1) {
        updated = [...items];
        updated[existingIdx].quantity += quantity;
        updated[existingIdx].totalMinor = updated[existingIdx].quantity * updated[existingIdx].unitPriceMinor;
      } else {
        const newItem: CartItemType = {
          id: `temp_${Date.now()}`,
          productId,
          variantId: variantId || null,
          title: optimisticItem.title,
          variantName: optimisticItem.variantName || null,
          colorHex: optimisticItem.colorHex || null,
          unitPriceMinor: optimisticItem.unitPriceMinor || 0,
          quantity,
          totalMinor: (optimisticItem.unitPriceMinor || 0) * quantity,
          image: optimisticItem.image || '',
          inStock: true,
          maxStock: 99,
        };
        updated = [newItem, ...items];
      }
      updateLocalCart(updated);
      setIsOpen(true);
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshCart();
        setIsOpen(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    const updated = items
      .map((it) => (it.id === cartItemId ? { ...it, quantity, totalMinor: it.unitPriceMinor * quantity } : it))
      .filter((it) => it.quantity > 0);
    updateLocalCart(updated);

    try {
      await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      await refreshCart();
    } catch (err) {
      console.error('Failed to update item quantity:', err);
    }
  };

  const removeItem = async (cartItemId: string) => {
    const updated = items.filter((it) => it.id !== cartItemId);
    updateLocalCart(updated);

    try {
      await fetch(`/api/cart?id=${cartItemId}`, { method: 'DELETE' });
      await refreshCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotalMinor,
        isOpen,
        isLoading,
        isLoaded,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
