import React, { useState } from 'react';
import { Search, Plus, Minus, PackageCheck, AlertCircle } from 'lucide-react';
import AddProductModal from './AddProductModal';

export default function InventoryManager({ products, categories, onUpdateProduct, onProductCreated }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCatId === 'ALL' || p.category_id === parseInt(selectedCatId);
    return matchesSearch && matchesCat;
  });

  const handleStockChange = (product, delta) => {
    const newStock = Math.max(0, product.stock + delta);
    onUpdateProduct(product.id, { stock: newStock, in_stock: newStock > 0 });
  };

  const handleToggleInStock = (product) => {
    onUpdateProduct(product.id, { in_stock: !product.in_stock });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-extrabold text-white text-lg">Dark Store Inventory Control</h3>
          <p className="text-xs text-slate-400">Manage real-time stock levels, pricing, and item availability</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow transition active:scale-95"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items in stock..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={selectedCatId}
          onChange={(e) => setSelectedCatId(e.target.value)}
          className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-700/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-700">
            <tr>
              <th className="p-3.5">Product SKU</th>
              <th className="p-3.5">Unit</th>
              <th className="p-3.5">Selling Price</th>
              <th className="p-3.5">Available Stock</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Quick Stock Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 bg-slate-800">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-700/40 transition">
                <td className="p-3.5 font-bold text-white flex items-center gap-3">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded-xl bg-slate-900 border border-slate-700"
                  />
                  <div>
                    <div className="font-extrabold text-slate-100">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Rating: ⭐ {p.rating}</div>
                  </div>
                </td>
                <td className="p-3.5 text-slate-400 font-medium">{p.weight_unit}</td>
                <td className="p-3.5 font-black text-white">
                  ₹{p.discount_price || p.price}
                  {p.discount_price && (
                    <span className="text-[10px] text-slate-500 line-through ml-1.5 font-normal">
                      ₹{p.price}
                    </span>
                  )}
                </td>
                <td className="p-3.5">
                  <span className={`font-black ${p.stock < 10 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="p-3.5">
                  <button
                    onClick={() => handleToggleInStock(p)}
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border transition ${
                      p.in_stock
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60 hover:bg-emerald-900'
                        : 'bg-rose-950/80 text-rose-400 border-rose-700/60 hover:bg-rose-900'
                    }`}
                  >
                    {p.in_stock ? 'IN STOCK ✅' : 'OUT OF STOCK ❌'}
                  </button>
                </td>
                <td className="p-3.5 text-right">
                  <div className="inline-flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
                    <button
                      onClick={() => handleStockChange(p, -5)}
                      className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded font-bold"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleStockChange(p, -1)}
                      className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded font-bold"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleStockChange(p, 1)}
                      className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded font-bold"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleStockChange(p, 5)}
                      className="px-2 py-1 text-purple-400 hover:bg-purple-900/50 rounded font-bold"
                    >
                      +5
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        categories={categories}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductCreated={onProductCreated}
      />
    </div>
  );
}
