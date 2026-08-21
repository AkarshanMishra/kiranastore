import React, { useState } from 'react';
import { Layers, AlertCircle, Plus, Minus, AlertTriangle, IndianRupee, RefreshCw, Search, ArrowDownCircle, ArrowUpCircle, X, CheckCircle2 } from 'lucide-react';

export default function InventoryView({ products = [], onUpdateProduct }) {
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [selectedProductForInward, setSelectedProductForInward] = useState(null);
  const [inwardQuantity, setInwardQuantity] = useState(50);

  const totalStockValue = products.reduce((sum, p) => sum + ((p.discount_price || p.price) * (p.stock || 0)), 0);
  const lowStockCount = products.filter(p => (p.stock || 0) <= 10 && (p.stock || 0) > 0).length;
  const outOfStockCount = products.filter(p => !p.in_stock || (p.stock || 0) === 0).length;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLow = filterLowStock ? (p.stock || 0) <= 10 : true;
    return matchesSearch && matchesLow;
  });

  const handleAdjustStock = (product, delta) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    if (onUpdateProduct) onUpdateProduct(product.id, { stock: newStock, in_stock: newStock > 0 });
  };

  const handleInwardSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductForInward) return;
    const addQty = parseInt(inwardQuantity) || 0;
    const newStock = (selectedProductForInward.stock || 0) + addQty;
    if (onUpdateProduct) {
      onUpdateProduct(selectedProductForInward.id, {
        stock: newStock,
        in_stock: true
      });
    }
    setIsStockInModalOpen(false);
    setSelectedProductForInward(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold block mb-1">Total Stock Asset Value</span>
            <div className="text-2xl font-black text-slate-900">₹{totalStockValue.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Physical Grocery Stock</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200">
            <IndianRupee size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold block mb-1">Low Stock Alerts</span>
            <div className="text-2xl font-black text-amber-600">{lowStockCount} items</div>
            <span className="text-[10px] text-amber-700 font-bold mt-1 inline-block">Stock ≤ 10 units</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200">
            <AlertTriangle size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold block mb-1">Out of Stock SKUs</span>
            <div className="text-2xl font-black text-rose-600">{outOfStockCount} items</div>
            <span className="text-[10px] text-rose-700 font-bold mt-1 inline-block">Requires supplier reorder</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200">
            <AlertCircle size={22} />
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Store Stock & Inward Entry Ledger</h3>
            <p className="text-xs text-slate-500 font-medium">Perform stock adjustments, purchase entry & damage write-offs</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stock..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
              />
            </div>

            <button
              onClick={() => setFilterLowStock(!filterLowStock)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition border ${
                filterLowStock
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {filterLowStock ? 'Showing Low Stock ⚠️' : 'Low Stock Filter'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="p-3.5">Product SKU</th>
                <th className="p-3.5">Unit Weight</th>
                <th className="p-3.5">Unit Price</th>
                <th className="p-3.5">Stock Count</th>
                <th className="p-3.5">Stock Value</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-medium">
              {filteredProducts.slice(0, 50).map((p) => {
                const effectivePrice = p.discount_price || p.price;
                const stockVal = effectivePrice * (p.stock || 0);
                const isLow = (p.stock || 0) <= 10 && (p.stock || 0) > 0;
                const isOut = (p.stock || 0) === 0 || !p.in_stock;

                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-9 h-9 object-cover rounded-lg bg-slate-50 border border-slate-200"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80';
                        }}
                      />
                      <div>
                        <span className="block line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: #{p.id}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600">{p.weight_unit || '500 g'}</td>
                    <td className="p-3.5 font-bold text-slate-900">₹{effectivePrice}</td>
                    <td className="p-3.5 font-black">
                      <span className={`px-2 py-0.5 rounded-md text-xs ${
                        isOut ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        isLow ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {p.stock || 0} units
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-700">₹{stockVal.toFixed(0)}</td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        isOut ? 'bg-rose-100 text-rose-800' :
                        isLow ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'IN STOCK'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(p, -1)}
                          className="w-7 h-7 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold rounded-lg flex items-center justify-center transition"
                          title="Decrease 1 unit"
                        >
                          <Minus size={14} />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p, +1)}
                          className="w-7 h-7 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 font-bold rounded-lg flex items-center justify-center transition"
                          title="Increase 1 unit"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProductForInward(p);
                            setIsStockInModalOpen(true);
                          }}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-[11px] px-2.5 py-1 rounded-lg transition ml-1"
                        >
                          Bulk Inward +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Inward Entry Modal */}
      {isStockInModalOpen && selectedProductForInward && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsStockInModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="font-black text-lg mb-1 text-slate-900 flex items-center gap-2">
              <ArrowDownCircle size={20} className="text-purple-600" /> Stock Inward Entry
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Record received vendor shipment quantities</p>

            <form onSubmit={handleInwardSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-bold text-slate-900">{selectedProductForInward.name}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Current Stock: <strong>{selectedProductForInward.stock || 0} units</strong></div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Quantity to Inward (+)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={inwardQuantity}
                  onChange={(e) => setInwardQuantity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 text-base outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsStockInModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-md transition"
                >
                  Confirm Inward Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
