import React, { useState } from 'react';
import { Gift, Share2, Users, DollarSign, CheckCircle2, Ticket, Copy, Plus } from 'lucide-react';

export default function ReferralsView() {
  const [referralBonus, setReferralBonus] = useState(100);
  const [refereeDiscount, setRefereeDiscount] = useState(100);

  const [topReferrers] = useState([
    { id: 1, name: 'Akarshan Mishra', phone: '+91 9876543210', code: 'AKARSHAN100', totalReferred: 18, earned: 1800 },
    { id: 2, name: 'Priya Sharma', phone: '+91 9811223344', code: 'PRIYA100', totalReferred: 12, earned: 1200 },
    { id: 3, name: 'Vikram Mehta', phone: '+91 9822334455', code: 'VIKRAM100', totalReferred: 9, earned: 900 },
    { id: 4, name: 'Neha Kapoor', phone: '+91 9833445566', code: 'NEHA100', totalReferred: 7, earned: 700 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Gift Vouchers & Referral System</h2>
          <p className="text-xs text-slate-500">Manage peer-to-peer customer referral bonuses, promotional vouchers & gift card redemptions</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">TOTAL REFERRALS</span>
          <div className="text-2xl font-black text-slate-900">46 Customers</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">₹4,600 Wallet Rewards Distributed</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">REFERRAL CONVERSION</span>
          <div className="text-2xl font-black text-purple-700">68.2%</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">First-order purchase completed</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">ACTIVE VOUCHERS</span>
          <div className="text-2xl font-black text-slate-900">124 Issued</div>
          <span className="text-[11px] text-purple-600 font-bold mt-1 block">E-Gift Card Value: ₹38,500</span>
        </div>
      </div>

      {/* Top Brand Advocates Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900">Top Customer Brand Ambassadors (Referral Champions)</h3>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {topReferrers.map((r, i) => (
            <div key={r.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 bg-purple-50 text-purple-700 rounded-full font-black flex items-center justify-center text-xs">
                  #{i + 1}
                </span>
                <div>
                  <h4 className="font-black text-slate-900">{r.name}</h4>
                  <span className="text-slate-400 font-mono text-[11px]">Code: {r.code} • {r.phone}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-slate-900">{r.totalReferred} Friends Joined</div>
                <span className="text-[11px] font-bold text-emerald-600">₹{r.earned} Cashback Earned</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
