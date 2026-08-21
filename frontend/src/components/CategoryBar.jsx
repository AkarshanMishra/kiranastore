import React from 'react';
import { LayoutGrid, ArrowUpDown, Percent, Sparkles, Filter } from 'lucide-react';

export default function CategoryBar({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  sortBy,
  setSortBy,
  filterDiscountedOnly,
  setFilterDiscountedOnly
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
      
      {/* Category Header & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
          Shop Categories
          {selectedCategoryId && (
            <span className="text-xs bg-green-100 text-brand-green font-bold px-2.5 py-0.5 rounded-full">
              Filtered
            </span>
          )}
        </h2>

        {/* Sort & Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Discount Filter Button */}
          <button
            onClick={() => setFilterDiscountedOnly(!filterDiscountedOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              filterDiscountedOnly
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
            }`}
          >
            <Percent size={13} />
            <span>Hot Deals Only</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
            <ArrowUpDown size={13} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-gray-900 cursor-pointer"
            >
              <option value="popular">Popularity</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated ⭐</option>
              <option value="discount">Max Discount %</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Categories */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
            selectedCategoryId === null
              ? 'bg-brand-green text-white ring-2 ring-brand-green'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <LayoutGrid size={16} />
          All Items
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
                isSelected
                  ? 'bg-brand-green text-white ring-2 ring-brand-green'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
