import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenNombre?: string;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  agregarAlCarrito: (item: CartItem) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  eliminarDelCarrito: (productoId: number) => void;
  limpiarCarrito: () => void;
  totalItems: number;
  totalPrecio: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const agregarAlCarrito = (item: CartItem) => {
    setCartItems((prevItems) => {
      const itemExistente = prevItems.find(ci => ci.productoId === item.productoId);
      if (itemExistente) {
        return prevItems.map(ci =>
          ci.productoId === item.productoId
            ? {
                ...ci,
                cantidad: Math.min(ci.cantidad + item.cantidad, item.stock), // no pasar stock máximo
                stock: item.stock
              }
            : ci
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map(ci =>
        ci.productoId === productoId ? { ...ci, cantidad } : ci
      )
    );
  };

  const eliminarDelCarrito = (productoId: number) => {
    setCartItems((prevItems) => prevItems.filter(ci => ci.productoId !== productoId));
  };

  const limpiarCarrito = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrecio = cartItems.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        limpiarCarrito,
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
