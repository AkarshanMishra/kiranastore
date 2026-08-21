import React, { useState } from 'react';
import { Award, Plus, Edit2, CheckCircle2, Gift, Users, Sparkles, TrendingUp, Save } from 'lucide-react';

export default function LoyaltyView() {
  const [pointsPerRupee, setPointsPerRupee] = useState(1);
  const [rupeesPerPoint, setRupeesPerPoint] = useState(0.1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const tiers = [
    { name: 'Silver Member', minSpend: '₹0 - ₹2,000', multiplier: '1.0x', perks: 'Standard loyalty points, daily deals', color: 'bg-slate-100 text-slate-800' },
    { name: 'Gold Member', minSpend: '₹2,000 - ₹10,000', multiplier: '1.5x', perks: 'Free delivery threshold ₹299, Priority packing', color: 'bg-amber-100 text-amber-900 border border-amber-300' },
    { name: 'Platinum Member', minSpend: '₹10,000 - ₹25,000', multiplier: '2.0x', perks: 'Zero delivery fee, Instant refunds, Free gifts', color: 'bg-purple-100 text-purple-900 border border-purple-300' },
    { name: 'VIP Patron 👑', minSpend: '₹25,000+', multiplier: '3.0x', perks: 'Dedicated delivery executive, WhatsApp concierge', color: 'bg-emerald-100 text-emerald-900 border border-emerald-300' },
  ];

  const handleSaveRules = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Customer Loyalty & Rewards Program</h2>
          <p className="text-xs text-slate-500">Configure loyalty coins calculation, tier perks, point redemption thresholds & VIP memberships</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Rules */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <Sparkles size={16} className="text-purple-600" /> Points Earning Rules
          </h3>

          <form onSubmit={handleSaveRules} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Points Awarded per ₹100 Spent</label>
              <input
                type="number"
                value={pointsPerRupee * 100}
                onChange={(e) => setPointsPerRupee(parseFloat(e.target.value) / 100)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Redemption Value (₹ per Point)</label>
              <input
                type="number"
                step="0.01"
                value={rupeesPerPoint}
                onChange={(e) => setRupeesPerPoint(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
              />
              <p className="text-[11px] text-slate-400 mt-1">100 Points = ₹{(100 * rupeesPerPoint).toFixed(0)} checkout discount</p>
            </div>

            {savedSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 font-bold text-xs p-2.5 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 size={15} /> Loyalty rules updated!
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <Save size={15} /> Save Loyalty Settings
              </button>
            )}
          </form>
        </div>

        {/* Right: Tiers */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-black text-sm text-slate-900">Membership Tiers & Exclusive Perks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tiers.map((t, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${t.color}`}>
                      {t.name}
                    </span>
                    <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {t.multiplier} Points
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-500 mb-2">Spend Tier: {t.minSpend}</div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-snug">
                    {t.perks}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
