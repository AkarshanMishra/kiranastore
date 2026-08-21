import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit2, Sparkles, Percent, Calendar } from 'lucide-react';

export default function OffersView() {
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'ZEPTO10', discount: '10%', minOrder: 200, maxDiscount: 100, usageCount: 420, status: 'ACTIVE' },
    { id: 2, code: 'BLINK10', discount: '10%', minOrder: 200, maxDiscount: 100, usageCount: 380, status: 'ACTIVE' },
    { id: 3, code: 'FIRSTORDER', discount: 'FLAT ₹75', minOrder: 300, maxDiscount: 75, usageCount: 150, status: 'ACTIVE' },
    { id: 4, code: 'BANKUPI', discount: '₹50 Cashback', minOrder: 500, maxDiscount: 50, usageCount: 290, status: 'ACTIVE' }
  ]);

  const handleAddCoupon = () => {
    const code = prompt("Enter new Coupon Code (e.g. SUMMER20):", "SUMMER20");
    if (code) {
      setCoupons([...coupons, {
        id: Date.now(),
        code: code.toUpperCase(),
        discount: '20%',
        minOrder: 300,
        maxDiscount: 150,
        usageCount: 0,
        status: 'ACTIVE'
      }]);
      alert(`Created coupon ${code.toUpperCase()} successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Coupon & Campaign Management</h2>
          <p className="text-xs text-slate-500">Control discount promo codes, flash sales, and customer app banners</p>
        </div>

        <button
          onClick={handleAddCoupon}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-xs"
        >
          <Plus size={16} /> Create New Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Tag className="text-purple-600" size={18} /> Active Store Coupons
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Promo Code</th>
                <th className="p-3.5">Discount Rate</th>
                <th className="p-3.5">Min Order Value</th>
                <th className="p-3.5">Max Discount</th>
                <th className="p-3.5">Times Used</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-black text-purple-700 text-sm">{c.code}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">{c.discount}</td>
                  <td className="p-3.5 text-slate-600">₹{c.minOrder}</td>
                  <td className="p-3.5 text-slate-600">₹{c.maxDiscount}</td>
                  <td className="p-3.5 font-bold text-slate-900">{c.usageCount} times</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded border border-emerald-200">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setCoupons(coupons.filter(x => x.id !== c.id))}
                      className="p-1.5 hover:bg-slate-100 rounded text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
