import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, MapPin, Tag, Heart, ArrowRight, ShieldCheck, Sparkles, BellOff, DoorOpen, Calendar, Clock, Wallet, Gift, CreditCard, Navigation, Edit2, Check, CheckCircle2, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import RazorpayModal from './RazorpayModal';
import { fetchApi } from '../apiClient';
import { showToast } from './Toast';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  userAddress,
  setUserAddress,
  user,
  onPlaceOrder
}) {
  // Lock background body scroll when Cart Drawer is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);
  const [tipAmount, setTipAmount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // 'RAZORPAY' | 'UPI' | 'WALLET' | 'COD'
  const [deliveryInstruction, setDeliveryInstruction] = useState('DOORSTEP');
  const [deliverySlot, setDeliverySlot] = useState('INSTANT');
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  // Address Modification & Location Detection States
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [customAddressInput, setCustomAddressInput] = useState(userAddress || 'Flat 402, Block B, Sector 62, Noida');
  const [addressTag, setAddressTag] = useState('Home');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatusMsg, setLocationStatusMsg] = useState(null);

  // Impulse Add Recommendations (1-Click Essentials)
  const impulseItems = [
    { id: 101, name: 'Amul Taaza Milk', weight_unit: '500 ml', price: 27, discount_price: 26, image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&q=80' },
    { id: 102, name: 'Fresh Malai Paneer', weight_unit: '200 g', price: 95, discount_price: 89, image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=150&q=80' },
    { id: 104, name: 'Farm Brown Eggs', weight_unit: '6 pcs', price: 68, discount_price: 62, image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=150&q=80' },
    { id: 105, name: 'Amul Salted Butter', weight_unit: '100 g', price: 60, discount_price: 58, image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=150&q=80' },
    { id: 106, name: 'Maggi 2-Min Noodles', weight_unit: '70 g', price: 15, discount_price: 14, image_url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=150&q=80' },
    { id: 107, name: 'Coca-Cola Soft Drink', weight_unit: '300 ml', price: 40, discount_price: 38, image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&q=80' }
  ];

  if (!isOpen) return null;

  const items = Object.values(cart);
  const itemTotal = items.reduce((sum, item) => {
    const price = item.discount_price || item.price;
    return sum + (price * item.quantity);
  }, 0);

  const totalOriginalTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemSavings = totalOriginalTotal - itemTotal;

  const pointsDiscount = redeemPoints ? 10 : 0;
  const deliveryFee = itemTotal >= 500 ? 0 : 15;
  const handlingFee = 2;
  const grandTotal = Math.max(0, itemTotal + deliveryFee + handlingFee + tipAmount - appliedDiscount - pointsDiscount);

  // Live Geolocation Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatusMsg({ type: 'error', text: 'Geolocation not supported by your device browser.' });
      return;
    }

    setIsLocating(true);
    setLocationStatusMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`, {
            headers: { 'Accept-Language': 'en' }
          });
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const street = addr.road || addr.suburb || addr.neighbourhood || addr.residential || 'GPS Street';
            const city = addr.city || addr.town || addr.state_district || 'Noida';
            const postcode = addr.postcode ? ` - ${addr.postcode}` : '';
            const state = addr.state || 'UP';
            const detected = `${street}, ${city}, ${state}${postcode}`;

            setCustomAddressInput(detected);
            if (setUserAddress) setUserAddress(detected);
            setLocationStatusMsg({ type: 'success', text: `✓ Live GPS locked: ${street}, ${city}` });
          } else {
            const fallback = `GPS Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Sector 62, Noida`;
            setCustomAddressInput(fallback);
            if (setUserAddress) setUserAddress(fallback);
            setLocationStatusMsg({ type: 'success', text: '✓ GPS Coordinates captured successfully!' });
          }
        } catch (err) {
          const fallback = `GPS Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Sector 62, Noida`;
          setCustomAddressInput(fallback);
          if (setUserAddress) setUserAddress(fallback);
          setLocationStatusMsg({ type: 'success', text: '✓ Live GPS Location detected!' });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationStatusMsg({ type: 'error', text: 'Location permission denied. Please enter address manually.' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveAddress = (e) => {
    e?.preventDefault();
    if (customAddressInput.trim()) {
      if (setUserAddress) setUserAddress(customAddressInput.trim());
      setIsEditingAddress(false);
      setLocationStatusMsg({ type: 'success', text: '✓ Delivery address updated for checkout!' });
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'WELCOME100') {
      if (itemTotal < 499) {
        setCouponError('WELCOME100 requires minimum order value of ₹499');
        return;
      }
      setAppliedDiscount(100);
      setCouponSuccess('WELCOME100 applied! Saved ₹100 Flat');
    } else if (code === 'ZEPTO20') {
      const discount = Math.min(80, Math.round(itemTotal * 0.2));
      setAppliedDiscount(discount);
      setCouponSuccess(`ZEPTO20 applied! 20% OFF — Saved ₹${discount}`);
    } else if (code === 'FREESHIP') {
      setAppliedDiscount(15);
      setCouponSuccess('FREESHIP applied! Free Delivery');
    } else {
      setCouponError('Invalid coupon code.');
    }
  };

  const executeOrderCreation = async (razorpayData = null) => {
    setIsSubmitting(true);
    try {
      let savedUser = null;
      try {
        const raw = localStorage.getItem('kirana_customer_user');
        if (raw) savedUser = JSON.parse(raw);
      } catch {}

      const activeUserName = user?.name || savedUser?.name || 'Customer';
      const activeUserPhone = user?.phone || savedUser?.phone || '+91 9876543210';
      const activeUserAddress = customAddressInput || userAddress || user?.address || savedUser?.address || 'Sector 62, Noida';

      const payload = {
        user_name: activeUserName,
        phone: activeUserPhone,
        delivery_address: activeUserAddress,
        payment_method: paymentMethod === 'RAZORPAY' || paymentMethod === 'UPI' ? 'RAZORPAY_TEST' : paymentMethod,
        delivery_slot_type: deliverySlot === 'NEXT_DAY' ? 'NEXT_DAY' : 'SAME_DAY',
        tip: tipAmount,
        discount: appliedDiscount + pointsDiscount,
        special_instructions: razorpayData ? `Paid via Razorpay Test Gateway (${razorpayData.razorpay_payment_id})` : undefined,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const res = await fetchApi('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(`Checkout error: ${errData.detail || 'Failed to place order'}`);
        setIsSubmitting(false);
        return;
      }

      const orderData = await res.json();
      clearCart();
      onClose();
      onPlaceOrder(orderData);
    } catch (err) {
      alert(`Network error placing order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckoutSubmit = () => {
    if (items.length === 0) return;

    if (paymentMethod === 'RAZORPAY' || paymentMethod === 'UPI') {
      setIsRazorpayOpen(true);
    } else {
      executeOrderCreation();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
      <div className="bg-gray-50 dark:bg-slate-900 dark:text-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="bg-brand-yellow text-gray-900 p-2 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white">My Checkout Cart</h2>
              <span className="text-xs text-gray-500 dark:text-slate-400 font-bold">
                {items.length} {items.length === 1 ? 'Item' : 'Items'} • Lightning 10-Min Delivery
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
              🛒
            </div>
            <h3 className="font-extrabold text-gray-800 dark:text-slate-200 text-base">Your cart is empty</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 mb-6">Explore our fresh groceries and daily essentials with express delivery.</p>
            <button
              onClick={onClose}
              className="bg-brand-green hover:bg-green-800 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-md transition active:scale-95 cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Razorpay Test Mode Badge */}
              <div className="bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                    RAZORPAY TEST GATEWAY
                  </span>
                  <span className="font-bold text-blue-900 dark:text-blue-200">Test Payments Active</span>
                </div>
                <ShieldCheck size={16} className="text-blue-600" />
              </div>

              {/* Delivery Address Pill */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-gray-200 dark:border-slate-700 shadow-sm space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="bg-emerald-50 dark:bg-emerald-950 p-2 rounded-xl text-brand-green flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="text-xs min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-gray-900 dark:text-white">Delivering to ({addressTag})</span>
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                          10 MINS
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-slate-300 line-clamp-2 font-medium mt-0.5">
                        {customAddressInput || userAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-700 px-2.5 py-1 rounded-xl flex items-center gap-1 active:scale-95 transition cursor-pointer"
                      title="Auto-detect Live GPS location"
                    >
                      <Navigation size={11} className={isLocating ? 'animate-spin text-emerald-600' : 'text-emerald-600'} />
                      <span>{isLocating ? 'Locating...' : 'GPS Detect'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 px-2.5 py-1 rounded-xl flex items-center gap-1 active:scale-95 transition cursor-pointer"
                    >
                      <Edit2 size={11} />
                      <span>{isEditingAddress ? 'Close' : 'Change'}</span>
                    </button>
                  </div>
                </div>

                {locationStatusMsg && (
                  <div className={`text-[11px] font-bold p-2 rounded-xl flex items-center gap-1.5 ${
                    locationStatusMsg.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200'
                  }`}>
                    {locationStatusMsg.type === 'success' ? <Check size={14} /> : <X size={14} />}
                    <span className="truncate">{locationStatusMsg.text}</span>
                  </div>
                )}

                {isEditingAddress && (
                  <form onSubmit={handleSaveAddress} className="pt-2 border-t border-gray-100 dark:border-slate-700/80 space-y-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">
                        Edit Delivery House / Street Address:
                      </label>
                      <textarea
                        rows="2"
                        value={customAddressInput}
                        onChange={(e) => setCustomAddressInput(e.target.value)}
                        placeholder="e.g. Flat 402, Block B, Sector 62, Noida, UP"
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-2 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:border-brand-green"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-1.5">
                        {['Home', 'Work', 'Parents', 'Other'].map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setAddressTag(tag)}
                            className={`px-2 py-0.5 text-[10px] font-extrabold rounded-lg border transition ${
                              addressTag === tag
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <button
                        type="submit"
                        className="bg-brand-green hover:bg-green-800 text-white font-black text-[11px] px-3.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Scheduled Delivery Slot Selector */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-gray-900 dark:text-white">Preferred Delivery Schedule</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliverySlot('SAME_DAY')}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center gap-0.5 transition ${
                      deliverySlot === 'SAME_DAY' || deliverySlot === 'INSTANT'
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-brand-green border-brand-green ring-2 ring-emerald-100 dark:ring-emerald-900'
                        : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    <span>⚡ Same Day</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliverySlot('NEXT_DAY')}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold flex flex-col items-center justify-center gap-0.5 transition ${
                      deliverySlot === 'NEXT_DAY'
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-brand-green border-brand-green ring-2 ring-emerald-100 dark:ring-emerald-900'
                        : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    <span>📅 Next Day</span>
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm divide-y divide-gray-100 dark:divide-slate-700">
                {items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 object-contain rounded-xl bg-gray-50 dark:bg-slate-900 p-1" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-extrabold text-gray-900 dark:text-white truncate">{item.name}</h4>
                      <div className="text-xs font-black text-gray-900 dark:text-white mt-0.5">
                        ₹{(item.discount_price || item.price) * item.quantity}
                      </div>
                    </div>
                    <div className="bg-brand-green text-white font-black text-xs flex items-center rounded-xl shadow-sm">
                      <button onClick={() => removeFromCart(item.id)} className="p-1.5 hover:bg-green-800 transition"><Minus size={12} /></button>
                      <span className="px-2">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="p-1.5 hover:bg-green-800 transition"><Plus size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100/60 transition cursor-pointer active:scale-98 shadow-xs"
              >
                <Plus size={16} /> <span>+ Add More Items from Store</span>
              </button>

              {/* Impulse Buys */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-gray-200 dark:border-slate-700 shadow-sm space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Quick Staples</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {impulseItems.map((rec) => (
                    <div key={rec.id} className="bg-gray-50 dark:bg-slate-900 border border-gray-200/70 dark:border-slate-700 rounded-xl p-2 flex flex-col justify-between">
                      <img src={rec.image_url} alt={rec.name} className="w-10 h-10 object-contain mx-auto mb-1 rounded-lg" />
                      <h5 className="text-[10px] font-bold truncate">{rec.name}</h5>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-200/50">
                        <span className="text-[11px] font-black">₹{rec.discount_price || rec.price}</span>
                        <button type="button" onClick={() => addToCart(rec)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black px-2 py-0.5 rounded-lg">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code (e.g. ZEPTO10)"
                      className="w-full text-xs pl-8 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-green uppercase font-bold dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-900 dark:bg-purple-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl hover:bg-gray-800"
                  >
                    Apply
                  </button>
                </form>
                {couponError && <p className="text-[11px] text-red-600 font-bold mt-1.5 ml-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-green-700 font-bold mt-1.5 ml-1">{couponSuccess}</p>}
              </div>

              {/* Bill Details */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm space-y-2 text-xs">
                <h3 className="font-black text-gray-900 dark:text-white mb-2">Bill Summary</h3>
                <div className="flex justify-between text-gray-600 dark:text-slate-400">
                  <span>Item Total</span>
                  <span>₹{itemTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-slate-400">
                  <span>Delivery Charge</span>
                  <span>{deliveryFee === 0 ? <strong className="text-brand-green">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-slate-400">
                  <span>Handling Charge</span>
                  <span>₹{handlingFee}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Delivery Tip</span>
                    <span>₹{tipAmount}</span>
                  </div>
                )}
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-brand-green font-extrabold">
                    <span>Coupon Discount</span>
                    <span>- ₹{appliedDiscount}</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-amber-500 font-extrabold">
                    <span>Reward Points Redeem</span>
                    <span>- ₹{pointsDiscount}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-2 flex justify-between font-black text-sm text-gray-900 dark:text-white">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-extrabold text-gray-900 dark:text-white text-xs mb-2">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'RAZORPAY', label: '💳 Razorpay (Test Mode)' },
                    { id: 'UPI', label: '📱 UPI (GPay/PhonePe)' },
                    { id: 'WALLET', label: '💰 KiranaWallet (₹250)' },
                    { id: 'COD', label: '💵 Cash on Delivery' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-2.5 text-[11px] font-extrabold rounded-xl border transition ${
                        paymentMethod === method.id
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900'
                          : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Sticky Checkout Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 border-t border-gray-200 dark:border-slate-700 shadow-lg">
              <button
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting}
                className="w-full bg-brand-green hover:bg-green-800 text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-between shadow-xl transition active:scale-95 disabled:opacity-50"
              >
                <div className="text-left">
                  <div className="text-xs opacity-90">Total: ₹{grandTotal.toFixed(0)}</div>
                  <div className="text-sm font-black">
                    {paymentMethod === 'RAZORPAY' || paymentMethod === 'UPI' ? 'PAY WITH RAZORPAY' : 'PLACE ORDER'}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs bg-green-800 px-3 py-1.5 rounded-xl font-bold">
                  <span>{isSubmitting ? 'Processing...' : 'Pay & Order'}</span>
                  <ArrowRight size={14} />
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Razorpay Test Mode Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={grandTotal}
        onPaymentSuccess={(rzpData) => {
          setIsRazorpayOpen(false);
          executeOrderCreation(rzpData);
        }}
        onPaymentFailure={() => {
          console.log('Payment test failed');
        }}
      />
    </div>
  );
}
