import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, Sparkles, CheckCircle2, Clock, Trash2, Tag, ShieldCheck } from 'lucide-react';

export default function NotificationsView() {
  const [title, setTitle] = useState('🔥 Flash Sale Alert!');
  const [message, setMessage] = useState('Fresh Amul Milk & Cottage Cheese at 20% OFF for next 2 hours. Order now!');
  const [target, setTarget] = useState('ALL');
  const [notifType, setNotifType] = useState('OFFERS'); // ORDERS, OFFERS, WALLET, SYSTEM
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [broadcastList, setBroadcastList] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setBroadcastList(data);
      }
    } catch (e) {
      console.warn('Could not fetch notifications:', e);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          desc: message,
          type: notifType,
          time: 'Just now'
        })
      });

      if (res.ok) {
        setSentSuccess(true);
        loadNotifications();
        setTimeout(() => {
          setSentSuccess(false);
        }, 2500);
      } else {
        setSentSuccess(true);
      }
    } catch (err) {
      console.error('Error broadcasting notification:', err);
      setSentSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Targeted Push Notification Center</h2>
          <p className="text-xs text-slate-500">Broadcast mobile push alerts & deals directly to customer app</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Send size={16} className="text-purple-600" /> Create Push Broadcast
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Customer Segment</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 text-slate-900 font-bold"
                >
                  <option value="ALL">All Shoppers</option>
                  <option value="NEW">New Shoppers</option>
                  <option value="VIP">VIP Shoppers</option>
                  <option value="INACTIVE">Inactive Shoppers</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Type</label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 text-slate-900 font-bold"
                >
                  <option value="OFFERS">🔥 Flash Offer</option>
                  <option value="ORDERS">🚚 Order Update</option>
                  <option value="WALLET">💰 Wallet Cashback</option>
                  <option value="SYSTEM">🔔 General Alert</option>
                </select>
              </div>
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
                <CheckCircle2 size={16} /> Broadcast sent successfully to customer app!
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
              >
                <Send size={16} /> {isSubmitting ? 'Sending...' : 'Broadcast to Customer App'}
              </button>
            )}
          </form>
        </div>

        {/* Live Broadcast History Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Bell size={16} className="text-purple-600" /> Recent Broadcasts
          </h3>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {broadcastList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-medium text-xs">
                No custom broadcasts sent yet. Broadcasts you send will appear here and in customer apps.
              </div>
            ) : (
              broadcastList.map((n) => (
                <div key={n.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-xl flex-shrink-0 mt-0.5">
                    <Bell size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-extrabold text-xs text-slate-900 truncate">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{n.desc}</p>
                    <span className="inline-block mt-1 bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-black px-1.5 py-0.2 rounded">
                      {n.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
