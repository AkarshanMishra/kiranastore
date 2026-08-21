import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, Search, CheckCircle2, Package, X, Sparkles, ExternalLink } from 'lucide-react';

export default function BrandsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [brands, setBrands] = useState([
    { id: 1, name: 'Amul', logoText: 'AMUL', category: 'Dairy & Beverages', productsCount: 68, status: 'FEATURED', origin: 'Anand, Gujarat' },
    { id: 2, name: 'Aashirvaad', logoText: 'ITC', category: 'Staples & Atta', productsCount: 42, status: 'ACTIVE', origin: 'Kolkata, WB' },
    { id: 3, name: "Lay's", logoText: 'PEPSI', category: 'Snacks & Munchies', productsCount: 35, status: 'FEATURED', origin: 'Gurugram, HR' },
    { id: 4, name: 'Fortune', logoText: 'ADANI', category: 'Oils & Grains', productsCount: 29, status: 'ACTIVE', origin: 'Ahmedabad, Gujarat' },
    { id: 5, name: 'Nestle (Maggi)', logoText: 'NESTLE', category: 'Packaged Foods', productsCount: 54, status: 'FEATURED', origin: 'Vevey / India' },
    { id: 6, name: 'Tata Sampann', logoText: 'TATA', category: 'Pulses & Spices', productsCount: 38, status: 'ACTIVE', origin: 'Mumbai, MH' },
    { id: 7, name: 'Mother Dairy', logoText: 'MD', category: 'Dairy & Ice Cream', productsCount: 45, status: 'ACTIVE', origin: 'Noida, UP' },
    { id: 8, name: 'Cadbury (Mondelez)', logoText: 'CADBURY', category: 'Chocolates & Sweets', productsCount: 31, status: 'FEATURED', origin: 'Mumbai, MH' },
  ]);

  const [brandName, setBrandName] = useState('');
  const [brandCategory, setBrandCategory] = useState('Dairy & Beverages');
  const [brandOrigin, setBrandOrigin] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newB = {
      id: Date.now(),
      name: brandName,
      logoText: brandName.substring(0, 4).toUpperCase(),
      category: brandCategory,
      productsCount: 0,
      status: 'ACTIVE',
      origin: brandOrigin || 'India'
    };
    setBrands([newB, ...brands]);
    setIsAddOpen(false);
    setBrandName('');
    alert(`Brand "${brandName}" added successfully!`);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this brand?')) {
      setBrands(brands.filter(b => b.id !== id));
    }
  };

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Brand & Manufacturer Directory</h2>
          <p className="text-xs text-slate-500">Manage FMCG brands, official logos, brand banners & associated catalog items</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FMCG brands..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-purple-600"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} /> Add Brand
          </button>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {filteredBrands.map((b) => (
          <div key={b.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-12 h-12 bg-slate-900 text-white font-black text-xs rounded-2xl flex items-center justify-center shadow-xs">
                  {b.logoText}
                </span>

                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                  b.status === 'FEATURED'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {b.status}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900">{b.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{b.category}</p>
              <span className="text-[11px] text-slate-400 block mt-1">HQ: {b.origin}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
              <span className="text-xs font-extrabold text-purple-700">
                {b.productsCount} SKUs
              </span>

              <div className="flex items-center gap-1">
                <button onClick={() => alert(`Editing brand ${b.name}`)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => handleDelete(b.id)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Brand Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Register New Brand</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Brand Name</label>
                <input type="text" required value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Haldiram's" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Category</label>
                <input type="text" required value={brandCategory} onChange={(e) => setBrandCategory(e.target.value)} placeholder="e.g. Namkeen & Sweets" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Origin / Manufacturer Location</label>
                <input type="text" value={brandOrigin} onChange={(e) => setBrandOrigin(e.target.value)} placeholder="e.g. Nagpur, Maharashtra" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Register Brand</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
