import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Tag, Star, Trash2, Edit2, ShieldCheck, Check, 
  X, Eye, AlertCircle, Download, Upload, Sparkles, Filter, RefreshCw, 
  CheckSquare, Square, Layers, ArrowUpDown, ChevronDown, CheckCircle2, DollarSign
} from 'lucide-react';
import AddProductModal from '../components/AddProductModal';

export default function ProductsView({ products = [], categories = [], onUpdateProduct, onProductCreated, onDeleteProduct }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'LOW' | 'OUT'
  const [sortBy, setSortBy] = useState('DEFAULT'); // 'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC' | 'STOCK_ASC' | 'STOCK_DESC'
  
  // Modals & Selected States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [bulkCategoryVal, setBulkCategoryVal] = useState('');
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.weight_unit && p.weight_unit.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'ALL' || 
      (p.category_name && p.category_name.toLowerCase() === selectedCategory.toLowerCase()) || 
      p.category_id === parseInt(selectedCategory);

    const isLow = p.stock > 0 && p.stock <= 10;
    const isOut = p.stock === 0 || !p.in_stock;

    const matchesStock = stockFilter === 'ALL' ||
      (stockFilter === 'IN_STOCK' && !isOut) ||
      (stockFilter === 'LOW' && isLow) ||
      (stockFilter === 'OUT' && isOut);

    return matchesSearch && matchesCategory && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'PRICE_ASC') return (a.discount_price || a.price) - (b.discount_price || b.price);
    if (sortBy === 'PRICE_DESC') return (b.discount_price || b.price) - (a.discount_price || a.price);
    if (sortBy === 'STOCK_ASC') return (a.stock || 0) - (b.stock || 0);
    if (sortBy === 'STOCK_DESC') return (b.stock || 0) - (a.stock || 0);
    return 0;
  });

  // Handle Select All Checkbox
  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(pid => pid !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  // Quick Stock Adjustment
  const handleQuickStock = async (product, delta) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    if (onUpdateProduct) {
      await onUpdateProduct(product.id, {
        stock: newStock,
        in_stock: newStock > 0
      });
      showToast(`Stock for "${product.name}" updated to ${newStock} units`);
    }
  };

  // Quick In-Stock Toggle
  const handleToggleInStock = async (product) => {
    const newInStock = !product.in_stock;
    const newStock = newInStock && product.stock === 0 ? 20 : product.stock;
    if (onUpdateProduct) {
      await onUpdateProduct(product.id, {
        in_stock: newInStock,
        stock: newStock
      });
      showToast(`"${product.name}" marked as ${newInStock ? 'AVAILABLE' : 'OUT OF STOCK'}`);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (onUpdateProduct) {
      await onUpdateProduct(editingProduct.id, {
        name: editingProduct.name.trim(),
        category_id: parseInt(editingProduct.category_id),
        price: parseFloat(editingProduct.price),
        discount_price: editingProduct.discount_price ? parseFloat(editingProduct.discount_price) : null,
        stock: parseInt(editingProduct.stock),
        weight_unit: editingProduct.weight_unit ? editingProduct.weight_unit.trim() : 'Standard',
        image_url: editingProduct.image_url ? editingProduct.image_url.trim() : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
        description: editingProduct.description ? editingProduct.description.trim() : '',
        in_stock: parseInt(editingProduct.stock) > 0 && editingProduct.in_stock
      });
      showToast(`Product "${editingProduct.name}" updated successfully!`);
    }
    setEditingProduct(null);
  };

  // Bulk Actions
  const handleExecuteBulk = async (action, value = null) => {
    if (selectedProductIds.length === 0) return;
    if (action === 'DELETE' && !confirm(`Permanently delete ${selectedProductIds.length} selected products?`)) return;

    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action,
          product_ids: selectedProductIds,
          value: value
        })
      });
      if (res.ok) {
        showToast(`Bulk action ${action} applied to ${selectedProductIds.length} items!`);
        setSelectedProductIds([]);
        setIsBulkOpen(false);
        window.location.reload();
      }
    } catch (e) {
      console.warn('Bulk action error:', e);
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
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toast */}
      {feedbackToast && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl text-xs font-black shadow-lg flex items-center justify-between animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{feedbackToast}</span>
          </div>
          <button onClick={() => setFeedbackToast(null)} className="opacity-80 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Package size={24} className="text-purple-600" />
            Catalog Products & SKUs
            <span className="bg-purple-50 text-purple-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200">
              {products.length} Total SKUs
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Live catalog synced with customer mobile app: Manage SKUs, pricing, stock levels & instant inventory status
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition"
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={15} /> Add New SKU
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl font-extrabold whitespace-nowrap transition ${
            selectedCategory === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map(c => {
          const count = products.filter(p => p.category_id === c.id || p.category_name === c.name).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory.toLowerCase() === c.name.toLowerCase() 
                  ? 'bg-purple-600 text-white shadow-xs font-black' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{c.icon || '📦'}</span>
              <span>{c.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory.toLowerCase() === c.name.toLowerCase() ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Stock Filter Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, category, unit..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
          />
        </div>

        {/* Stock Filter & Sort By Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
            {[
              { id: 'ALL', label: 'All Stock' },
              { id: 'IN_STOCK', label: 'In Stock' },
              { id: 'LOW', label: '⚠️ Low (≤10)' },
              { id: 'OUT', label: '❌ Out of Stock' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStockFilter(st.id)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  stockFilter === st.id ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-purple-600"
          >
            <option value="DEFAULT">Sort By: Default</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="PRICE_DESC">Price: High to Low</option>
            <option value="STOCK_ASC">Stock: Low to High</option>
            <option value="STOCK_DESC">Stock: High to Low</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when items selected) */}
      {selectedProductIds.length > 0 && (
        <div className="bg-purple-900 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between flex-wrap gap-2 text-xs animate-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-purple-300" />
            <span className="font-extrabold">{selectedProductIds.length} Products Selected</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleExecuteBulk('SET_IN_STOCK')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition"
            >
              Mark In-Stock
            </button>
            <button
              onClick={() => handleExecuteBulk('SET_OUT_OF_STOCK')}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition"
            >
              Mark Out-of-Stock
            </button>
            <button
              onClick={() => handleExecuteBulk('PRICE_DISCOUNT', 10)}
              className="bg-purple-700 hover:bg-purple-600 text-white font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition"
            >
              Apply 10% OFF
            </button>
            <button
              onClick={() => handleExecuteBulk('DELETE')}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition flex items-center gap-1"
            >
              <Trash2 size={12} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-700">
                    {selectedProductIds.length > 0 && selectedProductIds.length === filteredProducts.length ? (
                      <CheckSquare size={16} className="text-purple-600" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Item Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">MRP / Selling Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredProducts.map((p) => {
                const isLow = p.stock > 0 && p.stock <= 10;
                const isOut = p.stock === 0 || !p.in_stock;
                const isSelected = selectedProductIds.includes(p.id);

                return (
                  <tr key={p.id} className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-purple-50/40' : ''}`}>
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <button onClick={() => handleToggleSelect(p.id)} className="text-slate-400 hover:text-slate-700">
                        {isSelected ? (
                          <CheckSquare size={16} className="text-purple-600" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </td>

                    {/* Item Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80'}
                          alt={p.name}
                          className="w-11 h-11 object-cover rounded-2xl bg-slate-100 border border-slate-200 flex-shrink-0"
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
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                        {p.category_name || 'Grocery'}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black px-2 py-0.5 rounded-md text-xs ${
                          isOut ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          isLow ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {p.stock} units
                        </span>

                        <button
                          onClick={() => handleQuickStock(p, -5)}
                          className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-md flex items-center justify-center text-[10px] transition"
                          title="Reduce 5 units"
                        >
                          -
                        </button>
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
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleInStock(p)}
                        className={`text-[10px] font-black px-2 py-0.5 rounded transition ${
                          isOut ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title="Click to toggle in-stock status"
                      >
                        {isOut ? 'OUT OF STOCK' : 'AVAILABLE'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingProduct({ ...p })}
                          className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
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
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
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
          <div className="p-12 text-center text-slate-400 font-medium text-xs">
            No products found matching your active filter.
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-black mb-1 text-slate-900">Edit Catalog Product</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Update pricing, inventory, category and descriptions</p>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={editingProduct.category_id || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon || '📦'} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Weight / Unit</label>
                  <input
                    type="text"
                    value={editingProduct.weight_unit || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight_unit: e.target.value })}
                    placeholder="e.g. 500 g, 1 L"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">MRP Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.discount_price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discount_price: e.target.value })}
                    placeholder="Leave empty if none"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stock Level</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Availability</label>
                  <select
                    value={editingProduct.in_stock ? 'true' : 'false'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, in_stock: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  >
                    <option value="true">In Stock & Available</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.image_url || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition"
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
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onProductCreated={(newP) => {
          if (onProductCreated) onProductCreated(newP);
          showToast(`Added "${newP.name}" to store catalog!`);
        }}
      />
    </div>
  );
}
