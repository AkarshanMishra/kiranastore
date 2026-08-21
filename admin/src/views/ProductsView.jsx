import React, { useState } from 'react';
import { Package, Plus, Search, Tag, Star, Trash2, Edit2, ShieldCheck, Check, X, Eye, AlertCircle, Download, Upload, Sparkles, Filter } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';

export default function ProductsView({ products = [], categories = [], onUpdateProduct, onProductCreated, onDeleteProduct }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL' | 'LOW' | 'OUT'

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || (p.category_name && p.category_name.toLowerCase().includes(selectedCategory.toLowerCase())) || p.category_id === parseInt(selectedCategory);
    const matchesStock = stockFilter === 'ALL' ||
      (stockFilter === 'LOW' && (p.stock <= 10 && p.stock > 0)) ||
      (stockFilter === 'OUT' && (p.stock === 0 || !p.in_stock));

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (onUpdateProduct) {
      onUpdateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        discount_price: editingProduct.discount_price ? parseFloat(editingProduct.discount_price) : null,
        stock: parseInt(editingProduct.stock),
        weight_unit: editingProduct.weight_unit,
        in_stock: parseInt(editingProduct.stock) > 0
      });
    }
    setEditingProduct(null);
  };

  // Quick Stock Adjustment
  const handleQuickStock = (product, delta) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    if (onUpdateProduct) {
      onUpdateProduct(product.id, {
        stock: newStock,
        in_stock: newStock > 0
      });
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Category", "MRP Price", "Selling Price", "Stock", "Unit", "In Stock"];
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category_name || ''}"`,
      p.price,
      p.discount_price || p.price,
      p.stock,
      `"${p.weight_unit || ''}"`,
      p.in_stock ? 'YES' : 'NO'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kiranastore_catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            Catalog Products & SKUs
            <span className="bg-purple-50 text-purple-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200">
              {products.length} Items Total
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Manage grocery products, MRP/selling prices, units & inventory stock</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-extrabold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition"
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={15} /> Add New Product
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, category, brand..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
          />
        </div>

        {/* Category & Stock Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-purple-600 flex-1 md:flex-initial"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-purple-600 flex-1 md:flex-initial"
          >
            <option value="ALL">All Stock Status</option>
            <option value="LOW">⚠️ Low Stock (≤ 10)</option>
            <option value="OUT">❌ Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">MRP / Selling Price</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredProducts.slice(0, 50).map((p) => {
                const isLow = p.stock > 0 && p.stock <= 10;
                const isOut = p.stock === 0 || !p.in_stock;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    {/* Item Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'}
                          alt={p.name}
                          className="w-11 h-11 object-cover rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80';
                          }}
                        />
                        <div>
                          <div className="font-extrabold text-slate-900 line-clamp-1">{p.name}</div>
                          <span className="text-[11px] text-slate-400 font-bold">{p.weight_unit || 'Standard'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                        {p.category_name || 'Grocery'}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3 px-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-slate-900 text-sm">
                          ₹{p.discount_price ? p.discount_price : p.price}
                        </span>
                        {p.discount_price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{p.price}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock & Quick Adjustments */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black px-2 py-0.5 rounded-md text-xs ${
                          isOut ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          isLow ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {p.stock} units
                        </span>

                        <button
                          onClick={() => handleQuickStock(p, +10)}
                          className="w-5 h-5 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 font-black rounded-md flex items-center justify-center text-[10px] transition"
                          title="Add 10 units"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        isOut ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isOut ? 'OUT OF STOCK' : 'AVAILABLE'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingProduct({ ...p })}
                          className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="Edit product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              if (onDeleteProduct) onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <Package size={36} className="mx-auto mb-2 opacity-50" />
            <p className="font-bold text-sm text-slate-600">No products match your search</p>
            <p className="text-xs">Try searching with a different term or add a new product</p>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="font-black text-lg mb-1 text-slate-900 flex items-center gap-2">
              <Edit2 size={18} className="text-purple-600" /> Edit Product Details
            </h3>
            <p className="text-xs text-slate-500 mb-4">Modify prices, unit weight and stock quantity</p>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Selling / Discount Price (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProduct.discount_price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discount_price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit / Pack Size</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.weight_unit || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight_unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-md transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal Component */}
      <AddProductModal
        isOpen={isAddModalOpen}
        categories={categories}
        onClose={() => setIsAddModalOpen(false)}
        onProductCreated={(newProd) => {
          if (onProductCreated) onProductCreated(newProd);
        }}
      />
    </div>
  );
}
