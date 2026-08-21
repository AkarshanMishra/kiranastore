import React, { useState, useRef } from 'react';
import { Search, ShoppingBag, MapPin, ChevronDown, Store, X, Heart, TrendingUp, Sparkles, Bell, Globe, Sun, Moon, Bot, Mic, Volume2, Crosshair, Loader2, Navigation, CheckCircle2, AlertCircle, User, LogIn } from 'lucide-react';
import VoiceSearchModal from './VoiceSearchModal';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  cart,
  setIsCartOpen,
  userAddress,
  setUserAddress,
  wishlistCount,
  onOpenWishlist,
  onOpenNotifications,
  onOpenAi,
  user,
  onOpenAuth,
  darkMode,
  setDarkMode,
  language,
  setLanguage
}) {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState(userAddress);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null); // { type: 'success'|'error', message: string }

  const totalCartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const trendingSearches = language === 'HI'
    ? ['अमूल दूध', 'पनीर', 'मैगी 2-मिनट', 'लेस मसाला', 'कोका कोला', 'ओरियो', 'मक्खन']
    : ['Amul Milk', 'Paneer', 'Maggi 2-Min', 'Lays Masala', 'Coca Cola', 'Oreo', 'Butter'];

  const handleAddressSave = (e) => {
    e?.preventDefault();
    if (tempAddress.trim()) {
      setUserAddress(tempAddress);
      setIsAddressModalOpen(false);
    }
  };

  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({ type: 'error', message: 'Geolocation is not supported by your browser' });
      return;
    }

    setIsLocating(true);
    setLocationStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode via OpenStreetMap Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`, {
            headers: { 'Accept-Language': 'en' }
          });
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const street = addr.road || addr.suburb || addr.neighbourhood || addr.residential || 'GPS Location';
            const city = addr.city || addr.town || addr.state_district || 'Noida';
            const postcode = addr.postcode ? ` - ${addr.postcode}` : '';
            const state = addr.state || 'UP';
            const formatted = `${street}, ${city}, ${state}${postcode}`;

            setTempAddress(formatted);
            setUserAddress(formatted);
            setLocationStatus({ type: 'success', message: `Location detected: ${formatted}` });
          } else {
            const fallback = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}, Sector 62, Noida`;
            setTempAddress(fallback);
            setUserAddress(fallback);
            setLocationStatus({ type: 'success', message: 'Live GPS coordinates captured!' });
          }
        } catch (err) {
          const fallback = `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Sector 62, Noida`;
          setTempAddress(fallback);
          setUserAddress(fallback);
          setLocationStatus({ type: 'success', message: 'GPS coordinates locked!' });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve location. Please check browser permissions.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        setLocationStatus({ type: 'error', message: msg });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleStartVoiceSearch = () => {
    setIsVoiceModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Top Notice Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-brand-green to-teal-700 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 text-center font-bold flex items-center justify-center gap-1.5 sm:gap-2">
        <Sparkles size={13} className="text-yellow-300 animate-pulse flex-shrink-0" />
        <span className="truncate">
          {language === 'HI'
            ? '⚡ त्वरित होम डिलीवरी — सीधे स्थानीय किराना स्टोर से'
            : '⚡ FAST EXPRESS HOME DELIVERY — DIRECT FROM LOCAL STORE'}
        </span>
        <span className="hidden md:inline opacity-85">| {language === 'HI' ? '₹500+ पर मुफ्त डिलीवरी' : 'Free Delivery over ₹500'}</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        {/* Main Navbar Container */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3">
          
          {/* Top Row on Mobile: Logo, Location & Right Action Icons */}
          <div className="flex items-center justify-between gap-2">
            {/* Logo & Location Section */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div 
                onClick={() => window.location.reload()}
                className="cursor-pointer flex items-center gap-1 select-none flex-shrink-0"
              >
                <div className="bg-brand-yellow text-gray-900 font-black text-base sm:text-xl px-2 py-0.5 rounded-lg shadow-xs tracking-tight">
                  Kirana<span className="text-brand-green">Store</span>
                </div>
              </div>

              {/* Location Picker Pill (Always visible & compact on mobile) */}
              <button 
                onClick={() => setIsAddressModalOpen(true)}
                className="flex items-center gap-1.5 cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-gray-200/60 dark:border-slate-700 transition text-left min-w-0 max-w-[140px] sm:max-w-[200px]"
                title="Change Delivery Location"
              >
                <MapPin size={14} className="text-brand-green flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-black text-[10px] sm:text-xs text-gray-900 dark:text-white flex items-center gap-0.5 leading-none truncate">
                    <span>{language === 'HI' ? 'डिलीवरी' : 'Home'}</span>
                    <ChevronDown size={11} className="text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-gray-500 dark:text-slate-400 truncate font-medium leading-tight">
                    {userAddress.split(',')[0]}
                  </div>
                </div>
              </button>
            </div>

            {/* Right Actions for Mobile & Desktop */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              
              {/* Notifications */}
              <button
                onClick={onOpenNotifications}
                className="p-1.5 sm:p-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 relative transition"
                title="Notifications"
              >
                <Bell size={17} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              </button>

              {/* Wishlist Button */}
              <button
                onClick={onOpenWishlist}
                className="p-1.5 sm:p-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950 text-gray-600 dark:text-slate-300 hover:text-rose-500 relative transition"
                title="Saved Favorites"
              >
                <Heart size={17} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 sm:p-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={17} className="text-yellow-400" /> : <Moon size={17} />}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-brand-green hover:bg-green-800 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 flex-shrink-0"
              >
                <ShoppingBag size={16} />
                <span className="font-extrabold">{totalCartCount}</span>
                {totalCartCount > 0 && (
                  <span className="hidden sm:inline font-bold opacity-90">| ₹{totalCartPrice.toFixed(0)}</span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar (Full-width on Mobile, Centered on Desktop) */}
          <div className="w-full md:max-w-md lg:max-w-lg relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'HI' ? "खोजें 'दूध', 'पनीर', 'मैगी', 'चिप्स'..." : "Search 'milk', 'paneer', 'butter', 'chips'..."}
                className="w-full bg-gray-100 hover:bg-gray-100/90 dark:bg-slate-800 dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-800 text-xs sm:text-sm pl-9 pr-16 py-2 sm:py-2.5 rounded-2xl border border-gray-200 dark:border-slate-700 focus:border-brand-green focus:ring-2 focus:ring-green-100 dark:focus:ring-emerald-950 outline-none transition font-medium dark:text-white"
              />
              
              {/* Search Accessories (Clear & Voice Mic) */}
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600 bg-gray-200 dark:bg-slate-700 p-0.5 rounded-full"
                  >
                    <X size={13} />
                  </button>
                )}

                <button
                  onClick={handleStartVoiceSearch}
                  className="text-brand-green hover:bg-green-50 dark:hover:bg-slate-700 p-1 rounded-full transition"
                  title="Voice Search"
                >
                  <Mic size={16} />
                </button>
              </div>
            </div>

            {/* Search Dropdown Overlay */}
            {isSearchFocused && !searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 shadow-2xl border border-gray-100 dark:border-slate-800 z-50 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-gray-400 mb-2 uppercase tracking-wider">
                  <TrendingUp size={13} className="text-brand-green" /> {language === 'HI' ? 'ट्रेंडिंग खोजें' : 'Trending Searches'}
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {trendingSearches.map((item) => (
                    <button
                      key={item}
                      onMouseDown={() => setSearchQuery(item)}
                      className="text-[11px] sm:text-xs bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-brand-green text-gray-700 dark:text-slate-200 font-bold px-2.5 py-1 rounded-xl transition border border-gray-200/60 dark:border-slate-700"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Address Edit & GPS Location Access Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 dark:bg-emerald-950 p-3 rounded-2xl text-brand-green">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">
                  {language === 'HI' ? 'स्थान और डिलीवरी पता' : 'Location & Delivery Address'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Detect GPS coordinates or enter your delivery address</p>
              </div>
            </div>

            {/* Live GPS Location Detection Button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGetLiveLocation}
                disabled={isLocating}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs py-3 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-75"
              >
                {isLocating ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span>Detecting GPS Location via Browser...</span>
                  </>
                ) : (
                  <>
                    <Crosshair size={16} className="text-yellow-300" />
                    <span>📍 Detect Current GPS Location</span>
                  </>
                )}
              </button>

              {/* Status Alert */}
              {locationStatus && (
                <div className={`mt-2.5 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  locationStatus.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                }`}>
                  {locationStatus.type === 'success' ? (
                    <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={15} className="text-rose-600 flex-shrink-0" />
                  )}
                  <span className="truncate">{locationStatus.message}</span>
                </div>
              )}
            </div>

            {/* Quick-Pick Address Presets */}
            <div className="mb-4">
              <span className="text-[11px] font-extrabold text-gray-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
                Saved Locations
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const addr = 'Flat 402, Block B, Sector 62, Noida, UP';
                    setTempAddress(addr);
                    setUserAddress(addr);
                  }}
                  className="bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 p-2 rounded-xl text-left border border-gray-200 dark:border-slate-700 transition"
                >
                  <span className="font-extrabold text-xs block text-gray-900 dark:text-white">🏠 Home</span>
                  <span className="text-[10px] text-gray-500 truncate block">Sector 62, Noida</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const addr = 'Tower C, Candor TechSpace, Sector 62, Noida, UP';
                    setTempAddress(addr);
                    setUserAddress(addr);
                  }}
                  className="bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 p-2 rounded-xl text-left border border-gray-200 dark:border-slate-700 transition"
                >
                  <span className="font-extrabold text-xs block text-gray-900 dark:text-white">🏢 Work</span>
                  <span className="text-[10px] text-gray-500 truncate block">TechSpace, Sector 62</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const addr = 'Villa 14, Lotus Boulevard, Sector 100, Noida, UP';
                    setTempAddress(addr);
                    setUserAddress(addr);
                  }}
                  className="bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 p-2 rounded-xl text-left border border-gray-200 dark:border-slate-700 transition"
                >
                  <span className="font-extrabold text-xs block text-gray-900 dark:text-white">📍 Other</span>
                  <span className="text-[10px] text-gray-500 truncate block">Sector 100, Noida</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddressSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  Full Street Address & Landmark
                </label>
                <textarea
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:border-brand-green focus:ring-4 focus:ring-green-100 dark:focus:ring-emerald-950 outline-none font-medium dark:bg-slate-800 dark:text-white"
                  placeholder="Flat 402, Block B, Sector 62, Noida, Uttar Pradesh"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-green text-white font-extrabold text-xs rounded-xl hover:bg-green-800 shadow"
                >
                  Confirm Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onQuerySubmit={(query) => setSearchQuery(query)}
      />
    </header>
  );
}
