import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Shield, Key, Globe, DollarSign, Clock, Truck, Server, RefreshCw, AlertTriangle, Database } from 'lucide-react';

export default function SettingsView() {
  const [storeName, setStoreName] = useState('KiranaStore QuickCommerce Pvt Ltd');
  const [gstin, setGstin] = useState('07AAACK9842K1Z9');
  const [cin, setCin] = useState('U52100DL2026PTC394821');
  const [supportPhone, setSupportPhone] = useState('+91 9811223344');
  const [supportEmail, setSupportEmail] = useState('care@kiranastore.com');
  const [operatingHours, setOperatingHours] = useState('6:00 AM – 11:30 PM (All 365 Days)');
  const [slaMinutes, setSlaMinutes] = useState('10');
  const [minOrderValue, setMinOrderValue] = useState('99');
  const [freeDeliveryMin, setFreeDeliveryMin] = useState('499');
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [currency, setCurrency] = useState('INR');
  
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.store_name) setStoreName(data.store_name);
        if (data.gstin) setGstin(data.gstin);
        if (data.cin) setCin(data.cin);
        if (data.support_phone) setSupportPhone(data.support_phone);
        if (data.support_email) setSupportEmail(data.support_email);
        if (data.operating_hours) setOperatingHours(data.operating_hours);
        if (data.sla_minutes) setSlaMinutes(data.sla_minutes);
        if (data.min_order_value) setMinOrderValue(data.min_order_value);
        if (data.free_delivery_min) setFreeDeliveryMin(data.free_delivery_min);
        if (data.auto_backup !== undefined) setAutoBackup(data.auto_backup === 'true' || data.auto_backup === true);
        if (data.maintenance_mode !== undefined) setMaintenanceMode(data.maintenance_mode === 'true' || data.maintenance_mode === true);
      }
    } catch (e) {
      console.warn('Could not load admin settings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      store_name: storeName,
      gstin: gstin,
      cin: cin,
      support_phone: supportPhone,
      support_email: supportEmail,
      operating_hours: operatingHours,
      sla_minutes: slaMinutes,
      min_order_value: minOrderValue,
      free_delivery_min: freeDeliveryMin,
      auto_backup: autoBackup,
      maintenance_mode: maintenanceMode
    };

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {}

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings size={24} className="text-purple-600" />
            System & Enterprise Store Settings
          </h2>
          <p className="text-xs text-slate-500">
            Configure enterprise legal info, operating SLAs, quick-commerce thresholds, currency, and system governance
          </p>
        </div>

        <button
          onClick={loadSettings}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition self-start sm:self-auto"
          title="Reload Settings"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Legal & Commerce Settings */}
        <div className="lg:col-span-2 space-y-5">
          {/* Company Profile */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Shield size={16} className="text-purple-600" />
              Company Legal & Tax Profile
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Registered Name *</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Corporate Identity Number (CIN)</label>
                  <input
                    type="text"
                    value={cin}
                    onChange={(e) => setCin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Toll-Free / Support Helpline</label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick-Commerce Operations & SLAs */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Truck size={16} className="text-purple-600" />
              Quick-Commerce Fulfillment & SLAs
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Operating Hours Description</label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Express Delivery SLA (Mins)</label>
                  <input
                    type="number"
                    value={slaMinutes}
                    onChange={(e) => setSlaMinutes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-black"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Minimum Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-black"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Free Delivery Minimum (₹)</label>
                  <input
                    type="number"
                    value={freeDeliveryMin}
                    onChange={(e) => setFreeDeliveryMin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): System & Server Governance */}
        <div className="space-y-5">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Server size={16} className="text-purple-600" />
              Environment & Infrastructure
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Base Currency</label>
                <input
                  type="text"
                  disabled
                  value="₹ INR (Indian Rupee)"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-600 font-bold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Backend Deployment Host</label>
                <input
                  type="text"
                  disabled
                  value="https://kiranastore-imwk.onrender.com"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-600 font-mono text-[11px] cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
                <div>
                  <span className="font-extrabold text-slate-900 block">Automated Daily Database Backups</span>
                  <span className="text-slate-500 text-[11px]">Syncs snapshot at 03:00 AM UTC</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
                <div>
                  <span className="font-extrabold text-rose-900 block">Maintenance Mode</span>
                  <span className="text-rose-600 text-[11px]">Show maintenance banner on customer mobile app</span>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2">
              {saved ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs p-3.5 rounded-2xl flex items-center justify-center gap-2 animate-in zoom-in duration-200">
                  <CheckCircle2 size={16} /> Enterprise settings updated successfully!
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <Save size={16} /> Save Enterprise Settings
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

