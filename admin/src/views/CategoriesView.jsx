import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, RefreshCw, Globe, X, CheckCircle2, Package, Layers } from 'lucide-react';

export default function CategoriesView({ categories = [], setCategories }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('🍎');
  const [imageUrl, setImageUrl] = useState('');

  const emojiPresets = ['🥛', '🍎', '🌾', '🌶️', '🍪', '☕', '🧼', '🍫', '📦', '🥚', '🧃', '🧴', '🍞', '🧀', '🍗'];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const refreshFromBackend = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok && setCategories) {
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      }
    } catch (e) {
      console.warn('Could not refresh categories:', e);
    }
  };

  useEffect(() => {
    refreshFromBackend();
    const interval = setInterval(refreshFromBackend, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        slug: (slug || name.toLowerCase().replace(/\s+/g, '-')).trim(),
        icon: icon || '📦',
        image_url: imageUrl.trim() || null
      };
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        if (setCategories) setCategories((prev) => [created, ...prev.filter(c => c.id !== created.id)]);
        showToast(`Category "${name}" created & published LIVE in the app!`);
        setIsAddOpen(false);
        setName('');
        setSlug('');
        setIcon('🍎');
        setImageUrl('');
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.detail || 'Failed to create category');
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Category not saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsSaving(true);
    try {
      const payload = {
        name: editingCategory.name.trim(),
        slug: editingCategory.slug || editingCategory.name.toLowerCase().replace(/\s+/g, '-'),
        icon: editingCategory.icon || '📦',
        image_url: editingCategory.image_url || null
      };
      const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        if (setCategories) setCategories((prev) => prev.map(c => c.id === updated.id ? updated : c));
        showToast(`Category "${updated.name}" updated live!`);
        setEditingCategory(null);
      } else {
        alert('Failed to update category');
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Category not saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Delete category "${catName}"? Products will remain active in catalog.`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (setCategories) setCategories((prev) => prev.filter(c => c.id !== id));
        showToast(`Category "${catName}" deleted from customer app.`);
      } else {
        alert('Failed to delete category');
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Category not deleted.');
    }
  };

  const filteredCategories = (categories || []).filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.slug || '').toLowerCase().includes(searchQuery.toLowerCase())
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
            <Layers size={24} className="text-purple-600" />
            Categories & Aisles
            <span className="bg-purple-50 text-purple-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200">
              {categories.length} Aisles
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Live aisle taxonomy shown in the customer app category bar, home aisles & instant catalog filter
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={refreshFromBackend} 
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-purple-700 hover:border-purple-300 transition flex items-center gap-1.5 text-xs font-extrabold shadow-xs"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button 
            onClick={() => setIsAddOpen(true)} 
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={15} /> Add New Aisle
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search aisles and categories..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Globe size={14} className="text-emerald-600" />
          <span>Real-time sync to customer app via <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[11px]">/api/categories</code></span>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                {cat.icon || '📦'}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-slate-900 truncate text-sm">{cat.name}</h3>
                <span className="text-[11px] text-slate-400 font-mono block truncate mt-0.5">
                  slug: {cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                LIVE VISIBILITY
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setEditingCategory({ ...cat })} 
                  className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition" 
                  title="Edit Category"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id, cat.name)} 
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition" 
                  title="Delete Category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium">
          No categories found matching your query.
        </div>
      )}

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full">
              <X size={16} />
            </button>
            <h3 className="font-black text-base mb-1 text-slate-900">Add New Category Aisle</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">This category will immediately appear in the customer mobile app</p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Name *</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }} 
                  placeholder="e.g. Masalas & Spices" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Icon Emoji</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                  {emojiPresets.map((em, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setIcon(em)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition ${
                        icon === em ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-white'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={icon} 
                  onChange={(e) => setIcon(e.target.value)} 
                  placeholder="e.g. 🌶️" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-center text-lg outline-none focus:border-purple-600" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="e.g. masalas-spices" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs outline-none focus:border-purple-600" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSaving} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                {isSaving ? 'Creating...' : 'Publish Category Live'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150">
            <button onClick={() => setEditingCategory(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full">
              <X size={16} />
            </button>
            <h3 className="font-black text-base mb-1 text-slate-900">Edit Category Aisle</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Update category name, icon, and display slug</p>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Name *</label>
                <input 
                  type="text" 
                  required 
                  value={editingCategory.name} 
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Icon Emoji</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                  {emojiPresets.map((em, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingCategory({ ...editingCategory, icon: em })}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition ${
                        editingCategory.icon === em ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-white'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={editingCategory.icon || '📦'} 
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-center text-lg outline-none focus:border-purple-600" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                <input 
                  type="text" 
                  value={editingCategory.slug || ''} 
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs outline-none focus:border-purple-600" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSaving} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                {isSaving ? 'Saving...' : 'Save & Update Live'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
