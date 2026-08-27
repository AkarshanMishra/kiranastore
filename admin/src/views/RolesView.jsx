import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Key, Lock, Check, Plus, Trash2, Edit, X, Search, Shield, CheckCircle2 } from 'lucide-react';

export default function RolesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roles, setRoles] = useState([
    {
      id: 1,
      role: 'Super Admin',
      desc: 'Full unrestricted system access across all dark stores, settings, team members & financials',
      count: 2,
      badge: 'FULL ACCESS',
      isSystem: true,
      modules: ['Orders', 'Inventory', 'Catalog', 'Marketing', 'Finance', 'Logistics', 'Security', 'Support', 'Settings']
    },
    {
      id: 2,
      role: 'Store Manager',
      desc: 'Manage local dark store inventory, products, incoming orders, and daily fulfillment',
      count: 3,
      badge: 'STORE LEVEL',
      isSystem: true,
      modules: ['Orders', 'Inventory', 'Catalog', 'Logistics', 'Support']
    },
    {
      id: 3,
      role: 'Order Manager',
      desc: 'Fulfill, edit, itemize, pack, and dispatch incoming customer and monthly rashan orders',
      count: 5,
      badge: 'OPERATIONS',
      isSystem: false,
      modules: ['Orders', 'Logistics', 'Support']
    },
    {
      id: 4,
      role: 'Inventory Manager',
      desc: 'Manage stock levels, supplier purchase entries, price overrides, and low-stock replenishment',
      count: 2,
      badge: 'STOCK ONLY',
      isSystem: false,
      modules: ['Inventory', 'Catalog', 'Suppliers']
    },
    {
      id: 5,
      role: 'Delivery Lead',
      desc: 'Manage delivery riders, live GPS assignments, dark store pincodes, and express delivery slots',
      count: 2,
      badge: 'LOGISTICS',
      isSystem: false,
      modules: ['Logistics', 'Orders']
    },
    {
      id: 6,
      role: 'Finance & Accounts',
      desc: 'Manage payment gateway reconciliation, customer refunds, GST invoices, and financial P&L',
      count: 1,
      badge: 'FINANCE',
      isSystem: false,
      modules: ['Finance', 'Invoices', 'Reports']
    },
  ]);

  const allAvailableModules = [
    'Orders', 'Inventory', 'Catalog', 'Marketing', 'Finance', 
    'Logistics', 'Suppliers', 'Invoices', 'Reports', 'Security', 'Support', 'Settings'
  ];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    desc: '',
    badge: 'CUSTOM',
    modules: ['Orders', 'Inventory']
  });

  const handleOpenCreate = () => {
    setEditingRole(null);
    setFormData({
      role: '',
      desc: '',
      badge: 'CUSTOM',
      modules: ['Orders', 'Inventory']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role) => {
    setEditingRole(role);
    setFormData({
      role: role.role,
      desc: role.desc,
      badge: role.badge,
      modules: [...role.modules]
    });
    setIsModalOpen(true);
  };

  const handleToggleModule = (mod) => {
    if (formData.modules.includes(mod)) {
      setFormData({ ...formData, modules: formData.modules.filter(m => m !== mod) });
    } else {
      setFormData({ ...formData, modules: [...formData.modules, mod] });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.role || !formData.desc) return;

    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
    } else {
      const newRole = {
        id: Date.now(),
        ...formData,
        count: 0,
        isSystem: false
      };
      setRoles([...roles, newRole]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete the "${name}" role? Any assigned users will need to be reassigned.`)) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  const filteredRoles = roles.filter(r =>
    r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Key size={24} className="text-purple-600" />
            Roles & Granular Permissions Matrix (RBAC)
          </h2>
          <p className="text-xs text-slate-500">
            Define system roles, access badges, and granular module permissions for all store personnel
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
        >
          <Plus size={15} /> Create Custom Role
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search roles by title, badge, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs font-medium outline-none text-slate-900"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((r) => (
          <div key={r.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Shield size={16} className="text-purple-600" />
                  {r.role}
                </span>
                <span className={`font-black text-[10px] px-2.5 py-0.5 rounded-full border ${
                  r.badge === 'FULL ACCESS' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  r.badge === 'STORE LEVEL' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  r.badge === 'FINANCE' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {r.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{r.desc}</p>

              {/* Module Tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {r.modules.map((m, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold">{r.count} Active Users</span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(r)}
                  className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
                  title="Edit Role Matrix"
                >
                  <Edit size={14} />
                </button>
                {!r.isSystem && (
                  <button
                    onClick={() => handleDelete(r.id, r.role)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete Role"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT ROLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">
              {editingRole ? `Edit Role: ${editingRole.role}` : 'Create New Custom Role'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dark Store Auditor"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Access Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. AUDIT / OPERATIONS / COMPLIANCE"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Role Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the operational responsibilities of this role..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">Granted Module Permissions</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {allAvailableModules.map((mod) => {
                    const isChecked = formData.modules.includes(mod);
                    return (
                      <button
                        type="button"
                        key={mod}
                        onClick={() => handleToggleModule(mod)}
                        className={`flex items-center gap-1.5 p-2 rounded-xl border text-left font-bold transition text-[11px] ${
                          isChecked 
                            ? 'bg-purple-100 text-purple-900 border-purple-300' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${isChecked ? 'bg-purple-600 text-white' : 'border border-slate-300'}`}>
                          {isChecked && <Check size={10} />}
                        </div>
                        {mod}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                {editingRole ? 'Save Permissions Matrix' : 'Create Role'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

