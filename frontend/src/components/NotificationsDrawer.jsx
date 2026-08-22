import React, { useState, useEffect } from 'react';
import { X, Bell, Truck, Tag, Wallet, Sparkles, CheckCircle2, ArrowRight, Check } from 'lucide-react';
import { fetchApi } from '../apiClient';

export default function NotificationsDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ORDERS' | 'OFFERS'
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      type: 'ORDERS',
      title: "Order #KS-94821 Dispatched",
      desc: "Rider Rahul is on the way. Expected ETA: 7 mins.",
      time: "2m ago",
      icon: Truck,
      unread: true,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950"
    },
    {
      id: 2,
      type: 'OFFERS',
      title: "Amul Cow Ghee 20% Off",
      desc: "Flash deal live for your local area. ₹380 only.",
      time: "15m ago",
      icon: Tag,
      unread: true,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950"
    },
    {
      id: 3,
      type: 'WALLET',
      title: "₹25 Cashback Credited",
      desc: "Directly added to KiranaMoney wallet balance.",
      time: "1h ago",
      icon: Wallet,
      unread: false,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950"
    },
    {
      id: 4,
      type: 'ORDERS',
      title: "Morning Milk Scheduled",
      desc: "Amul Taaza 500ml booked for 6:30 AM dispatch.",
      time: "Yesterday",
      icon: Sparkles,
      unread: false,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950"
    }
  ]);

  useEffect(() => {
    const fetchLiveNotifications = async () => {
      try {
        const res = await fetchApi('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((n, idx) => ({
              id: n.id || `live-${idx}`,
              type: n.type || 'OFFERS',
              title: n.title,
              desc: n.desc,
              time: n.time || 'Just now',
              icon: n.type === 'ORDERS' ? Truck : n.type === 'WALLET' ? Wallet : Tag,
              unread: true,
              color: n.type === 'ORDERS' ? 'text-blue-500 bg-blue-50 dark:bg-blue-950' : n.type === 'WALLET' ? 'text-purple-500 bg-purple-50 dark:bg-purple-950' : 'text-amber-500 bg-amber-50 dark:bg-amber-950'
            }));
            setNotificationsList(mapped);
          }
        }
      } catch (err) {
        console.warn('Could not load live notifications:', err);
      }
    };

    if (isOpen) {
      fetchLiveNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredNotifications = notificationsList.filter(n => {
    if (activeTab === 'ORDERS') return n.type === 'ORDERS';
    if (activeTab === 'OFFERS') return n.type === 'OFFERS';
    return true;
  });

  const unreadCount = notificationsList.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotificationsList(notificationsList.map(n => ({ ...n, unread: false })));
  };

  const handleDismissNotification = (id, e) => {
    e.stopPropagation();
    setNotificationsList(notificationsList.filter(n => n.id !== id));
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 dark:text-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 z-50 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="bg-purple-100 dark:bg-purple-950 text-purple-600 p-2.5 rounded-2xl shadow-xs">
              <Bell size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.2 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Order updates, wallet cashback & flash deals</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full bg-gray-100 dark:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 m-3 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`flex-1 py-1.5 rounded-xl transition ${activeTab === 'ALL' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs font-black' : 'text-gray-500'}`}
          >
            All ({notificationsList.length})
          </button>
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex-1 py-1.5 rounded-xl transition ${activeTab === 'ORDERS' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs font-black' : 'text-gray-500'}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('OFFERS')}
            className={`flex-1 py-1.5 rounded-xl transition ${activeTab === 'OFFERS' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs font-black' : 'text-gray-500'}`}
          >
            Offers & Deals
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <div className="text-3xl">🔕</div>
              <h4 className="font-extrabold text-sm text-gray-700 dark:text-slate-300">No notifications here</h4>
              <p className="text-xs text-gray-400">You're all caught up with your grocery updates.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className={`border rounded-2xl p-3.5 flex items-start gap-3 transition shadow-xs relative ${
                    n.unread
                      ? 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/80'
                      : 'bg-gray-50/80 dark:bg-slate-800/60 border-gray-100 dark:border-slate-800'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${n.color}`}>
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-black text-gray-900 dark:text-white truncate">{n.title}</h4>
                      <span className="text-[10px] text-gray-400 font-bold flex-shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 leading-relaxed">{n.desc}</p>
                  </div>

                  <button
                    onClick={(e) => handleDismissNotification(n.id, e)}
                    className="text-gray-300 hover:text-gray-500 p-1 text-xs"
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-purple-600 dark:text-purple-400 font-extrabold flex items-center gap-1 hover:underline"
          >
            <Check size={14} /> Mark All as Read
          </button>

          <button
            onClick={onClose}
            className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
