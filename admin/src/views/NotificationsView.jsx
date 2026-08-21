import React, { useState } from 'react';
import { Bell, Send, Users, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NotificationsView() {
  const [title, setTitle] = useState('🔥 Flash Sale Alert!');
  const [message, setMessage] = useState('Fresh Amul Milk & Cottage Cheese at 20% OFF for next 2 hours. Order now!');
  const [target, setTarget] = useState('ALL');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = (e) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Targeted Push Notification Center</h2>
          <p className="text-xs text-slate-500">Broadcast mobile push alerts & deals to customer devices</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs max-w-2xl">
        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Target Customer Segment *</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
            >
              <option value="ALL">All Registered Shoppers (1,240 customers)</option>
              <option value="NEW">New Shoppers (First 30 days)</option>
              <option value="VIP">High Value VIP Shoppers (&gt; ₹3,000 spending)</option>
              <option value="INACTIVE">Inactive Shoppers (No order in 14 days)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Notification Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification Title"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Message Body *</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter push notification message..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-medium"
            />
          </div>

          {sentSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Broadcast sent successfully to customer devices!
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2"
            >
              <Send size={16} /> Broadcast Push Notification
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
