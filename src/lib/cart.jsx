import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "nora_cart_v1";

const CartContext = createContext(null);

function lineSignature(item) {
  return [
    item.productId,
    item.shape || "",
    item.size || "",
    item.sizeNote || "",
    JSON.stringify(item.customization || {}),
  ].join("|");
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStored);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — basket still works for this session */
    }
  }, [items]);

  const addItem = (item) => {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const signature = lineSignature(item);
    setItems((current) => {
      const index = current.findIndex((line) => line.signature === signature);
      if (index >= 0) {
        const next = [...current];
        next[index] = {
          ...next[index],
          quantity: Math.min(99, next[index].quantity + quantity),
        };
        return next;
      }
      return [
        ...current,
        {
          ...item,
          quantity,
          lineId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          signature,
        },
      ];
    });
    setIsOpen(true);
  };

  const setQuantity = (lineId, quantity) => {
    const qty = Number(quantity);
    setItems((current) =>
      current
        .map((line) =>
          line.lineId === lineId
            ? { ...line, quantity: Math.min(99, Math.max(1, qty || 1)) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const removeItem = (lineId) =>
    setItems((current) => current.filter((line) => line.lineId !== lineId));

  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const count = items.reduce((sum, line) => sum + (line.quantity || 0), 0);
    const subtotal = items.reduce(
      (sum, line) => sum + (Number(line.unitPrice) || 0) * (line.quantity || 0),
      0,
    );
    return {
      items,
      count,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}