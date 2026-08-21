import React, { useState } from 'react';
import { Globe, Image, FileText, CheckCircle2, Save } from 'lucide-react';

export default function ContentMgmtView() {
  const [announcement, setAnnouncement] = useState('⚡ FAST EXPRESS DELIVERY — DIRECT FROM YOUR LOCAL KIRANA STORE');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">App Content Management System (CMS)</h2>
          <p className="text-xs text-slate-500">Update homepage banners, announcements, terms & FAQs without code changes</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs max-w-2xl space-y-4">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Top App Announcement Ticker Bar</label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Homepage Promo Banner 1 Title</label>
            <input
              type="text"
              defaultValue="Express Delivery Or Free Products!"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
            />
          </div>

          {savedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> App CMS content updated live on customer app!
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2"
            >
              <Save size={16} /> Save & Publish Live
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
