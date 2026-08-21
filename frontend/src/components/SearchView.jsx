import React, { useState } from 'react';
import { Search, Mic, Scan, Tag, Star, ArrowUpDown, Filter, Sparkles, X, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import VoiceSearchModal from './VoiceSearchModal';

export default function SearchView({
  products = [],
  categories = [],
  cart = {},
  addToCart,
  removeFromCart,
  wishlist = {},
  toggleWishlist,
  onSelectProduct,
  onOpenBarcodeScanner
}) {
  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const trendingTags = ['Amul Milk', 'Paneer', 'Aashirvaad Atta', 'Maggi', 'Lay\'s', 'Desi Ghee', 'Eggs', 'Cold Drinks'];

  const handleVoiceSearch = () => {
    setIsVoiceModalOpen(true);
  };

  const filteredProducts = products.filter(p => {
    const matchesQuery = !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(query.toLowerCase()));

    const matchesBrand = selectedBrand === 'ALL' || p.name.toLowerCase().includes(selectedBrand.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || (p.category_name && p.category_name.toLowerCase().includes(selectedCategory.toLowerCase())) || p.category_id === parseInt(selectedCategory);

    const price = p.discount_price || p.price;
    const matchesPrice = selectedPriceRange === 'ALL' ||
      (selectedPriceRange === 'UNDER_100' && price < 100) ||
      (selectedPriceRange === '100_300' && price >= 100 && price <= 300) ||
      (selectedPriceRange === 'ABOVE_300' && price > 300);

    const matchesRating = selectedRating === 'ALL' || (p.rating || 4.5) >= parseFloat(selectedRating);
    const matchesStock = !onlyInStock || (p.in_stock && (p.stock || 0) > 0);

    return matchesQuery && matchesBrand && matchesCategory && matchesPrice && matchesRating && matchesStock;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Search Input Box */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-2.5 shadow-sm flex items-center gap-2">
        <Search size={18} className="text-gray-400 ml-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 1,000+ groceries, brands & items..."
          className="flex-1 bg-transparent text-xs font-bold text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
          autoFocus
        />

        {query && (
          <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}

        <button
          onClick={handleVoiceSearch}
          className={`p-2 rounded-2xl transition ${
            isVoiceModalOpen ? 'bg-rose-500 text-white animate-pulse' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
          }`}
          title="Voice Search"
        >
          <Mic size={16} />
        </button>

        {onOpenBarcodeScanner && (
          <button
            onClick={onOpenBarcodeScanner}
            className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl hover:bg-slate-200"
            title="Barcode Scanner"
          >
            <Scan size={16} />
          </button>
        )}
      </div>

      {/* Trending Search Tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
          <Sparkles size={12} className="text-purple-600" /> Trending:
        </span>
        {trendingTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setQuery(tag)}
            className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-[11px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap hover:bg-purple-50 hover:text-purple-700 transition"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-3 flex flex-wrap items-center gap-2 text-xs">
        {/* Brand Dropdown */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold text-gray-800 dark:text-slate-200 outline-none"
        >
          <option value="ALL">All Brands</option>
          <option value="Amul">Amul</option>
          <option value="Aashirvaad">Aashirvaad</option>
          <option value="Lay's">Lay's</option>
          <option value="Fortune">Fortune</option>
          <option value="Maggi">Maggi</option>
          <option value="Mother Dairy">Mother Dairy</option>
        </select>

        {/* Price Range */}
        <select
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
          className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold text-gray-800 dark:text-slate-200 outline-none"
        >
          <option value="ALL">All Prices</option>
          <option value="UNDER_100">Under ₹100</option>
          <option value="100_300">₹100 - ₹300</option>
          <option value="ABOVE_300">Above ₹300</option>
        </select>

        {/* Rating Filter */}
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold text-gray-800 dark:text-slate-200 outline-none"
        >
          <option value="ALL">All Ratings</option>
          <option value="4.5">⭐ 4.5+ Rated</option>
          <option value="4.0">⭐ 4.0+ Rated</option>
        </select>

        {/* Stock Toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer ml-auto text-[11px] font-bold text-gray-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="w-4 h-4 accent-purple-600"
          />
          <span>In-Stock Only</span>
        </label>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-bold text-gray-500">
        <span>Found <strong>{filteredProducts.length}</strong> items</span>
        {query && <span>Results for "{query}"</span>}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            quantity={cart[p.id]?.quantity || 0}
            onAdd={() => addToCart(p)}
            onRemove={() => removeFromCart(p.id)}
            onSelect={() => onSelectProduct(p)}
            isWishlisted={!!wishlist[p.id]}
            onToggleWishlist={() => toggleWishlist(p)}
          />
        ))}
      </div>

      {/* Smart Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onQuerySubmit={(val) => setQuery(val)}
      />
    </div>
  );
}
