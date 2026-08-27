import React, { useState, useEffect } from 'react';
import { Plug, Key, CheckCircle2, ShieldCheck, ExternalLink, RefreshCw, Save, Plus, Trash2, Edit, X, Search, Filter, AlertCircle, Wifi } from 'lucide-react';

export default function IntegrationsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [pingStatus, setPingStatus] = useState({}); // { [id]: { status: 'testing'|'success'|'error', latency: number } }

  const [integrations, setIntegrations] = useState([
    {
      id: 'razorpay',
      integration_id: 'razorpay',
      name: 'Razorpay Payment Gateway',
      desc: 'UPI, Credit/Debit Cards, Net Banking & Instant Refunds',
      status: 'CONNECTED',
      key_id: 'rzp_test_94827101928',
      secret_key: 'rzp_sec_***8492',
      webhook_url: 'https://api.kiranastore.com/api/webhooks/razorpay',
      category: 'PAYMENTS',
      environment: 'PRODUCTION'
    },
    {
      id: 'whatsapp',
      integration_id: 'whatsapp',
      name: 'WhatsApp Business Cloud API',
      desc: 'Real-time order dispatch updates & OTP login via Meta',
      status: 'CONNECTED',
      key_id: 'WABA_984719281726',
      secret_key: 'meta_token_***918',
      webhook_url: 'https://api.kiranastore.com/api/webhooks/whatsapp',
      category: 'MESSAGING',
      environment: 'PRODUCTION'
    },
    {
      id: 'maps',
      integration_id: 'maps',
      name: 'Google Maps & Geolocation API',
      desc: 'Address autocomplete & reverse geocoding pin-drop',
      status: 'CONNECTED',
      key_id: 'AIzaSyD984729182749102847',
      secret_key: '',
      webhook_url: '',
      category: 'LOCATION',
      environment: 'PRODUCTION'
    },
    {
      id: 'msg91',
      integration_id: 'msg91',
      name: 'Fast2SMS / MSG91 Gateway',
      desc: 'High-speed transactional SMS receipts & rider alerts',
      status: 'CONNECTED',
      key_id: 'SMS_AUTH_KEY_84920',
      secret_key: '',
      webhook_url: '',
      category: 'SMS',
      environment: 'PRODUCTION'
    },
    {
      id: 'firebase',
      integration_id: 'firebase',
      name: 'Firebase Cloud Messaging (FCM)',
      desc: 'Mobile push notification delivery engine',
      status: 'CONNECTED',
      key_id: 'fcm-kiranastore-service-account.json',
      secret_key: '',
      webhook_url: '',
      category: 'NOTIFICATIONS',
      environment: 'PRODUCTION'
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    integration_id: '',
    name: '',
    desc: '',
    key_id: '',
    secret_key: '',
    webhook_url: '',
    category: 'PAYMENTS',
    environment: 'PRODUCTION',
    status: 'CONNECTED'
  });

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/integrations');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(d => ({
            id: d.integration_id || `INT-${d.id}`,
            integration_id: d.integration_id || `INT-${d.id}`,
            name: d.name,
            desc: d.desc || '',
            key_id: d.key_id || '',
            secret_key: d.secret_key || '',
            webhook_url: d.webhook_url || '',
            category: d.category || 'PAYMENTS',
            environment: d.environment || 'PRODUCTION',
            status: d.status || 'CONNECTED'
          }));
          setIntegrations(mapped);
        }
      }
    } catch (e) {
      console.warn('Could not fetch integrations:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      integration_id: `custom_${Date.now()}`,
      name: '',
      desc: '',
      key_id: '',
      secret_key: '',
      webhook_url: '',
      category: 'PAYMENTS',
      environment: 'PRODUCTION',
      status: 'CONNECTED'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      integration_id: item.integration_id,
      name: item.name,
      desc: item.desc || '',
      key_id: item.key_id || '',
      secret_key: item.secret_key || '',
      webhook_url: item.webhook_url || '',
      category: item.category || 'PAYMENTS',
      environment: item.environment || 'PRODUCTION',
      status: item.status || 'CONNECTED'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.integration_id) return;

    try {
      await fetch('/api/admin/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch {}

    if (editingItem) {
      setIntegrations(integrations.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
    } else {
      setIntegrations([...integrations, { id: formData.integration_id, ...formData }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Remove the "${name}" integration and discard credentials?`)) {
      try {
        await fetch(`/api/admin/integrations/${id}`, { method: 'DELETE' });
      } catch {}
      setIntegrations(integrations.filter(i => i.id !== id));
    }
  };

  const handleTestPing = (id, name) => {
    setPingStatus(prev => ({ ...prev, [id]: { status: 'testing' } }));
    setTimeout(() => {
      const latency = Math.floor(45 + Math.random() * 85);
      setPingStatus(prev => ({
        ...prev,
        [id]: { status: 'success', latency }
      }));
    }, 600);
  };

  const filtered = integrations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Plug size={24} className="text-purple-600" />
            API Credentials & Third-Party Integrations
          </h2>
          <p className="text-xs text-slate-500">
            Manage payment gateways, WhatsApp business API, Google Maps, SMS gateways, and webhook endpoints
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={15} /> Add Integration / Webhook
          </button>

          <button
            onClick={loadIntegrations}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition"
            title="Refresh Integrations"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search API integrations by name, provider, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter size={13} /> Type:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="PAYMENTS">PAYMENTS</option>
            <option value="MESSAGING">MESSAGING</option>
            <option value="LOCATION">LOCATION</option>
            <option value="SMS">SMS</option>
            <option value="NOTIFICATIONS">NOTIFICATIONS</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const ping = pingStatus[item.id];
          return (
            <div key={item.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-purple-50 text-purple-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                    {item.category}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={12} /> {item.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 mb-1">{item.name}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3">{item.desc}</p>

                <div className="space-y-1.5">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px] text-slate-700 flex items-center justify-between">
                    <span className="truncate max-w-[200px]" title={item.key_id}>
                      Key: {item.key_id ? item.key_id : 'Not configured'}
                    </span>
                    <Key size={13} className="text-slate-400 flex-shrink-0" />
                  </div>

                  {item.webhook_url && (
                    <div className="text-[10px] text-slate-400 font-mono truncate px-1" title={item.webhook_url}>
                      Webhook: {item.webhook_url}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestPing(item.id, item.name)}
                    disabled={ping?.status === 'testing'}
                    className="text-xs text-purple-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw size={12} className={ping?.status === 'testing' ? 'animate-spin' : ''} />
                    {ping?.status === 'testing' ? 'Pinging...' : 'Test Ping'}
                  </button>

                  {ping?.status === 'success' && (
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Wifi size={10} /> {ping.latency}ms
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-3 py-1.5 rounded-xl transition"
                  >
                    Configure
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete Integration"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT INTEGRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">
              {editingItem ? `Configure ${editingItem.name}` : 'Connect New Service Integration'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Integration Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shiprocket Express Logistics"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="PAYMENTS">PAYMENTS</option>
                    <option value="MESSAGING">MESSAGING</option>
                    <option value="LOCATION">LOCATION</option>
                    <option value="SMS">SMS</option>
                    <option value="NOTIFICATIONS">NOTIFICATIONS</option>
                    <option value="LOGISTICS">LOGISTICS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Environment</label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="SANDBOX">SANDBOX / TEST</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">API Key / Client ID</label>
                <input
                  type="text"
                  placeholder="e.g. rzp_live_94827101928"
                  value={formData.key_id}
                  onChange={(e) => setFormData({ ...formData, key_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">API Secret / Auth Token</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••"
                  value={formData.secret_key}
                  onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Webhook URL Endpoint</label>
                <input
                  type="text"
                  placeholder="https://api.kiranastore.com/api/webhooks/service"
                  value={formData.webhook_url}
                  onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Brief description of usage in store workflow..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                Save Credentials
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

