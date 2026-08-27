import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, RefreshCw, Globe, CheckCircle2, X, Save, Bell, Sparkles, Image } from 'lucide-react';

const DEFAULT_GRADIENTS = [
  'from-emerald-950 via-teal-900 to-emerald-900',
  'from-purple-950 via-indigo-950 to-purple-900',
  'from-amber-950 via-orange-950 to-amber-900',
  'from-rose-950 via-pink-900 to-rose-900'
];

export default function ContentMgmtView() {
  const [banners, setBanners] = useState([]);
  const [announcement, setAnnouncement] = useState('⚡ FAST EXPRESS DELIVERY — DIRECT FROM YOUR LOCAL KIRANA STORE');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // New banner form state
  const [badge, setBadge] = useState('');
  const [headline, setHeadline] = useState('');
  const [subtext, setSubtext] = useState('');
  const [cta, setCta] = useState('');
  const [perk, setPerk] = useState('');
  const [icon, setIcon] = useState('🛒');
  const [gradient, setGradient] = useState(DEFAULT_GRADIENTS[0]);

  const loadContent = async () => {
    try {
      const [bannersRes, configRes] = await Promise.all([
        fetch('/api/admin/banners'),
        fetch('/api/config')
      ]);
      if (bannersRes.ok) {
        const data = await bannersRes.json();
        if (Array.isArray(data)) setBanners(data);
      }
      if (configRes.ok) {
        const config = await configRes.json();
        if (Array.isArray(config)) {
          const ann = config.find(s => s.key === 'announcement');
          if (ann && ann.value) setAnnouncement(ann.value);
        }
      }
    } catch (e) {
      console.warn('Could not load CMS content:', e);
    }
  };

  useEffect(() => { loadContent(); }, []);

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'announcement', value: announcement })
      });
      setSavedSuccess(res.ok);
      if (res.ok) {
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Announcement not saved.');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!headline.trim()) return;
    setIsSaving(true);
    try {
      const payload = {
        badge: badge.trim() || '⚡ NEW UPDATE',
        headline: headline.trim(),
        subtext: subtext.trim(),
        cta: cta.trim() || 'Explore Now',
        perk: perk.trim(),
        icon: icon || '🛒',
        bg_gradient: gradient,
        accent_border: 'border-white/20',
        badge_color: 'bg-white/20 text-white border-white/40',
        sort_order: banners.length + 1
      };
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setBanners(prev => [...prev, created]);
        setBadge(''); setHeadline(''); setSubtext(''); setCta(''); setPerk(''); setIcon('🛒'); setGradient(DEFAULT_GRADIENTS[0]);
        setIsAddOpen(false);
        alert('Banner published! It now appears on the customer app home page.');
      } else {
        alert('Failed to publish banner');
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Banner not saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleBanner = async (b) => {
    try {
      const res = await fetch(`/api/admin/banners/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...b, is_active: !b.is_active })
      });
      if (res.ok) {
        const updated = await res.json();
        setBanners(prev => prev.map(x => x.id === updated.id ? updated : x));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      if (res.ok) setBanners(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingBanner) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/banners/${editingBanner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBanner)
      });
      if (res.ok) {
        const updated = await res.json();
        setBanners(prev => prev.map(b => b.id === updated.id ? updated : b));
        setEditingBanner(null);
        alert('Banner updated & published live!');
      }
    } catch (err) {
      console.error(err);
      alert('Server unreachable. Banner not saved.');
    } finally {
      setIsSaving(false);
    }
  };
return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">App Content Management (CMS)</h2>
          <p className="text-xs text-slate-500">Update homepage hero banners, announcements & customer-app content live - no code changes</p>
        </div>
        <button onClick={loadContent} className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-purple-700 hover:border-purple-300 transition flex items-center gap-1.5 text-xs font-extrabold">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Live sync banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
        <Globe size={14} className="text-emerald-600" />
        {banners.filter(b => b.is_active).length} live banners — every change below instantly reaches the customer app home page.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Announcement ticker + add banner */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Bell size={16} className="text-purple-600" /> Top App Announcement Ticker
            </h3>
            <form onSubmit={handleSaveAnnouncement} className="space-y-3 text-xs">
              <input type="text" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold" />
              {savedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Ticker updated live on the customer app!
                </div>
              ) : (
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2">
                  <Save size={16} /> Publish Announcement
                </button>
              )}
            </form>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <button onClick={() => setIsAddOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs py-3 rounded-2xl shadow-md flex items-center justify-center gap-2">
              <Plus size={16} /> Add New Homepage Banner
            </button>
          </div>
        </div>

        {/* RIGHT: Live banner list */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Image size={16} className="text-purple-600" /> Homepage Hero Banners ({banners.length})
          </h3>

          {banners.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-bold text-xs">No banners yet. Publish your first hero banner!</div>
          ) : (
            <div className="space-y-3">
              {banners.map((b) => (
                <div key={b.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition ${b.is_active ? 'bg-gradient-to-r ' + (b.bg_gradient || 'from-emerald-950 via-teal-900 to-emerald-900') + ' text-white border-transparent' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-3xl flex-shrink-0">{b.icon || '🛒'}</span>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${b.is_active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {b.badge || 'BANNER'}
                    </span>
                    <h4 className={`font-black text-sm truncate mt-1 ${b.is_active ? 'text-white' : 'text-slate-900'}`}>{b.headline}</h4>
                    <p className={`text-[11px] font-medium truncate ${b.is_active ? 'text-white/70' : 'text-slate-500'}`}>{b.subtext || ''}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${b.is_active ? 'bg-emerald-400 text-slate-900' : 'bg-slate-200 text-slate-500'}`}>
                      {b.is_active ? 'LIVE' : 'HIDDEN'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingBanner({ ...b })} className="p-1.5 bg-white/15 hover:bg-white/30 rounded-lg text-white" title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleToggleBanner(b)} className="p-1.5 bg-white/15 hover:bg-white/30 rounded-lg text-white" title={b.is_active ? 'Hide' : 'Show'}>
                        <Sparkles size={13} />
                      </button>
                      <button onClick={() => handleDeleteBanner(b.id)} className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 rounded-lg text-rose-200" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
{/* Add Banner Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4">Create Homepage Banner</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Badge Text</label>
                <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="⚡ 10-MIN EXPRESS HUB" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Headline *</label>
                <input type="text" required value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Fresh Farm Dairy & Daily Staples" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-black" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Subtext</label>
                <input type="text" value={subtext} onChange={(e) => setSubtext(e.target.value)} placeholder="Amul Milk, Paneer & Breads..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Icon / Emoji</label>
                  <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center text-xl" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Perk Text</label>
                  <input type="text" value={perk} onChange={(e) => setPerk(e.target.value)} placeholder="Zero Delivery Fee" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Button Label</label>
                <input type="text" value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Shop Dairy" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Banner Colour Theme</label>
                <select value={gradient} onChange={(e) => setGradient(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold">
                  {DEFAULT_GRADIENTS.map((g, i) => (
                    <option key={i} value={g}>{['Emerald Green', 'Purple Night', 'Amber Sunset', 'Rose Pink'][i]}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md disabled:opacity-50">
                {isSaving ? 'Publishing...' : 'Publish Banner to Customer App'}
              </button>
            </form>
          </div>
        </div>
      )}
{/* Edit Banner Modal */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditingBanner(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4">Edit Banner: {editingBanner.headline}</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Headline</label>
                <input type="text" required value={editingBanner.headline} onChange={(e) => setEditingBanner({ ...editingBanner, headline: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-black" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Subtext</label>
                <input type="text" value={editingBanner.subtext || ''} onChange={(e) => setEditingBanner({ ...editingBanner, subtext: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Badge</label>
                <input type="text" value={editingBanner.badge || ''} onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CTA Label</label>
                  <input type="text" value={editingBanner.cta || ''} onChange={(e) => setEditingBanner({ ...editingBanner, cta: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Icon</label>
                  <input type="text" value={editingBanner.icon || ''} onChange={(e) => setEditingBanner({ ...editingBanner, icon: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center" />
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Banner Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}