import React, { useState } from 'react';
import { Ticket, Plus, Edit2, Trash2, Search, CheckCircle2, Copy, Check, X, Tag } from 'lucide-react';

export default function CouponsView() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'WELCOME100',
      type: 'FLAT',
      discount: 100,
      minOrder: 499,
      maxDiscount: 100,
      usageLimit: 500,
      usedCount: 142,
      validTill: '31 Aug 2026',
      firstOrderOnly: true,
      status: 'ACTIVE'
    },
    {
      id: 2,
      code: 'ZEPTO20',
      type: 'PERCENT',
      discount: 20,
      minOrder: 299,
      maxDiscount: 80,
      usageLimit: 1000,
      usedCount: 389,
      validTill: '15 Sep 2026',
      firstOrderOnly: false,
      status: 'ACTIVE'
    },
    {
      id: 3,
      code: 'FREESHIP',
      type: 'FLAT',
      discount: 15,
      minOrder: 199,
      maxDiscount: 15,
      usageLimit: 2000,
      usedCount: 890,
      validTill: '30 Sep 2026',
      firstOrderOnly: false,
      status: 'ACTIVE'
    },
    {
      id: 4,
      code: 'DAIRY50',
      type: 'PERCENT',
      discount: 15,
      minOrder: 350,
      maxDiscount: 50,
      usageLimit: 300,
      usedCount: 120,
      validTill: '31 Aug 2026',
      firstOrderOnly: false,
      status: 'ACTIVE'
    }
  ]);

  // Form states
  const [code, setCode] = useState('');
  const [type, setType] = useState('PERCENT');
  const [discount, setDiscount] = useState(15);
  const [minOrder, setMinOrder] = useState(299);
  const [maxDiscount, setMaxDiscount] = useState(60);
  const [validTill, setValidTill] = useState('');
  const [firstOrderOnly, setFirstOrderOnly] = useState(false);

  const handleAddCoupon = (e) => {
    e.preventDefault();
    const newC = {
      id: Date.now(),
      code: code.toUpperCase().trim(),
      type,
      discount: parseFloat(discount),
      minOrder: parseFloat(minOrder),
      maxDiscount: parseFloat(maxDiscount),
      usageLimit: 1000,
      usedCount: 0,
      validTill: validTill || '30 Sep 2026',
      firstOrderOnly,
      status: 'ACTIVE'
    };
    setCoupons([newC, ...coupons]);
    setIsAddOpen(false);
    setCode('');
    alert(`Coupon code "${newC.code}" activated!`);
  };

  const handleDelete = (id) => {
    if (confirm('Delete coupon?')) {
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Discount Coupons & Promo Vouchers</h2>
          <p className="text-xs text-slate-500">Configure percentage and flat discount codes, minimum basket value & usage restrictions</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={15} /> Create New Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-purple-100 text-purple-800 font-mono font-black text-xs px-2.5 py-1 rounded-xl border border-purple-200">
                  {c.code}
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-200">
                  {c.status}
                </span>
              </div>

              <div className="text-xl font-black text-slate-900 mb-1">
                {c.type === 'PERCENT' ? `${c.discount}% OFF` : `₹${c.discount} FLAT OFF`}
              </div>
              <p className="text-xs text-slate-500">Min Order: <strong>₹{c.minOrder}</strong> • Max Cap: <strong>₹{c.maxDiscount}</strong></p>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 my-3 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Redemptions:</span>
                  <strong className="text-purple-700">{c.usedCount} / {c.usageLimit}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Expiry:</span>
                  <strong className="text-slate-800">{c.validTill}</strong>
                </div>
                {c.firstOrderOnly && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded block text-center mt-1">
                    First Order Only ⭐
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold">Rule: {c.type}</span>
              <button onClick={() => handleDelete(c.id)} className="p-1 text-rose-400 hover:text-rose-600">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Create Discount Coupon</h3>
            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Coupon Code (Uppercase)</label>
                <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. FESTIVE20" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold">
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FLAT">Flat Cash (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Value</label>
                  <input type="number" required value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Order Value (₹)</label>
                  <input type="number" required value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Discount Cap (₹)</label>
                  <input type="number" required value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Expiry Date</label>
                <input type="date" value={validTill} onChange={(e) => setValidTill(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="firstOrder" checked={firstOrderOnly} onChange={(e) => setFirstOrderOnly(e.target.checked)} className="w-4 h-4 accent-purple-600" />
                <label htmlFor="firstOrder" className="text-slate-700 font-bold cursor-pointer">Restrict to First-Time Customers Only</label>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Publish Coupon Live</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
