import React from 'react';
import { Tag, Sparkles, ChevronRight } from 'lucide-react';

export default function BrandsSection({ onSelectBrand, selectedBrand }) {
  const brands = [
    { name: 'All Brands', logo: '🏷️', sub: 'All Items' },
    { name: 'Amul', logo: '🥛', sub: 'Dairy & Ghee' },
    { name: 'Aashirvaad', logo: '🌾', sub: 'Atta & Salt' },
    { name: "Lay's", logo: '🍿', sub: 'Chips & Snacks' },
    { name: 'Fortune', logo: '🧈', sub: 'Oils & Grains' },
    { name: 'Nestle (Maggi)', logo: '🍜', sub: 'Noodles & Coffee' },
    { name: 'Tata Sampann', logo: '🌿', sub: 'Dal & Spices' },
    { name: 'Mother Dairy', logo: '🍦', sub: 'Dairy & Curd' },
    { name: 'Cadbury', logo: '🍫', sub: 'Chocolates' }
  ];

  return (
    <div className="my-6 bg-white dark:bg-slate-800 rounded-3xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-[11px] font-black uppercase tracking-wider">
            <Sparkles size={13} />
            <span>FMCG Brand Stores</span>
          </div>
          <h3 className="text-base font-black text-gray-900 dark:text-white mt-0.5">
            Shop by Official Brands
          </h3>
        </div>

        {selectedBrand && (
          <button
            onClick={() => onSelectBrand('')}
            className="text-xs font-extrabold text-purple-600 dark:text-purple-400 hover:underline"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5">
        {brands.map((b) => {
          const isSelected = (b.name === 'All Brands' && !selectedBrand) || selectedBrand === b.name;

          return (
            <button
              key={b.name}
              onClick={() => onSelectBrand(b.name === 'All Brands' ? '' : b.name)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 scale-105'
                  : 'bg-gray-50 dark:bg-slate-900/60 text-gray-800 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-700'
              }`}
            >
              <span className="text-2xl mb-1">{b.logo}</span>
              <span className="font-black text-[11px] leading-tight block truncate w-full">{b.name}</span>
              <span className={`text-[9px] font-medium block truncate w-full mt-0.5 ${
                isSelected ? 'text-purple-100' : 'text-gray-400'
              }`}>
                {b.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
