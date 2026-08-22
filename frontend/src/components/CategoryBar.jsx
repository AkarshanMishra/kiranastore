import React from 'react';
import { LayoutGrid, ArrowUpDown, Percent } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 pt-2.5 pb-1">
      {/* Category Pills & Quick Filter Bar */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-black transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              selectedCategoryId === null
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-50'
            }`}
          >
            <LayoutGrid size={13} />
            All
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs">{cat.icon}</span>
                <span>{cat.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Sort / Deal Trigger */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setFilterDiscountedOnly(!filterDiscountedOnly)}
            className={`p-1.5 rounded-xl text-[10px] font-black transition border cursor-pointer ${
              filterDiscountedOnly
                ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700'
            }`}
            title="Hot Deals Only"
          >
            <Percent size={12} />
          </button>

          <div className="flex items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-2 py-1 text-[10px] font-bold text-gray-700 dark:text-slate-200">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-gray-800 dark:text-slate-200 cursor-pointer text-[10px]"
            >
              <option value="popular">Popular</option>
              <option value="price_low">₹ Low</option>
              <option value="price_high">₹ High</option>
              <option value="discount">Max %</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
