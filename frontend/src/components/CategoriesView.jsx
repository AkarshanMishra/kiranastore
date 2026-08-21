import React, { useState } from 'react';
import { Sparkles, ArrowRight, Tag, Layers, CheckCircle2, ChevronRight, Filter } from 'lucide-react';
import ProductCard from './ProductCard';

export default function CategoriesView({
  categories = [],
  products = [],
  cart = {},
  addToCart,
  removeFromCart,
  wishlist = {},
  toggleWishlist,
  onSelectProduct
}) {
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 1);
  const [selectedSubCat, setSelectedSubCat] = useState('ALL');

  // Subcategories mapping for key aisles
  const subCategoryMap = {
    1: ['All Dairy & Eggs', 'Milk & Cream', 'Paneer & Tofu', 'Butter & Cheese', 'Curd & Yogurt', 'Eggs'],
    2: ['All Fruits & Veggies', 'Fresh Vegetables', 'Leafy Greens', 'Fresh Fruits', 'Exotic Fruits', 'Herbs & Seasonings'],
    3: ['All Snacks & Munchies', 'Chips & Crisps', 'Namkeen & Bhujia', 'Biscuits & Cookies', 'Chocolates & Candies'],
    4: ['All Cold Drinks & Juices', 'Soft Drinks', 'Fruit Juices', 'Energy Drinks', 'Flavored Milk', 'Mineral Water'],
    5: ['All Atta, Rice & Dal', 'Chakki Atta', 'Basmati Rice', 'Pulses & Dal', 'Poha & Suji', 'Grains'],
    6: ['All Cleaning & Household', 'Detergents & Bars', 'Dishwash', 'Floor Cleaners', 'Pooja Needs']
  };

  const currentCategory = categories.find(c => c.id === selectedCatId) || categories[0] || { name: 'Grocery Aisle', id: 1, icon: '🛒' };
  const subCats = subCategoryMap[selectedCatId] || ['All Items', 'Best Sellers', 'Popular Deals', 'Top Rated'];

  // Filter products for selected category
  const categoryProducts = products.filter(p => {
    const matchesCat = p.category_id === selectedCatId || (p.category_name && p.category_name.toLowerCase().includes(currentCategory.name.toLowerCase().split(' ')[0]));
    const matchesSub = selectedSubCat === 'ALL' || selectedSubCat.startsWith('All') || p.name.toLowerCase().includes(selectedSubCat.toLowerCase().split(' ')[0]);
    return matchesCat && matchesSub;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 pb-28">
      {/* Category Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-emerald-700 text-white rounded-3xl p-5 sm:p-6 shadow-lg flex items-center justify-between">
        <div>
          <span className="bg-white/20 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Category Aisles & Subcategories
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-2 flex items-center gap-2">
            <span>{currentCategory.icon || '🛍️'}</span>
            <span>{currentCategory.name}</span>
          </h2>
          <p className="text-xs text-purple-100 mt-1 font-medium">Fresh items delivered directly from your local store</p>
        </div>
        <span className="text-xs bg-white text-purple-900 font-extrabold px-3 py-1.5 rounded-2xl shadow-sm hidden sm:block">
          {categoryProducts.length} Items in Aisle
        </span>
      </div>

      {/* Horizontal Category Selector Bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isSelected = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCatId(cat.id);
                setSelectedSubCat('ALL');
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-102'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <span className="text-base">{cat.icon || '📦'}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Subcategory Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
          <Filter size={12} className="text-purple-600" /> Subcategories:
        </span>
        {subCats.map((sub, idx) => {
          const isSubActive = selectedSubCat === sub || (selectedSubCat === 'ALL' && idx === 0);
          return (
            <button
              key={sub}
              onClick={() => setSelectedSubCat(idx === 0 ? 'ALL' : sub)}
              className={`text-[11px] font-bold px-3 py-1 rounded-xl whitespace-nowrap transition border ${
                isSubActive
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700 font-black'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200/60 dark:border-slate-700 hover:bg-gray-200'
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>

      {/* Category Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <span>{currentCategory.name} Catalog</span>
            <span className="text-xs font-bold text-gray-400">({categoryProducts.length} Items)</span>
          </h3>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl p-12 text-center">
            <div className="text-3xl mb-2">📦</div>
            <h4 className="font-extrabold text-sm text-gray-800 dark:text-slate-200">No items under this subcategory</h4>
            <p className="text-xs text-gray-400 mt-1">Tap another subcategory or explore all products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categoryProducts.map((product) => (
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
        )}
      </div>
    </div>
  );
}
