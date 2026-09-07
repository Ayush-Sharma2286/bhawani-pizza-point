"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';
import { menuItems as defaultMenuItems, FoodItem } from '@/lib/menuData';

export interface CartItem {
  id: string;
  name: { hi: string; en: string };
  size: 'Regular' | 'Medium' | 'Large';
  price: number;
  quantity: number;
}

export interface StoredOrder {
  id: string;
  customer: string;
  phone: string;
  address: string;
  cookingNote?: string;
  items: { name: string; size: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string;
  status: "Pending" | "Preparing" | "Out for Delivery" | "Delivered";
  time: string;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['en'];
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: number;
  orders: StoredOrder[];
  addOrder: (order: StoredOrder) => void;
  updateOrderStatus: (orderId: string, status: StoredOrder["status"]) => void;
  outOfStockItems: string[];
  toggleItemStock: (itemId: string) => void;
  isStoreOpen: boolean;
  toggleStoreStatus: () => void;
  // 🟢 Menu Manager
  items: FoodItem[];
  addNewItem: (item: FoodItem) => void;
  updateItemPrice: (id: string, regular: number, medium?: number, large?: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>('hi');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [outOfStockItems, setOutOfStockItems] = useState<string[]>([]);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(true);
  const [items, setItems] = useState<FoodItem[]>(defaultMenuItems);

  useEffect(() => {
    const savedLang = localStorage.getItem('bp_lang') as Language;
    if (savedLang) setLangState(savedLang);

    const savedOrders = localStorage.getItem('bp_orders');
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) {}
    }

    const savedStock = localStorage.getItem('bp_out_of_stock');
    if (savedStock) {
      try { setOutOfStockItems(JSON.parse(savedStock)); } catch (e) {}
    }

    const savedStoreStatus = localStorage.getItem('bp_store_open');
    if (savedStoreStatus !== null) {
      setIsStoreOpen(savedStoreStatus === 'true');
    }

    const savedCustomMenu = localStorage.getItem('bp_custom_menu');
    if (savedCustomMenu) {
      try { setItems(JSON.parse(savedCustomMenu)); } catch (e) {}
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('bp_lang', newLang);
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const addOrder = (newOrder: StoredOrder) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('bp_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const updateOrderStatus = (orderId: string, status: StoredOrder["status"]) => {
    setOrders((prev) => {
      const updated = prev.map((o) => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('bp_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleItemStock = (itemId: string) => {
    setOutOfStockItems((prev) => {
      const updated = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      localStorage.setItem('bp_out_of_stock', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleStoreStatus = () => {
    setIsStoreOpen((prev) => {
      const next = !prev;
      localStorage.setItem('bp_store_open', String(next));
      return next;
    });
  };

  const addNewItem = (newItem: FoodItem) => {
    setItems((prev) => {
      const updated = [newItem, ...prev];
      localStorage.setItem('bp_custom_menu', JSON.stringify(updated));
      return updated;
    });
  };

  const updateItemPrice = (id: string, regular: number, medium?: number, large?: number) => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            prices: {
              ...item.prices,
              regular,
              ...(medium !== undefined && { medium }),
              ...(large !== undefined && { large }),
            },
          };
        }
        return item;
      });
      localStorage.setItem('bp_custom_menu', JSON.stringify(updated));
      return updated;
    });
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t: translations[lang],
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        orders,
        addOrder,
        updateOrderStatus,
        outOfStockItems,
        toggleItemStock,
        isStoreOpen,
        toggleStoreStatus,
        items,
        addNewItem,
        updateItemPrice
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
};