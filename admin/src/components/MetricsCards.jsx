import React from 'react';
import { ShoppingBag, IndianRupee, Clock, PackageCheck } from 'lucide-react';

export default function MetricsCards({ orders, products }) {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const activeOrders = orders.filter(o => o.order_status !== 'DELIVERED' && o.order_status !== 'CANCELLED').length;
  const inStockCount = products.filter(p => p.in_stock).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Revenue */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Sales Revenue</span>
          <div className="text-2xl font-black text-white">₹{totalRevenue.toFixed(0)}</div>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">↑ Live store earnings</span>
        </div>
        <div className="bg-emerald-900/50 text-emerald-400 p-3 rounded-2xl border border-emerald-700/40">
          <IndianRupee size={22} />
        </div>
      </div>

      {/* Total Orders */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Orders</span>
          <div className="text-2xl font-black text-white">{totalOrders}</div>
          <span className="text-[10px] text-purple-400 font-bold mt-1 inline-block">All-time store orders</span>
        </div>
        <div className="bg-purple-900/50 text-purple-400 p-3 rounded-2xl border border-purple-700/40">
          <ShoppingBag size={22} />
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-400 font-semibold block mb-1">Active Pending Orders</span>
          <div className="text-2xl font-black text-amber-400">{activeOrders}</div>
          <span className="text-[10px] text-amber-300 font-bold mt-1 inline-block">Needs packing/dispatch</span>
        </div>
        <div className="bg-amber-900/50 text-amber-400 p-3 rounded-2xl border border-amber-700/40">
          <Clock size={22} />
        </div>
      </div>

      {/* Inventory Health */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-slate-400 font-semibold block mb-1">In-Stock Catalog</span>
          <div className="text-2xl font-black text-white">{inStockCount} / {products.length}</div>
          <span className="text-[10px] text-blue-400 font-bold mt-1 inline-block">Active SKUs available</span>
        </div>
        <div className="bg-blue-900/50 text-blue-400 p-3 rounded-2xl border border-blue-700/40">
          <PackageCheck size={22} />
        </div>
      </div>
    </div>
  );
}
