import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, Globe, Sparkles, X, Zap } from 'lucide-react';

export default function OffersView() {
  const [deals, setDeals] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Deal form states
  const [title, setTitle] = useState('');
  const [discountLabel, setDiscountLabel] = useState('');
  const [tag, setTag] = useState('');
  const [priceLabel, setPriceLabel] = useState('');
  const [mrpLabel, setMrpLabel] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const loadDeals = async () => {
    try {
      const res = await fetch('/api/admin/flashdeals');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setDeals(data);
      }
    } catch (e) {
      console.warn('Could not load flash deals:', e);
    }
  };

  useEffect(() => { loadDeals(); }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const payload = {
        title: title.trim(),
        discount_label: discountLabel.trim(),
        tag: tag.trim() || 'HOT DEAL',
        price_label: priceLabel.trim(),
        mrp_label: mrpLabel.trim(),
        image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80',
        sort_order: deals.length + 1
      };
      const res = await fetch('/api/admin/flashdeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setDeals(prev => [...prev, created]);
        setTitle(''); setDiscountLabel(''); setTag(''); setPriceLabel(''); setMrpLabel(''); setImageUrl('');
        setIsAddOpen(false);
        alert('Flash deal published to the customer app home page!');
      } else {
        alert('Failed to publish flash deal');
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Flash deal not saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (deal) => {
    try {
      const res = await fetch(`/api/admin/flashdeals/${deal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...deal, is_active: !deal.is_active })
      });
      if (res.ok) {
        const updated = await res.json();
        setDeals(prev => prev.map(d => d.id === updated.id ? updated : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flash deal?')) return;
    try {
      const res = await fetch(`/api/admin/flashdeals/${id}`, { method: 'DELETE' });
      if (res.ok) setDeals(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const activeCount = deals.filter(d => d.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Flash Sales & Campaign Deals</h2>
          <p className="text-xs text-slate-500">Control the deal cards shown on the customer app home page (Today's Mega Grocery Steals)</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={loadDeals} className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-purple-700 hover:border-purple-300 transition flex items-center gap-1.5 text-xs font-extrabold">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setIsAddOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-xs">
            <Plus size={16} /> Create Flash Deal
          </button>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
        <Globe size={14} className="text-emerald-600" />
        {activeCount} live flash deals synced to the customer app — create, hide or delete deals in real time.
      </div>

      {deals.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400 font-bold text-xs">
          No flash deals yet. Create your first deal to show it on the customer app.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <div key={deal.id} className={`bg-gradient-to-br rounded-3xl p-4 flex flex-col justify-between shadow-sm border ${deal.is_active ? 'from-amber-500 to-orange-500 border-amber-200 text-white' : 'from-slate-100 to-slate-200 border-slate-200 text-slate-500'}`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${deal.is_active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>{deal.tag || 'DEAL'}</span>
                  <span className="text-[10px] font-black text-yellow-300">{deal.discount_label || ''}</span>
                </div>
                {deal.image_url && <img src={deal.image_url} alt={deal.title} className="w-12 h-12 object-cover rounded-xl bg-white/30 border border-white/40 mb-2" />}
                <h4 className="font-black text-xs line-clamp-1">{deal.title}</h4>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-black text-xs text-yellow-300">{deal.price_label || ''}</span>
                  <span className="text-[10px] text-white/60 line-through">{deal.mrp_label || ''}</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${deal.is_active ? 'bg-emerald-400 text-slate-900' : 'bg-slate-300 text-slate-600'}`}>
                  {deal.is_active ? 'LIVE' : 'HIDDEN'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleToggle(deal)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white" title={deal.is_active ? 'Hide' : 'Show'}><Sparkles size={12} /></button>
                  <button onClick={() => handleDelete(deal.id)} className="p-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-100" title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
{/* Create Deal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2"><Zap size={18} className="text-amber-500" /> New Flash Deal</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product / Deal Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Amul Desi Ghee 1L" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Label</label>
                  <input type="text" value={discountLabel} onChange={(e) => setDiscountLabel(e.target.value)} placeholder="₹41 OFF" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tag</label>
                  <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Bestseller" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Deal Price</label>
                  <input type="text" value={priceLabel} onChange={(e) => setPriceLabel(e.target.value)} placeholder="₹589" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-amber-700" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">MRP (strikethrough)</label>
                  <input type="text" value={mrpLabel} onChange={(e) => setMrpLabel(e.target.value)} placeholder="₹630" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Image URL</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium" />
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md disabled:opacity-50">
                {isSaving ? 'Publishing...' : 'Publish Deal to Customer App'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}