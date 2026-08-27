import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Package,
  Navigation,
  ArrowLeft,
  RefreshCw,
  Bike,
  ShieldCheck,
  MessageSquare,
  Gift,
  Send,
  X,
  Calendar,
  AlertCircle,
  Sparkles,
  Store
} from 'lucide-react';
import { fetchApi, getApiBaseUrl } from '../apiClient';

export default function OrderTracking({ orderNumber, onBackToStore }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(1500); // 25 mins in seconds
  const [liveMessage, setLiveMessage] = useState('Connecting to live store tracking...');
  const [riderProgress, setRiderProgress] = useState(15);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showScratchCard, setShowScratchCard] = useState(true);
  const [scratched, setScratched] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'rider', text: 'Hi! I am Rahul Kumar, your delivery partner. Once the shopkeeper schedules your slot, I will pack and deliver your fresh groceries.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await fetchApi(`/api/orders/${orderNumber}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        if (data.order_status === 'PLACED') {
          setLiveMessage('Order received! Waiting for shopkeeper to confirm & schedule delivery slot...');
        } else if (data.scheduled_delivery_date) {
          setLiveMessage(`Delivery scheduled for ${data.scheduled_delivery_date} (${data.scheduled_delivery_time || 'Express'})`);
        }
      }
    } catch (err) {
      console.error('Failed to load order tracking details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 4 seconds so customer automatically sees when shop owner accepts!
    const poller = setInterval(fetchOrder, 4000);
    return () => clearInterval(poller);
  }, [orderNumber]);

  // WebSocket for real-time status stream
  useEffect(() => {
    if (!orderNumber) return;

    const apiBaseUrl = getApiBaseUrl();
    const wsBaseUrl = apiBaseUrl
      ? apiBaseUrl.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:')
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
    const wsUrl = `${wsBaseUrl}/ws/orders/${orderNumber}`;
    let ws;
    try {
      ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        setLiveMessage('Connected to live Kirana Store dispatch stream ⚡');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.order_status) {
            setOrder((prev) => prev ? {
              ...prev,
              order_status: data.order_status,
              accepted_by_owner: data.accepted_by_owner !== undefined ? data.accepted_by_owner : prev.accepted_by_owner,
              scheduled_delivery_date: data.scheduled_delivery_date || prev.scheduled_delivery_date,
              scheduled_delivery_time: data.scheduled_delivery_time || prev.scheduled_delivery_time,
            } : prev);

            if (data.message) {
              setLiveMessage(data.message);
            }
          }
        } catch (e) {
          console.error('Error parsing WS message', e);
        }
      };
    } catch (e) {
      console.error('WebSocket connection error', e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [orderNumber]);

  // Countdown timer & rider map animation (only active when confirmed/packing/out)
  useEffect(() => {
    if (!order || order.order_status === 'PLACED') return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      setRiderProgress((prev) => (prev < 90 ? prev + 1 : 90));
    }, 1000);
    return () => clearInterval(timer);
  }, [order?.order_status]);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user', text: chatInput.trim() }];
    setChatMessages(newMsgs);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { sender: 'rider', text: 'Got it! I will deliver according to your instructions.' }]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <RefreshCw className="animate-spin text-brand-green mx-auto mb-3" size={32} />
        <p className="text-sm font-bold text-gray-700">Loading order tracking details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h3 className="text-lg font-bold text-gray-800">Order not found</h3>
        <button
          onClick={onBackToStore}
          className="mt-4 bg-brand-green text-white font-bold text-xs px-4 py-2 rounded-xl"
        >
          Back to Store
        </button>
      </div>
    );
  }

  // 5-Stage Stepper
  const steps = [
    { key: 'PLACED', label: 'Order Placed', icon: Package },
    { key: 'CONFIRMED', label: 'Shop Accepted & Slot Fixed', icon: Calendar },
    { key: 'PACKING', label: 'Packing Items', icon: RefreshCw },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Navigation },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'CONFIRMED': return 1;
      case 'PACKING': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.order_status);
  const isAwaitingAcceptance = order.order_status === 'PLACED';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={onBackToStore}
        className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-slate-300 hover:text-brand-green mb-4"
      >
        <ArrowLeft size={16} /> Back to Store
      </button>

      {/* Main Tracking Card */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl p-6 shadow-xl mb-6">
        
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-700">
          <div>
            <span className="bg-green-100 dark:bg-emerald-950 text-brand-green text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Order #{order.order_number}
            </span>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
              {order.order_status === 'DELIVERED'
                ? 'Order Delivered 🎉'
                : isAwaitingAcceptance
                ? 'Order Received • Awaiting Shopkeeper Approval'
                : order.order_status === 'CONFIRMED'
                ? 'Order Accepted by Shopkeeper! 📅'
                : order.order_status === 'PACKING'
                ? 'Fresh Items Being Packed 📦'
                : 'Out for Express Delivery 🛵'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-0.5">{liveMessage}</p>
          </div>

          {/* Delivery Slot Status Box */}
          <div className={`rounded-2xl p-4 text-center shadow-md min-w-[170px] ${
            isAwaitingAcceptance
              ? 'bg-amber-500 text-white'
              : 'bg-gradient-to-br from-brand-green to-emerald-800 text-white'
          }`}>
            {isAwaitingAcceptance ? (
              <>
                <Clock size={24} className="mx-auto mb-1 opacity-90 animate-pulse" />
                <div className="text-sm font-black uppercase">Approval Pending</div>
                <div className="text-[10px] text-amber-100 font-bold mt-0.5">Shopkeeper Reviewing</div>
              </>
            ) : (
              <>
                <Calendar size={24} className="mx-auto mb-1 opacity-90" />
                <div className="text-xs font-black uppercase">
                  {order.scheduled_delivery_date || 'Same Day Delivery'}
                </div>
                <div className="text-[11px] text-emerald-100 font-extrabold mt-0.5">
                  {order.scheduled_delivery_time || '4:00 PM - 7:00 PM'}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Amazon-Style Order Acceptance & Scheduled Slot Banner */}
        {isAwaitingAcceptance ? (
          <div className="my-5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 flex items-start gap-3">
            <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-xl text-amber-800 dark:text-amber-200 flex-shrink-0 mt-0.5">
              <Store size={20} />
            </div>
            <div className="text-xs">
              <h4 className="font-black text-amber-900 dark:text-amber-200 text-sm">
                Shopkeeper is Reviewing Your Order
              </h4>
              <p className="text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                Your order is sent to the shopkeeper. Once approved, the shopkeeper will confirm whether your items will be delivered <strong>Same-Day (Today)</strong> or <strong>Next-Day (Tomorrow)</strong> along with your exact delivery time slot.
              </p>
            </div>
          </div>
        ) : (
          <div className="my-5 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 rounded-2xl p-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-xl text-purple-800 dark:text-purple-200 flex-shrink-0 mt-0.5">
                <CheckCircle2 size={20} />
              </div>
              <div className="text-xs">
                <span className="text-[10px] bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 font-black px-2 py-0.5 rounded-full uppercase">
                  CONFIRMED BY SHOPKEEPER
                </span>
                <h4 className="font-black text-purple-950 dark:text-purple-100 text-sm mt-1">
                  Scheduled Delivery: {order.scheduled_delivery_date || 'Today (Same Day)'}
                </h4>
                <p className="text-purple-700 dark:text-purple-300 mt-0.5">
                  Expected Time Window: <strong>{order.scheduled_delivery_time || '4:00 PM - 7:00 PM'}</strong>
                </p>
              </div>
            </div>
            <span className="text-xl">🛵</span>
          </div>
        )}

        {/* Live Stepper (5-Stage) */}
        <div className="py-6">
          <div className="relative flex items-center justify-between">
            {/* Progress Bar Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 dark:bg-slate-700 -translate-y-1/2 -z-0">
              <div
                className="h-full bg-brand-green transition-all duration-700"
                style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, idx) => {
              const isDone = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const Icon = step.icon;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      isDone
                        ? 'bg-brand-green text-white ring-4 ring-green-100 dark:ring-emerald-950 scale-110 shadow-md'
                        : 'bg-white dark:bg-slate-900 text-gray-400 border-2 border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    <Icon size={16} className={isCurrent ? 'animate-bounce' : ''} />
                  </div>
                  <span
                    className={`text-[10px] font-extrabold mt-2 text-center max-w-[70px] ${
                      isDone ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Route & Dispatch Radar */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden mb-6 shadow-inner min-h-[180px] flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold">
              <span className={`w-2 h-2 rounded-full ${isAwaitingAcceptance ? 'bg-amber-400' : 'bg-green-400 animate-ping'}`} />
              <span>{isAwaitingAcceptance ? 'ORDER STANDBY • AWAITING SHOPKEEPER' : 'LIVE STORE DISPATCH RADAR'}</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-extrabold">
              {isAwaitingAcceptance ? 'Slot: To be confirmed' : `Estimated Arrival: ~${formatCountdown(countdown)}`}
            </span>
          </div>

          <div className="relative z-10 my-6">
            <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${isAwaitingAcceptance ? 5 : riderProgress}%` }}
              />
            </div>

            <div
              className="absolute -top-3 transition-all duration-1000"
              style={{ left: `calc(${isAwaitingAcceptance ? 5 : riderProgress}% - 12px)` }}
            >
              <div className="bg-brand-yellow text-gray-900 p-2 rounded-full shadow-lg border-2 border-white animate-pulse">
                <Bike size={16} />
              </div>
            </div>
          </div>

          <div className="relative z-10 flex justify-between text-xs text-gray-400 font-bold">
            <div className="flex items-center gap-1 text-purple-300">
              <Store size={14} />
              <span>Local Kirana Store</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <MapPin size={14} />
              <span>Your Doorstep</span>
            </div>
          </div>
        </div>

        {/* Delivery Partner Details & In-App Chat */}
        <div className="bg-gray-50 dark:bg-slate-900/60 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-100 text-brand-green rounded-full flex items-center justify-center font-black text-base shadow-sm">
              🛵
            </div>
            <div>
              <div className="text-xs font-extrabold text-gray-900 dark:text-white">Rahul Kumar (Store Delivery Partner)</div>
              <div className="text-[11px] text-gray-500 font-medium">⭐ 4.9 Rating • Contactless Safe Delivery</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-xl shadow transition"
              title="Chat with Delivery Partner"
            >
              <MessageSquare size={16} />
            </button>
            <button 
              onClick={() => alert("Calling store delivery partner Rahul Kumar (+91 9811223344)...")}
              className="bg-brand-green text-white p-2.5 rounded-xl hover:bg-green-800 shadow transition"
            >
              <Phone size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Ordered Items Summary */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
        <h3 className="font-black text-gray-900 dark:text-white text-base mb-4">Items in this Order</h3>
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
              {item.image_url && (
                <img src={item.image_url} alt={item.product_name} className="w-12 h-12 object-cover rounded-xl bg-gray-50 dark:bg-slate-900" />
              )}
              <div className="flex-1">
                <div className="text-xs font-bold text-gray-900 dark:text-white">{item.product_name}</div>
                <div className="text-[11px] text-gray-500">Qty: {item.quantity}</div>
              </div>
              <div className="text-xs font-black text-gray-900 dark:text-white">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between text-xs font-black text-gray-900 dark:text-white">
          <span>Total Paid ({order.payment_method})</span>
          <span>₹{order.total_amount.toFixed(0)}</span>
        </div>
      </div>

      {/* In-App Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border border-slate-700 rounded-3xl max-w-sm w-full h-[450px] flex flex-col shadow-2xl relative">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/60 rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Bike size={18} className="text-brand-green" />
                <span className="font-extrabold text-xs">Chat with Rahul Kumar (Rider)</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2.5 rounded-xl font-medium ${m.sender === 'user' ? 'bg-brand-green text-white' : 'bg-slate-800 text-slate-200'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message to rider..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
              <button type="submit" className="bg-purple-600 text-white p-2 rounded-xl"><Send size={14} /></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
