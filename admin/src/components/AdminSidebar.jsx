import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Bike,
  Tag,
  CreditCard,
  BarChart3,
  Bell,
  Globe,
  Store,
  ShieldCheck,
  Settings,
  ChevronRight,
  Search,
  Ticket,
  Award,
  Gift,
  Share2,
  Receipt,
  HelpCircle,
  BrainCircuit,
  Smartphone,
  Plug,
  History,
  Lock,
  DollarSign,
  Star,
  Truck,
  Sparkles
} from 'lucide-react';

export default function AdminSidebar({ activeView, setActiveView, isCollapsed, setIsCollapsed }) {
  const [sidebarSearch, setSidebarSearch] = useState('');

  const menuGroups = [
    {
      title: "CORE & ORDERS",
      items: [
        { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Order Pipeline', icon: ShoppingBag, badge: '4 New' },
      ]
    },
    {
      title: "CATALOG & MERCHANDISE",
      items: [
        { id: 'products', label: 'Products & SKUs', icon: Package },
        { id: 'categories', label: 'Categories & Subcategories', icon: Layers },
        { id: 'brands', label: 'FMCG Brands', icon: Tag },
        { id: 'reviews', label: 'Reviews & Wishlist', icon: Star, badge: '2 Pending' },
      ]
    },
    {
      title: "INVENTORY & PURCHASES",
      items: [
        { id: 'inventory', label: 'Stock & Inventory', icon: Package, badge: '3 Low' },
        { id: 'suppliers', label: 'Suppliers & POs', icon: Truck },
        { id: 'expenses', label: 'Expenses Ledger', icon: DollarSign },
      ]
    },
    {
      title: "OPERATIONS & LOGISTICS",
      items: [
        { id: 'stores', label: 'Store Profile & Hours', icon: Store },
        { id: 'delivery', label: 'Delivery & Riders', icon: Bike },
        { id: 'customers', label: 'Customer CRM', icon: Users },
      ]
    },
    {
      title: "DISCOUNTS & MARKETING",
      items: [
        { id: 'coupons', label: 'Coupons & Vouchers', icon: Ticket },
        { id: 'offers', label: 'Flash Sales & Offers', icon: Sparkles },
        { id: 'marketing', label: 'Marketing Campaigns', icon: Share2 },
        { id: 'loyalty', label: 'Loyalty Program', icon: Award },
        { id: 'referrals', label: 'Referral & Gift Cards', icon: Gift },
        { id: 'notifications', label: 'Push Notifications', icon: Bell },
        { id: 'content', label: 'App CMS Banners', icon: Globe },
      ]
    },
    {
      title: "FINANCE & COMPLIANCE",
      items: [
        { id: 'payments', label: 'Payments & Refunds', icon: CreditCard },
        { id: 'invoices', label: 'Tax Invoices & GST', icon: Receipt },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      ]
    },
    {
      title: "SUPPORT & AI",
      items: [
        { id: 'support', label: 'Support & Helpdesk', icon: HelpCircle, badge: '1 Open' },
        { id: 'ai_analytics', label: 'AI Intelligence & Demand', icon: BrainCircuit },
      ]
    },
    {
      title: "SYSTEM & SECURITY",
      items: [
        { id: 'app_mgmt', label: 'Mobile App Management', icon: Smartphone },
        { id: 'integrations', label: 'API & Integrations', icon: Plug },
        { id: 'security', label: 'Admin Security & 2FA', icon: Lock },
        { id: 'audit_logs', label: 'Audit Trail & Logs', icon: History },
        { id: 'settings', label: 'General Settings', icon: Settings },
      ]
    }
  ];

  const filteredGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      group.title.toLowerCase().includes(sidebarSearch.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <aside className={`bg-white border-r border-slate-200 text-slate-700 flex flex-col transition-all duration-300 z-30 shadow-sm ${isCollapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Brand Logo Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-purple-600 text-white font-black rounded-2xl flex items-center justify-center text-lg flex-shrink-0 shadow-md">
            ⚡
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-black text-slate-900 text-base tracking-tight leading-tight">
                Kirana<span className="text-purple-600">Control</span>
              </h1>
              <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block">
                Enterprise OS • 30 Modules
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 hidden sm:block transition"
        >
          <ChevronRight size={18} className={`transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Quick Search */}
      {!isCollapsed && (
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search 30 admin modules..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
            />
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 no-scrollbar">
        {filteredGroups.map((group, gIdx) => (
          <div key={gIdx}>
            {!isCollapsed && (
              <h3 className="text-[10px] font-black text-slate-400 px-3 mb-1 tracking-wider uppercase">
                {group.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs transition ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={16} className={isActive ? 'text-white flex-shrink-0' : 'text-slate-500 flex-shrink-0'} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md flex-shrink-0 ${
                        isActive ? 'bg-purple-800 text-white' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile Info & Developer Credits */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-100 bg-slate-50 m-2 rounded-2xl text-xs space-y-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
              AM
            </div>
            <div className="truncate">
              <span className="font-black text-slate-900 block truncate">Akarshan Mishra</span>
              <span className="text-[10px] text-purple-700 font-extrabold block truncate">App Developer & Owner</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold text-center pt-1.5 border-t border-slate-200/70">
            ⚡ App is developed by <span className="text-purple-700 font-black">Akarshan Mishra</span>
          </div>
        </div>
      )}
    </aside>
  );
}
