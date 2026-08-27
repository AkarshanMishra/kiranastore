import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Search, RefreshCw, Globe, X, Tag, Copy, Check } from 'lucide-react';

export default function CouponsView() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form states
  const [code, setCode] = useState('');
  const [type, setType] = useState('PERCENT');
  const [discountValue, setDiscountValue] = useState(15);
  const [minOrder, setMinOrder] = useState(299);
  const [maxDiscount, setMaxDiscount] = useState(60);
  const [validTill, setValidTill] = useState('');
  const [firstOrderOnly, setFirstOrderOnly] = useState(false);
  const [discountLabel, setDiscountLabel] = useState('');
  const [desc, setDesc] = useState('');
  const [tag, setTag] = useState('');

  const loadCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setCoupons(data);
      }
    } catch (e) {
      console.warn('Could not fetch coupons:', e);
    }
  };

  useEffect(() => { loadCoupons(); }, []);

  const buildDiscountLabel = (t, val) => {
    if (t === 'PERCENT') return `${val}% OFF`;
    if (val <= 0) return 'FREE DELIVERY';
    return `FLAT ₹${Math.round(val)} OFF`;
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setIsSaving(true);
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discount_type: type,
        discount_value: parseFloat(discountValue) || 0,
        min_order: parseFloat(minOrder) || 0,
        max_discount: parseFloat(maxDiscount) || 0,
        valid_till: validTill || '',
        first_order_only: firstOrderOnly,
        discount_label: discountLabel.trim() || buildDiscountLabel(type, parseFloat(discountValue) || 0),
        desc: desc.trim() || `Use code ${code.trim().toUpperCase()} at checkout`,
        tag: tag.trim() || 'PROMO'
      };
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setCoupons(prev => [created, ...prev.filter(c => c.id !== created.id)]);
        setCode(''); setDiscountLabel(''); setDesc(''); setTag('');
        setIsAddOpen(false);
        alert(`Coupon "${payload.code}" published to the customer app Offers tab!`);
      } else {
        alert('Failed to create coupon');
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Coupon not saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (c) => {
    try {
      const res = await fetch(`/api/admin/coupons/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...c, is_active: !c.is_active })
      });
      if (res.ok) {
        const updated = await res.json();
        setCoupons(prev => prev.map(x => x.id === updated.id ? updated : x));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (c) => {
    navigator.clipboard.writeText(c.code);
    setCopiedCode(c.code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCount = coupons.filter(c => c.is_active).length;
return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Discount Coupons & Promo Vouchers</h2>
          <p className="text-xs text-slate-500">Configures coupons shown in the customer app Offers tab - 1-Tap Promo Coupons</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={loadCoupons} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-purple-700 hover:border-purple-300 transition flex items-center gap-1.5 text-xs font-extrabold">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setIsAddOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Plus size={15} /> Create Coupon
          </button>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
        <Globe size={14} className="text-emerald-600" />
        {activeCount} live coupons synced to the customer app Offers tab.
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400 font-bold text-xs">
          No coupons yet. Create your first promo code.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((c) => (
            <div key={c.id} className={`bg-white border rounded-3xl p-4 shadow-xs flex flex-col gap-3 ${c.is_active ? 'border-purple-100' : 'border-slate-200 opacity-70'}`}>
              <div className="flex items-center justify-between">
                <span className="bg-purple-100 text-purple-700 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">{c.tag || 'PROMO'}</span>
                <button onClick={() => handleToggle(c)} className={`text-[10px] font-black px-2 py-0.5 rounded ${c.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                  {c.is_active ? 'LIVE' : 'PAUSED'}
                </button>
              </div>

              <div className="font-black text-base text-slate-900">{c.discount_label || (c.discount_type === 'PERCENT' ? `${c.discount_value}% OFF` : `FLAT ₹${c.discount_value} OFF`)}</div>
              <p className="text-[11px] text-slate-500 line-clamp-2 min-h-[28px]">{c.desc || ''}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700">{c.code}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleCopy(c)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg" title="Copy code">
                    {copiedCode === c.code ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Delete"><Trash2 size={13} /></button>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Tag size={11} /> Min ₹{c.min_order || 0} {c.max_discount > 0 && ` • Cap ₹${c.max_discount}`}{c.first_order_only ? ' • New users only' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
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
                  <input type="number" required value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Order ₹</label>
                  <input type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Discount Cap ₹</label>
                  <input type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Show Label (e.g. "20% OFF")</label>
                <input type="text" value={discountLabel} onChange={(e) => setDiscountLabel(e.target.value)} placeholder="Auto-generated if empty" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-black" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="On orders above ₹299" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Expiry Date</label>
                <input type="date" value={validTill} onChange={(e) => setValidTill(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="firstOrder" checked={firstOrderOnly} onChange={(e) => setFirstOrderOnly(e.target.checked)} className="w-4 h-4 accent-purple-600" />
                <label htmlFor="firstOrder" className="text-slate-700 font-bold cursor-pointer">Restrict to First-Time Customers Only</label>
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md disabled:opacity-50">
                {isSaving ? 'Publishing...' : 'Publish Coupon to Customer App'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}