import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'comandaja_cart_items_v1';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading cart:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  const addToCart = (item, { quantity = 1, selectedSize = null, selectedAddons = [], comboChoices = {}, notes = '' } = {}) => {
    // Calculate unit total
    let unitTotal = item.price;
    if (selectedSize && selectedSize.price) {
      unitTotal = selectedSize.price;
    }
    const addonsTotal = selectedAddons.reduce((sum, add) => sum + (add.price || 0), 0);
    unitTotal += addonsTotal;

    const cartItemId = `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newItem = {
      cartItemId,
      itemId: item.id,
      name: item.name,
      category: item.category,
      image: item.image,
      quantity,
      selectedSize,
      selectedAddons,
      comboChoices,
      notes: notes.trim(),
      unitPrice: unitTotal,
      totalPrice: unitTotal * quantity,
    };

    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
