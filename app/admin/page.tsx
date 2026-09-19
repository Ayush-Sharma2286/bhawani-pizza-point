"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Lock, 
  Unlock, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Store, 
  Power, 
  TrendingUp, 
  Plus, 
  Trash2, 
  KeyRound, 
  LogOut,
  ShoppingBag,
  IndianRupee,
  Utensils
} from "lucide-react";
import { initialFoodItems, Order, FoodItem } from "@/context/AppContext";

export default function AdminPage() {
  // Authentication & PIN States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [currentAdminPin, setCurrentAdminPin] = useState("1234");
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [oldPinInput, setOldPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");

  // Dashboard States
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<FoodItem[]>(initialFoodItems);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "menu" | "analytics">("orders");

  // New Item Form States
  const [newItemNameEn, setNewItemNameEn] = useState("");
  const [newItemNameHi, setNewItemNameHi] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("pizza");
  const [newItemRegularPrice, setNewItemRegularPrice] = useState("");
  const [newItemMediumPrice, setNewItemMediumPrice] = useState("");
  const [newItemLargePrice, setNewItemLargePrice] = useState("");
  const [newItemImage, setNewItemImage] = useState("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60");

  // Load Saved PIN, Auth Token & Orders on Mount
  useEffect(() => {
    const savedPin = localStorage.getItem("bp_admin_custom_pin");
    if (savedPin) {
      setCurrentAdminPin(savedPin);
    }

    const adminToken = sessionStorage.getItem("bp_admin_auth");
    if (adminToken === "authenticated_secret_session") {
      setIsAuthenticated(true);
    }

    const savedStoreState = localStorage.getItem("bp_store_open");
    if (savedStoreState !== null) {
      setIsStoreOpen(savedStoreState === "true");
    }

    // Load orders from localStorage
    const savedOrders = localStorage.getItem("bp_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Orders parse error:", e);
      }
    }

    // Polling for live orders every 5 seconds
    const interval = setInterval(() => {
      const updated = localStorage.getItem("bp_orders");
      if (updated) {
        try {
          setOrders(JSON.parse(updated));
        } catch (e) {
          console.error("Orders interval parse error:", e);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Login Handler
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const activePin = localStorage.getItem("bp_admin_custom_pin") || currentAdminPin;
    if (pin.trim() === activePin) {
      sessionStorage.setItem("bp_admin_auth", "authenticated_secret_session");
      setIsAuthenticated(true);
      setPin("");
    } else {
      alert("Galat PIN! Kripya sahi 4-digit PIN dalein.");
      setPin("");
    }
  };

  // Logout Handler
  const handleAdminLogout = () => {
    sessionStorage.removeItem("bp_admin_auth");
    setIsAuthenticated(false);
    setPin("");
  };

  // Change PIN Handler
  const handleUpdatePin = () => {
    const activePin = localStorage.getItem("bp_admin_custom_pin") || currentAdminPin;
    if (oldPinInput !== activePin) {
      alert("Purana PIN galat hai!");
      return;
    }
    if (!/^\d{4}$/.test(newPinInput)) {
      alert("Naya PIN theek 4 ank (digits) ka hona chahiye!");
      return;
    }
    localStorage.setItem("bp_admin_custom_pin", newPinInput);
    setCurrentAdminPin(newPinInput);
    alert("PIN safaltapoorvak badal diya gaya hai!");
    setOldPinInput("");
    setNewPinInput("");
    setShowChangePinModal(false);
  };

  // Store Toggle
  const toggleStoreStatus = () => {
    const nextState = !isStoreOpen;
    setIsStoreOpen(nextState);
    localStorage.setItem("bp_store_open", String(nextState));
  };

  // Update Order Status
  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    const updated = orders.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
    setOrders(updated);
    localStorage.setItem("bp_orders", JSON.stringify(updated));
  };

  // Print KOT
  const handlePrintKOT = (order: Order) => {
    const printWindow = window.open("", "", "width=380,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>KOT - #${order.id.slice(-5)}</title>
          <style>
            body { font-family: monospace; padding: 10px; font-size: 13px; }
            .center { text-align: center; }
            .line { border-bottom: 1px dashed #000; margin: 8px 0; }
            .flex { display: flex; justify-content: space-between; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 16px;">BHAWANI PIZZA POINT</div>
          <div class="center">KITCHEN ORDER TICKET (KOT)</div>
          <div class="line"></div>
          <div class="flex"><span>Order: #${order.id.slice(-6)}</span><span>Type: ${order.orderType.toUpperCase()}</span></div>
          <div class="flex"><span>Date: ${new Date(order.timestamp).toLocaleTimeString()}</span><span>Pay: ${order.paymentMethod}</span></div>
          <div class="line"></div>
          <div><strong>Customer:</strong> ${order.customerName} (${order.customerPhone})</div>
          ${order.orderType === "delivery" ? `<div><strong>Address:</strong> ${order.address || "Local Delivery"}</div>` : ""}
          <div class="line"></div>
          <div class="bold">ITEMS:</div>
          ${order.items
            .map(
              (i) => `
            <div class="flex" style="margin: 4px 0;">
              <span>${i.quantity}x ${i.name.en} (${i.size})</span>
              <span>₹${i.price * i.quantity}</span>
            </div>
          `
            )
            .join("")}
          <div class="line"></div>
          <div class="flex bold" style="font-size: 15px;">
            <span>TOTAL:</span>
            <span>₹${order.totalAmount}</span>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Create New Menu Item (isVeg included)
  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemNameEn || !newItemRegularPrice) {
      alert("Naam aur Regular price bharna anivarya hai!");
      return;
    }

    const newItem: FoodItem = {
      id: `item-${Date.now()}`,
      name: { hi: newItemNameHi || newItemNameEn, en: newItemNameEn },
      description: { hi: "Swadisht aur taaza", en: "Freshly prepared & delicious" },
      category: newItemCategory as any,
      image: newItemImage,
      isVeg: true,
      prices: {
        regular: parseInt(newItemRegularPrice),
        ...(newItemMediumPrice && { medium: parseInt(newItemMediumPrice) }),
        ...(newItemLargePrice && { large: parseInt(newItemLargePrice) }),
      },
    };

    const updatedMenu = [newItem, ...menuItems];
    setMenuItems(updatedMenu);
    alert("Naya item safaltapoorvak menu me jud gaya!");
    setNewItemNameEn("");
    setNewItemNameHi("");
    setNewItemRegularPrice("");
    setNewItemMediumPrice("");
    setNewItemLargePrice("");
  };

  // Analytics Calculation
  const totalSales = orders.reduce((sum, ord) => sum + (ord.status !== "cancelled" ? ord.totalAmount : 0), 0);
  const upiSales = orders
    .filter((ord) => ord.paymentMethod === "UPI" && ord.status !== "cancelled")
    .reduce((sum, ord) => sum + ord.totalAmount, 0);
  const codSales = totalSales - upiSales;

  // ----------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Admin Control Panel</h2>
          <p className="mt-1 text-xs text-gray-500">Bhawani Pizza Point Admin Access</p>

          <form onSubmit={handleAdminLogin} className="mt-6">
            <label className="block text-left text-xs font-semibold text-gray-700">Admin PIN Dalein</label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="****"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              autoFocus
            />
            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-red-600 py-3 font-bold text-white shadow-md transition-all active:scale-95 hover:bg-red-700"
            >
              Login Karein
            </button>
          </form>

          <div className="mt-4 text-xs text-gray-400">
            Default PIN: <span className="font-mono font-bold text-gray-600">1234</span>
          </div>

          <div className="mt-6 border-t pt-4">
            <Link href="/" className="text-xs font-semibold text-red-600 hover:underline">
              ← Wapas Customer Menu par jayein
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white font-black shadow">
              BP
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Admin Dashboard</h1>
              <p className="text-[11px] text-gray-500">Bhawani Pizza Point</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChangePinModal(true)}
              className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <KeyRound className="h-3.5 w-3.5 text-gray-500" />
              <span>PIN Badlein</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto mt-3 flex max-w-5xl gap-2 border-t pt-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              activeTab === "orders" ? "bg-red-600 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Live Orders ({orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length})
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              activeTab === "menu" ? "bg-red-600 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              activeTab === "analytics" ? "bg-red-600 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Sales Report
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl p-4">
        {/* Store Online/Offline Bar */}
        <div className="mb-4 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <Store className={`h-6 w-6 ${isStoreOpen ? "text-green-600" : "text-gray-400"}`} />
            <div>
              <p className="text-sm font-bold text-gray-800">
                Dukaan ka Status: {isStoreOpen ? "Khuli Hai (Online)" : "Band Hai (Offline)"}
              </p>
              <p className="text-xs text-gray-500">
                {isStoreOpen ? "Customer abhi orders place kar sakte hain." : "Naye orders aana band hain."}
              </p>
            </div>
          </div>
          <button
            onClick={toggleStoreStatus}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow transition-all ${
              isStoreOpen ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <Power className="h-4 w-4" />
            <span>{isStoreOpen ? "Dukaan Band Karein" : "Dukaan Chalu Karein"}</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
                <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="font-semibold">Abhi koi orders nahi hain</p>
                <p className="text-xs text-gray-400 mt-1">Customer dwara naya order karte hi yahan show ho jayega.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                    <div>
                      <span className="text-xs font-bold text-red-600">#{order.id.slice(-6)}</span>
                      <span className="ml-2 text-xs font-semibold text-gray-800">{order.customerName}</span>
                      <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                        {order.customerPhone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handlePrintKOT(order)}
                        className="flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>KOT</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="py-3 text-xs text-gray-600">
                    <p className="font-medium text-gray-800 mb-1">
                      Type: <span className="uppercase font-bold">{order.orderType}</span> | Pay:{" "}
                      <span className="font-bold text-gray-900">{order.paymentMethod}</span>
                    </p>
                    {order.address && (
                      <p className="text-gray-500 mb-2">Address: {order.address}</p>
                    )}

                    <div className="rounded-lg bg-gray-50 p-2.5 space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {it.quantity}x {it.name.en} ({it.size})
                          </span>
                          <span className="font-semibold text-gray-800">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between font-bold text-sm text-gray-900">
                      <span>Total Amount:</span>
                      <span className="text-red-600">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                    >
                      Kitchen me Ban raha hai
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, "out_for_delivery")}
                      className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                    >
                      Delivery par nikal gaya
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                      className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
                    >
                      Delivered ho gaya
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: MENU EDITOR */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            {/* Add New Item Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4 text-red-600" />
                Naya Food Item Jodein
              </h3>
              <form onSubmit={handleCreateNewItem} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-700">English Naam</label>
                  <input
                    type="text"
                    value={newItemNameEn}
                    onChange={(e) => setNewItemNameEn(e.target.value)}
                    placeholder="e.g. Farmhouse Special Pizza"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Hindi Naam</label>
                  <input
                    type="text"
                    value={newItemNameHi}
                    onChange={(e) => setNewItemNameHi(e.target.value)}
                    placeholder="e.g. फार्महाउस स्पेशल पिज़्ज़ा"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-red-500"
                  >
                    <option value="pizza">Pizza</option>
                    <option value="burger">Burger</option>
                    <option value="sides">Sides / Snacks</option>
                    <option value="beverages">Cold Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Regular Price (₹)</label>
                  <input
                    type="number"
                    value={newItemRegularPrice}
                    onChange={(e) => setNewItemRegularPrice(e.target.value)}
                    placeholder="e.g. 120"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Medium Price (Optional)</label>
                  <input
                    type="number"
                    value={newItemMediumPrice}
                    onChange={(e) => setNewItemMediumPrice(e.target.value)}
                    placeholder="e.g. 220"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Large Price (Optional)</label>
                  <input
                    type="number"
                    value={newItemLargePrice}
                    onChange={(e) => setNewItemLargePrice(e.target.value)}
                    placeholder="e.g. 350"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 outline-none focus:border-red-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-red-600 py-2.5 font-bold text-white shadow hover:bg-red-700"
                  >
                    + Menu me Add Karein
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Menu Items List */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Live Menu Items ({menuItems.length})</h3>
              <div className="divide-y text-xs">
                {menuItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800">{item.name.en} ({item.name.hi})</p>
                      <p className="text-gray-500">Category: {item.category} | Regular: ₹{item.prices.regular}</p>
                    </div>
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 border border-green-200">
                      100% Veg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SALES & ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold">Total Revenue</p>
                <p className="mt-1 text-2xl font-black text-gray-900">₹{totalSales}</p>
                <p className="mt-1 text-[11px] text-gray-400">Kul aane wale tamam orders ka hisaab</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold">UPI Online Sales</p>
                <p className="mt-1 text-2xl font-black text-blue-600">₹{upiSales}</p>
                <p className="mt-1 text-[11px] text-gray-400">Direct QR code / PhonePe / GPay</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-semibold">Cash On Delivery (COD)</p>
                <p className="mt-1 text-2xl font-black text-emerald-600">₹{codSales}</p>
                <p className="mt-1 text-[11px] text-gray-400">Delivery par aane wala cash</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CHANGE PIN MODAL */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">Naya Admin PIN Set Karein</h3>
            <p className="mt-1 text-xs text-gray-500">Security ke liye 4 ankon ka apna naya secret PIN chunein.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700">Purana PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={oldPinInput}
                  onChange={(e) => setOldPinInput(e.target.value)}
                  placeholder="****"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-lg tracking-widest outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Naya PIN (4 Digits)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="****"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-lg tracking-widest outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowChangePinModal(false)}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-200"
              >
                Radd Karein
              </button>
              <button
                onClick={handleUpdatePin}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-red-700"
              >
                Save Karein
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}