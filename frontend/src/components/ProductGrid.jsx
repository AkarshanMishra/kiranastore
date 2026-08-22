import React from 'react';
import { Sparkles, ArrowRight, Flame, Layers, Tag, X, Filter } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  categories = [],
  selectedCategoryId = null,
  cart = {},
  addToCart,
  removeFromCart,
  wishlist = {},
  toggleWishlist,
  onSelectProduct,
  onSelectCategory,
  onClearCategory
}) {
  if (!products || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 text-gray-400 rounded-3xl mx-auto flex items-center justify-center text-2xl mb-3 shadow-xs">
          🔍
        </div>
        <h3 className="text-base font-extrabold text-gray-800 dark:text-slate-200">No products found</h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Try selecting another category or clear your search filter.</p>
        {selectedCategoryId && (
          <button
            onClick={onClearCategory}
            className="mt-4 bg-brand-green text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow hover:bg-green-800"
          >
            Show All Products
          </button>
        )}
      </div>
    );
  }

  const selectedCategoryObj = categories.find(c => c.id === selectedCategoryId);

  // If a specific category is selected, render the dedicated category view directly
  if (selectedCategoryId) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4 space-y-4">
        <div className="bg-gradient-to-r from-emerald-700 via-brand-green to-teal-700 text-white rounded-3xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedCategoryObj?.icon || '🛒'}</span>
            <div>
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Category Aisle
              </span>
              <h2 className="text-lg sm:text-xl font-black mt-0.5">{selectedCategoryObj?.name || 'Selected Category'}</h2>
              <p className="text-[11px] text-emerald-100">{products.length} Products Available</p>
            </div>
          </div>

          {onClearCategory && (
            <button
              onClick={onClearCategory}
              className="bg-white text-brand-green font-black text-xs px-3 py-1.5 rounded-xl shadow-xs hover:bg-emerald-50 flex items-center gap-1 transition"
            >
              <X size={14} />
              <span>Show All</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {products.map((product) => (
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
    );
  }

  // Dynamic Shelves based on available categories or fallback shelves
  const dynamicShelves = categories.length > 0 
    ? categories.map(cat => ({
        id: cat.id,
        title: cat.name,
        icon: cat.icon || '🛍️',
        desc: `Fresh ${cat.name} direct from local store`,
        products: products.filter(p => p.category_id === cat.id || (p.category_name && p.category_name.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0])))
      })).filter(shelf => shelf.products.length > 0)
    : [
        { id: 2, title: 'Dairy, Bread & Farm Eggs', icon: '🥛', desc: 'Fresh daily milk, malai paneer, butter & eggs', products: products.filter(p => p.category_id === 2) },
        { id: 6, title: 'Snacks, Munchies & Biscuits', icon: '🍿', desc: 'Crunchy chips, namkeen & evening tea snacks', products: products.filter(p => p.category_id === 6) },
        { id: 7, title: 'Cold Drinks, Juices & Beverages', icon: '🥤', desc: 'Chilled soft drinks, energy drinks & juices', products: products.filter(p => p.category_id === 7) },
        { id: 3, title: 'Atta, Rice, Dal & Cooking Staples', icon: '🌾', desc: 'Chakki fresh atta, basmati rice & pulses', products: products.filter(p => p.category_id === 3) }
      ].filter(shelf => shelf.products.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2 sm:py-4 space-y-5 sm:space-y-7">
      {/* ── Category Shelves (Single-Line Horizontal Scroll on Home) ────────────────── */}
      {dynamicShelves.map((shelf) => (
        <section key={shelf.id} className="space-y-2 sm:space-y-2.5">
          {/* Shelf Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">{shelf.icon}</span>
              <div>
                <h2 className="text-xs sm:text-base font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                  {shelf.title}
                </h2>
                <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                  {shelf.desc}
                </p>
              </div>
            </div>

            {onSelectCategory && (
              <button
                onClick={() => onSelectCategory(shelf.id)}
                className="text-[10px] sm:text-xs font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 transition flex-shrink-0 active:scale-95 shadow-2xs"
              >
                <span>See All ({shelf.products.length})</span>
                <ArrowRight size={11} />
              </button>
            )}
          </div>

          {/* Single-Line Horizontal Scroll Row */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1.5 pt-0.5 snap-x snap-mandatory">
            {shelf.products.map((product) => (
              <div
                key={product.id}
                className="min-w-[150px] max-w-[165px] sm:min-w-[190px] sm:max-w-[205px] flex-shrink-0 snap-start flex flex-col"
              >
                <ProductCard
                  product={product}
                  quantity={cart[product.id]?.quantity || 0}
                  onAdd={() => addToCart(product)}
                  onRemove={() => removeFromCart(product.id)}
                  onSelect={() => onSelectProduct(product)}
                  isWishlisted={!!wishlist[product.id]}
                  onToggleWishlist={() => toggleWishlist(product)}
                />
              </div>
            ))}

            {/* End of Row: "View All Items" Card */}
            {onSelectCategory && (
              <div
                onClick={() => onSelectCategory(shelf.id)}
                className="min-w-[130px] sm:min-w-[160px] flex-shrink-0 snap-start bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 dark:from-slate-800 dark:to-purple-950/40 border-2 border-dashed border-purple-300 dark:border-purple-800 rounded-2xl sm:rounded-3xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500 hover:shadow-md transition-all duration-200 group active:scale-95"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                  <ArrowRight size={20} />
                </div>
                <span className="font-black text-xs sm:text-sm text-purple-900 dark:text-purple-200 block">
                  See All
                </span>
                <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold mt-0.5">
                  {shelf.products.length} Products
                </span>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

