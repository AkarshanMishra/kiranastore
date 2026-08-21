import React from 'react';
import { Plus, Minus, Heart, Star, Sparkles, Store } from 'lucide-react';

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

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0 || !product.in_stock;

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 group relative">
      {/* Top Badges & Wishlist */}
      <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2 relative z-10">
        <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
          ⚡ FRESH
        </span>

        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className={`p-1.5 rounded-full transition ${
              isWishlisted
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
                : 'text-gray-300 dark:text-slate-600 hover:text-rose-500 hover:bg-gray-50'
            }`}
            title="Add to Wishlist"
          >
            <Heart size={15} className={isWishlisted ? 'fill-rose-500' : ''} />
          </button>
        )}
      </div>

      {/* Image & Click Area */}
      <div onClick={onSelect} className="cursor-pointer">
        <div className="relative aspect-square flex items-center justify-center p-2 mb-2 bg-gray-50 dark:bg-slate-900 rounded-2xl overflow-hidden">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80';
            }}
          />

          {discountPercent > 0 && (
            <span className="absolute bottom-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Product Info */}
        <span className="text-[10px] text-gray-400 font-bold block mb-0.5">
          {product.weight_unit || 'Standard'}
        </span>

        <h3 className="font-extrabold text-xs text-gray-900 dark:text-white line-clamp-2 leading-tight min-h-[32px]">
          {product.name}
        </h3>

        {/* Rating & Stock status */}
        <div className="flex items-center justify-between gap-1 mt-1 mb-2">
          <div className="flex items-center text-amber-500 font-black text-[10px]">
            <Star size={10} fill="currentColor" className="mr-0.5" />
            <span>{product.rating || '4.8'}</span>
          </div>

          {isOutOfStock ? (
            <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.2 rounded">Out of Stock</span>
          ) : isLowStock ? (
            <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">Only {product.stock} left</span>
          ) : (
            <span className="text-[9px] text-emerald-600 font-bold">In Stock</span>
          )}
        </div>
      </div>

      {/* Pricing & Add to Cart Controls */}
      <div className="pt-2 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between mt-auto">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-gray-900 dark:text-white">
              ₹{product.discount_price ? product.discount_price : product.price}
            </span>
            {product.discount_price && (
              <span className="text-[10px] text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>
        </div>

        <div>
          {isOutOfStock ? (
            <button disabled className="bg-gray-100 text-gray-400 font-bold text-[10px] px-2.5 py-1 rounded-xl cursor-not-allowed">
              Sold Out
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={onAdd}
              className="bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-600 hover:text-white text-purple-700 dark:text-purple-300 font-black text-[11px] px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 transition flex items-center gap-1 shadow-2xs"
            >
              <Plus size={13} /> ADD
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-purple-600 text-white rounded-xl px-2 py-1 shadow-sm">
              <button onClick={onRemove} className="hover:bg-purple-700 p-0.5 rounded transition">
                <Minus size={12} />
              </button>
              <span className="font-black text-xs min-w-[14px] text-center">{quantity}</span>
              <button onClick={onAdd} className="hover:bg-purple-700 p-0.5 rounded transition">
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
