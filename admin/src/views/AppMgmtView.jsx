import React, { useState } from 'react';
import { Smartphone, ToggleLeft, ToggleRight, CheckCircle2, AlertOctagon, Save, ShieldAlert } from 'lucide-react';

export default function AppMgmtView() {
  const [appVersion, setAppVersion] = useState('2.4.0');
  const [minSupportedVersion, setMinSupportedVersion] = useState('2.1.0');
  const [forceUpdate, setForceUpdate] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [featureFlags, setFeatureFlags] = useState({
    voiceSearch: true,
    aiAssistant: true,
    scratchCards: true,
    walletCheckout: true,
    prescriptionUpload: true,
    scheduledDeliveries: true
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Mobile & Web App Configuration</h2>
          <p className="text-xs text-slate-500">Manage live mobile app versions, forced OTA updates, emergency maintenance mode & feature flags</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          App settings and feature flags updated live on customer devices!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Version Control */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <Smartphone size={18} className="text-purple-600" />
            App Versioning & OTA Updates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Current Latest App Version</label>
              <input
                type="text"
                value={appVersion}
                onChange={(e) => setAppVersion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Minimum Supported Version</label>
              <input
                type="text"
                value={minSupportedVersion}
                onChange={(e) => setMinSupportedVersion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="font-black text-slate-900 block">Force App Update (Blocking Modal)</span>
              <span className="text-slate-500 text-[11px]">Forces all customers with older versions to update before placing orders</span>
            </div>
            <input
              type="checkbox"
              checked={forceUpdate}
              onChange={(e) => setForceUpdate(e.target.checked)}
              className="w-5 h-5 accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Maintenance Mode Toggle */}
          <div className={`flex items-center justify-between p-4 rounded-2xl border text-xs ${
            maintenanceMode ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-100'
          }`}>
            <div>
              <span className="font-black text-slate-900 block flex items-center gap-1.5">
                <AlertOctagon size={16} className={maintenanceMode ? 'text-rose-600' : 'text-slate-400'} />
                Emergency Maintenance Mode (Store Lockdown)
              </span>
              <span className="text-slate-500 text-[11px]">Displays 'Under Maintenance' screen on all customer apps</span>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition ${
                maintenanceMode ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {maintenanceMode ? 'LOCKDOWN ACTIVE' : 'NORMAL MODE'}
            </button>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-slate-900">Live Feature Flags</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { key: 'voiceSearch', label: '🎙️ Voice Search Mic Engine' },
              { key: 'aiAssistant', label: '🤖 Kira AI Shopping Assistant' },
              { key: 'scratchCards', label: '✨ Scratch & Win Cash Rewards' },
              { key: 'walletCheckout', label: '💰 KiranaMoney 1-Click Wallet' },
              { key: 'prescriptionUpload', label: '📄 Medical Rx Prescription Upload' },
              { key: 'scheduledDeliveries', label: '📅 Same-Day & Next-Day Slot Picker' }
            ].map(f => (
              <div key={f.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-800">{f.label}</span>
                <input
                  type="checkbox"
                  checked={featureFlags[f.key]}
                  onChange={(e) => setFeatureFlags({ ...featureFlags, [f.key]: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md flex items-center gap-2"
        >
          <Save size={16} /> Save App Configurations Live
        </button>
      </form>
    </div>
  );
}
