import React from 'react';
import { Plus, Minus, Heart, Star } from 'lucide-react';

export default function ProductCard({
  product,
  quantity = 0,
  onAdd,
  onRemove,
  onSelect,
  isWishlisted = false,
  onToggleWishlist
}) {
  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const isLowStock = product.stock > 0 && product.stock <= 8;
  const isOutOfStock = product.stock === 0 || !product.in_stock;

  return (
    <div className="bg-white dark:bg-slate-850 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 group relative">
      {/* Top Discount Tag & Wishlist */}
      <div className="flex items-center justify-between gap-1 mb-1 relative z-10">
        {discountPercent > 0 ? (
          <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-2xs">
            {discountPercent}% OFF
          </span>
        ) : (
          <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[8px] font-black px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
            ⚡ 10m
          </span>
        )}

        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className={`p-1 rounded-full transition ${
              isWishlisted
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
                : 'text-gray-300 dark:text-slate-600 hover:text-rose-500 hover:bg-gray-50'
            }`}
            title="Wishlist"
          >
            <Heart size={13} className={isWishlisted ? 'fill-rose-500' : ''} />
          </button>
        )}
      </div>

      {/* Image & Click Area */}
      <div onClick={onSelect} className="cursor-pointer">
        <div className="relative aspect-square flex items-center justify-center p-1.5 mb-1.5 bg-gray-50/80 dark:bg-slate-900 rounded-xl overflow-hidden">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=250&q=80'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=250&q=80';
            }}
          />
        </div>

        {/* Product Unit / Weight */}
        <span className="text-[9px] text-gray-400 font-bold block leading-none mb-0.5">
          {product.weight_unit || 'Standard'}
        </span>

        {/* Product Title */}
        <h3 className="font-extrabold text-[11px] sm:text-xs text-gray-900 dark:text-white line-clamp-2 leading-tight min-h-[28px]">
          {product.name}
        </h3>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between gap-1 mt-0.5 mb-1.5">
          <div className="flex items-center text-amber-500 font-black text-[9px]">
            <Star size={9} fill="currentColor" className="mr-0.5" />
            <span>{product.rating || '4.8'}</span>
          </div>

          {isOutOfStock ? (
            <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-1 rounded">Out</span>
          ) : isLowStock ? (
            <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-1 rounded">Few left</span>
          ) : (
            <span className="text-[8px] text-emerald-600 font-bold">In Stock</span>
          )}
        </div>
      </div>

      {/* Pricing & Add to Cart Controls */}
      <div className="pt-1.5 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between mt-auto">
        <div className="min-w-0 pr-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
              ₹{product.discount_price ? product.discount_price : product.price}
            </span>
            {product.discount_price && (
              <span className="text-[9px] text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>
        </div>

        <div>
          {isOutOfStock ? (
            <button disabled className="bg-gray-100 dark:bg-slate-800 text-gray-400 font-bold text-[9px] px-2 py-0.5 rounded-lg cursor-not-allowed">
              Sold Out
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={onAdd}
              className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 font-black text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-0.5 shadow-2xs active:scale-95 cursor-pointer"
            >
              <Plus size={11} /> ADD
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-emerald-600 text-white rounded-xl px-1.5 py-0.5 shadow-xs">
              <button onClick={onRemove} className="hover:bg-emerald-700 p-0.5 rounded transition">
                <Minus size={10} />
              </button>
              <span className="font-black text-[11px] min-w-[12px] text-center">{quantity}</span>
              <button onClick={onAdd} className="hover:bg-emerald-700 p-0.5 rounded transition">
                <Plus size={10} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
