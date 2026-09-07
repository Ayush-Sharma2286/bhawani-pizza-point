"use client";

import React, { useState } from "react";
import { useApp, StoredOrder } from "@/context/AppContext";
import { restaurantInfo } from "@/lib/menuData";
import { 
  ArrowLeft, 
  Search, 
  Clock, 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  AlertCircle 
} from "lucide-react";
import Link from "next/link";

export default function TrackOrderPage() {
  const { orders, lang } = useApp();
  const [searchId, setSearchId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<StoredOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const query = searchId.trim().replace("#", "");
    if (!query) {
      setErrorMsg("कृपया अपनी ऑर्डर आईडी दर्ज करें");
      return;
    }

    const found = orders.find((o) => o.id === query);
    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setErrorMsg("इस आईडी से कोई ऑर्डर नहीं मिला। कृपया सही आईडी डालें।");
    }
  };

  const steps: { key: StoredOrder["status"]; label: string; icon: any }[] = [
    { key: "Pending", label: "ऑर्डर प्राप्त हुआ", icon: Clock },
    { key: "Preparing", label: "किचन में बन रहा है", icon: ChefHat },
    { key: "Out for Delivery", label: "रास्ते में है", icon: Bike },
    { key: "Delivered", label: "डिलीवर हो गया", icon: CheckCircle2 },
  ];

  const getStepIndex = (status: StoredOrder["status"]) => {
    switch (status) {
      case "Pending": return 0;
      case "Preparing": return 1;
      case "Out for Delivery": return 2;
      case "Delivered": return 3;
      default: return 0;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white px-4 py-3 shadow-xs">
        <Link href="/" className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-base font-bold text-gray-900">Track Your Order</h1>
          <p className="text-[11px] text-gray-500">{restaurantInfo.name}</p>
        </div>
      </header>

      <div className="mx-auto max-w-md p-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            अपनी 10-अंकों की Order ID दर्ज करें:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="उदा. 2609020001"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm font-mono tracking-wider outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="flex items-center gap-1 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 active:scale-95"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Track</span>
            </button>
          </div>
          {errorMsg && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{errorMsg}</span>
            </p>
          )}
        </form>

        {/* Tracking Timeline */}
        {searchedOrder && (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-xs font-bold text-gray-900 font-mono">Order #{searchedOrder.id}</span>
                  <p className="text-[11px] text-gray-400">समय: {searchedOrder.time}</p>
                </div>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 border border-red-200">
                  {searchedOrder.status}
                </span>
              </div>

              {/* Progress Stepper */}
              <div className="mt-6 space-y-6">
                {steps.map((step, idx) => {
                  const currentIdx = getStepIndex(searchedOrder.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="relative flex items-center gap-4">
                      {idx !== steps.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                            idx < currentIdx ? "bg-green-600" : "bg-gray-200"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition ${
                          isCompleted
                            ? "bg-green-600 text-white shadow-xs"
                            : "bg-gray-100 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-green-100" : ""}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1">
                        <p className={`text-xs font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-[10px] text-green-700 animate-pulse font-medium">
                            वर्तमान स्थिति (In Progress)
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-xs shadow-xs space-y-2">
              <h3 className="font-bold text-gray-900 border-b pb-2">ऑर्डर विवरण (Order Summary)</h3>
              <p className="text-gray-700"><span className="font-semibold">ग्राहक:</span> {searchedOrder.customer}</p>
              <p className="text-gray-700 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-red-500" />
                <span>{searchedOrder.address}</span>
              </p>
              <div className="mt-2 border-t pt-2 space-y-1">
                {searchedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-gray-600 text-[11px]">
                    <span>{item.name} ({item.size}) x {item.quantity}</span>
                    <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-sm text-gray-900">
                <span>कुल राशि:</span>
                <span className="text-red-600">₹{searchedOrder.total}</span>
              </div>
            </div>

            {/* Call Store Button */}
            <a
              href={`tel:${restaurantInfo.phone}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 p-3.5 text-xs font-bold text-white shadow-md active:scale-95"
            >
              <Phone className="h-4 w-4" />
              <span>सीधे रेस्टोरेंट को कॉल करें ({restaurantInfo.phone})</span>
            </a>
          </div>
        )}
      </div>
    </main>
  );
}