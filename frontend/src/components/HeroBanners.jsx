import React, { useState, useEffect } from 'react';
import { Zap, Clock, Sparkles, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function HeroBanners() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      badge: "⚡ 10-MIN EXPRESS HUB",
      headline: "Fresh Farm Dairy & Daily Staples",
      subtext: "Amul Milk, Paneer & Breads straight from dark store shelves",
      cta: "Shop Dairy",
      bgGradient: "from-emerald-950 via-teal-900 to-emerald-900",
      accentBorder: "border-emerald-500/40",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
      icon: "🥛",
      perk: "Zero Delivery Fee on ₹199+"
    },
    {
      badge: "🔥 FLASH DEALS • UP TO 40% OFF",
      headline: "Midnight Munchies & Party Packs",
      subtext: "Lay's, Cold Beverages, Chocolates & Namkeen at wholesale prices",
      cta: "Explore Deals",
      bgGradient: "from-purple-950 via-indigo-950 to-purple-900",
      accentBorder: "border-purple-500/40",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/40",
      icon: "🍿",
      perk: "Instant 10-Min Dispatch"
    },
    {
      badge: "👑 MONTHLY RASHAN HUB",
      headline: "Save ₹500+ on 30-Day Household Grocery",
      subtext: "Upload handwritten slip photo or build custom monthly pack",
      cta: "Upload Slip",
      bgGradient: "from-amber-950 via-orange-950 to-amber-900",
      accentBorder: "border-amber-500/40",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
      icon: "🌾",
      perk: "Free Dark Store Itemization"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const active = banners[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 pt-2 pb-1">
      <div className={`relative overflow-hidden rounded-3xl border ${active.accentBorder} bg-gradient-to-br ${active.bgGradient} p-4 sm:p-4.5 shadow-md transition-all duration-500`}>
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Top Badge & Micro-perk */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-full border tracking-wide uppercase flex items-center gap-1 ${active.badgeColor}`}>
                {active.badge}
              </span>
              <span className="text-[9px] text-white/70 font-semibold hidden xs:inline-flex items-center gap-1">
                <Sparkles size={10} className="text-amber-400" /> {active.perk}
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-xs sm:text-base font-black text-white leading-tight tracking-tight drop-shadow-xs">
              {active.headline}
            </h3>

            {/* Subtext */}
            <p className="text-[10px] sm:text-xs text-white/80 font-medium truncate mt-0.5">
              {active.subtext}
            </p>
          </div>

          {/* Icon & 3D Glass Emoji Display */}
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner text-2xl sm:text-3xl">
            {active.icon}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-1">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-6 h-1.5 bg-gradient-to-r from-white to-white/90 rounded-full shadow-xs'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50 rounded-full'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
