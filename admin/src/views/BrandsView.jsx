import React, { useEffect, useState } from 'react';
import { 
  Edit2, Globe, Plus, RefreshCw, Search, Star, Trash2, X, 
  CheckCircle2, Sparkles, Check, Tag, ShieldCheck 
} from 'lucide-react';

export default function BrandsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const [brandName, setBrandName] = useState('');
  const [brandCategory, setBrandCategory] = useState('Dairy & Breakfast');
  const [brandOrigin, setBrandOrigin] = useState('India');
  const [brandLogo, setBrandLogo] = useState('🏷️');

  const brandEmojiPresets = ['🥛', '🌾', '🍫', '🍪', '☕', '🧼', '🧴', '🍟', '🧀', '🧃', '🏷️', '✨'];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setBrands(data);
      }
    } catch (e) {
      console.warn('Could not fetch brands:', e);
    }
  };

  useEffect(() => {
    loadBrands();
    const interval = setInterval(loadBrands, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setIsSaving(true);

    const payload = {
      name: brandName.trim(),
      logo: brandLogo || '🏷️',
      category: brandCategory || 'General',
      origin: brandOrigin || 'India',
      logo_text: brandName.substring(0, 4).toUpperCase(),
      sort_order: brands.length + 1,
      is_active: true,
      is_featured: true
    };

    try {
      const res = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const created = await res.json();
        setBrands((prev) => [created, ...prev.filter((b) => b.id !== created.id)]);
        setBrandName('');
        setBrandCategory('Dairy & Breakfast');
        setBrandOrigin('India');
        setBrandLogo('🏷️');
        setIsAddOpen(false);
        showToast(`Official Brand "${payload.name}" published to customer store!`);
      } else {
        alert('Failed to add brand');
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Brand not saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingBrand) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/brands/${editingBrand.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBrand)
      });

      if (res.ok) {
        const updated = await res.json();
        setBrands((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        setEditingBrand(null);
        showToast(`Brand "${updated.name}" updated live!`);
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Brand not saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFeatured = async (brand) => {
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brand, is_featured: !brand.is_featured })
      });

      if (res.ok) {
        const updated = await res.json();
        setBrands((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        showToast(`"${brand.name}" ${!brand.is_featured ? 'marked as Featured Brand ⭐' : 'removed from Featured'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (brand) => {
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brand, is_active: !brand.is_active })
      });

      if (res.ok) {
        const updated = await res.json();
        setBrands((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        showToast(`"${brand.name}" set to ${!brand.is_active ? 'LIVE VISIBILITY' : 'HIDDEN'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete official brand "${name}" from the customer store?`)) return;

    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBrands((prev) => prev.filter((b) => b.id !== id));
        showToast(`Brand "${name}" deleted.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBrands = brands.filter((b) =>
    (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl text-xs font-black shadow-lg flex items-center justify-between animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="opacity-80 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Tag size={24} className="text-purple-600" />
            FMCG Brand Stores
            <span className="bg-purple-50 text-purple-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200">
              {brands.length} Brands
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Manage official partner brands shown in the customer app "Shop by Official Brands" storefront carousel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={loadBrands} 
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-purple-700 hover:border-purple-300 transition flex items-center gap-1.5 text-xs font-extrabold shadow-xs"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button 
            onClick={() => setIsAddOpen(true)} 
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={15} /> Add Brand Store
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FMCG brands by name, category..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Globe size={14} className="text-emerald-600" />
          <span>Real-time sync to customer app via <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[11px]">/api/admin/brands</code></span>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => (
          <div key={brand.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                    {brand.logo || '🏷️'}
                  </span>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm line-clamp-1">{brand.name}</h3>
                    <span className="text-[11px] text-slate-400 font-medium block">
                      {brand.category} • {brand.origin || 'India'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleFeatured(brand)}
                  className={`p-1.5 rounded-xl transition ${
                    brand.is_featured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                  }`}
                  title={brand.is_featured ? 'Featured Brand' : 'Click to feature'}
                >
                  <Star size={16} className={brand.is_featured ? 'fill-amber-500' : ''} />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(brand)}
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full transition ${
                  brand.is_active 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {brand.is_active ? 'LIVE VISIBLE' : 'HIDDEN'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingBrand({ ...brand })}
                  className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
                  title="Edit Brand"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(brand.id, brand.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Delete Brand"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium">
          No FMCG brands found matching your search.
        </div>
      )}

      {/* Add Brand Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full">
              <X size={16} />
            </button>
            <h3 className="font-black text-base mb-1 text-slate-900">Add FMCG Brand Partner</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">This brand will be highlighted in the customer official brands carousel</p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Brand Name *</label>
                <input 
                  type="text" 
                  required 
                  value={brandName} 
                  onChange={(e) => setBrandName(e.target.value)} 
                  placeholder="e.g. Amul, Aashirvaad, Tata, Nestle" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Brand Logo / Emoji</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                  {brandEmojiPresets.map((em, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBrandLogo(em)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition ${
                        brandLogo === em ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-white'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={brandLogo} 
                  onChange={(e) => setBrandLogo(e.target.value)} 
                  placeholder="e.g. 🥛" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-center text-lg outline-none focus:border-purple-600" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={brandCategory}
                    onChange={(e) => setBrandCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  >
                    <option value="Dairy & Breakfast">Dairy & Breakfast</option>
                    <option value="Snacks & Munchies">Snacks & Munchies</option>
                    <option value="Atta, Rice & Dal">Atta, Rice & Dal</option>
                    <option value="Tea & Beverages">Tea & Beverages</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Cleaning & Household">Household</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Origin Country</label>
                  <input 
                    type="text" 
                    value={brandOrigin} 
                    onChange={(e) => setBrandOrigin(e.target.value)} 
                    placeholder="e.g. India" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSaving} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                {isSaving ? 'Adding Brand...' : 'Publish Brand to App'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {editingBrand && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150">
            <button onClick={() => setEditingBrand(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full">
              <X size={16} />
            </button>
            <h3 className="font-black text-base mb-1 text-slate-900">Edit FMCG Brand</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Update brand identity and storefront categorization</p>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Brand Name *</label>
                <input 
                  type="text" 
                  required 
                  value={editingBrand.name} 
                  onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Brand Logo / Emoji</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                  {brandEmojiPresets.map((em, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingBrand({ ...editingBrand, logo: em })}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition ${
                        editingBrand.logo === em ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-white'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={editingBrand.logo || '🏷️'} 
                  onChange={(e) => setEditingBrand({ ...editingBrand, logo: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-center text-lg outline-none focus:border-purple-600" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={editingBrand.category || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  >
                    <option value="Dairy & Breakfast">Dairy & Breakfast</option>
                    <option value="Snacks & Munchies">Snacks & Munchies</option>
                    <option value="Atta, Rice & Dal">Atta, Rice & Dal</option>
                    <option value="Tea & Beverages">Tea & Beverages</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Cleaning & Household">Household</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Origin Country</label>
                  <input 
                    type="text" 
                    value={editingBrand.origin || 'India'} 
                    onChange={(e) => setEditingBrand({ ...editingBrand, origin: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSaving} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                {isSaving ? 'Saving...' : 'Save & Publish Live'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
