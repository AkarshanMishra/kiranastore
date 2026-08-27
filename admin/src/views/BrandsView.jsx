import React, { useEffect, useState } from 'react';
import { Edit2, Globe, Plus, RefreshCw, Search, Star, Trash2, X } from 'lucide-react';

export default function BrandsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [brandName, setBrandName] = useState('');
  const [brandCategory, setBrandCategory] = useState('Dairy & Beverages');
  const [brandOrigin, setBrandOrigin] = useState('');
  const [brandLogo, setBrandLogo] = useState('🏷️');

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
        setBrandCategory('Dairy & Beverages');
        setBrandOrigin('');
        setBrandLogo('🏷️');
        setIsAddOpen(false);
        alert(`Brand "${payload.name}" published to the customer app!`);
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
        alert('Brand updated & published live!');
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand from the customer app?')) return;

    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' });
      if (res.ok) setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBrands = brands.filter((b) =>
    (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const liveCount = brands.filter((b) => b.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">FMCG Brand Stores</h2>
          <p className="text-xs text-slate-500">Manage the brands shown in the customer app "Shop by Official Brands" section</p>
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
          <button onClick={loadBrands} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-purple-700 hover:border-purple-300 transition flex items-center gap-1.5 text-xs font-extrabold">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setIsAddOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Plus size={15} /> Add Brand
          </button>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
        <Globe size={14} className="text-emerald-600" />
        {liveCount} live brands synced to the customer app "Shop by Official Brands" section.
      </div>

      {filteredBrands.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400 font-bold text-xs">
          No brands yet. Register your first FMCG brand store.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBrands.map((b) => (
            <div key={b.id} className={`bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col gap-3 ${b.is_active ? '' : 'opacity-60'}`}>
              <div className="flex items-center justify-between">
                <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black shadow-xs ${b.is_featured ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {b.logo_text || (b.name || 'BRAND').substring(0, 4).toUpperCase()}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggleFeatured(b)} className={`p-1.5 rounded-lg transition ${b.is_featured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500'}`} title={b.is_featured ? 'Unfeature' : 'Feature'}>
                    <Star size={14} fill={b.is_featured ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => setEditingBrand({ ...b })} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg" title="Edit"><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Delete"><Trash2 size={13} /></button>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>{b.logo || '🏷️'}</span> {b.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{b.category || 'General'}</p>
                <span className="text-[11px] text-slate-400 block mt-1">HQ: {b.origin || 'India'}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(b)}
                  className={`text-[9px] font-black px-2 py-0.5 rounded border ${b.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                >
                  {b.is_active ? 'LIVE' : 'HIDDEN'}
                </button>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${b.is_featured ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                  {b.is_featured ? 'FEATURED' : 'STANDARD'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <label className="block text-slate-700 font-bold mb-1">Icon / Logo Emoji</label>
                <input type="text" value={brandLogo} onChange={(e) => setBrandLogo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center text-xl" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Category</label>
                <input type="text" required value={brandCategory} onChange={(e) => setBrandCategory(e.target.value)} placeholder="e.g. Namkeen & Sweets" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Origin / Manufacturer Location</label>
                <input type="text" value={brandOrigin} onChange={(e) => setBrandOrigin(e.target.value)} placeholder="e.g. Nagpur, Maharashtra" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md disabled:opacity-50">
                {isSaving ? 'Publishing...' : 'Register & Publish Brand'}
              </button>
            </form>
          </div>
        </div>
      )}

      {editingBrand && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setEditingBrand(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Edit Brand: {editingBrand.name}</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Brand Name</label>
                <input type="text" required value={editingBrand.name} onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Icon / Logo Emoji</label>
                <input type="text" value={editingBrand.logo || ''} onChange={(e) => setEditingBrand({ ...editingBrand, logo: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center text-xl" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <input type="text" value={editingBrand.category || ''} onChange={(e) => setEditingBrand({ ...editingBrand, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Origin</label>
                <input type="text" value={editingBrand.origin || ''} onChange={(e) => setEditingBrand({ ...editingBrand, origin: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Brand Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
