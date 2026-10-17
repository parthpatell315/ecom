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
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, variantId?: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotalMinor, setSubtotalMinor] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
        setTotalItems(data.totalItems || 0);
        setSubtotalMinor(data.subtotalMinor || 0);
      }
    } catch (err) {
      console.error('Failed to refresh cart:', err);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (productId: string, variantId?: string, quantity = 1): Promise<boolean> => {
    setIsLoading(true);
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
