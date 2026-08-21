import React, { useState } from 'react';
import { History, Search, User, ShieldCheck, Clock, Download, Filter } from 'lucide-react';

export default function AuditLogsView() {
  const [searchQuery, setSearchQuery] = useState('');

  const logs = [
    {
      id: 'LOG-9482',
      actor: 'Super Admin (Akarshan)',
      action: 'ACCEPTED_ORDER_SCHEDULE',
      target: 'Order #KS-94821',
      details: 'Scheduled delivery slot for Today (4:00 PM - 7:00 PM)',
      ip: '106.210.84.192',
      time: '20 Aug 2026, 10:13 PM'
    },
    {
      id: 'LOG-9481',
      actor: 'Inventory Manager (Sandeep)',
      action: 'STOCK_RESTOCK',
      target: 'Amul Taaza Milk 500ml',
      details: 'Stock increased from 18 → 80 pcs (+62 units)',
      ip: '106.210.84.192',
      time: '20 Aug 2026, 9:45 PM'
    },
    {
      id: 'LOG-9480',
      actor: 'Super Admin (Akarshan)',
      action: 'PRICE_UPDATE',
      target: 'Aashirvaad Chakki Atta 5kg',
      details: 'Discount price updated: ₹225 → ₹219',
      ip: '106.210.84.192',
      time: '20 Aug 2026, 8:30 PM'
    },
    {
      id: 'LOG-9479',
      actor: 'Store Manager (Amit)',
      action: 'ASSIGN_RIDER',
      target: 'Order #KS-94820',
      details: 'Assigned rider Rahul Kumar (+91 9811223344)',
      ip: '106.210.84.192',
      time: '20 Aug 2026, 6:15 PM'
    },
    {
      id: 'LOG-9478',
      actor: 'Marketing Admin (Neha)',
      action: 'COUPON_CREATED',
      target: 'Coupon ZEPTO20',
      details: 'Created 20% discount coupon code capped at ₹80',
      ip: '106.210.84.192',
      time: '20 Aug 2026, 4:00 PM'
    }
  ];

  const filteredLogs = logs.filter(l =>
    l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Admin Audit Trail & Activity Logs</h2>
          <p className="text-xs text-slate-500">Track every change: who modified products, orders, stock, discounts, IP address & exact timestamps</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Downloading full audit trail CSV...")}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Download size={15} /> Export Audit Log CSV
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900">Recent Admin Activities</h3>
          <span className="text-xs text-slate-400 font-bold">{filteredLogs.length} Events Recorded</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="font-black text-slate-900">{log.target}</span>
                  <span className="text-slate-400 text-[11px]">• {log.time}</span>
                </div>
                <div className="text-slate-700 font-medium">{log.details}</div>
                <div className="text-slate-400 text-[10px] mt-0.5 flex items-center gap-2">
                  <span>By: <strong>{log.actor}</strong></span>
                  <span>•</span>
                  <span>IP: {log.ip}</span>
                </div>
              </div>

              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-1 rounded-lg">
                {log.id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
