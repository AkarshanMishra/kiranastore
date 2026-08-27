import React, { useState } from 'react';
import { 
  ShieldCheck, UserCheck, Key, Lock, Check, Plus, Trash2, Edit, X, Search, 
  Shield, CheckCircle2, ShoppingBag, Package, Tag, Truck, Flame, DollarSign, 
  Users, MessageSquare, BarChart3, Building2, Settings, Sparkles, Layers, Grid, Zap, Eye
} from 'lucide-react';

const AVAILABLE_MODULES = [
  {
    id: 'Orders',
    name: 'Orders & Dispatch',
    desc: 'Fulfill customer orders, edit items, dispatch & track delivery',
    icon: ShoppingBag,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200'
  },
  {
    id: 'Inventory',
    name: 'Inventory & Stock',
    desc: 'Dark store warehouse stock levels, batch tracking & low-stock alerts',
    icon: Package,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200'
  },
  {
    id: 'Catalog',
    name: 'Products & Catalog',
    desc: 'Manage grocery SKUs, pricing, discount tags, categories & images',
    icon: Tag,
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200'
  },
  {
    id: 'Logistics',
    name: 'Riders & Logistics',
    desc: 'Live delivery fleet tracking, rider dispatching & serviceable pincodes',
    icon: Truck,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200'
  },
  {
    id: 'Marketing',
    name: 'Offers & Banners',
    desc: 'Hero banners, promo coupons, flash sales & push notification campaigns',
    icon: Flame,
    color: 'from-rose-500 to-red-600',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200'
  },
  {
    id: 'Finance',
    name: 'Finance & Billing',
    desc: 'Payment gateways, instant customer refunds, GST invoices & ledger',
    icon: DollarSign,
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200'
  },
  {
    id: 'Customers',
    name: 'Customers & CRM',
    desc: 'Customer accounts, delivery addresses, wallet balances & order histories',
    icon: Users,
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    border: 'border-sky-200'
  },
  {
    id: 'Support',
    name: 'Helpdesk & Live Chat',
    desc: 'Real-time customer live chat, support tickets, disputes & order ratings',
    icon: MessageSquare,
    color: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200'
  },
  {
    id: 'Reports',
    name: 'Analytics & Reports',
    desc: 'Revenue metrics, dark store conversion rates, top selling SKUs & P&L',
    icon: BarChart3,
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    border: 'border-cyan-200'
  },
  {
    id: 'Suppliers',
    name: 'Vendors & Suppliers',
    desc: 'Supplier directory, purchase orders, bulk intake & vendor credit ledger',
    icon: Building2,
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200'
  },
  {
    id: 'Security',
    name: 'Security & Access',
    desc: 'Admin team members, 2FA policies, firewall IP whitelist & active sessions',
    icon: ShieldCheck,
    color: 'from-purple-500 to-indigo-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200'
  },
  {
    id: 'Settings',
    name: 'Store & App Config',
    desc: 'Store legal info, GSTIN, dark store SLAs, minimum order value & timings',
    icon: Settings,
    color: 'from-slate-500 to-slate-700',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200'
  },
];

export default function RolesView() {
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'cards'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [roles, setRoles] = useState([
    {
      id: 1,
      role: 'Super Admin',
      desc: 'Full unrestricted system access across all dark stores, settings, team members & financials',
      count: 2,
      badge: 'FULL ACCESS',
      isSystem: true,
      modules: ['Orders', 'Inventory', 'Catalog', 'Logistics', 'Marketing', 'Finance', 'Customers', 'Support', 'Reports', 'Suppliers', 'Security', 'Settings']
    },
    {
      id: 2,
      role: 'Store Manager',
      desc: 'Manage local dark store inventory, products, incoming orders, and daily fulfillment',
      count: 3,
      badge: 'STORE LEVEL',
      isSystem: true,
      modules: ['Orders', 'Inventory', 'Catalog', 'Logistics', 'Customers', 'Support']
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
      modules: ['Inventory', 'Catalog', 'Suppliers', 'Reports']
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
      modules: ['Finance', 'Reports', 'Suppliers']
    },
  ]);

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
      modules: ['Orders', 'Inventory', 'Catalog']
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

  // Toggle module selection for modal
  const handleToggleModule = (modId) => {
    if (formData.modules.includes(modId)) {
      setFormData({ ...formData, modules: formData.modules.filter(m => m !== modId) });
    } else {
      setFormData({ ...formData, modules: [...formData.modules, modId] });
    }
  };

  // Direct Interactive Matrix Toggle
  const handleToggleMatrixCell = (roleId, moduleId) => {
    setRoles(prevRoles => prevRoles.map(role => {
      if (role.id !== roleId) return role;
      if (role.isSystem && role.role === 'Super Admin') return role; // Keep Super Admin full access

      const hasModule = role.modules.includes(moduleId);
      const newModules = hasModule 
        ? role.modules.filter(m => m !== moduleId)
        : [...role.modules, moduleId];

      return { ...role, modules: newModules };
    }));
  };

  // Presets
  const applyPreset = (presetType) => {
    if (presetType === 'all') {
      setFormData({ ...formData, modules: AVAILABLE_MODULES.map(m => m.id) });
    } else if (presetType === 'ops') {
      setFormData({ ...formData, modules: ['Orders', 'Inventory', 'Catalog', 'Logistics', 'Support'] });
    } else if (presetType === 'delivery') {
      setFormData({ ...formData, modules: ['Orders', 'Logistics'] });
    } else if (presetType === 'finance') {
      setFormData({ ...formData, modules: ['Finance', 'Reports', 'Suppliers'] });
    } else if (presetType === 'none') {
      setFormData({ ...formData, modules: [] });
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Key size={24} className="text-purple-600" />
            Granular Permissions Matrix (RBAC)
          </h2>
          <p className="text-xs text-slate-500">
            Define system roles & simply select which operational modules each role can access
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'matrix' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid size={14} /> Matrix View
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'cards' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={14} /> Role Cards
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={15} /> Create Role
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search by role title, badge, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs font-medium outline-none text-slate-900"
        />
      </div>

      {/* TAB 1: INTERACTIVE FULL MATRIX VIEW */}
      {activeTab === 'matrix' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" />
              <span className="font-black text-xs text-slate-900">Interactive Permissions Grid</span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">• Click any cell to toggle module permission live</span>
            </div>
            <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
              {AVAILABLE_MODULES.length} Modules × {filteredRoles.length} Roles
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  <th className="py-4 px-4 font-black text-slate-700 bg-slate-50/50 sticky left-0 z-10 min-w-[220px]">
                    System Module
                  </th>
                  {filteredRoles.map((role) => (
                    <th key={role.id} className="py-4 px-3 text-center min-w-[130px]">
                      <div className="font-extrabold text-slate-900 text-xs">{role.role}</div>
                      <span className={`inline-block font-black text-[9px] px-2 py-0.5 rounded-full mt-1 ${
                        role.badge === 'FULL ACCESS' ? 'bg-purple-100 text-purple-800' :
                        role.badge === 'STORE LEVEL' ? 'bg-emerald-100 text-emerald-800' :
                        role.badge === 'FINANCE' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {role.badge}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {AVAILABLE_MODULES.map((module) => {
                  const Icon = module.icon;
                  return (
                    <tr key={module.id} className="hover:bg-slate-50/70 transition">
                      {/* Module Info Cell */}
                      <td className="py-3 px-4 bg-white sticky left-0 z-10 border-r border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${module.bg} ${module.text} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs">{module.name}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[200px]" title={module.desc}>
                              {module.desc}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Checkbox Cells */}
                      {filteredRoles.map((role) => {
                        const hasAccess = role.modules.includes(module.id);
                        const isSuperAdmin = role.role === 'Super Admin';

                        return (
                          <td key={role.id} className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleMatrixCell(role.id, module.id)}
                              disabled={isSuperAdmin}
                              title={isSuperAdmin ? 'Super Admin always has full unrestricted access' : `${hasAccess ? 'Revoke' : 'Grant'} ${module.name} for ${role.role}`}
                              className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center transition-all ${
                                hasAccess
                                  ? 'bg-purple-600 text-white shadow-xs hover:bg-purple-700 scale-100'
                                  : 'bg-slate-100 text-slate-300 hover:bg-purple-50 hover:text-purple-400'
                              } ${isSuperAdmin ? 'opacity-90 cursor-default' : 'cursor-pointer'}`}
                            >
                              {hasAccess ? <Check size={16} className="stroke-[3]" /> : <span className="text-xs font-bold opacity-30">—</span>}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE CARDS VIEW */}
      {activeTab === 'cards' && (
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

                {/* Granted Modules Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Granted Access ({r.modules.length} Modules):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.modules.map((mId) => {
                      const modObj = AVAILABLE_MODULES.find(m => m.id === mId);
                      return (
                        <span key={mId} className="bg-purple-50 text-purple-800 font-bold text-[10px] px-2 py-0.5 rounded-lg border border-purple-100 flex items-center gap-1">
                          <Check size={10} className="text-purple-600" />
                          {modObj ? modObj.name : mId}
                        </span>
                      );
                    })}
                  </div>
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
      )}

      {/* CREATE / EDIT ROLE MODAL WITH MODERN MODULE SELECTOR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <div>
              <h3 className="font-black text-base text-slate-900">
                {editingRole ? `Configure Role: ${editingRole.role}` : 'Create New Custom Role'}
              </h3>
              <p className="text-xs text-slate-500">
                Simply select which modules this role is allowed to access
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dark Store Lead"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Access Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. OPERATIONS / COMPLIANCE"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Role Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe what responsibilities this role handles in daily store operations..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              {/* MODULE SELECTOR SECTION */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs">Select Permitted Modules</span>
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {formData.modules.length} of {AVAILABLE_MODULES.length} Selected
                    </span>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-bold">Presets:</span>
                    <button
                      type="button"
                      onClick={() => applyPreset('all')}
                      className="text-[10px] bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 font-bold px-2 py-0.5 rounded-md transition"
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('ops')}
                      className="text-[10px] bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 font-bold px-2 py-0.5 rounded-md transition"
                    >
                      Operations
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('delivery')}
                      className="text-[10px] bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 font-bold px-2 py-0.5 rounded-md transition"
                    >
                      Logistics
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('none')}
                      className="text-[10px] bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800 font-bold px-2 py-0.5 rounded-md transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Modern Interactive Module Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto p-1">
                  {AVAILABLE_MODULES.map((mod) => {
                    const isSelected = formData.modules.includes(mod.id);
                    const Icon = mod.icon;

                    return (
                      <div
                        key={mod.id}
                        onClick={() => handleToggleModule(mod.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-600/20 shadow-xs'
                            : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl ${mod.bg} ${mod.text} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className={`font-extrabold text-xs truncate ${isSelected ? 'text-purple-950 font-black' : 'text-slate-800'}`}>
                              {mod.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                              {mod.desc}
                            </div>
                          </div>
                        </div>

                        {/* Modern Check Switch */}
                        <div
                          className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-xs scale-105'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check size={14} className="stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                {editingRole ? 'Save Permissions Matrix' : 'Create Role'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


