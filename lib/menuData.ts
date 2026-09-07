export interface FoodItem {
  id: string;
  name: { hi: string; en: string };
  description: { hi: string; en: string };
  category: "normal-pizza" | "special-pizza" | "burger" | "maggi" | "sandwich" | "pasta" | "drinks";
  isVeg: boolean;
  image: string;
  prices: {
    regular: number; // Small (S)
    medium?: number; // Medium (M)
    large?: number;  // Large (L)
  };
}

export const restaurantInfo = {
  name: "भवानी पिज़्ज़ा पॉइंट & रेस्टोरेंट",
  tagline: "स्वाद ऐसा कि बार-बार आने का मन करे!",
  proprietor: "Ayush Sharma",
  phone: "9454186929",
  whatsapp: "9454186929",
};

export const menuItems: FoodItem[] = [
  // --- नॉर्मल पिज़्ज़ा ---
  {
    id: "cheese-pizza",
    name: { hi: "चीज़ पिज़्ज़ा", en: "Cheese Pizza" },
    description: { hi: "क्लासिक मोज़ेरेला चीज़ पिज़्ज़ा।", en: "Classic cheesy pizza delight." },
    category: "normal-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 70, medium: 150, large: 230 }
  },
  {
    id: "capsicum-pizza",
    name: { hi: "कैप्सिकम पिज़्ज़ा", en: "Capsicum Pizza" },
    description: { hi: "फ्रेश क्रंची शिमला मिर्च और चीज़ के साथ।", en: "Loaded with fresh capsicum and mozzarella." },
    category: "normal-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 70, medium: 150, large: 230 }
  },
  {
    id: "onion-pizza",
    name: { hi: "ओनियन पिज़्ज़ा", en: "Onion Pizza" },
    description: { hi: "कुरकुरे प्याज और मोज़ेरेला चीज़ का बेहतरीन स्वाद।", en: "Fresh crunchy onions topped with cheese." },
    category: "normal-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 70, medium: 150, large: 230 }
  },
  {
    id: "tomato-pizza",
    name: { hi: "टोमेटो पिज़्ज़ा", en: "Tomato Pizza" },
    description: { hi: "रसीले टमाटर और चीज़ का क्लासिक कॉम्बो।", en: "Juicy ripe tomatoes with loaded cheese." },
    category: "normal-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 70, medium: 150, large: 230 }
  },

  // --- स्पेशल पिज़्ज़ा ---
  {
    id: "onion-paneer-pizza",
    name: { hi: "ओनियन पनीर पिज़्ज़ा", en: "Onion Paneer Pizza" },
    description: { hi: "ताज़ा पनीर क्यूब्स और प्याज भरपूर चीज़ के साथ।", en: "Fresh paneer and crisp onions with cheese." },
    category: "special-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 120, medium: 250, large: 330 }
  },
  {
    id: "mix-pizza",
    name: { hi: "मिक्स पिज़्ज़ा", en: "Mix Pizza" },
    description: { hi: "सभी ताज़ी सब्जियों और भरपूर चीज़ का संगम।", en: "All mixed veggie delight with extra cheese." },
    category: "special-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 140, medium: 270, large: 350 }
  },
  {
    id: "spicy-paneer-pizza",
    name: { hi: "स्पाइसी पनीर पिज़्ज़ा", en: "Spicy Paneer Pizza" },
    description: { hi: "तीखा और चटपटा पनीर पिज़्ज़ा देसी मसालों के साथ।", en: "Spicy seasoned paneer with herbs and cheese." },
    category: "special-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 150, medium: 270, large: 350 }
  },
  {
    id: "deluxe-delight-pizza",
    name: { hi: "डीलक्स डिलाइट पिज़्ज़ा", en: "Deluxe Delight Pizza" },
    description: { hi: "प्रीमियम टॉपिंग्स और लिक्विड चीज़ का रिच टेस्ट।", en: "Loaded premium toppings and rich crust." },
    category: "special-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 150, medium: 270, large: 350 }
  },
  {
    id: "supreme-hot-pizza",
    name: { hi: "सुप्रीम हॉट पिज़्ज़ा", en: "Supreme Hot Pizza" },
    description: { hi: "हॉट पेपर्स, चिली फ्लेक्स और सुप्रीम टॉपिंग्स।", en: "Fiery hot spices with special supreme toppings." },
    category: "special-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 170, medium: 300, large: 390 }
  },
  {
    id: "mushroom-spicy-pizza",
    name: { hi: "मशरूम स्पाइसी पिज़्ज़ा", en: "Mushroom Spicy Pizza" },
    description: { hi: "ताज़ा मशरूम और तीखे फ्लेवर्स का चीज़ी कॉम्बिनेशन।", en: "Sliced fresh mushrooms in spicy seasoned herbs." },
    category: "special-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 170, medium: 300, large: 400 }
  },
  {
    id: "veg-supreme-pizza",
    name: { hi: "वेज सुप्रीम पिज़्ज़ा", en: "Veg Supreme Pizza" },
    description: { hi: "पनीर, कॉर्न, शिमला मिर्च, प्याज और ढेर सारा चीज़।", en: "Supreme load of paneer, corn, capsicum & onions." },
    category: "special-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 170, medium: 300, large: 400 }
  },
  {
    id: "paneer-racho-pizza",
    name: { hi: "पनीर रैंचो पिज़्ज़ा", en: "Paneer Rancho Pizza" },
    description: { hi: "स्पेशल रैंच सॉस और स्मोकी पनीर के साथ।", en: "Special zesty rancho sauce and grilled paneer." },
    category: "special-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 170, medium: 300, large: 410 }
  },
  {
    id: "paneer-makhani-pizza",
    name: { hi: "पनीर मखनी पिज़्ज़ा", en: "Paneer Makhani Pizza" },
    description: { hi: "मखमली मखनी ग्रेवी ट्विस्ट और फ्रेश पनीर क्यूब्स।", en: "Rich Indian makhani sauce base with soft paneer." },
    category: "special-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 170, medium: 300, large: 410 }
  },
  {
    id: "crispy-veg-pizza",
    name: { hi: "क्रिस्प वेज पिज़्ज़ा", en: "Crispy Veg Pizza" },
    description: { hi: "क्रंची क्रस्ट और सुपर क्रिस्पी वेजिटेबल डिलाइट।", en: "Crispy crust topped with crunchy fresh veggies." },
    category: "special-pizza",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 170, medium: 300, large: 410 }
  },

  // --- बर्गर ---
  {
    id: "veg-burger",
    name: { hi: "वेज बर्गर", en: "Veg Burger" },
    description: { hi: "कुरकुरी वेज पैटी और क्रीमी मेयोनीज़।", en: "Crispy vegetable patty with mayo and fresh buns." },
    category: "burger",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 40 }
  },
  {
    id: "paneer-burger",
    name: { hi: "पनीर बर्गर", en: "Paneer Burger" },
    description: { hi: "मसालेदार फ्राइड पनीर पैटी और सॉस।", en: "Fresh soft paneer patty with spicy herb spread." },
    category: "burger",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 50 }
  },
  {
    id: "cheese-burger",
    name: { hi: "चीज़ बर्गर", en: "Cheese Burger" },
    description: { hi: "एक्स्ट्रा मेल्टेड चीज़ स्लाइस के साथ।", en: "Loaded with melted cheese slices and veggies." },
    category: "burger",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 60 }
  },
  {
    id: "tandoori-burger",
    name: { hi: "तंदूरी बर्गर", en: "Tandoori Burger" },
    description: { hi: "स्मोकी तंदूरी सॉस और क्रंची लेट्यूस।", en: "Rich smoky tandoori sauce with crisp patty." },
    category: "burger",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 70 }
  },
  {
    id: "special-burger",
    name: { hi: "स्पेशल बर्गर", en: "Special Burger" },
    description: { hi: "डबल पैटी, पनीर और एक्स्ट्रा चीज़ का महा-बर्गर।", en: "Chef special big burger with double stuffing & cheese." },
    category: "burger",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 80 }
  },

  // --- शेक & ड्रिंक्स ---
  {
    id: "strawberry-shake",
    name: { hi: "स्ट्रॉबेरी शेक", en: "Strawberry Shake" },
    description: { hi: "फ्रेश स्ट्रॉबेरी पल्प और वैनिला आइसक्रीम शेक।", en: "Sweet chilled strawberry thick shake." },
    category: "drinks",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 50 }
  },
  {
    id: "chocolate-shake",
    name: { hi: "चॉकलेट शेक", en: "Chocolate Shake" },
    description: { hi: "रिच चॉकलेट सिरप और कोको शेक।", en: "Creamy thick chocolate shake topped with drizzle." },
    category: "drinks",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 60 }
  },
  {
    id: "vanilla-shake",
    name: { hi: "वैनिला शेक", en: "Vanilla Shake" },
    description: { hi: "क्लासिक वैनिला फ्लेवर्ड क्रीमी शेक।", en: "Smooth chilled vanilla milkshake." },
    category: "drinks",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1568651316812-70b92db24c8b?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 60 }
  },
  {
    id: "cold-coffee",
    name: { hi: "कोल्ड कॉफी", en: "Cold Coffee" },
    description: { hi: "गाढ़ी, चिल्ड कैफ़े स्टाइल कोल्ड कॉफ़ी।", en: "Refreshing chilled espresso blended with milk." },
    category: "drinks",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 50 }
  },
  {
    id: "cold-drink",
    name: { hi: "कोल्ड ड्रिंक", en: "Cold Drink" },
    description: { hi: "एकदम ठंडी रिफ्रेशिंग कार्बोनेटेड ड्रिंक।", en: "Chilled bottle of refreshing soft drink." },
    category: "drinks",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 20 }
  },

  // --- मैगी ---
  {
    id: "masala-maggi",
    name: { hi: "मसाला मैगी", en: "Masala Maggi" },
    description: { hi: "देसी स्टाइल स्पाइसी मसाला मैगी।", en: "Classic hot & spicy street-style noodles." },
    category: "maggi",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 40 }
  },
  {
    id: "paneer-maggi",
    name: { hi: "पनीर मैगी", en: "Paneer Maggi" },
    description: { hi: "सब्जियों और पनीर क्यूब्स से भरपूर मैगी।", en: "Noodles packed with sautéed paneer cubes." },
    category: "maggi",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 50 }
  },
  {
    id: "cheese-maggi",
    name: { hi: "चीज़ मैगी", en: "Cheese Maggi" },
    description: { hi: "मेल्टेड मोज़ेरेला चीज़ से लबालब मैगी।", en: "Loaded molten cheese pulled over spicy maggi." },
    category: "maggi",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 60 }
  },
  {
    id: "butter-maggi",
    name: { hi: "बटर मैगी", en: "Butter Maggi" },
    description: { hi: "अमूल बटर के तड़के वाली स्वादिष्ट मैगी।", en: "Cooked with extra rich butter dollop." },
    category: "maggi",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 70 }
  },

  // --- सैंडविच ---
  {
    id: "veg-sandwich",
    name: { hi: "वेज सैंडविच", en: "Veg Sandwich" },
    description: { hi: "ताज़ी सब्जियों और हरी चटनी से तैयार टोस्ट।", en: "Toasted bread with fresh veggies & green mint chutney." },
    category: "sandwich",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 40 }
  },
  {
    id: "paneer-sandwich",
    name: { hi: "पनीर सैंडविच", en: "Paneer Sandwich" },
    description: { hi: "मसालेदार पनीर फिलिंग से भरा ग्रिल्ड सैंडविच।", en: "Grilled sandwich stuffed with seasoned paneer." },
    category: "sandwich",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 50 }
  },
  {
    id: "cheese-sandwich",
    name: { hi: "चीज़ सैंडविच", en: "Cheese Sandwich" },
    description: { hi: "भरपूर चीज़ ग्रिल्ड सैंडविच।", en: "Melted cheese layered toasted treat." },
    category: "sandwich",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 60 }
  },
  {
    id: "tandoori-sandwich",
    name: { hi: "तंदूरी सैंडविच", en: "Tandoori Sandwich" },
    description: { hi: "तंदूरी सॉस और वेजीज़ का क्रंची स्वाद।", en: "Tandoori marinated stuffing grilled hot." },
    category: "sandwich",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 70 }
  },
  {
    id: "tikki-sandwich",
    name: { hi: "टिक्की सैंडविच", en: "Tikki Sandwich" },
    description: { hi: "क्रंची आलू टिक्की स्टफ्ड स्पेशल सैंडविच।", en: "Crunchy spiced potato patty inside toasted sandwich." },
    category: "sandwich",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 80 }
  },

  // --- पास्ता ---
  {
    id: "red-sauce-pasta",
    name: { hi: "रेड सॉस पास्ता", en: "Red Sauce Pasta" },
    description: { hi: "टैंगी टमाटर प्यूरी और इटैलियन हर्ब्स पास्ता।", en: "Penne tossed in tangy spiced red tomato sauce." },
    category: "pasta",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 50 }
  },
  {
    id: "white-sauce-pasta",
    name: { hi: "व्हाइट सॉस पास्ता", en: "White Sauce Pasta" },
    description: { hi: "क्रीमी और चीज़ी सॉस में बना सुपर टेस्टी पास्ता।", en: "Creamy, rich white bechamel sauce penne pasta." },
    category: "pasta",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 60 }
  },
  {
    id: "tandoori-pasta",
    name: { hi: "तंदूरी पास्ता", en: "Tandoori Pasta" },
    description: { hi: "देसी तंदूरी तड़का और चीज़ी पास्ता।", en: "Fusion smoky tandoori sauce tossed pasta." },
    category: "pasta",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 70 }
  },
  {
    id: "makhani-pasta",
    name: { hi: "मखनी पास्ता", en: "Makhani Pasta" },
    description: { hi: "शाही मखनी ग्रेवी ट्विस्ट पास्ता।", en: "Royal creamy makhani herb sauce coated pasta." },
    category: "pasta",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=60",
    prices: { regular: 80 }
  }
];
export interface DeliveryLocation {
  id: string;
  name: { hi: string; en: string };
  fee: number; // डिलीवरी चार्ज
  minOrder: number; // इस गाँव के लिए मिनिमम ऑर्डर
}

export const deliveryLocations: DeliveryLocation[] = [
  { id: "magrayar", name: { hi: "मगरायर (Magrayar)", en: "Magrayar" }, fee: 0, minOrder: 99 },
  { id: "purwa", name: { hi: "पुरवा (Purwa)", en: "Purwa" }, fee: 20, minOrder: 149 },
  { id: "maurawan", name: { hi: "मौरावां (Maurawan)", en: "Maurawan" }, fee: 30, minOrder: 199 },
  { id: "chamiyani", name: { hi: "चमियानी (Chamiyani)", en: "Chamiyani" }, fee: 25, minOrder: 149 },
  { id: "other", name: { hi: "अन्य गाँव / आस-पास (Other)", en: "Other Village" }, fee: 30, minOrder: 149 },
];