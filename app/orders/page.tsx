"use client";

import React from "react";
import { useApp, StoredOrder } from "@/context/AppContext";
import { restaurantInfo } from "@/lib/menuData";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Clock, 
  RotateCcw, 
  ChevronRight, 
  Truck,
  CheckCircle2,
  Phone
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const { orders, addToCart, lang } = useApp();
  const router = useRouter();

  const handleReorder = (order: StoredOrder) => {
    order.items.forEach((item) => {
      addToCart({
        id: `reorder-${Date.now()}-${Math.random()}`,
        name: { hi: item.name, en: item.name },
        size: item.size as any,
        price: item.price,
        quantity: item.quantity,
      });
    });

    // कार्ट में लोड करके सीधे होमपेज पर भेजें
    alert("पुराने ऑर्डर के आइटम्स कार्ट में जोड़ दिए गए हैं!");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 text-gray-800">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900">मेरे पुराने ऑर्डर्स (My Orders)</h1>
            <p className="text-[11px] text-gray-500">{restaurantInfo.name}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md p-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400">
            <ShoppingBag className="h-12 w-12 stroke-1 text-gray-300" />
            <h3 className="mt-3 text-sm font-bold text-gray-700">अभी कोई पुराना ऑर्डर नहीं है</h3>
            <p className="mt-1 text-xs text-gray-500">मेन्यू से अपना पसंदीदा पिज़्ज़ा या बर्गर चुनें!</p>
            <Link
              href="/"
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700"
            >
              मेन्यू देखें ➔
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b pb-2.5">
                  <div>
                    <span className="text-xs font-bold text-gray-900 font-mono">Order #{order.id}</span>
                    <p className="text-[11px] text-gray-400">{order.time}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    order.status === "Delivered" ? "bg-green-100 text-green-700" :
                    order.status === "Out for Delivery" ? "bg-purple-100 text-purple-700" :
                    order.status === "Preparing" ? "bg-yellow-100 text-yellow-800" :
                    "bg-orange-100 text-orange-700"
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Items List */}
                <div className="mt-2.5 space-y-1.5 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>{item.name} ({item.size}) x {item.quantity}</span>
                      <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Address & Total */}
                <div className="mt-3 border-t pt-2 text-[11px] text-gray-500 space-y-1">
                  <p className="line-clamp-1">📍 {order.address}</p>
                  <p className="font-mono">💳 {order.paymentMethod}</p>
                </div>

                {/* Total & Action Buttons */}
                <div className="mt-3 flex items-center justify-between border-t pt-2.5">
                  <span className="text-sm font-extrabold text-gray-900">कुल: ₹{order.total}</span>
                  
                  <div className="flex gap-2">
                    <Link
                      href="/track"
                      className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200"
                    >
                      <Truck className="h-3.5 w-3.5 text-red-600" />
                      <span>Track</span>
                    </Link>

                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 active:scale-95"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Re-Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}