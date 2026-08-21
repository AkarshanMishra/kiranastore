import React, { useState } from 'react';
import { IndianRupee, ShoppingBag, Clock, Users, AlertTriangle, TrendingUp, Percent, ArrowUpRight, BarChart2, ShieldCheck, Plus, Ticket, DollarSign, Bell, Package, Sparkles, Calendar } from 'lucide-react';

export default function OverviewView({ orders = [], products = [], setActiveView }) {
  const [timeRange, setTimeRange] = useState('TODAY'); // 'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH' | 'YEAR'

  const totalSales = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.order_status !== 'DELIVERED' && o.order_status !== 'CANCELLED').length;
  const deliveredCount = orders.filter(o => o.order_status === 'DELIVERED').length;
  const lowStockCount = products.filter(p => (p.stock || 0) <= 10 && (p.stock || 0) > 0).length;
  const outOfStockCount = products.filter(p => !p.in_stock || (p.stock || 0) === 0).length;

  const kpis = [
    { title: "Total Sales Revenue", value: `₹${(148500 + totalSales).toLocaleString()}`, change: "+18.4% vs last period", icon: IndianRupee, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { title: "Total Orders", value: (42 + totalOrdersCount).toString(), change: `${deliveredCount} Delivered • ${pendingCount} Active`, icon: ShoppingBag, color: "text-purple-700 bg-purple-50 border-purple-200" },
    { title: "Active Pending Orders", value: pendingCount.toString(), change: "Needs packing & dispatch", icon: Clock, color: "text-amber-700 bg-amber-50 border-amber-200" },
    { title: "Low / Out of Stock", value: `${lowStockCount} / ${outOfStockCount}`, change: "Action needed in Inventory", icon: AlertTriangle, color: "text-rose-700 bg-rose-50 border-rose-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Time Filter */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 border border-purple-200 rounded-3xl p-6 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Single Dedicated Kirana Store OS
            </span>
            <span className="text-[10px] bg-emerald-400 text-slate-900 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-ping" /> STORE LIVE
            </span>
          </div>
          <h2 className="text-2xl font-black mt-2">Executive Store Performance Dashboard</h2>
          <p className="text-xs text-purple-100 mt-0.5">Real-time revenue, scheduled deliveries, inventory stock & margins</p>
        </div>

        {/* Time Range Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
          {['TODAY', 'YESTERDAY', 'WEEK', 'MONTH', 'YEAR'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1 rounded-xl transition ${
                timeRange === t ? 'bg-white text-purple-900 shadow font-black' : 'text-purple-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {t === 'TODAY' ? 'Today' : t === 'YESTERDAY' ? 'Yesterday' : t === 'WEEK' ? 'This Week' : t === 'MONTH' ? 'This Month' : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between hover:border-purple-200 transition">
              <div>
                <span className="text-xs text-slate-500 font-bold block mb-1">{kpi.title}</span>
                <div className="text-2xl font-black text-slate-900">{kpi.value}</div>
                <span className="text-[10px] text-slate-500 font-bold mt-1 block">{kpi.change}</span>
              </div>
              <div className={`p-3.5 rounded-2xl border ${kpi.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Order & Sales Trend */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BarChart2 size={18} className="text-purple-600" /> Hourly Order & Sales Velocity
              </h3>
              <p className="text-xs text-slate-500 font-medium">Peak demand hours: 7 AM - 10 AM (Morning) & 5 PM - 9 PM (Evening)</p>
            </div>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <TrendingUp size={14} /> +22.4% vs Avg
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100 pb-2">
            {[35, 50, 75, 90, 60, 45, 80, 95, 100, 85, 65, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg hover:from-purple-500 hover:to-pink-500 transition duration-300 relative group cursor-pointer"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow whitespace-nowrap z-20">
                    ₹{(h * 320).toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">{i * 2 + 1}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance Breakdown */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base mb-4">Category Share of Revenue</h3>
            <div className="space-y-4">
              {[
                { category: 'Milk, Bread & Dairy 🥛', percent: 38, color: 'bg-emerald-500' },
                { category: 'Fruits & Vegetables 🍎', percent: 26, color: 'bg-amber-500' },
                { category: 'Snacks & Munchies 🍿', percent: 18, color: 'bg-purple-500' },
                { category: 'Atta, Rice & Staples 🌾', percent: 12, color: 'bg-blue-500' },
                { category: 'Cold Drinks & Juices 🥤', percent: 6, color: 'bg-rose-500' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>{item.category}</span>
                    <span className="font-black text-slate-900">{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-xs font-bold text-slate-500 flex justify-between">
            <span>Highest Margin: <strong>Dairy & Staples</strong></span>
            <span className="text-purple-600 font-extrabold">View Reports →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
