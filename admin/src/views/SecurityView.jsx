import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, Users, Key, CheckCircle2, AlertTriangle, LogOut, Power, Plus, Trash2 } from 'lucide-react';

export default function SecurityView() {
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [otpLogin, setOtpLogin] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(60);

  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: 'Akarshan Mishra', email: 'admin@kiranastore.com', role: 'Super Admin', permissions: 'Full Access (All Modules)', lastLogin: 'Just now', status: 'ACTIVE' },
    { id: 2, name: 'Amit Varma', email: 'amit.v@kiranastore.com', role: 'Store Manager', permissions: 'Orders, Inventory, Delivery', lastLogin: '2 hours ago', status: 'ACTIVE' },
    { id: 3, name: 'Sandeep Rai', email: 'sandeep@kiranastore.com', role: 'Inventory Manager', permissions: 'Stock, Products, Suppliers', lastLogin: 'Yesterday', status: 'ACTIVE' },
    { id: 4, name: 'Neha Kapoor', email: 'neha.k@kiranastore.com', role: 'Marketing Manager', permissions: 'Offers, Coupons, Banners', lastLogin: '3 days ago', status: 'ACTIVE' },
  ]);

  const [activeSessions] = useState([
    { id: 1, device: 'Chrome on Windows 11', location: 'Noida, UP (Current Session)', ip: '106.210.84.192', active: true },
    { id: 2, device: 'KiranaStore Admin Mobile App (Android)', location: 'Noida, UP', ip: '106.210.84.192', active: false }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Admin Security & Role-Based Access Control (RBAC)</h2>
          <p className="text-xs text-slate-500">Manage administrative user accounts, 9 role assignments, 2FA authentication & active sessions</p>
        </div>

        <button
          onClick={() => {
            const name = prompt("Enter new Admin User Name:");
            const email = prompt("Enter Admin Email:");
            const role = prompt("Enter Role (e.g. Order Manager / Delivery Manager):", "Order Manager");
            if (name && email) {
              setAdminUsers([...adminUsers, {
                id: Date.now(),
                name,
                email,
                role: role || 'Admin',
                permissions: 'Assigned Role Modules',
                lastLogin: 'Never',
                status: 'ACTIVE'
              }]);
              alert(`Admin user ${name} registered successfully!`);
            }
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={15} /> Add Admin User
        </button>
      </div>

      {/* Security Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 2FA & Login Security */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <Lock size={18} className="text-purple-600" />
            Two-Factor Authentication & Login Policy
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="font-extrabold text-slate-900 block">Require 2-Factor Authentication (OTP / App)</span>
                <span className="text-slate-500 text-[11px]">Enforces SMS / Authenticator OTP code on admin login</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="w-5 h-5 accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="font-extrabold text-slate-900 block">Mobile OTP Quick Login</span>
                <span className="text-slate-500 text-[11px]">Allow trusted store managers to login via SMS OTP</span>
              </div>
              <input
                type="checkbox"
                checked={otpLogin}
                onChange={(e) => setOtpLogin(e.target.checked)}
                className="w-5 h-5 accent-purple-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Active Logged-in Sessions */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <Smartphone size={18} className="text-purple-600" />
            Active Administrator Sessions
          </h3>

          <div className="space-y-2 text-xs">
            {activeSessions.map((s) => (
              <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 block">{s.device}</span>
                  <span className="text-slate-400 text-[11px]">{s.location} • IP: {s.ip}</span>
                </div>
                {s.active ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">CURRENT</span>
                ) : (
                  <button onClick={() => alert("Session revoked.")} className="text-rose-600 font-bold hover:underline">Revoke</button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => alert("All other admin sessions terminated.")}
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs py-2 rounded-xl transition"
          >
            Logout from All Other Devices
          </button>
        </div>
      </div>

      {/* Admin Users & Role Assignments */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-black text-sm text-slate-900">Admin Team Members & Role Permissions</h3>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {adminUsers.map((u) => (
            <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-slate-900">{u.name}</span>
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                    {u.role}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded border border-emerald-200">
                    {u.status}
                  </span>
                </div>
                <div className="text-slate-500 font-medium">{u.email} • Permissions: <strong className="text-slate-800">{u.permissions}</strong></div>
                <span className="text-slate-400 text-[10px] block mt-0.5">Last login: {u.lastLogin}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Editing permissions for ${u.name}...`)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition"
                >
                  Edit Role
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
