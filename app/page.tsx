"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { FoodItem, restaurantInfo, deliveryLocations } from "@/lib/menuData";
import { 
  Phone, 
  MessageCircle, 
  ShoppingBag, 
  MapPin, 
  Search, 
  Globe, 
  Volume2, 
  Plus, 
  Minus, 
  X, 
  Trash2, 
  ArrowRight, 
  Mic, 
  CheckCircle2, 
  Home, 
  Store, 
  ExternalLink, 
  CreditCard, 
  Ban, 
  Tag, 
  Truck, 
  FileText, 
  AlertTriangle,
  RotateCcw,
  Download
} from "lucide-react";
import Link from "next/link";

const categories = [
  { id: "all", label: { hi: "सभी", en: "All" }, icon: "🍽️" },
  { id: "normal-pizza", label: { hi: "नॉर्मल पिज़्ज़ा", en: "Normal Pizza" }, icon: "🍕" },
  { id: "special-pizza", label: { hi: "स्पेशल पिज़्ज़ा", en: "Special Pizza" }, icon: "⭐" },
  { id: "burger", label: { hi: "बर्गर", en: "Burger" }, icon: "🍔" },
  { id: "sandwich", label: { hi: "सैंडविच", en: "Sandwich" }, icon: "🥪" },
  { id: "maggi", label: { hi: "मैगी", en: "Maggi" }, icon: "🍜" },
  { id: "pasta", label: { hi: "पास्ता", en: "Pasta" }, icon: "🍝" },
  { id: "drinks", label: { hi: "शेक & ड्रिंक्स", en: "Drinks & Shakes" }, icon: "🥤" },
];

export default function HomePage() {
  const { 
    t, 
    lang, 
    setLang, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    cart, 
    cartTotal, 
    addOrder, 
    outOfStockItems, 
    isStoreOpen, 
    items 
  } = useApp();

  const [showLangModal, setShowLangModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState<FoodItem | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "upi_pay" | "confirmed">("cart");

  const [selectedSize, setSelectedSize] = useState<"Regular" | "Medium" | "Large">("Regular");
  const [quantity, setQuantity] = useState(1);

  // Address & Checkout Form States
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("magrayar");
  const [customVillage, setCustomVillage] = useState("");
  const [landmark, setLandmark] = useState("");
  const [cookingNote, setCookingNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const [currentOrderId, setCurrentOrderId] = useState<string>("");

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // 🟢 PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem("bp_lang");
    if (!storedLang) setShowLangModal(true);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("ऐप इंस्टॉल करने के लिए ब्राउज़र मेन्यू (3 डॉट्स) पर जाकर 'Add to Home screen' चुनें।");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const activeLocation = deliveryLocations.find(l => l.id === selectedVillageId) || deliveryLocations[0];
  const deliveryFee = orderType === "pickup" ? 0 : (cartTotal >= 199 ? 0 : activeLocation.fee);
  const finalPayableTotal = Math.max(0, cartTotal - discountAmount + deliveryFee);

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();

    if (code === "PIZZA50") {
      if (cartTotal < 200) {
        setCouponError("PIZZA50 के लिए न्यूनतम ऑर्डर ₹200 होना चाहिए।");
        return;
      }
      setDiscountAmount(50);
      setAppliedCoupon("PIZZA50");
    } else if (code === "BHAWANI10") {
      const discount = Math.round(cartTotal * 0.10);
      setDiscountAmount(discount);
      setAppliedCoupon("BHAWANI10");
    } else {
      setCouponError("अमान्य कोड! PIZZA50 या BHAWANI10 आज़माएँ।");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    setCouponError("");
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.name.en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const speakItem = (item: FoodItem) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = lang === "hi"
        ? `${item.name.hi}, कीमत ${item.prices.regular} रुपये से शुरू।`
        : `${item.name.en}, price starting from ${item.prices.regular} rupees.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "hi" ? "hi-IN" : "en-US";
      recognition.onstart = () => setSearchQuery(lang === "hi" ? "सुन रहे हैं..." : "Listening...");
      recognition.onresult = (event: any) => setSearchQuery(event.results[0][0].transcript);
      recognition.onerror = () => setSearchQuery("");
      recognition.start();
    }
  };

  const openCustomizeModal = (item: FoodItem) => {
    if (!isStoreOpen) {
      alert("दुकान अभी बंद है। ऑर्डर स्वीकार नहीं किए जा रहे हैं।");
      return;
    }
    if (outOfStockItems.includes(item.id)) return;
    setActiveItem(item);
    setSelectedSize("Regular");
    setQuantity(1);
  };

  const calculateModalPrice = () => {
    if (!activeItem) return 0;
    let base = activeItem.prices.regular;
    if (selectedSize === "Medium" && activeItem.prices.medium) base = activeItem.prices.medium;
    if (selectedSize === "Large" && activeItem.prices.large) base = activeItem.prices.large;
    return base * quantity;
  };

  const handleAddToCart = () => {
    if (!activeItem) return;
    const finalPrice = calculateModalPrice() / quantity;
    addToCart({
      id: `${activeItem.id}-${selectedSize}-${Date.now()}`,
      name: activeItem.name,
      size: selectedSize,
      price: finalPrice,
      quantity: quantity,
    });
    setActiveItem(null);
  };

  const generateDailyOrderId = (): string => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${yy}${mm}${dd}`;

    const storedDate = localStorage.getItem('bp_last_order_date');
    let currentSeq = 1;

    if (storedDate === datePrefix) {
      const lastSeq = parseInt(localStorage.getItem('bp_daily_seq') || '0', 10);
      currentSeq = lastSeq + 1;
    } else {
      localStorage.setItem('bp_last_order_date', datePrefix);
    }

    localStorage.setItem('bp_daily_seq', String(currentSeq));
    return `${datePrefix}${String(currentSeq).padStart(4, '0')}`;
  };
   const validateCheckoutForm = (): boolean => {
    if (!customerName.trim() || customerName.trim().length < 2) {
      alert("कृपया अपना सही नाम दर्ज करें (कम से कम 2 अक्षर)।");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = customerPhone.trim().replace(/\D/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      alert("कृपया 10 अंकों का मान्य मोबाइल नंबर डालें (शुरुआत 6, 7, 8 या 9 से होनी चाहिए)।");
      return false;
    }

    if (orderType === "delivery" && selectedVillageId === "other" && !customVillage.trim()) {
      alert("कृपया अपने गाँव/इलाके का नाम लिखें।");
      return false;
    }

    if (cart.length === 0) {
      alert("कार्ट खाली है! पहले कुछ आइटम जोड़ें।");
      return false;
    }

    return true;
  };

  const handleAddressProceed = () => {
    if (!validateCheckoutForm()) return;
    if (!isStoreOpen) {
      alert("दुकान अभी बंद है।");
      return;
    }

    if (!customerName || !customerPhone) {
      alert(lang === "hi" ? "कृपया नाम और मोबाइल नंबर भरें।" : "Please enter name and phone number.");
      return;
    }

    if (orderType === "delivery" && cartTotal < activeLocation.minOrder) {
      alert(`${activeLocation.name[lang]} के लिए न्यूनतम ऑर्डर ₹${activeLocation.minOrder} होना चाहिए।`);
      return;
    }

    const newOrderId = generateDailyOrderId();
    setCurrentOrderId(newOrderId);

    if (paymentMethod === "upi") {
      setCheckoutStep("upi_pay");
    } else {
      dispatchOrder(newOrderId, "COD");
    }
  };

  const upiIntentUrl = `upi://pay?pa=${restaurantInfo.phone}@upi&pn=BhawaniPizza&am=${finalPayableTotal}&cu=INR&tn=Order-${currentOrderId}`;
  const dynamicQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiIntentUrl)}`;

  const dispatchOrder = (orderNum: string, payType: "COD" | "UPI_ONLINE") => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const villageLabel = selectedVillageId === "other" && customVillage.trim()
      ? customVillage
      : activeLocation.name[lang];

    const finalAddress = orderType === "delivery"
      ? `${villageLabel} (Landmark: ${landmark || "N/A"})`
      : "दुकान से पिकअप (Takeaway)";

    addOrder({
      id: orderNum,
      customer: customerName,
      phone: customerPhone,
      address: finalAddress,
      cookingNote: cookingNote.trim() || undefined,
      items: cart.map(i => ({ name: i.name[lang], size: i.size, quantity: i.quantity, price: i.price })),
      total: finalPayableTotal,
      paymentMethod: payType === "COD" ? "Cash on Delivery" : "UPI Online",
      status: "Pending",
      time: timeFormatted
    });

    let msg = `🍕 *New Order #${orderNum} - ${restaurantInfo.name}*\n\n`;
    msg += `👤 *ग्राहक:* ${customerName}\n`;
    msg += `📞 *मोबाइल:* ${customerPhone}\n`;
    msg += `🛍️ *प्रकार:* ${orderType === "delivery" ? "होम डिलीवरी" : "दुकान से पिकअप"}\n`;

    if (orderType === "delivery") {
      msg += `📍 *गाँव:* ${villageLabel}\n`;
      msg += `🏛️ *पहचान:* ${landmark || "N/A"}\n`;
    }

    if (cookingNote.trim()) {
      msg += `📝 *निर्देश (Note):* ${cookingNote}\n`;
    }

    if (payType === "COD") {
      msg += `💳 *भुगतान:* Cash on Delivery (COD)\n\n`;
    } else {
      msg += `💳 *भुगतान:* UPI Online (Paid)\n`;
      msg += `🔖 *Ref:* Order-${orderNum}\n\n`;
    }

    msg += `*ऑर्डर आइटम्स:*\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name[lang]} (${item.size}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });

    msg += `\n*आइटम टोटल:* ₹${cartTotal}`;
    if (discountAmount > 0) {
      msg += `\n*छूट (${appliedCoupon}):* -₹${discountAmount}`;
    }
    msg += `\n*डिलीवरी शुल्क:* ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}`;
    msg += `\n*कुल देय राशि:* ₹${finalPayableTotal}\n\nकृपया ऑर्डर कन्फ़र्म करें!`;

    window.open(`https://wa.me/${restaurantInfo.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    clearCart();
    handleRemoveCoupon();
    setCookingNote("");
    setCheckoutStep("confirmed");
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-28 text-gray-800">
      {/* 1. Language Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl shadow-inner">
            🍕
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900">Welcome to {restaurantInfo.name}</h1>
          <p className="mt-1 text-sm text-gray-500">अपनी भाषा चुनें / Choose your language</p>
          <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
            <button
              onClick={() => { setLang("hi"); setShowLangModal(false); }}
              className="flex items-center justify-between rounded-xl border-2 border-red-500 bg-red-50 p-4 font-bold text-red-700 shadow-xs"
            >
              <span>🇮🇳 हिंदी में आगे बढ़ें</span>
              <span>➔</span>
            </button>
            <button
              onClick={() => { setLang("en"); setShowLangModal(false); }}
              className="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-gray-50 p-4 font-bold text-gray-800 shadow-xs"
            >
              <span>🇬🇧 Continue in English</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍕</span>
          <div>
            <h2 className="text-sm font-bold leading-tight">भवानी पिज़्ज़ा पॉइंट</h2>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <MapPin className="mr-0.5 h-3 w-3 text-red-500" />
              <span>₹199 से ऊपर फ्री डिलीवरी</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "hi" ? "en" : "hi")}
            className="flex items-center gap-1 rounded-full border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "hi" ? "EN" : "हिं"}
          </button>
          <button 
            onClick={() => { setIsCartOpen(true); setCheckoutStep("cart"); }}
            className="relative flex items-center justify-center rounded-full bg-red-600 p-2 text-white shadow-xs"
          >
            <ShoppingBag className="h-4 w-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-extrabold text-black">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 🟢 PWA INSTALL APP BANNER */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-red-600 to-amber-600 px-4 py-2.5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 text-xs">
            <Download className="h-4 w-4 animate-bounce" />
            <span className="font-bold">फ़ोन में App इंस्टॉल करें!</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="rounded-lg bg-white px-3 py-1 text-[11px] font-bold text-red-600 shadow-sm active:scale-95"
            >
              Install
            </button>
            <button onClick={() => setShowInstallBanner(false)} className="text-white/80 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Store Closed Warning Banner */}
      {!isStoreOpen && (
        <div className="bg-red-600 px-4 py-2.5 text-center text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <span>दुकान अभी बंद है (Orders are currently paused)</span>
        </div>
      )}

      {/* 3. Hero Section */}
      <section className="bg-gradient-to-b from-red-600 to-red-700 px-4 py-8 text-white">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-extrabold sm:text-3xl">{restaurantInfo.tagline} 🍕</h1>
          <p className="mt-2 text-xs text-red-100">मो.: {restaurantInfo.phone} | समय: 10:00 AM – 10:00 PM</p>
          <div className="mt-5 relative flex items-center">
            <input
              type="text"
              placeholder={lang === "hi" ? "खाना खोजें..." : "Search food..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white/95 px-4 py-3 pl-10 pr-10 text-sm text-gray-900 shadow-inner outline-none"
            />
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <button onClick={handleVoiceSearch} className="absolute right-2.5 top-2.5 rounded-lg bg-red-100 p-1.5 text-red-600">
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Info Strip */}
      <section className="bg-amber-100 px-4 py-2 border-b border-amber-200">
        <div className="flex items-center justify-between text-xs text-amber-900">
          <span className="flex items-center gap-1 font-semibold">
            <Truck className="h-3.5 w-3.5 text-amber-700" />
            ₹199+ पर मुफ़्त डिलीवरी
          </span>
          <span className="font-bold text-[11px] bg-amber-200 px-2 py-0.5 rounded-md">
            कूपन: PIZZA50
          </span>
        </div>
      </section>

      {/* 4. Categories */}
      <section className="mt-4 px-4" id="menu">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
                selectedCategory === cat.id
                  ? "bg-red-600 text-white border-red-600"
                  : "border border-gray-200 bg-white text-gray-700"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label[lang]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Food Grid */}
      <section className="mt-4 px-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredItems.map((item) => {
            const isOOS = outOfStockItems.includes(item.id);
            return (
              <div
                key={item.id}
                className={`relative flex overflow-hidden rounded-2xl border bg-white p-3 shadow-xs gap-3 transition ${
                  isOOS || !isStoreOpen ? "border-gray-200 opacity-60 grayscale-50" : "border-gray-200"
                }`}
              >
                <img src={item.image} alt={item.name[lang]} className="h-24 w-24 rounded-xl object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-900">{item.name[lang]}</h4>
                      <span className="flex h-3.5 w-3.5 items-center justify-center border border-green-600 p-0.5 rounded-[3px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description[lang]}</p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-gray-900">
                      ₹{item.prices.regular}
                      {item.prices.medium && <span className="text-[10px] text-gray-500 font-normal"> (S)</span>}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button onClick={() => speakItem(item)} className="rounded-lg bg-gray-100 p-1.5 text-gray-600">
                        <Volume2 className="h-4 w-4" />
                      </button>

                      {isOOS ? (
                        <span className="flex items-center gap-1 rounded-xl bg-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-500">
                          <Ban className="h-3.5 w-3.5" />
                          Out of Stock
                        </span>
                      ) : (
                        <button
                          onClick={() => openCustomizeModal(item)}
                          className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700"
                        >
                          + {t.addToCart}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Customization Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">{activeItem.name[lang]}</h3>
                <p className="text-xs text-gray-500">{activeItem.description[lang]}</p>
              </div>
              <button onClick={() => setActiveItem(null)} className="rounded-full bg-gray-100 p-1.5">
                <X className="h-4 w-4" />
              </button>
            </div>

            {activeItem.prices.medium && (
              <div className="mt-4">
                <span className="text-xs font-bold text-gray-700">साइज़ चुनें</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["Regular", "Medium", "Large"] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`rounded-xl border p-2 text-center text-xs font-bold ${
                        selectedSize === sz ? "border-red-600 bg-red-50 text-red-600" : "border-gray-200 text-gray-700"
                      }`}
                    >
                      <div>{sz === "Regular" ? "Small" : sz}</div>
                      <div className="text-[10px] text-gray-500">
                        ₹{sz === "Regular" ? activeItem.prices.regular : sz === "Medium" ? activeItem.prices.medium : activeItem.prices.large}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-xs font-bold text-gray-700">मात्रा</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-lg bg-gray-100 p-1.5">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="rounded-lg bg-gray-100 p-1.5">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5">
              <button onClick={handleAddToCart} className="flex w-full items-center justify-between rounded-xl bg-red-600 p-3.5 font-bold text-white shadow-lg">
                <span>{t.addToCart}</span>
                <span>₹{calculateModalPrice()}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Cart & Checkout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="flex h-full w-full max-w-md flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-red-600" />
                {checkoutStep === "cart" && `${t.cart} (${cart.length})`}
                {checkoutStep === "address" && "डिलीवरी की जानकारी"}
                {checkoutStep === "upi_pay" && "ऑनलाइन UPI पेमेंट"}
                {checkoutStep === "confirmed" && "ऑर्डर कन्फ़र्मेशन"}
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="rounded-full bg-gray-100 p-1.5">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Cart Items */}
            {checkoutStep === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-gray-400">
                      <ShoppingBag className="h-10 w-10 stroke-1" />
                      <p className="mt-2 text-xs">कार्ट खाली है</p>
                    </div>
                  ) : (
                    <>
                      {cart.map((item, idx) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <h4 className="text-xs font-bold text-gray-800">{item.name[lang]}</h4>
                            <span className="text-[10px] text-gray-500">{item.size} x {item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-900">₹{item.price * item.quantity}</span>
                            <button onClick={() => removeFromCart(idx)} className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Coupon */}
                      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5 text-red-600" />
                          <span>कूपन कोड डालें</span>
                        </label>
                        
                        {appliedCoupon ? (
                          <div className="mt-2 flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-800 font-bold">
                            <span>🎉 {appliedCoupon} लागू हुआ (-₹{discountAmount})</span>
                            <button onClick={handleRemoveCoupon} className="text-red-600 underline text-[11px]">हटाएँ</button>
                          </div>
                        ) : (
                          <div className="mt-2 flex gap-2">
                            <input
                              type="text"
                              placeholder="उदा. PIZZA50"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-mono uppercase outline-none focus:border-red-600"
                            />
                            <button
                              onClick={handleApplyCoupon}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 active:scale-95"
                            >
                              Apply
                            </button>
                          </div>
                        )}
                        {couponError && (
                          <p className="mt-1 text-[10px] text-red-600">{couponError}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t pt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>आइटम टोटल:</span>
                      <span>₹{cartTotal}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-700 font-medium">
                        <span>कूपन डिस्काउंट:</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>डिलीवरी चार्ज:</span>
                      <span>{deliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-gray-900 border-t pt-2">
                      <span>कुल राशि:</span>
                      <span className="text-red-600 text-base">₹{finalPayableTotal}</span>
                    </div>

                    <button
                      disabled={!isStoreOpen}
                      onClick={() => setCheckoutStep("address")}
                      className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl p-3.5 text-sm font-bold shadow-md active:scale-95 ${
                        isStoreOpen ? "bg-red-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <span>{isStoreOpen ? "आगे बढ़ें (पता डालें)" : "दुकान अभी बंद है"}</span>
                      {isStoreOpen && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Address */}
            {checkoutStep === "address" && (
              <div className="flex-1 overflow-y-auto py-3 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderType("delivery")}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold ${
                      orderType === "delivery" ? "border-red-600 bg-red-50 text-red-600" : "border-gray-200"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>घर पर डिलीवरी</span>
                  </button>
                  <button
                    onClick={() => setOrderType("pickup")}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold ${
                      orderType === "pickup" ? "border-red-600 bg-red-50 text-red-600" : "border-gray-200"
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    <span>दुकान से लेना है</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-700">आपका नाम *</label>
                    <input
                      type="text"
                      placeholder="अपना नाम लिखें"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700">मोबाइल नंबर *</label>
                    <input
                      type="tel"
                      placeholder="10 अंकों का मोबाइल नंबर"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-red-600"
                    />
                  </div>

                  {orderType === "delivery" && (
                    <>
                      <div>
                        <label className="font-bold text-gray-700 flex items-center justify-between">
                          <span>गाँव चुनें (Select Village) *</span>
                          <span className="text-[10px] text-gray-500 font-normal">
                            Min Order: ₹{activeLocation.minOrder}
                          </span>
                        </label>
                        <select
                          value={selectedVillageId}
                          onChange={(e) => setSelectedVillageId(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-red-600 bg-white"
                        >
                          {deliveryLocations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name[lang]} {loc.fee === 0 ? "(Free Delivery)" : `(+₹${loc.fee} Delivery)`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedVillageId === "other" && (
                        <div>
                          <label className="font-bold text-gray-700">गाँव का नाम लिखें *</label>
                          <input
                            type="text"
                            placeholder="अपने गाँव का नाम दर्ज करें"
                            value={customVillage}
                            onChange={(e) => setCustomVillage(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-red-600"
                          />
                        </div>
                      )}

                      <div>
                        <label className="font-bold text-gray-700">पहचान की जगह (Landmark)</label>
                        <input
                          type="text"
                          placeholder="जैसे: मंदिर, स्कूल, चौराहा"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-red-600"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="font-bold text-gray-700 flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-red-600" />
                      <span>कुकिंग निर्देश (Special Cooking Note)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. मिर्च कम रखना, चीज़ ज़्यादा डालना, गर्म देना"
                      value={cookingNote}
                      onChange={(e) => setCookingNote(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 outline-none focus:border-red-600 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700">भुगतान का माध्यम</label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`rounded-xl border p-2.5 text-xs font-bold ${
                          paymentMethod === "cod" ? "border-green-600 bg-green-50 text-green-700" : "border-gray-200"
                        }`}
                      >
                        💵 Cash on Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`rounded-xl border p-2.5 text-xs font-bold ${
                          paymentMethod === "upi" ? "border-green-600 bg-green-50 text-green-700" : "border-gray-200"
                        }`}
                      >
                        📱 UPI (GPay/PhonePe)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <button
                    onClick={handleAddressProceed}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 p-3.5 text-sm font-bold text-white shadow-md active:scale-95"
                  >
                    <span>{paymentMethod === "upi" ? "ऑनलाइन भुगतान करें" : "WhatsApp पर ऑर्डर भेजें"} (₹{finalPayableTotal})</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* UPI Step */}
            {checkoutStep === "upi_pay" && (
              <div className="flex flex-1 flex-col items-center justify-start py-2 text-center overflow-y-auto">
                <div className="w-full mb-3 sm:hidden">
                  <a
                    href={upiIntentUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-700 p-3.5 text-sm font-bold text-white shadow-md"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Pay via UPI App</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <div className="flex items-center my-3">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-2 text-[10px] text-gray-500 font-bold uppercase">या QR स्कैन करें</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-3">
                  <img src={dynamicQrCodeUrl} alt="UPI QR Code" className="h-40 w-40 rounded-lg mx-auto" />
                  <p className="mt-2 text-xs font-bold text-gray-800">Scan & Pay ₹{finalPayableTotal}</p>
                  <p className="text-[11px] font-mono text-blue-700 font-bold bg-blue-50 py-0.5 px-2 rounded-md mt-1">
                    Auto-Ref: Order-{currentOrderId}
                  </p>
                </div>

                <button
                  onClick={() => dispatchOrder(currentOrderId, "UPI_ONLINE")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 p-3.5 text-sm font-bold text-white shadow-md"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>मैंने भुगतान कर दिया है (WhatsApp पर भेजें)</span>
                </button>
              </div>
            )}

            {/* Confirmation */}
            {checkoutStep === "confirmed" && (
              <div className="flex flex-1 flex-col items-center justify-center py-6 text-center space-y-3">
                <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
                <h4 className="text-lg font-bold text-gray-900">ऑर्डर दर्ज हो चुका है!</h4>
                <p className="text-xs font-mono font-bold text-red-600">Order ID: #{currentOrderId}</p>
                <p className="text-xs text-gray-600 px-4">
                  ऑर्डर सीधा रेस्टोरेंट के डैशबोर्ड और WhatsApp पर भेजा जा चुका है।
                </p>

                <div className="w-full pt-4 space-y-2">
                  <Link
                    href="/track"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 p-3 text-xs font-bold text-white shadow-xs hover:bg-amber-600"
                  >
                    <span>ऑर्डर ट्रैक करें (Track Order) ➔</span>
                  </Link>
                  <button
                    onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); }}
                    className="w-full rounded-xl border border-gray-300 p-3 text-xs font-bold text-gray-700"
                  >
                    होम पेज पर लौटें
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      

      {/* 8. Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t bg-white/95 py-2 px-3 backdrop-blur-md shadow-lg sm:hidden">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center text-[10px] font-medium text-red-600">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </button>
        <a href="#menu" className="flex flex-col items-center text-[10px] font-medium text-gray-600">
          <span className="text-lg leading-none">🍕</span>
          <span>Menu</span>
        </a>
        <button onClick={() => { setIsCartOpen(true); setCheckoutStep("cart"); }} className="relative flex flex-col items-center text-[10px] font-medium text-gray-600">
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                {cart.length}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>
        <Link href="/orders" className="flex flex-col items-center text-[10px] font-medium text-gray-600">
          <RotateCcw className="h-5 w-5" />
          <span>Orders</span>
        </Link>
        <Link href="/track" className="flex flex-col items-center text-[10px] font-medium text-gray-600">
          <Truck className="h-5 w-5" />
          <span>Track</span>
        </Link>
        <a href={`https://wa.me/${restaurantInfo.whatsapp}`} target="_blank" rel="noreferrer" className="flex flex-col items-center text-[10px] font-medium text-green-600">
          <MessageCircle className="h-5 w-5" />
          <span>WhatsApp</span>
        </a>
      </nav>
    </main>
  );
}