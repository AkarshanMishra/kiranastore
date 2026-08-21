import React from 'react';
import { ShieldCheck, UserCheck, Key, Lock, Check } from 'lucide-react';

export default function RolesView() {
  const roles = [
    { role: 'Super Admin', desc: 'Full unrestricted system access across all dark stores & financial settings', count: 2, badge: 'FULL ACCESS' },
    { role: 'Store Manager', desc: 'Manage local dark store inventory, products, and incoming orders', count: 3, badge: 'STORE LEVEL' },
    { role: 'Order Manager', desc: 'Fulfill, edit, pack, and dispatch incoming customer orders', count: 5, badge: 'OPERATIONS' },
    { role: 'Inventory Manager', desc: 'Manage stock levels, purchase entries, and low-stock reorders', count: 2, badge: 'STOCK ONLY' },
    { role: 'Delivery Manager', desc: 'Manage delivery riders, assignments, pincodes, and slots', count: 2, badge: 'LOGISTICS' },
    { role: 'Account Manager', desc: 'Manage payment gateway reconciliation, refunds, and financial P&L', count: 1, badge: 'FINANCE' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Role-Based Access Control (RBAC) & Permissions</h2>
          <p className="text-xs text-slate-500">Configure administrative team roles, permissions matrix & security privileges</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-slate-900 text-sm">{r.role}</span>
                <span className="bg-purple-50 text-purple-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded border border-purple-200">
                  {r.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{r.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-700 font-bold">{r.count} Team Members</span>
              <button onClick={() => alert(`Edit permissions for role ${r.role}`)} className="text-purple-600 hover:underline font-bold">
                Edit Matrix
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
