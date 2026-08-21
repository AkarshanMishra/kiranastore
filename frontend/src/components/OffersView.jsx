import React, { useState } from 'react';
import { Tag, Sparkles, Clock, Copy, Check, ShieldCheck, Gift, Flame, Percent, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function OffersView({
  products = [],
  cart = {},
  addToCart,
  removeFromCart,
  wishlist = {},
  toggleWishlist,
  onSelectProduct
}) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedOfferFilter, setSelectedOfferFilter] = useState('ALL'); // 'ALL' | 'FLASH' | 'BOGO' | 'UNDER_100'

  const coupons = [
    { code: 'WELCOME100', discount: 'FLAT ₹100 OFF', desc: 'On grocery orders above ₹499', tag: 'NEW USER' },
    { code: 'ZEPTO20', discount: '20% OFF', desc: 'Save up to ₹80 on daily staples', tag: 'POPULAR' },
    { code: 'FREESHIP', discount: 'FREE DELIVERY', desc: 'Zero delivery fee on your entire basket', tag: 'FREE SHIP' },
    { code: 'DAIRY50', discount: '15% OFF', desc: 'Save on Milk, Paneer & Ghee essentials', tag: 'DAIRY DEAL' }
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter products that have discounts
  const dealProducts = products.filter(p => {
    const hasDiscount = p.discount_price && p.discount_price < p.price;
    if (selectedOfferFilter === 'FLASH') return hasDiscount && p.price > 100;
    if (selectedOfferFilter === 'UNDER_100') return (p.discount_price || p.price) < 100;
    if (selectedOfferFilter === 'BOGO') return p.category_id === 3 || p.name.toLowerCase().includes('pack');
    return hasDiscount || p.rating >= 4.8;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 pb-28">
      {/* Header Mega Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 text-white rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-max">
            <Flame size={12} className="text-yellow-300 animate-pulse" /> Mega Grocery Savings Zone
          </span>
          <h2 className="text-2xl font-black mt-2">Exclusive Deals & Offers</h2>
          <p className="text-xs text-rose-100 mt-1 font-medium">Daily flash price drops, BOGO combos & promo vouchers</p>
        </div>
        <Gift size={44} className="opacity-80 text-yellow-300 hidden sm:block" />
      </div>

      {/* 1. Active Coupons Section */}
      <div>
        <h3 className="text-sm font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Tag className="text-purple-600" size={16} /> 1-Tap Promo Coupons
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                  {c.tag}
                </span>
                <div className="text-base font-black text-gray-900 dark:text-white mt-1">
                  {c.discount}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1">{c.desc}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between mt-3">
                <span className="font-mono text-xs font-bold text-gray-700 dark:text-slate-300">{c.code}</span>
                <button
                  onClick={() => handleCopy(c.code)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
                >
                  {copiedCode === c.code ? (
                    <>
                      <Check size={12} className="text-emerald-300" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Offers Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
          <Percent size={12} className="text-rose-500" /> Filter Deals:
        </span>
        {[
          { id: 'ALL', label: '🔥 All Steal Deals' },
          { id: 'FLASH', label: '⚡ Flash Price Drops' },
          { id: 'UNDER_100', label: '🪙 Under ₹100 Deals' },
          { id: 'BOGO', label: '🎁 Combo & BOGO Packs' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedOfferFilter(f.id)}
            className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition border ${
              selectedOfferFilter === f.id
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-rose-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 3. Discounted Items Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <span>Special Offer Items</span>
            <span className="text-xs font-bold text-gray-400">({dealProducts.length} Items on Discount)</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {dealProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id]?.quantity || 0}
              onAdd={() => addToCart(product)}
              onRemove={() => removeFromCart(product.id)}
              onSelect={() => onSelectProduct(product)}
              isWishlisted={!!wishlist[product.id]}
              onToggleWishlist={() => toggleWishlist(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
