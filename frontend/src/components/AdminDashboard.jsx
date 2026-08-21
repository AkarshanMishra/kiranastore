import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, CheckCircle2, Clock, Truck, Plus, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('orders'); // 'orders' | 'inventory'

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, prodsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/products')
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (prodsRes.ok) setProducts(await prodsRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderNumber, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(orders.map(o => o.order_number === orderNumber ? updated : o));
      }
    } catch (err) {
      alert(`Error updating order status: ${err.message}`);
    }
  };

  const handleToggleStock = async (product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ in_stock: !product.in_stock })
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(products.map(p => p.id === product.id ? updated : p));
      }
    } catch (err) {
      alert(`Error updating product stock: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-purple-900 text-white rounded-3xl p-6 shadow-xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-purple-700 text-purple-200 text-xs font-bold px-3 py-1 rounded-full">
            Dark Store #402 — Sector 62 Noida
          </span>
          <h2 className="text-2xl font-black mt-2">Dark Store Management Panel</h2>
          <p className="text-xs text-purple-200 mt-1">Live order fulfillment and inventory control center</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
              activeSubTab === 'orders'
                ? 'bg-white text-purple-900 shadow'
                : 'bg-purple-800 text-purple-200 hover:bg-purple-700'
            }`}
          >
            Live Dispatch Board ({orders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition ${
              activeSubTab === 'inventory'
                ? 'bg-white text-purple-900 shadow'
                : 'bg-purple-800 text-purple-200 hover:bg-purple-700'
            }`}
          >
            Inventory Stock ({products.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="animate-spin text-purple-700 mx-auto mb-2" size={28} />
          <p className="text-xs font-bold text-gray-500">Loading store dashboard...</p>
        </div>
      ) : activeSubTab === 'orders' ? (
        /* Orders Kanban Dispatch Board */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900 text-base">Incoming Orders</h3>
            <button
              onClick={fetchData}
              className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <Package className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-sm font-bold text-gray-700">No active orders right now</p>
              <p className="text-xs text-gray-400 mt-1">Place an order from Customer View to see it live here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-xs text-gray-900">
                        #{order.order_number}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          order.order_status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.order_status === 'OUT_FOR_DELIVERY'
                            ? 'bg-blue-100 text-blue-800'
                            : order.order_status === 'PACKING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 mb-3">
                      <strong>Customer:</strong> {order.user_name} ({order.phone})
                      <br />
                      <strong>Address:</strong> {order.delivery_address}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-2.5 mb-3 text-xs divide-y divide-gray-100">
                      {order.items.map(item => (
                        <div key={item.id} className="py-1 flex justify-between">
                          <span>{item.quantity}x {item.product_name}</span>
                          <span className="font-bold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm font-black text-gray-900">
                      ₹{order.total_amount.toFixed(0)}
                    </div>

                    {/* Action controls for changing order status */}
                    <div className="flex items-center gap-1">
                      {order.order_status === 'PLACED' && (
                        <button
                          onClick={() => handleUpdateStatus(order.order_number, 'PACKING')}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg"
                        >
                          Pack Order 📦
                        </button>
                      )}
                      {order.order_status === 'PACKING' && (
                        <button
                          onClick={() => handleUpdateStatus(order.order_number, 'OUT_FOR_DELIVERY')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg"
                        >
                          Dispatch 🛵
                        </button>
                      )}
                      {order.order_status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={() => handleUpdateStatus(order.order_number, 'DELIVERED')}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg"
                        >
                          Mark Delivered ✅
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Inventory Management */
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-extrabold text-gray-900 text-base mb-4">Dark Store Inventory Control</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock Count</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                      <img src={p.image_url} alt={p.name} className="w-8 h-8 object-cover rounded bg-gray-100" />
                      <span>{p.name}</span>
                    </td>
                    <td className="p-3 text-gray-500">{p.weight_unit}</td>
                    <td className="p-3 font-bold text-gray-900">₹{p.discount_price || p.price}</td>
                    <td className="p-3 font-extrabold text-gray-800">{p.stock} pcs</td>
                    <td className="p-3">
                      <span className={`font-bold px-2 py-0.5 rounded ${p.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleStock(p)}
                        className={`font-bold px-3 py-1 rounded-lg text-[11px] ${
                          p.in_stock
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {p.in_stock ? 'Set Out of Stock' : 'Set In Stock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
