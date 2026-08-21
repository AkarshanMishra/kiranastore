import React, { useState } from 'react';
import { Package, Navigation, CheckCircle2, Clock, MapPin, Phone, User, Filter } from 'lucide-react';

export default function OrderKanban({ orders, onUpdateStatus }) {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return o.order_status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="bg-purple-900/80 text-purple-300 border border-purple-700/60 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">Order Placed 📝</span>;
      case 'PACKING':
        return <span className="bg-amber-900/80 text-amber-300 border border-amber-700/60 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">Packing at Store 📦</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="bg-blue-900/80 text-blue-300 border border-blue-700/60 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">Out for Delivery 🛵</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">Delivered ✅</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 text-[11px] font-bold px-2.5 py-1 rounded-lg">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar bg-slate-800 p-2 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-1">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'PLACED', label: 'Placed 📝' },
            { id: 'PACKING', label: 'Packing 📦' },
            { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery 🛵' },
            { id: 'DELIVERED', label: 'Delivered ✅' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-bold px-3">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-12 text-center">
          <Package className="mx-auto text-slate-600 mb-3" size={48} />
          <h4 className="text-slate-200 font-bold text-base">No orders matching this status</h4>
          <p className="text-slate-400 text-xs mt-1">Place an order from the customer app to see real-time status updates here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-600 transition"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700/80">
                  <div>
                    <span className="text-xs font-black text-white">#{order.order_number}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {getStatusBadge(order.order_status)}
                </div>

                {/* Customer Details */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <User size={14} className="text-purple-400" />
                    <span>{order.user_name}</span>
                    <span className="text-slate-500 font-normal">({order.phone})</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-400 text-[11px] leading-tight">
                    <MapPin size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.delivery_address}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Packing Items ({order.items.length})
                  </div>
                  <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/50 max-h-36 overflow-y-auto space-y-2 text-xs divide-y divide-slate-800">
                    {order.items.map((item) => (
                      <div key={item.id} className="pt-1.5 first:pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-900/60 text-purple-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                            {item.quantity}x
                          </span>
                          <span className="text-slate-200 font-medium">{item.product_name}</span>
                        </div>
                        <span className="text-slate-400 font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer & Status Controls */}
              <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">TOTAL BILL</div>
                  <div className="text-lg font-black text-white">₹{order.total_amount.toFixed(0)}</div>
                </div>

                {/* Real-time Order Action Buttons */}
                <div className="flex items-center gap-2">
                  {order.order_status === 'PLACED' && (
                    <button
                      onClick={() => onUpdateStatus(order.order_number, 'PACKING')}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition"
                    >
                      Pack Items 📦
                    </button>
                  )}
                  {order.order_status === 'PACKING' && (
                    <button
                      onClick={() => onUpdateStatus(order.order_number, 'OUT_FOR_DELIVERY')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition"
                    >
                      Dispatch Rider 🛵
                    </button>
                  )}
                  {order.order_status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => onUpdateStatus(order.order_number, 'DELIVERED')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition"
                    >
                      Mark Delivered ✅
                    </button>
                  )}
                  {order.order_status === 'DELIVERED' && (
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={16} /> Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
