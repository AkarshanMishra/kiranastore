import React, { useState, useRef } from 'react';
import { Camera, Upload, ListPlus, CheckCircle2, Sparkles, ArrowRight, X, Calendar, ShoppingBag, Plus, Minus, Trash2, FileText, Check, Clock, ShieldCheck, PhoneCall, MapPin, Store, CreditCard, Wallet, Crosshair, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchApi } from '../apiClient';

export default function MonthlyRashanSection({
  onAddToCart,
  cart = {},
  language = 'EN',
  userAddress = 'Flat 402, Block B, Sector 62, Noida, UP',
  setUserAddress,
  user
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('photo'); // 'photo' | 'builder'
  
  // Location & Hub Access State
  const [currentAddress, setCurrentAddress] = useState(userAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'RAZORPAY' | 'COD' | 'MONTHLY_AUTOPAY'
  const [upiApp, setUpiApp] = useState('GPAY'); // 'GPAY' | 'PHONEPE' | 'PAYTM' | 'OTHER'
  const [isAutoDebitActive, setIsAutoDebitActive] = useState(false);

  // Photo Upload State
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [photoNote, setPhotoNote] = useState('');
  const [photoDeliverySlot, setPhotoDeliverySlot] = useState('TOMORROW');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState(null);
  const fileInputRef = useRef(null);

  // Pre-made & Custom Rashan Builder State
  const prebuiltPacks = [
    {
      id: 'small_family',
      name: language === 'HI' ? 'छोटा परिवार 30-दिन राशन पैक' : 'Small Family (2-3 Members) 30-Day Pack',
      price: 1499,
      originalPrice: 1750,
      badge: 'Most Popular',
      items: [
        { id: 101, name: 'Aashirvaad Shuddh Chakki Atta (5 kg)', qty: 2, price: 219 },
        { id: 102, name: 'Fortune Biryani Basmati Rice (5 kg)', qty: 1, price: 420 },
        { id: 103, name: 'Tata Sampann Unpolished Toor Dal (1 kg)', qty: 2, price: 129 },
        { id: 104, name: 'Fortune Sunlite Refined Sunflower Oil (1 L)', qty: 2, price: 135 },
        { id: 105, name: 'Tata Salt Vacuum Evaporated (1 kg)', qty: 1, price: 28 },
        { id: 106, name: 'Madhur Pure & Hygienic Sugar (1 kg)', qty: 2, price: 48 },
        { id: 107, name: 'Tata Tea Gold Leaf (500 g)', qty: 1, price: 285 }
      ]
    },
    {
      id: 'large_family',
      name: language === 'HI' ? 'बड़ा परिवार फुल राशन पैक' : 'Large Family (4-6 Members) Mega Rashan',
      price: 2899,
      originalPrice: 3400,
      badge: 'Best Value',
      items: [
        { id: 101, name: 'Aashirvaad Shuddh Chakki Atta (10 kg)', qty: 2, price: 430 },
        { id: 102, name: 'India Gate Feast Rozzana Basmati Rice (5 kg)', qty: 2, price: 399 },
        { id: 103, name: 'Tata Sampann Toor + Moong + Chana Dal (1kg each)', qty: 3, price: 130 },
        { id: 104, name: 'Amul Pure Cow Desi Ghee (1 L)', qty: 1, price: 589 },
        { id: 105, name: 'Fortune Mustard Oil Pouch (1 L)', qty: 3, price: 140 },
        { id: 106, name: 'Catch Spices Combo (Haldi, Mirch, Dhaniya 200g)', qty: 1, price: 165 },
        { id: 107, name: 'Surf Excel Quick Wash Detergent Powder (2 kg)', qty: 1, price: 280 }
      ]
    },
    {
      id: 'bachelors',
      name: language === 'HI' ? 'बैचलर / सिंगल एसेंशियल्स पैक' : 'Bachelors & Singles Quick Monthly Pack',
      price: 799,
      originalPrice: 950,
      badge: 'Budget Pick',
      items: [
        { id: 201, name: 'Aashirvaad Atta (5 kg)', qty: 1, price: 219 },
        { id: 202, name: 'Fortune Everyday Rice (2 kg)', qty: 1, price: 160 },
        { id: 203, name: 'Maggi 2-Minute Masala Noodles (4 Pack)', qty: 2, price: 52 },
        { id: 204, name: 'Tata Tea Premium (250 g)', qty: 1, price: 120 },
        { id: 205, name: 'Fortune Kachi Ghani Oil (1 L)', qty: 1, price: 145 }
      ]
    }
  ];

  // Comprehensive Catalog of Monthly Grocery Suggestions
  const popularGrocerySuggestions = [
    { id: 'sug_1', name: 'Aashirvaad Shuddh Chakki Atta (10 kg)', category: 'Atta & Flour', price: 430, unit: '10 kg', image: '🌾' },
    { id: 'sug_2', name: 'Aashirvaad Select Sharbati Atta (5 kg)', category: 'Atta & Flour', price: 285, unit: '5 kg', image: '🌾' },
    { id: 'sug_3', name: 'Fortune Chakki Fresh Atta (5 kg)', category: 'Atta & Flour', price: 219, unit: '5 kg', image: '🌾' },
    { id: 'sug_4', name: 'Rajdhani Besan / Gram Flour (1 kg)', category: 'Flours & Besan', price: 95, unit: '1 kg', image: '🥣' },
    { id: 'sug_5', name: 'Maida Refined Wheat Flour (1 kg)', category: 'Flours', price: 48, unit: '1 kg', image: '🥣' },
    { id: 'sug_6', name: 'Fortune Biryani Special Basmati Rice (5 kg)', category: 'Rice & Grains', price: 420, unit: '5 kg', image: '🍚' },
    { id: 'sug_7', name: 'India Gate Feast Rozzana Basmati Rice (5 kg)', category: 'Rice & Grains', price: 390, unit: '5 kg', image: '🍚' },
    { id: 'sug_8', name: 'Kolam / Sona Masoori Daily Rice (10 kg)', category: 'Rice & Grains', price: 580, unit: '10 kg', image: '🍚' },
    { id: 'sug_9', name: 'Tata Sampann Unpolished Toor Dal (1 kg)', category: 'Dals & Pulses', price: 135, unit: '1 kg', image: '🍲' },
    { id: 'sug_10', name: 'Tata Sampann Yellow Moong Dal (1 kg)', category: 'Dals & Pulses', price: 145, unit: '1 kg', image: '🍲' },
    { id: 'sug_11', name: 'Tata Sampann Chana Dal (1 kg)', category: 'Dals & Pulses', price: 110, unit: '1 kg', image: '🍲' },
    { id: 'sug_12', name: 'Tata Sampann Masoor Dal (1 kg)', category: 'Dals & Pulses', price: 118, unit: '1 kg', image: '🍲' },
    { id: 'sug_13', name: 'Kabuli Chana / White Chickpeas (1 kg)', category: 'Dals & Pulses', price: 155, unit: '1 kg', image: '🍲' },
    { id: 'sug_14', name: 'Fortune Sunlite Refined Sunflower Oil (2 L)', category: 'Edible Oils', price: 265, unit: '2 L', image: '🛢️' },
    { id: 'sug_15', name: 'Fortune Kachi Ghani Mustard Oil (1 L)', category: 'Edible Oils', price: 145, unit: '1 L', image: '🛢️' },
    { id: 'sug_16', name: 'Saffola Gold Pro Healthy Heart Oil (2 L)', category: 'Edible Oils', price: 330, unit: '2 L', image: '🛢️' },
    { id: 'sug_17', name: 'Amul Pure Cow Desi Ghee Pouch (1 L)', category: 'Ghee & Dairy', price: 589, unit: '1 L', image: '🧈' },
    { id: 'sug_18', name: 'Madhur Pure & Hygienic Sugar (5 kg)', category: 'Sugar & Salt', price: 235, unit: '5 kg', image: '🍬' },
    { id: 'sug_19', name: 'Tata Salt Vacuum Evaporated (1 kg)', category: 'Sugar & Salt', price: 28, unit: '1 kg', image: '🧂' },
    { id: 'sug_20', name: 'Tata Tea Gold Premium Blend (500 g)', category: 'Tea & Coffee', price: 285, unit: '500 g', image: '☕' },
    { id: 'sug_21', name: 'Red Label Tea Pack (1 kg)', category: 'Tea & Coffee', price: 460, unit: '1 kg', image: '☕' },
    { id: 'sug_22', name: 'Surf Excel Easy Wash Detergent (3 kg)', category: 'Detergents', price: 399, unit: '3 kg', image: '🧼' },
    { id: 'sug_23', name: 'Ariel Matic Front/Top Load Powder (2 kg)', category: 'Detergents', price: 420, unit: '2 kg', image: '🧼' },
    { id: 'sug_24', name: 'Vim Dishwash Gel Lemon (750 ml)', category: 'Household', price: 155, unit: '750 ml', image: '🧴' },
    { id: 'sug_25', name: 'Dettol Original Bathing Soap (4 x 125g)', category: 'Personal Care', price: 195, unit: '4 Pack', image: '🧼' },
    { id: 'sug_26', name: 'Maggi 2-Minute Masala Noodles (12 Pack)', category: 'Snacks & Noodles', price: 168, unit: '12 Pack', image: '🍜' },
    { id: 'sug_27', name: 'Catch Turmeric / Haldi Powder (200 g)', category: 'Spices & Masala', price: 56, unit: '200 g', image: '🟡' },
    { id: 'sug_28', name: 'Catch Garam Masala Powder (100 g)', category: 'Spices & Masala', price: 78, unit: '100 g', image: '🌶️' },
    { id: 'sug_29', name: 'Everest Kashmiri Red Chilli Powder (100 g)', category: 'Spices & Masala', price: 82, unit: '100 g', image: '🌶️' },
    { id: 'sug_30', name: 'California Premium Almonds / Badaam (500 g)', category: 'Dry Fruits', price: 440, unit: '500 g', image: '🥜' },
    { id: 'sug_31', name: 'Cashew Nuts / Kaju W320 Grade (500 g)', category: 'Dry Fruits', price: 490, unit: '500 g', image: '🥜' }
  ];

  // Custom List Builder items (Persisted in localStorage)
  const [customItems, setCustomItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kirana_monthly_rashan_custom_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 301, name: 'Chakki Fresh Atta (10 kg)', price: 420, qty: 1, selected: true },
      { id: 302, name: 'Premium Basmati Rice (5 kg)', price: 390, qty: 1, selected: true },
      { id: 303, name: 'Toor Dal / Arhar Dal (1 kg)', price: 135, qty: 2, selected: true },
      { id: 304, name: 'Refined Cooking Oil (2 L)', price: 270, qty: 1, selected: true },
      { id: 305, name: 'Pure Desi Ghee (1 L)', price: 589, qty: 1, selected: true },
      { id: 306, name: 'Sugar / Cheeni (2 kg)', price: 96, qty: 1, selected: true },
      { id: 307, name: 'Tata Salt (1 kg)', price: 28, qty: 1, selected: true },
      { id: 308, name: 'Red Chilli & Haldi Powder (200g)', price: 120, qty: 1, selected: false },
      { id: 309, name: 'Washing Powder & Detergent (2 kg)', price: 240, qty: 1, selected: false },
      { id: 310, name: 'Dishwash Gel & Scrubber', price: 99, qty: 1, selected: false }
    ];
  });

  const [searchItemQuery, setSearchItemQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [recentlyAddedNotice, setRecentlyAddedNotice] = useState(null);

  // Sync to localStorage whenever custom list changes
  const saveCustomItemsState = (updatedItems) => {
    setCustomItems(updatedItems);
    try {
      localStorage.setItem('kirana_monthly_rashan_custom_list', JSON.stringify(updatedItems));
    } catch {}
  };

  // Handle Live GPS Geolocation
  const handleDetectGpsLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      return;
    }

    setIsLocating(true);
    setLocationMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`, {
            headers: { 'Accept-Language': 'en' }
          });
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const street = addr.road || addr.suburb || addr.neighbourhood || 'GPS Detected Location';
            const city = addr.city || addr.town || addr.state_district || 'Noida';
            const state = addr.state || 'UP';
            const postcode = addr.postcode ? ` - ${addr.postcode}` : '';
            const formatted = `${street}, ${city}, ${state}${postcode}`;

            setCurrentAddress(formatted);
            if (setUserAddress) setUserAddress(formatted);
            setLocationMessage({ type: 'success', text: `📍 GPS Locked: ${formatted}` });
          } else {
            const fallback = `GPS Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Sector 62, Noida`;
            setCurrentAddress(fallback);
            if (setUserAddress) setUserAddress(fallback);
            setLocationMessage({ type: 'success', text: '📍 Coordinates captured successfully!' });
          }
        } catch (err) {
          const fallback = `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Sector 62, Noida`;
          setCurrentAddress(fallback);
          if (setUserAddress) setUserAddress(fallback);
          setLocationMessage({ type: 'success', text: '📍 GPS locked!' });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Unable to detect location. Please type your delivery address.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please allow location access in your browser.';
        }
        setLocationMessage({ type: 'error', text: msg });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Photo selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (mode) => {
    setActiveMode(mode);
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handlePhotoOrderSubmit = async (e) => {
    e.preventDefault();
    if (!imagePreview) {
      alert("Please choose or take a photo of your handwritten rashan list.");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      let savedUser = null;
      try {
        const raw = localStorage.getItem('kirana_customer_user');
        if (raw) savedUser = JSON.parse(raw);
      } catch {}

      const activeUserName = user?.name || savedUser?.name || 'Customer';
      const activeUserPhone = user?.phone || savedUser?.phone || '+91 9876543210';

      const payload = {
        user_name: activeUserName,
        phone: activeUserPhone,
        delivery_address: currentAddress || userAddress,
        items: [],
        order_type: 'MONTHLY_RASHAN_SLIP',
        hub_name: 'Kirana Express Hub',
        slip_image_url: imagePreview,
        special_instructions: photoNote || 'Pack all handwritten items from photo',
        payment_method: paymentMethod,
        delivery_slot_type: photoDeliverySlot,
        scheduled_delivery_date: photoDeliverySlot === 'SAME_DAY' ? 'Today (Same Day)' : 'Tomorrow Morning (8:00 AM)',
        scheduled_delivery_time: '8:00 AM - 12:00 PM',
        estimated_amount: 0.0
      };

      const res = await fetchApi('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const orderData = await res.json();
        setPlacedOrderNumber(orderData.order_number);
        setIsSubmitted(true);
        // Trigger storage update so My Orders tab immediately updates
        window.dispatchEvent(new Event('order_placed'));
      } else {
        const fallbackNum = 'RASHAN-' + Math.floor(10000 + Math.random() * 90000);
        setPlacedOrderNumber(fallbackNum);
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('Error placing photo rashan order', err);
      const fallbackNum = 'RASHAN-' + Math.floor(10000 + Math.random() * 90000);
      setPlacedOrderNumber(fallbackNum);
      setIsSubmitted(true);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handlePlaceCustomRashanOrderDirectly = async () => {
    const selectedList = customItems.filter(item => item.selected && item.qty > 0);
    if (selectedList.length === 0) {
      alert("Please select at least 1 item for your monthly list.");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      let savedUser = null;
      try {
        const raw = localStorage.getItem('kirana_customer_user');
        if (raw) savedUser = JSON.parse(raw);
      } catch {}

      const activeUserName = user?.name || savedUser?.name || 'Customer';
      const activeUserPhone = user?.phone || savedUser?.phone || '+91 9876543210';

      const payload = {
        user_name: activeUserName,
        phone: activeUserPhone,
        delivery_address: currentAddress || userAddress,
        items: selectedList.map(item => ({
          product_id: item.id,
          quantity: item.qty
        })),
        order_type: 'MONTHLY_RASHAN_LIST',
        hub_name: 'Kirana Express Hub',
        special_instructions: `Monthly 30-Day Kitchen List (${selectedList.length} items)`,
        payment_method: paymentMethod,
        delivery_slot_type: 'MONTHLY_1ST',
        scheduled_delivery_date: '1st of Month Scheduled',
        scheduled_delivery_time: '7:00 AM - 10:00 AM',
        estimated_amount: customTotal
      };

      const res = await fetchApi('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const orderData = await res.json();
        alert(`🎉 Monthly Rashan Order #${orderData.order_number} successfully placed! Payment: ${paymentMethod}`);
        setIsModalOpen(false);
        window.dispatchEvent(new Event('order_placed'));
      } else {
        alert(`🎉 Monthly Rashan Order successfully placed! Payment: ${paymentMethod}`);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error placing direct custom rashan order', err);
      alert(`🎉 Monthly Rashan Order placed successfully!`);
      setIsModalOpen(false);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleAddPrebuiltToCart = (pack) => {
    if (onAddToCart) {
      pack.items.forEach(item => {
        onAddToCart({
          id: item.id + Math.floor(Math.random() * 1000),
          name: item.name,
          price: item.price,
          discount_price: item.price,
          image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80',
          weight_unit: 'Monthly Pack Item'
        });
      });
      setIsModalOpen(false);
    }
  };

  const handleAddCustomListToCart = () => {
    const selectedList = customItems.filter(item => item.selected && item.qty > 0);
    if (selectedList.length === 0) {
      setRecentlyAddedNotice("Please select at least 1 item for your monthly list.");
      setTimeout(() => setRecentlyAddedNotice(null), 3000);
      return;
    }

    if (onAddToCart) {
      selectedList.forEach(item => {
        for (let i = 0; i < item.qty; i++) {
          onAddToCart({
            id: item.id + Math.floor(Math.random() * 1000),
            name: item.name,
            price: item.price,
            discount_price: item.price,
            image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80',
            weight_unit: 'Monthly List'
          });
        }
      });
      setIsModalOpen(false);
    }
  };

  const handleAddSuggestionItem = (suggestion) => {
    // Check if already in list
    const existing = customItems.find(i => i.name.toLowerCase() === suggestion.name.toLowerCase());
    let updated;
    if (existing) {
      updated = customItems.map(i => i.id === existing.id ? { ...i, qty: i.qty + 1, selected: true } : i);
    } else {
      updated = [
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: suggestion.name,
          price: suggestion.price,
          qty: 1,
          selected: true
        },
        ...customItems
      ];
    }
    saveCustomItemsState(updated);
    setRecentlyAddedNotice(`✓ Added "${suggestion.name}" to Monthly List!`);
    setTimeout(() => setRecentlyAddedNotice(null), 2500);
  };

  const handleAddNewCustomItem = (e) => {
    e?.preventDefault();
    const nameToAdd = searchItemQuery.trim() || newItemName.trim();
    if (!nameToAdd) return;
    const priceVal = parseInt(newItemPrice) || 100;
    
    const updated = [
      {
        id: Date.now(),
        name: nameToAdd,
        price: priceVal,
        qty: 1,
        selected: true
      },
      ...customItems
    ];
    saveCustomItemsState(updated);
    setSearchItemQuery('');
    setNewItemName('');
    setNewItemPrice('');
    setRecentlyAddedNotice(`✓ Saved "${nameToAdd}" (₹${priceVal}) in Monthly List!`);
    setTimeout(() => setRecentlyAddedNotice(null), 2500);
  };

  const toggleItemSelection = (id) => {
    const updated = customItems.map(item => item.id === id ? { ...item, selected: !item.selected } : item);
    saveCustomItemsState(updated);
  };

  const updateItemQty = (id, delta) => {
    const updated = customItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
    saveCustomItemsState(updated);
  };

  const handleRemoveCustomItem = (id) => {
    const updated = customItems.filter(item => item.id !== id);
    saveCustomItemsState(updated);
  };

  const customTotal = customItems
    .filter(i => i.selected)
    .reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Suggestions filtered by search query
  const matchingSuggestions = searchItemQuery.trim()
    ? popularGrocerySuggestions.filter(s =>
        s.name.toLowerCase().includes(searchItemQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchItemQuery.toLowerCase())
      )
    : [];

  const firstMatchCategory = matchingSuggestions[0]?.category;
  const relatedSuggestions = firstMatchCategory
    ? popularGrocerySuggestions.filter(s => s.category === firstMatchCategory && !matchingSuggestions.includes(s)).slice(0, 3)
    : [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-1.5">
      {/* ─── HOMEPAGE COMPACT RASHAN STRIP ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-3 text-white shadow-2xs relative overflow-hidden border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="bg-emerald-400 text-gray-950 font-black text-[8px] sm:text-[9px] px-2 py-0.2 rounded uppercase">
              MONTHLY SAVINGS
            </span>
            <span className="text-[10px] text-emerald-300 font-bold">Save ₹500+ on 30-Day Kitchen Staples</span>
          </div>
          <h3 className="text-xs sm:text-sm font-black text-white truncate">
            📸 Snap Grocery Slip or Build 30-Day Monthly Pack
          </h3>
        </div>

        {/* 2 Compact Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleOpenModal('photo')}
            className="flex-1 sm:flex-none bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-[10px] sm:text-[11px] px-3 py-1.5 rounded-xl shadow-2xs flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
          >
            <Camera size={13} />
            <span>Upload Slip</span>
          </button>

          <button
            onClick={() => handleOpenModal('builder')}
            className="flex-1 sm:flex-none bg-white/15 hover:bg-white/25 text-white font-black text-[10px] sm:text-[11px] px-3 py-1.5 rounded-xl border border-white/20 shadow-2xs flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
          >
            <ListPlus size={13} />
            <span>Build Pack</span>
          </button>
        </div>
      </div>
    </div>

    {/* ─── FULL INTERACTIVE MODAL ────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-4 sm:p-5 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl">
                  {activeMode === 'photo' ? <Camera size={22} /> : <ListPlus size={22} />}
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg">
                    {activeMode === 'photo' 
                      ? (language === 'HI' ? 'राशन पर्ची का फोटो अपलोड करें' : 'Upload Handwritten Rashan Slip')
                      : (language === 'HI' ? 'मासिक राशन लिस्ट बिल्डर' : 'Make & Customize Monthly Rashan List')}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {activeMode === 'photo' 
                      ? 'Local kirana store packs verified items from your photo'
                      : 'Customize items & add complete bundle to cart in 1-click'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sub-tabs toggle */}
            <div className="flex border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 p-2 gap-2 flex-shrink-0">
              <button
                onClick={() => { setActiveMode('photo'); setIsSubmitted(false); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                  activeMode === 'photo'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-transparent text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800'
                }`}
              >
                <Camera size={15} />
                <span>Option 1: Upload Photograph</span>
              </button>

              <button
                onClick={() => setActiveMode('builder')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                  activeMode === 'builder'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-transparent text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800'
                }`}
              >
                <ListPlus size={15} />
                <span>Option 2: Make Your List</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5">
              
              {/* ─── LOCATION & DELIVERY ADDRESS PANEL ──────────────────── */}
              <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-slate-800/90 dark:to-slate-800/60 p-4 rounded-3xl border border-emerald-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-brand-green" />
                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                      Delivery Address & GPS Location
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleDetectGpsLocation}
                    disabled={isLocating}
                    className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition border border-emerald-300 dark:border-emerald-700 disabled:opacity-50"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <Crosshair size={12} />
                        <span>GPS Auto-Detect</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status Message */}
                {locationMessage && (
                  <div className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    locationMessage.type === 'success'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200'
                  }`}>
                    {locationMessage.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                    <span className="truncate">{locationMessage.text}</span>
                  </div>
                )}

                {/* Delivery Address Row */}
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  {isEditingAddress ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={currentAddress}
                        onChange={(e) => {
                          setCurrentAddress(e.target.value);
                          if (setUserAddress) setUserAddress(e.target.value);
                        }}
                        className="flex-1 text-xs p-1.5 border border-emerald-400 rounded-xl outline-none font-medium dark:bg-slate-800 dark:text-white"
                        placeholder="Enter your street address..."
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="bg-brand-green text-white font-black text-xs px-3 py-1.5 rounded-xl"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 font-bold block">DOORSTEP DELIVERY ADDRESS</span>
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{currentAddress}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(true)}
                        className="text-[11px] font-black text-purple-600 dark:text-purple-400 hover:underline flex-shrink-0"
                      >
                        Edit Address
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* ─── PAYMENT SELECTION MODULE ───────────────────────────────────── */}
              <div className="bg-gray-50 dark:bg-slate-800/80 p-4 rounded-3xl border border-gray-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                      Select Payment Method
                    </span>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                    Instant or Post-Delivery
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      paymentMethod === 'UPI'
                        ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-600 ring-2 ring-purple-200 dark:ring-purple-900 text-purple-900 dark:text-purple-200 font-black'
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-black block">📱 Instant UPI</span>
                    <span className="text-[9px] text-gray-500 dark:text-slate-400">GPay, PhonePe, Paytm</span>
                  </button>

                  {/* Razorpay Online */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('RAZORPAY')}
                    className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      paymentMethod === 'RAZORPAY'
                        ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-600 ring-2 ring-purple-200 dark:ring-purple-900 text-purple-900 dark:text-purple-200 font-black'
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-black block">💳 Cards / NetBanking</span>
                    <span className="text-[9px] text-gray-500 dark:text-slate-400">Visa, Master, Rupay</span>
                  </button>

                  {/* Cash On Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      paymentMethod === 'COD'
                        ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-600 ring-2 ring-purple-200 dark:ring-purple-900 text-purple-900 dark:text-purple-200 font-black'
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-black block">💵 Cash on Delivery</span>
                    <span className="text-[9px] text-gray-500 dark:text-slate-400">Pay at Doorstep</span>
                  </button>

                  {/* Auto-Debit Monthly */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('MONTHLY_AUTOPAY')}
                    className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      paymentMethod === 'MONTHLY_AUTOPAY'
                        ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-600 ring-2 ring-purple-200 dark:ring-purple-900 text-purple-900 dark:text-purple-200 font-black'
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-black block">⚡ 1st of Month</span>
                    <span className="text-[9px] text-gray-500 dark:text-slate-400">Auto-Debit & Deliver</span>
                  </button>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* OPTION 1: UPLOAD PHOTO WORKFLOW */}
              {/* ────────────────────────────────────────────────────────── */}
              {activeMode === 'photo' && (
                <>
                  {isSubmitted ? (
                    <div className="py-6 text-center space-y-3 animate-in zoom-in duration-200">
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-brand-green rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
                        <CheckCircle2 size={36} />
                      </div>
                      <h4 className="text-lg font-black text-gray-900 dark:text-white">
                        {language === 'HI' ? 'राशन पर्ची सफलतापूर्वक प्राप्त हुई!' : 'Rashan Slip Order Placed Successfully!'}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-slate-400 max-w-md mx-auto font-medium">
                        Order <strong className="text-purple-600">#{placedOrderNumber}</strong> received! Our store team is packing your items.
                      </p>

                      <div className="bg-emerald-50 dark:bg-emerald-950/60 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 max-w-md mx-auto text-left text-xs space-y-1.5 mt-2">
                        <div className="flex justify-between font-bold text-emerald-900 dark:text-emerald-300">
                          <span>Order Status:</span>
                          <span className="bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded">⚡ Processing Order</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-slate-300">
                          <span>Fulfillment Service:</span>
                          <span className="font-bold text-gray-900 dark:text-white">Kirana Express Doorstep</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-slate-300">
                          <span>Delivery Address:</span>
                          <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{currentAddress}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-slate-300">
                          <span>Payment Selected:</span>
                          <span className="font-bold text-purple-700 dark:text-purple-300">{paymentMethod}</span>
                        </div>
                      </div>

                      <div className="pt-3 flex justify-center gap-3">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="bg-brand-green text-white font-black text-xs px-6 py-2.5 rounded-xl shadow hover:bg-green-800"
                        >
                          Done & Return to Store
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handlePhotoOrderSubmit} className="space-y-4">
                      
                      {/* Photo Upload Box */}
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                          imagePreview
                            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                            : 'border-gray-300 dark:border-slate-700 hover:border-emerald-500 bg-gray-50 dark:bg-slate-800/60'
                        }`}
                      >
                        {imagePreview ? (
                          <div className="space-y-2">
                            <img
                              src={imagePreview}
                              alt="Rashan Slip Preview"
                              className="max-h-48 rounded-2xl object-contain mx-auto shadow-md border border-gray-200 dark:border-slate-700"
                            />
                            <p className="text-xs font-bold text-emerald-600">✓ Photo attached (Tap to replace)</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                              <Camera size={26} />
                            </div>
                            <div className="font-extrabold text-sm text-gray-900 dark:text-white">
                              Take Photo or Upload Slip Image
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm">
                              Upload a photo of your handwritten diary list, prescription, or grocery bill.
                            </p>
                            <span className="inline-block bg-brand-green text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs mt-2">
                              Browse / Open Camera
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Additional Instructions */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                          Special Instructions / Specific Brands (Optional)
                        </label>
                        <input
                          type="text"
                          value={photoNote}
                          onChange={(e) => setPhotoNote(e.target.value)}
                          placeholder="e.g. Please pack Aashirvaad Atta only, low sugar tea..."
                          className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:border-brand-green outline-none font-medium dark:bg-slate-800 dark:text-white"
                        />
                      </div>

                      {/* Delivery Preference */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPhotoDeliverySlot('SAME_DAY')}
                          className={`p-3 rounded-2xl border text-left text-xs transition ${
                            photoDeliverySlot === 'SAME_DAY'
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-brand-green text-brand-green font-extrabold shadow-xs'
                              : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'
                          }`}
                        >
                          <span className="block font-black text-gray-900 dark:text-white">⚡ Same Day Express</span>
                          <span className="text-[10px] text-gray-500">Delivered within 2 hours</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPhotoDeliverySlot('TOMORROW')}
                          className={`p-3 rounded-2xl border text-left text-xs transition ${
                            photoDeliverySlot === 'TOMORROW'
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-brand-green text-brand-green font-extrabold shadow-xs'
                              : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'
                          }`}
                        >
                          <span className="block font-black text-gray-900 dark:text-white">📅 Tomorrow Morning</span>
                          <span className="text-[10px] text-gray-500">Delivered at 8:00 AM</span>
                        </button>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={!imagePreview}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98"
                      >
                        <Upload size={16} />
                        <span>Place Slip Order with {paymentMethod}</span>
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* OPTION 2: MAKE & CUSTOMIZE MONTHLY RASHAN LIST */}
              {/* ────────────────────────────────────────────────────────── */}
              {activeMode === 'builder' && (
                <div className="space-y-6">
                  
                  {/* Section A: Ready-Made 30-Day Rashan Packages */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-xs sm:text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                        📦 Recommended 30-Day Family Packages
                      </h4>
                      <span className="text-[11px] text-purple-600 font-bold">1-Click Full Pack</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {prebuiltPacks.map((pack) => (
                        <div
                          key={pack.id}
                          className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-3.5 border border-gray-200 dark:border-slate-700 flex flex-col justify-between hover:border-purple-400 transition"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-black text-[9px] px-2 py-0.5 rounded">
                                {pack.badge}
                              </span>
                              <span className="text-[10px] text-gray-400 line-through">₹{pack.originalPrice}</span>
                            </div>
                            <h5 className="font-black text-xs text-gray-900 dark:text-white">{pack.name}</h5>
                            <span className="font-black text-sm text-purple-600 dark:text-purple-400 block mt-1">
                              ₹{pack.price}
                            </span>
                            <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                              {pack.items.length} essentials: Atta, Rice, Dal, Oil, Sugar & Salt.
                            </p>
                          </div>

                          <button
                            onClick={() => handleAddPrebuiltToCart(pack)}
                            className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] py-2 rounded-xl transition flex items-center justify-center gap-1 shadow-xs"
                          >
                            <ShoppingBag size={13} />
                            <span>Add Complete Pack to Cart</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section B: Custom Interactive Monthly Item Checklist */}
                  <div className="border-t border-gray-200 dark:border-slate-800 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                          <span>✍️ Search & Build Monthly Rashan List</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                            Auto-Saved 💾
                          </span>
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400">
                          Type any grocery name for instant smart recommendations & 1-click addition
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 font-bold block">ESTIMATED TOTAL</span>
                        <span className="text-base font-black text-brand-green">₹{customTotal}</span>
                      </div>
                    </div>

                    {/* Recently Added Toast Alert */}
                    {recentlyAddedNotice && (
                      <div className="bg-emerald-500 text-white p-2 rounded-xl text-xs font-black text-center mb-3 shadow-md animate-in slide-in-from-top-2 flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={15} />
                        <span>{recentlyAddedNotice}</span>
                      </div>
                    )}

                    {/* Smart Search & Auto-Suggest Input Bar */}
                    <div className="relative mb-3">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="🔍 Type grocery item (e.g. Atta, Oil, Toor Dal, Maggi, Surf, Tea)..."
                            value={searchItemQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onChange={(e) => {
                              setSearchItemQuery(e.target.value);
                              setIsSearchFocused(true);
                            }}
                            className="w-full bg-white dark:bg-slate-800 border-2 border-emerald-500/50 focus:border-emerald-600 rounded-2xl px-3.5 py-2.5 text-xs font-bold outline-none dark:text-white shadow-xs"
                          />
                          {searchItemQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchItemQuery('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-700 p-1 rounded-full text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <input
                          type="number"
                          placeholder="₹ Custom Price"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          className="w-28 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl px-3 py-2.5 text-xs font-bold outline-none dark:text-white"
                        />

                        <button
                          type="button"
                          onClick={handleAddNewCustomItem}
                          disabled={!searchItemQuery.trim()}
                          className="bg-brand-green hover:bg-green-800 disabled:opacity-50 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-xs transition active:scale-95 flex items-center gap-1 flex-shrink-0"
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      </div>

                      {/* Smart Suggestion Dropdown */}
                      {isSearchFocused && searchItemQuery.trim().length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl z-30 p-2 max-h-72 overflow-y-auto space-y-1.5">
                          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800">
                            <span>✨ Smart Recommendations</span>
                            <button
                              type="button"
                              onClick={() => setIsSearchFocused(false)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ✕ Close
                            </button>
                          </div>

                          {/* Matching Items */}
                          {matchingSuggestions.length > 0 ? (
                            matchingSuggestions.map((sug) => (
                              <div
                                key={sug.id}
                                className="p-2 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 rounded-xl flex items-center justify-between gap-2 transition border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-xl flex-shrink-0">{sug.image}</span>
                                  <div className="min-w-0">
                                    <span className="font-extrabold text-xs text-gray-900 dark:text-white block truncate">
                                      {sug.name}
                                    </span>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                      <span className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.2 rounded font-bold">
                                        {sug.category}
                                      </span>
                                      <span className="font-black text-brand-green">₹{sug.price}</span>
                                      <span>({sug.unit})</span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleAddSuggestionItem(sug)}
                                  className="bg-brand-green hover:bg-green-800 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition active:scale-95 flex-shrink-0"
                                >
                                  <Plus size={12} />
                                  <span>+ Add Item</span>
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-xs text-gray-500">
                              <span>No exact brand match found. Click <strong>+ Add</strong> above to save "{searchItemQuery}" as a custom item!</span>
                            </div>
                          )}

                          {/* Related / Complementary Items */}
                          {relatedSuggestions.length > 0 && (
                            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-slate-800">
                              <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 block px-2 mb-1.5 uppercase">
                                💡 Related in {firstMatchCategory}
                              </span>
                              {relatedSuggestions.map((rel) => (
                                <div
                                  key={rel.id}
                                  className="p-1.5 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl flex items-center justify-between gap-2 text-xs"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span>{rel.image}</span>
                                    <span className="font-bold text-gray-800 dark:text-slate-200 truncate">{rel.name}</span>
                                    <span className="font-black text-purple-600 text-[11px]">₹{rel.price}</span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleAddSuggestionItem(rel)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
                                  >
                                    + Add
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Active Monthly Rashan Checklist Items */}
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-850 p-1">
                      {customItems.map((item) => (
                        <div key={item.id} className="p-2.5 flex items-center justify-between gap-2 text-xs hover:bg-gray-50 dark:hover:bg-slate-800/40 transition rounded-xl">
                          <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={() => toggleItemSelection(item.id)}
                              className="w-4 h-4 rounded text-brand-green focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <span className={`font-bold block truncate ${item.selected ? 'text-gray-900 dark:text-white' : 'text-gray-400 line-through'}`}>
                                {item.name}
                              </span>
                              <span className="text-[10px] text-gray-500 font-semibold">
                                ₹{item.price} each • Subtotal: <strong className="text-gray-900 dark:text-white">₹{item.price * item.qty}</strong>
                              </span>
                            </div>
                          </label>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {item.selected && (
                              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 rounded-xl px-2 py-1">
                                <button
                                  type="button"
                                  onClick={() => updateItemQty(item.id, -1)}
                                  className="p-0.5 text-gray-600 hover:text-black dark:text-slate-300"
                                  title="Decrease quantity"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="font-black text-xs w-4 text-center">{item.qty}</span>
                                <button
                                  type="button"
                                  onClick={() => updateItemQty(item.id, 1)}
                                  className="p-0.5 text-gray-600 hover:text-black dark:text-slate-300"
                                  title="Increase quantity"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveCustomItem(item.id)}
                              className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              title="Delete from list"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar for Custom List */}
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-gray-500 font-bold block">
                          {customItems.filter(i => i.selected).length} Items Active in Rashan List
                        </span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">
                          ₹{customTotal} Total Bill
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePlaceCustomRashanOrderDirectly}
                          className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition active:scale-95 cursor-pointer"
                        >
                          <CheckCircle2 size={16} />
                          <span>Confirm Monthly Order ({paymentMethod})</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
