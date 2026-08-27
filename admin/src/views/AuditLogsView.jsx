import React, { useState, useEffect } from 'react';
import { History, Search, User, ShieldCheck, Clock, Download, Filter, Plus, Trash2, X, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AuditLogsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const [logs, setLogs] = useState([
    {
      id: 'LOG-9482',
      actor: 'Super Admin (Akarshan)',
      action: 'ACCEPTED_ORDER_SCHEDULE',
      category: 'ORDERS',
      target: 'Order #KS-94821',
      details: 'Scheduled delivery slot for Today (4:00 PM - 7:00 PM)',
      ip_address: '106.210.84.192',
      time: '20 Aug 2026, 10:13 PM'
    },
    {
      id: 'LOG-9481',
      actor: 'Inventory Manager (Sandeep)',
      action: 'STOCK_RESTOCK',
      category: 'INVENTORY',
      target: 'Amul Taaza Milk 500ml',
      details: 'Stock increased from 18 → 80 pcs (+62 units)',
      ip_address: '106.210.84.192',
      time: '20 Aug 2026, 9:45 PM'
    },
    {
      id: 'LOG-9480',
      actor: 'Super Admin (Akarshan)',
      action: 'PRICE_UPDATE',
      category: 'INVENTORY',
      target: 'Aashirvaad Chakki Atta 5kg',
      details: 'Discount price updated: ₹225 → ₹219',
      ip_address: '106.210.84.192',
      time: '20 Aug 2026, 8:30 PM'
    },
    {
      id: 'LOG-9479',
      actor: 'Store Manager (Amit)',
      action: 'ASSIGN_RIDER',
      category: 'ORDERS',
      target: 'Order #KS-94820',
      details: 'Assigned rider Rahul Kumar (+91 9811223344)',
      ip_address: '106.210.84.192',
      time: '20 Aug 2026, 6:15 PM'
    },
    {
      id: 'LOG-9478',
      actor: 'Marketing Admin (Neha)',
      action: 'COUPON_CREATED',
      category: 'SYSTEM',
      target: 'Coupon ZEPTO20',
      details: 'Created 20% discount coupon code capped at ₹80',
      ip_address: '106.210.84.192',
      time: '20 Aug 2026, 4:00 PM'
    }
  ]);

  // Modal State for Manual Log Creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    actor: 'Super Admin (Current)',
    action: 'SECURITY_CHECK',
    category: 'SECURITY',
    target: 'System Audit',
    details: ''
  });

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(l => ({
            id: l.log_id || `LOG-${l.id}`,
            actor: l.actor,
            action: l.action,
            category: l.category || 'OPERATIONS',
            target: l.target,
            details: l.details || '',
            ip_address: l.ip_address || '106.210.84.192',
            time: new Date(l.created_at || Date.now()).toLocaleString()
          }));
          setLogs(formatted);
        }
      }
    } catch (e) {
      console.warn('Could not fetch audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleCreateLog = async (e) => {
    e.preventDefault();
    if (!formData.target || !formData.details) return;

    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      actor: formData.actor,
      action: formData.action,
      category: formData.category,
      target: formData.target,
      details: formData.details,
      ip_address: '106.210.84.192',
      time: 'Just now'
    };

    try {
      await fetch('/api/admin/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: formData.actor,
          action: formData.action,
          category: formData.category,
          target: formData.target,
          details: formData.details,
          ip_address: '106.210.84.192'
        })
      });
    } catch {}

    setLogs([newLog, ...logs]);
    setIsModalOpen(false);
    setFormData({
      actor: 'Super Admin (Current)',
      action: 'SECURITY_CHECK',
      category: 'SECURITY',
      target: '',
      details: ''
    });
  };

  const handleClearLogs = async () => {
    if (confirm('Are you sure you want to purge and clear the audit trail? This action is logged.')) {
      try {
        await fetch('/api/admin/audit-logs', { method: 'DELETE' });
      } catch {}
      setLogs([]);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Actor', 'Action', 'Category', 'Target', 'Details', 'IP Address', 'Timestamp'];
    const rows = logs.map(l => [
      l.id,
      `"${l.actor}"`,
      l.action,
      l.category,
      `"${l.target}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      l.ip_address,
      `"${l.time}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KiranaStore_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (l.details && l.details.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || l.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <History size={24} className="text-purple-600" />
            Admin Audit Trail & Activity Logs
          </h2>
          <p className="text-xs text-slate-500">
            Track every administrative change: price updates, stock adjustments, order fulfillment, and IP addresses
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={15} /> Log Event
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Download size={15} /> Export CSV
          </button>

          <button
            onClick={handleClearLogs}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs px-3 py-2.5 rounded-2xl transition"
            title="Clear logs"
          >
            <Trash2 size={15} />
          </button>

          <button
            onClick={loadLogs}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition"
            title="Refresh Logs"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, target item, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter size={13} /> Scope:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="ORDERS">Orders</option>
            <option value="INVENTORY">Inventory & Stock</option>
            <option value="SECURITY">Security & Access</option>
            <option value="SYSTEM">System & Config</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900">Recorded Administrative Events</h3>
          <span className="text-xs text-purple-700 font-extrabold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            {filteredLogs.length} Events
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono text-[11px] font-black px-2 py-0.5 rounded ${
                    log.category === 'ORDERS' ? 'bg-blue-50 text-blue-800' :
                    log.category === 'INVENTORY' ? 'bg-emerald-50 text-emerald-800' :
                    log.category === 'SECURITY' ? 'bg-rose-50 text-rose-800' :
                    'bg-purple-50 text-purple-800'
                  }`}>
                    {log.action}
                  </span>
                  <span className="font-black text-slate-900">{log.target}</span>
                  <span className="text-slate-400 text-[11px]">• {log.time}</span>
                </div>
                <div className="text-slate-700 font-medium text-xs">{log.details}</div>
                <div className="text-slate-400 text-[10px] flex items-center gap-2">
                  <span>By: <strong className="text-slate-600">{log.actor}</strong></span>
                  <span>•</span>
                  <span>IP: <strong className="font-mono text-slate-600">{log.ip_address}</strong></span>
                </div>
              </div>

              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2.5 py-1 rounded-xl self-start sm:self-center">
                {log.id}
              </span>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-medium">
              No audit logs recorded for the selected criteria.
            </div>
          )}
        </div>
      </div>

      {/* MANUAL LOG ENTRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">Record Administrative Audit Event</h3>

            <form onSubmit={handleCreateLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Actor (Administrator) *</label>
                <input
                  type="text"
                  required
                  value={formData.actor}
                  onChange={(e) => setFormData({ ...formData, actor: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Action Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MANUAL_AUDIT"
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="ORDERS">ORDERS</option>
                    <option value="INVENTORY">INVENTORY</option>
                    <option value="SECURITY">SECURITY</option>
                    <option value="SYSTEM">SYSTEM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Object / Entity *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dark Store 402 Stock Audit"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Event Details & Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed notes regarding this administrative action..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                Save Audit Log
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

