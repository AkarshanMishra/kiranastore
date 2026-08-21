import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Shield, Key, Globe, DollarSign } from 'lucide-react';

export default function SettingsView() {
  const [storeName, setStoreName] = useState('KiranaStore QuickCommerce Pvt Ltd');
  const [gstin, setGstin] = useState('07AAACK9842K1Z9');
  const [supportPhone, setSupportPhone] = useState('+91 1800-10-KIRANA');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">System & Enterprise Store Settings</h2>
          <p className="text-xs text-slate-500">Configure business information, GST rates, currency, and API endpoints</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Company Registered Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Toll-Free Support Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Base Currency</label>
              <input
                type="text"
                disabled
                value="₹ INR (Indian Rupee)"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-500 font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">FastAPI Backend API Target</label>
              <input
                type="text"
                disabled
                value="http://127.0.0.1:8000"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-500 font-bold cursor-not-allowed"
              />
            </div>
          </div>

          {saved ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Enterprise settings updated successfully!
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2"
            >
              <Save size={16} /> Save Enterprise Settings
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
