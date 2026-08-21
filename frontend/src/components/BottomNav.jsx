import React from 'react';
import { Home, LayoutGrid, Search, ShoppingBag, User, ArrowRight, ShoppingCart } from 'lucide-react';

export default function BottomNav({
  activeTab,
  setActiveTab,
  cartCount = 0,
  cartTotal = 0,
  onOpenCart,
  orderCount = 0
}) {
  const navItems = [
    { id: 'store', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'my_orders', label: 'Orders', icon: ShoppingBag, badge: orderCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Floating Persistent Cart Pill (when items in cart) */}
      {cartCount > 0 && (
        <div className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] left-3 right-3 sm:left-4 sm:right-4 z-40 max-w-md mx-auto animate-in slide-in-from-bottom duration-200">
          <button
            onClick={onOpenCart}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white p-2.5 sm:p-3.5 rounded-2xl shadow-xl flex items-center justify-between transition transform active:scale-98 border border-emerald-400/30"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-xl flex items-center justify-center font-black text-xs">
                <ShoppingCart size={15} />
              </div>
              <div className="text-left">
                <span className="text-xs font-black block leading-none">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} • ₹{cartTotal.toFixed(0)}
                </span>
                <span className="text-[9px] sm:text-[10px] text-emerald-100 font-medium">Tap to view basket & checkout</span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white text-emerald-800 font-black text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-xs">
              <span>View Cart</span>
              <ArrowRight size={13} />
            </div>
          </button>
        </div>
      )}

      {/* 5-Tab Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 shadow-2xl pt-1 pb-[calc(0.35rem+env(safe-area-inset-bottom,0px))] px-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center py-1 rounded-2xl transition relative ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-400 font-black scale-105'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 font-bold'
                }`}
              >
                <div className="relative">
                  <Icon size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border-2 border-white dark:border-slate-900">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
