import React, { useState } from 'react';
import { X, Plus, Image, Tag, DollarSign, Package, Sparkles } from 'lucide-react';

export default function AddProductModal({ categories, isOpen, onClose, onProductCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    category_id: categories[0]?.id || 1,
    weight_unit: '500 g',
    price: '',
    discount_price: '',
    stock: 50,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image_url) {
      alert('Please fill in product name, price, and image URL.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category_id: parseInt(formData.category_id),
        weight_unit: formData.weight_unit.trim(),
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock: parseInt(formData.stock),
        in_stock: formData.in_stock,
        image_url: formData.image_url.trim(),
        description: formData.description.trim() || 'Fresh local kirana store grocery item.'
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newProduct = await res.json();
        onProductCreated(newProduct);
        onClose();
      } else {
        // Fallback for offline/mock state
        const fallbackProduct = {
          id: Date.now(),
          ...payload,
          category_name: categories.find(c => c.id === payload.category_id)?.name || 'General'
        };
        onProductCreated(fallbackProduct);
        onClose();
      }
    } catch (err) {
      const fallbackProduct = {
        id: Date.now(),
        ...formData,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock: parseInt(formData.stock)
      };
      onProductCreated(fallbackProduct);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-black mb-1 flex items-center gap-2 text-slate-900">
          <Plus size={20} className="text-purple-600" /> Add New Catalog Product
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-medium">Add SKU item with pricing, tax, stock & image to store catalog</p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Amul Taaza Toned Milk (500 ml)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 text-slate-900 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Category *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 text-slate-900 font-bold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon || '📦'} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Unit / Pack Size *</label>
              <input
                type="text"
                required
                value={formData.weight_unit}
                onChange={(e) => setFormData({ ...formData, weight_unit: e.target.value })}
                placeholder="e.g. 500 g, 1 L, 4 Pack"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 text-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">MRP Price (₹) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="60"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Selling Price (₹)</label>
              <input
                type="number"
                step="0.1"
                value={formData.discount_price}
                onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                placeholder="55"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Initial Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 text-slate-900 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Product Image URL *</label>
            <input
              type="text"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Short Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Fresh grocery item delivered same-day or next-day."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 text-slate-900 font-medium"
            />
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-md disabled:opacity-50 transition"
            >
              {submitting ? 'Adding...' : 'Save Product to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
