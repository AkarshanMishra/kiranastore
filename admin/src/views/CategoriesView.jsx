import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, RefreshCw, Globe, X } from 'lucide-react';

export default function CategoriesView({ categories = [], setCategories }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('🍎');
  const [imageUrl, setImageUrl] = useState('');

  // Sync with the latest backend list passed from App.jsx
  const categoryList = categories || [];

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
        alert(`Category "${name}" created and is now LIVE in the customer app!`);
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
        name: editingCategory.name,
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
        alert('Category updated & published to the customer app!');
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Products remain but lose their category.')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (setCategories) setCategories((prev) => prev.filter(c => c.id !== id));
        alert('Category deleted and removed from the customer app.');
      } else {
        alert('Failed to delete category');
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Category not deleted.');
    }
  };

  const filteredCategories = categoryList.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.slug || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Categories & Aisles</h2>
          <p className="text-xs text-slate-500">Create & edit aisles shown in the customer app category bar, category screen and home page</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={refreshFromBackend} className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-purple-700 hover:border-purple-300 transition flex items-center gap-1.5 text-xs font-extrabold">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setIsAddOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs">
            <Plus size={16} /> Add New Category
          </button>
        </div>
      </div>

      {/* Live status banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
        <Globe size={14} className="text-emerald-600" />
        {categoryList.length} categories synced LIVE to the customer app via <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono">/api/categories</code>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400 font-bold text-xs">
          No categories yet. Click "Add New Category" to publish the first aisle.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl">{cat.icon || '📦'}</span>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900 truncate">{cat.name}</h3>
                  <span className="text-[11px] text-slate-500 font-mono block truncate">{cat.slug || '—'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">LIVE</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditingCategory({ ...cat })} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition" title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Add New Category</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Masalas & Spices" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Icon / Emoji</label>
                <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. 🌶️" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-lg" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. masalas-spices" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Banner Image URL (optional)</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium" />
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md disabled:opacity-50">
                {isSaving ? 'Publishing...' : 'Publish Category to Customer App'}
              </button>
            </form>
          </div>
        </div>
      )}
{/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setEditingCategory(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Edit Category: {editingCategory.name}</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Name</label>
                <input type="text" required value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Icon</label>
                <input type="text" value={editingCategory.icon || ''} onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-lg" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Slug</label>
                <input type="text" value={editingCategory.slug || ''} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono" />
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save & Publish Live'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}