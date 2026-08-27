import React, { useState, useEffect } from 'react';
import { Zap, Clock, Flame } from 'lucide-react';
import { fetchApi } from '../apiClient';

export default function FlashSaleBanner({ onSelectOfferCategory }) {
  const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds
  const fallbackDeals = [
    { title: 'Amul Desi Ghee 1L', discount: '₹41 OFF', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&q=80', price: '₹589', mrp: '₹630' },
    { title: 'Aashirvaad Atta 5kg', discount: '₹26 OFF', tag: 'Steal Deal', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&q=80', price: '₹219', mrp: '₹245' },
    { title: 'Maggi 4-Pack Noodles', discount: '₹6 OFF', tag: 'Hot Seller', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=100&q=80', price: '₹52', mrp: '₹58' },
    { title: 'Coca Cola Can 300ml', discount: '₹5 OFF', tag: 'Chilled', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&q=80', price: '₹35', mrp: '₹40' }
  ];
  const [deals, setDeals] = useState(fallbackDeals);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 14400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let isMounted = true;

    const loadDeals = async () => {
      try {
        const res = await fetchApi('/api/flashdeals');
        if (!res.ok) throw new Error('Failed to load flash deals');
        const data = await res.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setDeals(data.map((deal) => ({
            title: deal.title,
            discount: deal.discount_label || '',
            tag: deal.tag || 'Deal',
            image: deal.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80',
            price: deal.price_label || '',
            mrp: deal.mrp_label || ''
          })));
        }
      } catch (err) {
        if (isMounted) setDeals(fallbackDeals);
      }
    };

    loadDeals();
    window.addEventListener('api_base_url_changed', loadDeals);
    return () => {
      isMounted = false;
      window.removeEventListener('api_base_url_changed', loadDeals);
    };
  }, []);

  return (
    <div className="my-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 opacity-15 text-white">
        <Flame size={180} />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-black/30 backdrop-blur-md text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Zap size={12} className="text-yellow-300 fill-yellow-300" /> Flash Sale Live
            </span>
            <span className="bg-yellow-400 text-gray-900 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
              Up to 30% OFF
            </span>
          </div>

          <h3 className="text-xl font-black text-white mt-1">Today's Mega Grocery Steals</h3>
          <p className="text-xs text-orange-100 font-medium">Grab farm fresh items & staples at wholesale prices</p>
        </div>

        {/* Countdown Box */}
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 text-center flex items-center gap-3">
          <Clock size={18} className="text-yellow-300 animate-pulse" />
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-wider text-orange-100 block font-bold">Ends In</span>
            <span className="font-mono font-black text-sm text-yellow-300 tracking-wider">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Deals Cards */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {deals.map((deal, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex flex-col justify-between hover:bg-white/20 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-yellow-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                {deal.tag}
              </span>
              <span className="text-[10px] font-black text-yellow-300">{deal.discount}</span>
            </div>

            <div className="flex items-center gap-2.5 my-1">
              <img src={deal.image} alt={deal.title} className="w-10 h-10 object-cover rounded-xl bg-white/20 border border-white/30" />
              <div>
                <h4 className="font-black text-xs text-white line-clamp-1">{deal.title}</h4>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-black text-xs text-yellow-300">{deal.price}</span>
                  <span className="text-[10px] text-white/60 line-through">{deal.mrp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
