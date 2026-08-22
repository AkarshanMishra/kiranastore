import React, { useState, useEffect } from 'react';
import { Zap, Clock, Sparkles } from 'lucide-react';

export default function HeroBanners() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      badge: "⚡ 10-MIN EXPRESS",
      title: "Fresh Milk, Dairy & Kitchen Staples",
      desc: "Instant delivery direct from your local Kirana store",
      gradient: "from-emerald-700 via-emerald-600 to-teal-700",
      icon: "🥛"
    },
    {
      badge: "🔥 FLAT 40% OFF",
      title: "Snacks, Cold Drinks & Midnight Munchies",
      desc: "Party packs & namkeen starting at ₹10",
      gradient: "from-purple-700 via-purple-600 to-indigo-700",
      icon: "🍿"
    },
    {
      badge: "💰 SMART SAVER",
      title: "Monthly 30-Day Rashan Pack",
      desc: "Upload handwritten slip or customize pack & save ₹500+",
      gradient: "from-amber-600 via-orange-600 to-rose-600",
      icon: "🌾"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const active = banners[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 pt-2 pb-1">
      <div className={`bg-gradient-to-r ${active.gradient} text-white rounded-2xl p-3 sm:p-3.5 shadow-2xs relative overflow-hidden transition-all duration-300 flex items-center justify-between min-h-[85px] sm:min-h-[95px]`}>
        <div className="relative z-10 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="bg-white/20 text-white text-[8px] sm:text-[9px] font-black px-2 py-0.2 rounded uppercase tracking-wider">
              {active.badge}
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-black leading-tight truncate">
            {active.title}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-white/85 font-medium truncate mt-0.5">
            {active.desc}
          </p>
        </div>

        <div className="text-2xl sm:text-3xl flex-shrink-0 relative z-10 pr-1">
          {active.icon}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all ${currentSlide === idx ? 'w-3.5 h-1 bg-white rounded-full' : 'w-1 h-1 bg-white/40 rounded-full'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
