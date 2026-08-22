import React, { useState, useEffect, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import AuthModal from './components/AuthModal';
import CustomerAuthPage from './components/CustomerAuthPage';
import AiAssistantModal from './components/AiAssistantModal';
import CustomerSupportModal from './components/CustomerSupportModal';
import NotificationsDrawer from './components/NotificationsDrawer';
import BottomNav from './components/BottomNav';
import Navbar from './components/Navbar';
import HeroBanners from './components/HeroBanners';
import CategoryBar from './components/CategoryBar';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import OrderTracking from './components/OrderTracking';
import CategoriesView from './components/CategoriesView';
import OffersView from './components/OffersView';
import MyOrdersView from './components/MyOrdersView';
import ProfileView from './components/ProfileView';
import SearchView from './components/SearchView';
import BrandsSection from './components/BrandsSection';
import FlashSaleBanner from './components/FlashSaleBanner';
import BarcodeScannerModal from './components/BarcodeScannerModal';
import MonthlyRashanSection from './components/MonthlyRashanSection';
import { X, Heart, Bot } from 'lucide-react';
import { defaultCategories, defaultProducts } from './data/catalog';
import { fetchApi } from './apiClient';
import { App as CapacitorApp } from '@capacitor/app';

export default function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [exitToast, setExitToast] = useState(false);
  const lastBackPressRef = React.useRef(0);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kirana_customer_user');
      return saved ? JSON.parse(saved) : { name: 'Akarshan Mishra', phone: '+91 9876543210', email: 'akarshan@kiranastore.com' };
    } catch {
      return { name: 'Akarshan Mishra', phone: '+91 9876543210' };
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);

  const handleCustomerLogout = () => {
    localStorage.removeItem('kirana_customer_user');
    setUser(null);
  };

  const [categories, setCategories] = useState(defaultCategories);
  const [products, setProducts] = useState(defaultProducts);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  const [wishlist, setWishlist] = useState({});
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('customer_active_tab') || 'store';
  });
  const [activeOrderNumber, setActiveOrderNumber] = useState(() => {
    return localStorage.getItem('customer_active_order_number') || null;
  });

  useEffect(() => {
    localStorage.setItem('customer_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (activeOrderNumber) {
      localStorage.setItem('customer_active_order_number', activeOrderNumber);
    }
  }, [activeOrderNumber]);
  const [userAddress, setUserAddress] = useState('Flat 402, Block B, Sector 62, Noida, UP');
  const [loading, setLoading] = useState(false);

  // App Settings
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('EN');

  // Sorting & Filtering
  const [sortBy, setSortBy] = useState('popular');
  const [filterDiscountedOnly, setFilterDiscountedOnly] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');

  // Keep fresh reference for native/web back navigation
  const navStateRef = React.useRef({});
  navStateRef.current = {
    selectedProduct,
    isCartOpen,
    isWishlistOpen,
    isAuthOpen,
    isAiOpen,
    isSupportOpen,
    isNotificationsOpen,
    isBarcodeOpen,
    searchQuery,
    selectedCategoryId,
    activeTab
  };

  const handleGoBack = useCallback(() => {
    const s = navStateRef.current;
    
    // 1. Close open full-screen modals & drawers first
    if (s.selectedProduct) {
      setSelectedProduct(null);
      return true;
    }
    if (s.isCartOpen) {
      setIsCartOpen(false);
      return true;
    }
    if (s.isWishlistOpen) {
      setIsWishlistOpen(false);
      return true;
    }
    if (s.isAuthOpen) {
      setIsAuthOpen(false);
      return true;
    }
    if (s.isAiOpen) {
      setIsAiOpen(false);
      return true;
    }
    if (s.isSupportOpen) {
      setIsSupportOpen(false);
      return true;
    }
    if (s.isNotificationsOpen) {
      setIsNotificationsOpen(false);
      return true;
    }
    if (s.isBarcodeOpen) {
      setIsBarcodeOpen(false);
      return true;
    }

    // 2. Clear Active Search or Category Filter
    if (s.searchQuery && s.searchQuery.trim() !== '') {
      setSearchQuery('');
      return true;
    }
    if (s.selectedCategoryId !== null) {
      setSelectedCategoryId(null);
      return true;
    }

    // 3. Switch back to Home / Store tab if on another tab
    if (s.activeTab !== 'store') {
      setActiveTab('store');
      return true;
    }

    // 4. Double back to exit when already on Home
    const now = Date.now();
    if (now - lastBackPressRef.current < 2000) {
      try {
        CapacitorApp.exitApp();
      } catch {}
    } else {
      lastBackPressRef.current = now;
      setExitToast(true);
      setTimeout(() => setExitToast(false), 2000);
    }
    return false;
  }, []);

  useEffect(() => {
    let listener = null;
    try {
      CapacitorApp.addListener('backButton', () => {
        handleGoBack();
      }).then(l => {
        listener = l;
      });
    } catch {}

    const handlePopState = (e) => {
      e.preventDefault();
      handleGoBack();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (listener && listener.remove) listener.remove();
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleGoBack]);

  // Fetch Categories
  const loadCategories = () => {
    fetchApi('/api/categories')
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setCategories(data);
      })
      .catch(() => setCategories(defaultCategories));
  };

  useEffect(() => {
    loadCategories();
    const handleUrlChange = () => loadCategories();
    window.addEventListener('api_base_url_changed', handleUrlChange);
    return () => window.removeEventListener('api_base_url_changed', handleUrlChange);
  }, []);

  // Fetch Products based on category filter or search query
  useEffect(() => {
    let url = '/api/products';
    const params = new URLSearchParams();
    if (selectedCategoryId) params.append('category_id', selectedCategoryId);
    if (searchQuery.trim()) params.append('q', searchQuery.trim());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetchApi(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          throw new Error('Empty');
        }
      })
      .catch(() => {
        let filtered = [...defaultProducts];
        if (selectedCategoryId) {
          filtered = filtered.filter(p => p.category_id === selectedCategoryId);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
        }
        setProducts(filtered);
      });
  }, [selectedCategoryId, searchQuery]);

  // Wishlist toggle
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const next = { ...prev };
      if (next[product.id]) {
        delete next[product.id];
      } else {
        next[product.id] = product;
      }
      return next;
    });
  };

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      const qty = existing ? existing.quantity + 1 : 1;
      return {
        ...prev,
        [product.id]: {
          ...product,
          quantity: qty
        }
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      if (existing.quantity === 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return {
        ...prev,
        [productId]: {
          ...existing,
          quantity: existing.quantity - 1
        }
      };
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const handleOrderPlaced = (orderData) => {
    setActiveOrderNumber(orderData.order_number);
    setActiveTab('tracking');
  };

  const handleReorder = (items) => {
    items.forEach(item => {
      addToCart({
        id: item.product_id,
        name: item.product_name,
        price: item.price,
        image_url: item.image_url,
        weight_unit: '1 pack'
      });
    });
    setIsCartOpen(true);
  };

  // Frontend Sorting & Filtering
  let processedProducts = [...products];

  if (selectedBrand) {
    processedProducts = processedProducts.filter(p => p.name.toLowerCase().includes(selectedBrand.toLowerCase()));
  }

  if (filterDiscountedOnly) {
    processedProducts = processedProducts.filter(p => p.discount_price && p.discount_price < p.price);
  }

  if (sortBy === 'price_low') {
    processedProducts.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
  } else if (sortBy === 'price_high') {
    processedProducts.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
  } else if (sortBy === 'rating') {
    processedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'discount') {
    processedProducts.sort((a, b) => {
      const discA = a.discount_price ? ((a.price - a.discount_price) / a.price) : 0;
      const discB = b.discount_price ? ((b.price - b.discount_price) / b.price) : 0;
      return discB - discA;
    });
  }

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // When customer is logged out, ONLY display the login / signup screen
  if (!user) {
    return (
      <div className={`${darkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen font-sans`}>
        <CustomerAuthPage
          onLoginSuccess={(u) => {
            setUser(u);
            if (u.address) setUserAddress(u.address);
          }}
          onBackToStore={null}
          setUserAddress={setUserAddress}
        />
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen flex flex-col font-sans selection:bg-green-100 selection:text-green-800 transition-colors duration-200`}>
      
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        wishlistCount={Object.keys(wishlist).length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        user={user}
        onOpenAuth={() => setActiveTab('login')}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        products={products}
        addToCart={addToCart}
        onSelectProduct={setSelectedProduct}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-32 sm:pb-24">
        {activeTab === 'tracking' && activeOrderNumber ? (
          <OrderTracking
            orderNumber={activeOrderNumber}
            onBackToStore={() => setActiveTab('store')}
          />
        ) : activeTab === 'categories' ? (
          <CategoriesView
            categories={categories}
            products={products}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            onSelectProduct={setSelectedProduct}
          />
        ) : activeTab === 'search' ? (
          <SearchView
            products={products}
            categories={categories}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            onSelectProduct={setSelectedProduct}
            onOpenBarcodeScanner={() => setIsBarcodeOpen(true)}
          />
        ) : activeTab === 'offers' ? (
          <OffersView
            products={products}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            onSelectProduct={setSelectedProduct}
          />
        ) : activeTab === 'my_orders' ? (
          <MyOrdersView
            user={user}
            onSelectTrackOrder={(orderNum) => {
              setActiveOrderNumber(orderNum);
              setActiveTab('tracking');
            }}
            onReorder={handleReorder}
            addToCart={addToCart}
            onOpenSupport={() => setIsSupportOpen(true)}
          />
        ) : activeTab === 'profile' ? (
          <ProfileView
            user={user}
            userAddress={userAddress}
            setUserAddress={setUserAddress}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            language={language}
            setLanguage={setLanguage}
            onOpenSupport={() => setIsSupportOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onNavigateToOrders={() => setActiveTab('my_orders')}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            wishlist={wishlist}
            addToCart={addToCart}
            onOpenAuth={() => setActiveTab('login')}
            onLogout={handleCustomerLogout}
          />
        ) : activeTab === 'login' || activeTab === 'signup' || activeTab === 'auth' ? (
          <CustomerAuthPage
            initialMode={activeTab === 'signup' ? 'signup' : 'login'}
            onLoginSuccess={(userData) => {
              setUser(userData);
              setActiveTab('store');
            }}
            onBackToStore={() => setActiveTab('store')}
            setUserAddress={setUserAddress}
          />
        ) : (
          <>
            {/* 1. Compact Auto-Slide Hero Banner */}
            <HeroBanners />

            {/* 2. Sleek Categories Filter Bar */}
            <CategoryBar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterDiscountedOnly={filterDiscountedOnly}
              setFilterDiscountedOnly={setFilterDiscountedOnly}
            />

            {/* 3. Sleek 1-Line Monthly Rashan Strip */}
            <MonthlyRashanSection
              onAddToCart={addToCart}
              cart={cart}
              language={language}
              userAddress={userAddress}
              setUserAddress={setUserAddress}
              user={user}
            />

            {/* 4. Instant Fast-Delivery Grocery Shelves & Catalog */}
            {loading ? (
              <div className="py-16 text-center text-xs font-bold text-gray-500">
                ⚡ {language === 'HI' ? 'डार्क स्टोर कैटलॉग लोड हो रहा है...' : 'Fetching dark store catalog...'}
              </div>
            ) : (
              <ProductGrid
                products={processedProducts}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                onSelectProduct={setSelectedProduct}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                onClearCategory={() => setSelectedCategoryId(null)}
                onSelectCategory={(catId) => {
                  setSelectedCategoryId(catId);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}

        {/* Developer Attribution Footer */}
        <footer className="mt-12 mb-20 text-center text-xs text-gray-500 dark:text-slate-400 font-medium px-4">
          <div className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700/80 px-4 py-2 rounded-full shadow-xs">
            <span>🚀 App is developed by</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">Akarshan Mishra</span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1.5 font-medium">
            KiranaStore • 10-Minute Hyperlocal Quick Commerce Platform
          </p>
        </footer>
      </main>

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] right-3 sm:right-4 z-30 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition flex items-center gap-1.5 font-black text-xs border-2 border-white"
        title="Kira AI Shopping Assistant"
      >
        <Bot size={18} />
        <span className="hidden sm:inline">Ask Kira AI</span>
      </button>

      {/* Bottom Navigation & Floating Cart */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)}
        cartTotal={Object.values(cart).reduce((sum, item) => sum + ((item.discount_price || item.price) * item.quantity), 0)}
        onOpenCart={() => setIsCartOpen(true)}
        orderCount={1}
      />

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        products={products}
        onAddToCart={addToCart}
      />

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        products={products}
        addToCart={addToCart}
      />

      <CustomerSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Saved Wishlist Drawer */}
      {isWishlistOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Heart size={20} className="text-rose-500 fill-rose-500" />
              <h3 className="font-black text-gray-900 dark:text-white text-lg">My Saved Favorites</h3>
            </div>

            {Object.keys(wishlist).length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-xs font-bold text-gray-500 dark:text-slate-400">No saved items yet.</p>
                <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">Tap the heart icon on any product to save it here for quick re-ordering!</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800 pr-1">
                {Object.values(wishlist).map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <img src={item.image_url} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50 dark:bg-slate-800" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.name}</h4>
                      <div className="text-xs font-black text-gray-900 dark:text-white">₹{item.discount_price || item.price}</div>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-brand-green text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow hover:bg-green-800"
                    >
                      + ADD
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        user={user}
        onPlaceOrder={handleOrderPlaced}
      />

      {/* Floating Exit Toast for Double Back Press */}
      {exitToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-950/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl z-50 animate-in fade-in zoom-in duration-150 flex items-center gap-2 border border-gray-700/80">
          <span>Press back again to exit</span>
        </div>
      )}
    </div>
  );
}
