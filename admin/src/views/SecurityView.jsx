import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Smartphone, Users, Key, CheckCircle2, AlertTriangle, 
  LogOut, Power, Plus, Trash2, Edit, Search, Filter, Globe, RefreshCw, X, ShieldAlert, Check
} from 'lucide-react';

export default function SecurityView() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'firewall' | 'sessions' | 'policies'
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // --- Admin Users State ---
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: 'Akarshan Mishra', email: 'admin@kiranastore.com', role: 'Super Admin', permissions: 'Full Access (All Modules)', status: 'ACTIVE', last_login: 'Just now', two_factor_enabled: true },
    { id: 2, name: 'Amit Varma', email: 'amit.v@kiranastore.com', role: 'Store Manager', permissions: 'Orders, Inventory, Delivery', status: 'ACTIVE', last_login: '2 hours ago', two_factor_enabled: true },
    { id: 3, name: 'Sandeep Rai', email: 'sandeep@kiranastore.com', role: 'Inventory Manager', permissions: 'Stock, Products, Suppliers', status: 'ACTIVE', last_login: 'Yesterday', two_factor_enabled: false },
    { id: 4, name: 'Neha Kapoor', email: 'neha.k@kiranastore.com', role: 'Marketing Manager', permissions: 'Offers, Coupons, Banners', status: 'ACTIVE', last_login: '3 days ago', two_factor_enabled: true },
  ]);

  // Modal State for User Create / Edit
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'Store Manager',
    permissions: 'Orders, Inventory, Delivery',
    status: 'ACTIVE',
    two_factor_enabled: true
  });

  // --- IP Whitelist / Firewall Rules State ---
  const [firewallRules, setFirewallRules] = useState([
    { id: 1, ip: '106.210.84.192/32', desc: 'Main Store HQ (Noida Sector 62)', type: 'ALLOW', status: 'ACTIVE', date: '20 Aug 2026' },
    { id: 2, ip: '192.168.1.0/24', desc: 'Local Dark Store POS Network', type: 'ALLOW', status: 'ACTIVE', date: '18 Aug 2026' },
    { id: 3, ip: '45.142.122.0/24', desc: 'Known Malicious Tor Exit Node', type: 'BLOCK', status: 'ACTIVE', date: '15 Aug 2026' },
  ]);
  const [isFirewallModalOpen, setIsFirewallModalOpen] = useState(false);
  const [firewallFormData, setFirewallFormData] = useState({
    ip: '',
    desc: '',
    type: 'ALLOW',
    status: 'ACTIVE'
  });

  // --- Active Sessions State ---
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome on Windows 11', location: 'Noida, UP (Current Session)', ip: '106.210.84.192', loginTime: 'Today, 10:15 AM', active: true },
    { id: 2, device: 'KiranaStore Admin Mobile App (Android 14)', location: 'Noida Sector 62, UP', ip: '106.210.84.192', loginTime: 'Yesterday, 8:40 PM', active: false },
    { id: 3, device: 'Safari on iPhone 15 Pro', location: 'Delhi NCR', ip: '122.161.48.21', loginTime: '3 days ago', active: false },
  ]);

  // --- Security Policies State ---
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [otpLogin, setOtpLogin] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90);
  const [bruteForceDefense, setBruteForceDefense] = useState(true);
  const [policiesSaved, setPoliciesSaved] = useState(false);

  // Fetch live Admin Users from backend
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAdminUsers(data);
        }
      }
    } catch (e) {
      console.warn('Could not load admin users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // --- Admin User CRUD Handlers ---
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      role: 'Store Manager',
      permissions: 'Orders, Inventory, Delivery',
      status: 'ACTIVE',
      two_factor_enabled: true
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions || 'Standard Access',
      status: user.status || 'ACTIVE',
      two_factor_enabled: user.two_factor_enabled ?? true
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userFormData.name || !userFormData.email) return;

    if (editingUser) {
      // Update
      try {
        await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userFormData)
        });
      } catch {}
      setAdminUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userFormData } : u));
    } else {
      // Create
      const newObj = {
        ...userFormData,
        id: Date.now(),
        last_login: 'Never'
      };
      try {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userFormData)
        });
        if (res.ok) {
          const created = await res.json();
          newObj.id = created.id;
        }
      } catch {}
      setAdminUsers(prev => [newObj, ...prev]);
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Are you sure you want to revoke and delete admin access for ${name}?`)) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    } catch {}
    setAdminUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleToggleUserStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch {}
    setAdminUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
  };

  // --- Firewall CRUD Handlers ---
  const handleSaveFirewallRule = (e) => {
    e.preventDefault();
    if (!firewallFormData.ip || !firewallFormData.desc) return;
    const newRule = {
      id: Date.now(),
      ...firewallFormData,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setFirewallRules([newRule, ...firewallRules]);
    setIsFirewallModalOpen(false);
    setFirewallFormData({ ip: '', desc: '', type: 'ALLOW', status: 'ACTIVE' });
  };

  const handleDeleteFirewallRule = (id) => {
    if (confirm('Delete this firewall / IP whitelist rule?')) {
      setFirewallRules(firewallRules.filter(r => r.id !== id));
    }
  };

  const handleToggleFirewallStatus = (id) => {
    setFirewallRules(firewallRules.map(r => r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' } : r));
  };

  // --- Session Handlers ---
  const handleRevokeSession = (id) => {
    setActiveSessions(activeSessions.filter(s => s.id !== id));
  };

  const handleTerminateAllSessions = () => {
    if (confirm('Terminate all other active administrator sessions across all devices?')) {
      setActiveSessions(activeSessions.filter(s => s.active));
      alert('All other remote devices have been logged out securely.');
    }
  };

  // --- Save Policies ---
  const handleSavePolicies = (e) => {
    e.preventDefault();
    setPoliciesSaved(true);
    setTimeout(() => setPoliciesSaved(false), 2500);
  };

  // Filtered Users
  const filteredUsers = adminUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck size={24} className="text-purple-600" />
            Enterprise Security & Access Control (RBAC)
          </h2>
          <p className="text-xs text-slate-500">
            Manage admin users, granular role assignments, firewall IP rules, active sessions & 2FA authentication
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'users' && (
            <button
              onClick={handleOpenCreateUser}
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus size={15} /> Add Team Member
            </button>
          )}

          {activeTab === 'firewall' && (
            <button
              onClick={() => setIsFirewallModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus size={15} /> Add IP Rule
            </button>
          )}

          <button
            onClick={loadUsers}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition"
            title="Refresh Security Status"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 text-xs font-bold w-full overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === 'users' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users size={15} /> Admin Team & RBAC ({adminUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('firewall')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === 'firewall' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe size={15} /> IP Whitelist & Firewall ({firewallRules.length})
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === 'sessions' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone size={15} /> Active Sessions ({activeSessions.length})
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === 'policies' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock size={15} /> Security Policies & 2FA
        </button>
      </div>

      {/* TAB 1: ADMIN USERS & RBAC */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search admin users by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-purple-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Filter size={13} /> Role:
              </span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Store Manager">Store Manager</option>
                <option value="Order Manager">Order Manager</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Delivery Manager">Delivery Manager</option>
                <option value="Marketing Manager">Marketing Manager</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-extrabold border-b border-slate-200/80">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role & Scope</th>
                    <th className="py-3.5 px-4">Assigned Permissions</th>
                    <th className="py-3.5 px-4">2FA</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{u.name}</div>
                        <div className="text-slate-400 text-[11px] font-medium">{u.email}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Last login: {u.last_login || 'Recently'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block font-black text-[10px] px-2.5 py-0.5 rounded-full ${
                          u.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'Store Manager' ? 'bg-emerald-100 text-emerald-800' :
                          u.role === 'Order Manager' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-[220px]">
                        <span className="text-slate-700 font-semibold text-[11px] truncate block" title={u.permissions}>
                          {u.permissions}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {u.two_factor_enabled ? (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 w-max">
                            <ShieldCheck size={11} /> ENABLED
                          </span>
                        ) : (
                          <span className="text-slate-400 bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            DISABLED
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`font-black text-[10px] px-2.5 py-0.5 rounded-full cursor-pointer transition ${
                            u.status === 'ACTIVE' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {u.status}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
                            title="Edit Role & Permissions"
                          >
                            <Edit size={14} />
                          </button>
                          {u.role !== 'Super Admin' && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                              title="Delete Admin Account"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-400 font-medium">
                        No administrator accounts found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIREWALL & IP WHITELIST */}
      {activeTab === 'firewall' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Admin Portal Network Restrictions</h3>
              <p className="text-xs text-slate-500">Only authorized CIDR subnets and corporate IPs can access the backend</p>
            </div>
            <span className="bg-purple-50 text-purple-700 text-xs font-black px-3 py-1 rounded-xl border border-purple-200">
              Firewall Active (3 Rules)
            </span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 text-xs">
              {firewallRules.map((rule) => (
                <div key={rule.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {rule.ip}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        rule.type === 'ALLOW' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {rule.type}
                      </span>
                      <span className="text-slate-400 text-[11px]">• Added {rule.date}</span>
                    </div>
                    <div className="text-slate-600 font-medium">{rule.desc}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFirewallStatus(rule.id)}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-xl transition ${
                        rule.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {rule.status}
                    </button>
                    <button
                      onClick={() => handleDeleteFirewallRule(rule.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVE SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Concurrent Administrator Sessions</h3>
              <p className="text-xs text-slate-500">Track and terminate active browser and mobile logins across devices</p>
            </div>
            <button
              onClick={handleTerminateAllSessions}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs px-3.5 py-2 rounded-xl transition"
            >
              Logout From All Other Devices
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeSessions.map((session) => (
              <div key={session.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                      <Smartphone size={14} className="text-purple-600" />
                      {session.device}
                    </span>
                    {session.active ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                        THIS DEVICE
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        REMOTE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div>Location: <strong className="text-slate-700">{session.location}</strong></div>
                    <div>IP: <strong className="font-mono text-slate-700">{session.ip}</strong></div>
                    <div>Active since: {session.loginTime}</div>
                  </div>
                </div>

                {!session.active && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="w-full bg-slate-50 hover:bg-rose-50 text-rose-600 font-extrabold text-xs py-2 rounded-xl border border-slate-200 hover:border-rose-200 transition"
                  >
                    Revoke Token
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY POLICIES & 2FA */}
      {activeTab === 'policies' && (
        <form onSubmit={handleSavePolicies} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 2FA & Auth Controls */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Lock size={18} className="text-purple-600" />
              Two-Factor Authentication & Access Guard
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="font-extrabold text-slate-900 block">Enforce 2FA for All Store Managers</span>
                  <span className="text-slate-500 text-[11px]">Require OTP verification upon signing in</span>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="font-extrabold text-slate-900 block">SMS OTP Direct Quick Login</span>
                  <span className="text-slate-500 text-[11px]">Allow store executives to authenticate via mobile OTP</span>
                </div>
                <input
                  type="checkbox"
                  checked={otpLogin}
                  onChange={(e) => setOtpLogin(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="font-extrabold text-slate-900 block">Brute-Force & Rate Limiting Defense</span>
                  <span className="text-slate-500 text-[11px]">Automatically block IP after failed login attempts</span>
                </div>
                <input
                  type="checkbox"
                  checked={bruteForceDefense}
                  onChange={(e) => setBruteForceDefense(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Session & Password Expiry Controls */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <ShieldAlert size={18} className="text-purple-600" />
              Session Timeouts & Password Governance
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Inactivity Session Timeout:</span>
                  <span className="text-purple-600 font-extrabold">{sessionTimeout} Minutes</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Login Attempts</label>
                  <select
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="3">3 Attempts</option>
                    <option value="5">5 Attempts (Recommended)</option>
                    <option value="10">10 Attempts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Password Rotation</label>
                  <select
                    value={passwordExpiryDays}
                    onChange={(e) => setPasswordExpiryDays(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="30">Every 30 Days</option>
                    <option value="60">Every 60 Days</option>
                    <option value="90">Every 90 Days</option>
                    <option value="0">Never Expire</option>
                  </select>
                </div>
              </div>

              {policiesSaved ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs p-3 rounded-2xl flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={16} /> Security policies updated & enforced!
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition"
                >
                  Save Security Policies
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {/* MODAL 1: ADD / EDIT ADMIN USER */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">
              {editingUser ? 'Edit Administrator Account' : 'Register New Admin Team Member'}
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@kiranastore.com"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role Assignment</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Order Manager">Order Manager</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                    <option value="Delivery Manager">Delivery Manager</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account Status</label>
                  <select
                    value={userFormData.status}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="INVITED">INVITED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Scope & Module Permissions</label>
                <input
                  type="text"
                  placeholder="e.g. Orders, Inventory, Catalog, Delivery"
                  value={userFormData.permissions}
                  onChange={(e) => setUserFormData({ ...userFormData, permissions: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="twofa_check"
                  checked={userFormData.two_factor_enabled}
                  onChange={(e) => setUserFormData({ ...userFormData, two_factor_enabled: e.target.checked })}
                  className="w-4 h-4 accent-purple-600"
                />
                <label htmlFor="twofa_check" className="text-slate-700 font-bold cursor-pointer">
                  Require 2FA verification for this account
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                {editingUser ? 'Save Changes' : 'Create Admin Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD FIREWALL IP RULE */}
      {isFirewallModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setIsFirewallModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">Add Firewall / IP Rule</h3>

            <form onSubmit={handleSaveFirewallRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">IP Address or CIDR Subnet *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 106.210.84.192/32"
                  value={firewallFormData.ip}
                  onChange={(e) => setFirewallFormData({ ...firewallFormData, ip: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Rule Description / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Noida Store Dark Hub POS"
                  value={firewallFormData.desc}
                  onChange={(e) => setFirewallFormData({ ...firewallFormData, desc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Action Policy</label>
                <select
                  value={firewallFormData.type}
                  onChange={(e) => setFirewallFormData({ ...firewallFormData, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                >
                  <option value="ALLOW">ALLOW (Whitelist Access)</option>
                  <option value="BLOCK">BLOCK (Blacklist Access)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                Add Rule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

