"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp, StoredOrder } from "@/context/AppContext";
import { FoodItem, restaurantInfo } from "@/lib/menuData";
import { 
  ShoppingBag, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  ArrowLeft,
  Phone,
  Printer,
  Volume2,
  VolumeX,
  Trash2,
  Store,
  Plus,
  Edit2,
  Check,
  X,
  TrendingUp,
  CreditCard,
  Banknote,
  Bike,
  FileSpreadsheet
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { 
    orders, 
    updateOrderStatus, 
    outOfStockItems, 
    toggleItemStock,
    isStoreOpen,
    toggleStoreStatus,
    items,
    addNewItem,
    updateItemPrice
  } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // New Item Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemNameHi, setNewItemNameHi] = useState("");
  const [newItemNameEn, setNewItemNameEn] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("normal-pizza");
  const [newItemRegularPrice, setNewItemRegularPrice] = useState("");
  const [newItemMediumPrice, setNewItemMediumPrice] = useState("");
  const [newItemLargePrice, setNewItemLargePrice] = useState("");
  const [newItemImage, setNewItemImage] = useState("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60");

  // Edit Price State
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceRegular, setEditPriceRegular] = useState("");
  const [editPriceMedium, setEditPriceMedium] = useState("");
  const [editPriceLarge, setEditPriceLarge] = useState("");

  const prevOrderCountRef = useRef(orders.length);

  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log("Audio waiting for user click");
    }
  };

  useEffect(() => {
    if (isAuthenticated && orders.length > prevOrderCountRef.current) {
      playAlertSound();
    }
    prevOrderCountRef.current = orders.length;
  }, [orders.length, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl text-center">
          <div className="mb-3 text-4xl">🔐</div>
          <h2 className="text-lg font-bold text-gray-800">Admin Login</h2>
          <p className="text-xs text-gray-500 mb-4">रेस्टोरेंट एडमिन पिन दर्ज करें</p>
          <input
            type="password"
            maxLength={4}
            placeholder="PIN (उदा. 1234)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3 text-center text-lg tracking-widest outline-none focus:border-red-600"
          />
          <button
            onClick={() => {
              if (pin === "1234") {
                setIsAuthenticated(true);
                try {
                  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                  ctx.resume();
                } catch (e) {}
              } else {
                alert("गलत पिन! सही पिन 1234 है।");
              }
            }}
            className="mt-4 w-full rounded-xl bg-red-600 py-3 font-bold text-white shadow active:scale-95"
          >
            लॉगिन करें
          </button>
        </div>
      </div>
    );
  }

  // 📊 Analytics Calculations
  const todaySales = orders.reduce((sum, o) => sum + o.total, 0);
  const codSales = orders.filter(o => o.paymentMethod.toLowerCase().includes("cash") || o.paymentMethod.toLowerCase().includes("cod")).reduce((sum, o) => sum + o.total, 0);
  const upiSales = orders.filter(o => o.paymentMethod.toLowerCase().includes("upi") || o.paymentMethod.toLowerCase().includes("online")).reduce((sum, o) => sum + o.total, 0);
  const deliveryOrdersCount = orders.filter(o => !o.address.includes("पिकअप")).length;
  const pickupOrdersCount = orders.length - deliveryOrdersCount;

  // Top Selling Item Calculation
  const itemFrequency: { [name: string]: number } = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      itemFrequency[item.name] = (itemFrequency[item.name] || 0) + item.quantity;
    });
  });
  const topSellingItem = Object.entries(itemFrequency).sort((a, b) => b[1] - a[1])[0];

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemNameHi || !newItemNameEn || !newItemRegularPrice) {
      alert("कृपया नाम और कीमत दर्ज करें!");
      return;
    }

    const newItem: FoodItem = {
      id: `item-${Date.now()}`,
      name: { hi: newItemNameHi, en: newItemNameEn },
      description: { hi: "स्वादिष्ट और गरमा-गरम", en: "Freshly prepared & delicious" },
      category: newItemCategory as any,
      image: newItemImage,
      isVeg: true,
      prices: {
        regular: parseInt(newItemRegularPrice),
        ...(newItemMediumPrice && { medium: parseInt(newItemMediumPrice) }),
        ...(newItemLargePrice && { large: parseInt(newItemLargePrice) }),
      },
    };

    addNewItem(newItem);
    setShowAddModal(false);
    setNewItemNameHi("");
    setNewItemNameEn("");
    setNewItemRegularPrice("");
    setNewItemMediumPrice("");
    setNewItemLargePrice("");
    alert("नया आइटम मेन्यू में जुड़ गया!");
  };

  const startEditPrice = (item: FoodItem) => {
    setEditingItemId(item.id);
    setEditPriceRegular(String(item.prices.regular));
    setEditPriceMedium(item.prices.medium ? String(item.prices.medium) : "");
    setEditPriceLarge(item.prices.large ? String(item.prices.large) : "");
  };

  const saveEditPrice = (id: string) => {
    const reg = parseInt(editPriceRegular);
    if (isNaN(reg)) return;
    const med = editPriceMedium ? parseInt(editPriceMedium) : undefined;
    const lrg = editPriceLarge ? parseInt(editPriceLarge) : undefined;

    updateItemPrice(id, reg, med, lrg);
    setEditingItemId(null);
  };

  const printOrderKOT = (order: StoredOrder) => {
    const printWindow = window.open("", "_blank", "width=350,height=550");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>KOT - #${order.id}</title>
          <style>
            body { font-family: monospace; padding: 12px; font-size: 13px; color: #000; }
            .center { text-align: center; }
            hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
            .flex { display: flex; justify-content: space-between; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="center">
            <h2 style="margin: 0;">${restaurantInfo.name}</h2>
            <p style="margin: 3px 0;">📞 ${restaurantInfo.phone}</p>
            <p style="margin: 3px 0;" class="bold">*** KITCHEN ORDER TICKET (KOT) ***</p>
            <p style="margin: 3px 0;">Order: #${order.id} | ${order.time}</p>
          </div>
          <hr/>
          <p><strong>Customer:</strong> ${order.customer}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Address:</strong> ${order.address}</p>
          <p><strong>Pay Mode:</strong> ${order.paymentMethod}</p>
          ${order.cookingNote ? `<p style="color:red; margin:4px 0;"><strong>*** NOTE:</strong> ${order.cookingNote} ***</p>` : ""}
          <hr/>
          <table style="width:100%; text-align:left; font-size: 12px;">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th style="text-align:right;">Amt</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(i => `
                <tr>
                  <td>${i.name} (${i.size})</td>
                  <td>x${i.quantity}</td>
                  <td style="text-align:right;">₹${i.price * i.quantity}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <hr/>
          <div class="flex bold" style="font-size: 15px;">
            <span>TOTAL AMOUNT:</span>
            <span>₹${order.total}</span>
          </div>
          <hr/>
          <div class="center" style="font-size: 11px; margin-top: 8px;">
            Thank you for ordering! Visit again.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printDailyReport = () => {
    const printWindow = window.open("", "_blank", "width=380,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Daily Sales Report</title>
          <style>
            body { font-family: monospace; padding: 15px; font-size: 13px; }
            .center { text-align: center; }
            hr { border: none; border-top: 1px dashed #000; margin: 10px 0; }
            .flex { display: flex; justify-content: space-between; margin: 4px 0; }
          </style>
        </head>
        <body>
          <div class="center">
            <h2>${restaurantInfo.name}</h2>
            <h3>--- DAILY SALES REPORT ---</h3>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <hr/>
          <div class="flex"><span>Total Orders:</span><strong>${orders.length}</strong></div>
          <div class="flex"><span>Delivery Orders:</span><strong>${deliveryOrdersCount}</strong></div>
          <div class="flex"><span>Takeaway Orders:</span><strong>${pickupOrdersCount}</strong></div>
          <hr/>
          <div class="flex"><span>Cash (COD) Collected:</span><strong>₹${codSales}</strong></div>
          <div class="flex"><span>Online UPI Received:</span><strong>₹${upiSales}</strong></div>
          <hr/>
          <div class="flex" style="font-size: 16px;"><span>GROSS SALES:</span><strong>₹${todaySales}</strong></div>
          <hr/>
          <p><strong>Top Selling Item:</strong> ${topSellingItem ? `${topSellingItem[0]} (${topSellingItem[1]} sold)` : "N/A"}</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const clearAllOrders = () => {
    if (confirm("क्या आप सचमुच सभी पुराने ऑर्डर्स साफ़ करना चाहते हैं?")) {
      localStorage.removeItem('bp_orders');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 text-gray-800">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-[11px] text-gray-500">{restaurantInfo.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playAlertSound();
            }}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold ${
              soundEnabled ? "border-green-300 bg-green-50 text-green-700" : "border-gray-200 text-gray-500"
            }`}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? "Sound ON" : "Muted"}</span>
          </button>
          
          <button
            onClick={() => setIsAuthenticated(false)}
            className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Store Status Toggle */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-xs border border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isStoreOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Restaurant Status</h3>
              <p className="text-xs text-gray-500">
                {isStoreOpen ? "🟢 दुकान चालू है (Orders On)" : "🔴 दुकान बंद है (Orders Paused)"}
              </p>
            </div>
          </div>
          <button
            onClick={toggleStoreStatus}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
              isStoreOpen 
                ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200" 
                : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
            }`}
          >
            {isStoreOpen ? "दुकान बंद करें" : "दुकान खोलें"}
          </button>
        </div>
      </div>

      {/* 🟢 BUSINESS ANALYTICS & DAILY SALES REPORT */}
      <div className="p-4 pb-0">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2 mb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-red-600" />
              <span>Business Sales Breakdown</span>
            </h3>
            <button
              onClick={printDailyReport}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-200"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-green-600" />
              <span>Print Report</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl bg-green-50 border border-green-200 p-3">
              <div className="flex items-center justify-between text-[11px] text-green-800 font-semibold">
                <span>Total Cash (COD)</span>
                <Banknote className="h-3.5 w-3.5 text-green-600" />
              </div>
              <div className="mt-1 text-base font-extrabold text-green-900">₹{codSales}</div>
            </div>

            <div className="rounded-xl bg-purple-50 border border-purple-200 p-3">
              <div className="flex items-center justify-between text-[11px] text-purple-800 font-semibold">
                <span>Total Online (UPI)</span>
                <CreditCard className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <div className="mt-1 text-base font-extrabold text-purple-900">₹{upiSales}</div>
            </div>

            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
              <div className="flex items-center justify-between text-[11px] text-blue-800 font-semibold">
                <span>Delivery Orders</span>
                <Bike className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div className="mt-1 text-base font-extrabold text-blue-900">{deliveryOrdersCount}</div>
            </div>

            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold">
                <span>Takeaway Orders</span>
                <Store className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <div className="mt-1 text-base font-extrabold text-amber-900">{pickupOrdersCount}</div>
            </div>
          </div>

          {topSellingItem && (
            <div className="mt-3 rounded-xl bg-gray-50 border border-gray-200 p-2 text-xs flex items-center justify-between">
              <span className="text-gray-600">⭐ सबसे ज़्यादा बिकने वाला आइटम:</span>
              <span className="font-bold text-gray-900">{topSellingItem[0]} ({topSellingItem[1]} बिका)</span>
            </div>
          )}
        </div>
      </div>

      {/* Total Overview Metrics */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-xs border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Gross Sales</span>
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900">₹{todaySales}</div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-xs border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-gray-900">{orders.length}</div>
        </div>
      </div>

      {/* Live Orders */}
      <div className="px-4 mt-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-red-600" />
            <span>Live Orders ({orders.filter(o => o.status !== "Delivered").length})</span>
          </h2>
          {orders.length > 0 && (
            <button
              onClick={clearAllOrders}
              className="text-[11px] text-gray-400 hover:text-red-600 flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-xs">
            अभी कोई सक्रिय ऑर्डर नहीं है।
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="text-xs font-bold text-gray-900 font-mono">Order #{order.id}</span>
                    <span className="ml-2 text-[10px] text-gray-400">{order.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => printOrderKOT(order)}
                      className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print KOT</span>
                    </button>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === "Delivered" ? "bg-green-100 text-green-700" :
                      order.status === "Out for Delivery" ? "bg-purple-100 text-purple-700" :
                      order.status === "Preparing" ? "bg-yellow-100 text-yellow-800" :
                      "bg-orange-100 text-orange-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-800">{order.customer}</p>
                    <a href={`tel:${order.phone}`} className="flex items-center gap-1 text-blue-600 font-medium">
                      <Phone className="h-3 w-3" />
                      <span>{order.phone}</span>
                    </a>
                  </div>
                  <p className="text-gray-600 text-[11px]">{order.address}</p>
                  <p className="text-[10px] text-gray-500 font-mono">Payment: {order.paymentMethod}</p>

                  {order.cookingNote && (
                    <p className="mt-1 rounded-md bg-amber-50 p-1.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                      📝 Note: {order.cookingNote}
                    </p>
                  )}

                  <div className="mt-2 border-t pt-2 space-y-1">
                    {order.items.map((it, idx) => (
                      <p key={idx} className="font-medium text-red-600 text-[11px]">
                        • {it.name} ({it.size}) x {it.quantity} = ₹{it.price * it.quantity}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t pt-2.5">
                  <span className="text-base font-extrabold text-gray-900">Final Total: ₹{order.total}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => updateOrderStatus(order.id, "Preparing")}
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
                        order.status === "Preparing" ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      Preparing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "Out for Delivery")}
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
                        order.status === "Out for Delivery" ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      Out for Delivery
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "Delivered")}
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
                        order.status === "Delivered" ? "bg-green-600 text-white" : "bg-green-100 text-green-800"
                      }`}
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Stock & Price Manager */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>Menu & Price Manager ({items.length} Items)</span>
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add New Item</span>
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-2 divide-y">
          {items.map(item => {
            const isOOS = outOfStockItems.includes(item.id);
            const isEditing = editingItemId === item.id;

            return (
              <div key={item.id} className="py-2.5 px-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">{item.name.hi} ({item.name.en})</p>
                    <p className="text-[10px] text-gray-500">
                      Regular: ₹{item.prices.regular}
                      {item.prices.medium && ` | Med: ₹${item.prices.medium}`}
                      {item.prices.large && ` | Lrg: ₹${item.prices.large}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => isEditing ? saveEditPrice(item.id) : startEditPrice(item)}
                      className="rounded-lg bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
                      title="Edit Price"
                    >
                      {isEditing ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Edit2 className="h-3.5 w-3.5" />}
                    </button>
                    
                    <button
                      onClick={() => toggleItemStock(item.id)}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-bold text-[10px] transition ${
                        !isOOS ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {!isOOS ? "🟢 Available" : "🔴 Out of Stock"}
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-2.5 flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500">Edit Price:</span>
                    <input
                      type="number"
                      placeholder="Reg"
                      value={editPriceRegular}
                      onChange={(e) => setEditPriceRegular(e.target.value)}
                      className="w-16 rounded border bg-white p-1 text-xs outline-none"
                    />
                    {item.prices.medium && (
                      <input
                        type="number"
                        placeholder="Med"
                        value={editPriceMedium}
                        onChange={(e) => setEditPriceMedium(e.target.value)}
                        className="w-16 rounded border bg-white p-1 text-xs outline-none"
                      />
                    )}
                    {item.prices.large && (
                      <input
                        type="number"
                        placeholder="Lrg"
                        value={editPriceLarge}
                        onChange={(e) => setEditPriceLarge(e.target.value)}
                        className="w-16 rounded border bg-white p-1 text-xs outline-none"
                      />
                    )}
                    <button
                      onClick={() => saveEditPrice(item.id)}
                      className="rounded bg-green-600 px-2 py-1 font-bold text-white text-[10px]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingItemId(null)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleCreateNewItem} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-gray-900">+ Add New Food Item</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="rounded-full bg-gray-100 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="font-bold text-gray-700">नाम (हिंदी) *</label>
                <input
                  type="text"
                  placeholder="उदा. वेज पनीर पिज़्ज़ा"
                  value={newItemNameHi}
                  onChange={(e) => setNewItemNameHi(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-2 outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700">Name (English) *</label>
                <input
                  type="text"
                  placeholder="e.g. Veg Paneer Pizza"
                  value={newItemNameEn}
                  onChange={(e) => setNewItemNameEn(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-2 outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-2 outline-none focus:border-red-600 bg-white"
                >
                  <option value="normal-pizza">Normal Pizza</option>
                  <option value="special-pizza">Special Pizza</option>
                  <option value="burger">Burger</option>
                  <option value="sandwich">Sandwich</option>
                  <option value="maggi">Maggi</option>
                  <option value="pasta">Pasta</option>
                  <option value="drinks">Drinks & Shakes</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-700">Regular ₹ *</label>
                  <input
                    type="number"
                    placeholder="₹70"
                    value={newItemRegularPrice}
                    onChange={(e) => setNewItemRegularPrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 p-2 outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700">Medium ₹</label>
                  <input
                    type="number"
                    placeholder="₹120"
                    value={newItemMediumPrice}
                    onChange={(e) => setNewItemMediumPrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 p-2 outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700">Large ₹</label>
                  <input
                    type="number"
                    placeholder="₹180"
                    value={newItemLargePrice}
                    onChange={(e) => setNewItemLargePrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 p-2 outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700">Image URL</label>
                <input
                  type="text"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-2 outline-none focus:border-red-600 text-[11px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-red-600 py-3 text-xs font-bold text-white shadow-md active:scale-95"
            >
              मेन्यू में जोड़ें (Save Item)
            </button>
          </form>
        </div>
      )}
    </div>
  );
}