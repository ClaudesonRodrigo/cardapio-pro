// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string; // Usaremos o título como ID por enquanto
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: { title: string; price: number }) => void;
  removeFromCart: (title: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: { title: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.title === product.title);
      if (existing) {
        return prev.map((item) =>
          item.title === product.title
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: product.title, title: product.title, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (title: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.title === title);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.title === title ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.title !== title);
    });
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}