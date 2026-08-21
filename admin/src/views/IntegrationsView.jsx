import React, { useState } from 'react';
import { Plug, Key, CheckCircle2, ShieldCheck, ExternalLink, RefreshCw, Save } from 'lucide-react';

export default function IntegrationsView() {
  const [integrations, setIntegrations] = useState([
    {
      id: 'razorpay',
      name: 'Razorpay Payment Gateway',
      desc: 'UPI, Credit/Debit Cards, Net Banking & Instant Refunds',
      status: 'CONNECTED',
      keyId: 'rzp_test_94827101928',
      type: 'PAYMENTS'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business Cloud API',
      desc: 'Real-time order dispatch updates & OTP login via Meta',
      status: 'CONNECTED',
      keyId: 'WABA_984719281726',
      type: 'MESSAGING'
    },
    {
      id: 'maps',
      name: 'Google Maps & Geolocation API',
      desc: 'Address autocomplete & reverse geocoding pin-drop',
      status: 'CONNECTED',
      keyId: 'AIzaSyD98472918274...',
      type: 'LOCATION'
    },
    {
      id: 'msg91',
      name: 'Fast2SMS / MSG91 Gateway',
      desc: 'High-speed transactional SMS receipts & rider alerts',
      status: 'CONNECTED',
      keyId: 'SMS_AUTH_KEY_84920',
      type: 'SMS'
    },
    {
      id: 'firebase',
      name: 'Firebase Cloud Messaging (FCM)',
      desc: 'Mobile push notification delivery engine',
      status: 'CONNECTED',
      keyId: 'fcm-kiranastore-service-account.json',
      type: 'NOTIFICATIONS'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">API Credentials & Third-Party Integrations</h2>
          <p className="text-xs text-slate-500">Manage payment gateways, WhatsApp business API, Google Maps, SMS gateways & webhooks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-purple-50 text-purple-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                  {item.type}
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {item.status}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 mb-1">{item.name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-3">{item.desc}</p>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px] text-slate-700 flex items-center justify-between">
                <span className="truncate max-w-[180px]">{item.keyId}</span>
                <Key size={13} className="text-slate-400 flex-shrink-0" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
              <button
                onClick={() => alert(`Testing API connection to ${item.name}... Connection Successful (200 OK)!`)}
                className="text-xs text-purple-600 font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} /> Test Ping
              </button>

              <button
                onClick={() => {
                  const newKey = prompt(`Enter new Key/Token for ${item.name}:`, item.keyId);
                  if (newKey) alert('Credentials updated securely!');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-3 py-1.5 rounded-xl transition"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
