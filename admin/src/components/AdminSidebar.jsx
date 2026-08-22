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
  Sparkles,
  X
} from 'lucide-react';

export default function AdminSidebar({
  activeView,
  setActiveView,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) {
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
        { id: 'expenses', label: 'Store Expenses & Ledger', icon: DollarSign },
      ]
    },
    {
      title: "LOGISTICS & DARK STORES",
      items: [
        { id: 'stores', label: 'Dark Store Hubs', icon: Store },
        { id: 'delivery', label: 'Riders & Fleet Dispatch', icon: Bike, badge: '8 Live' },
      ]
    },
    {
      title: "CUSTOMERS & USERS",
      items: [
        { id: 'customers', label: 'Customer CRM & Wallets', icon: Users },
        { id: 'roles', label: 'Staff & Role Management', icon: ShieldCheck },
      ]
    },
    {
      title: "DISCOUNTS & MARKETING",
      items: [
        { id: 'coupons', label: 'Promo Codes & Vouchers', icon: Ticket },
        { id: 'offers', label: 'Flash Deals & Banners', icon: Tag },
        { id: 'marketing', label: 'SMS & WhatsApp Broadcast', icon: Sparkles },
        { id: 'loyalty', label: 'Loyalty & Scratch Cards', icon: Award },
        { id: 'referrals', label: 'Referral Program', icon: Share2 },
        { id: 'notifications', label: 'Push Notifications', icon: Bell },
        { id: 'content', label: 'CMS & Banners', icon: Globe },
      ]
    },
    {
      title: "FINANCE & REPORTS",
      items: [
        { id: 'payments', label: 'Payment Gateway & UPI', icon: CreditCard },
        { id: 'invoices', label: 'GST & Invoicing', icon: Receipt },
        { id: 'reports', label: 'Analytics & P&L Reports', icon: BarChart3 },
      ]
    },
    {
      title: "SUPPORT & AI",
      items: [
        { id: 'support', label: 'Customer Helpdesk', icon: HelpCircle, badge: '1 Open' },
        { id: 'ai_analytics', label: 'AI Demand Forecaster', icon: BrainCircuit },
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

  const handleSelectItem = (id) => {
    setActiveView(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const renderNavContent = (collapsed = false, isMobile = false) => (
    <>
      {/* Brand Logo Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-purple-600 text-white font-black rounded-2xl flex items-center justify-center text-lg flex-shrink-0 shadow-md">
            ⚡
          </div>
          {(!collapsed || isMobile) && (
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

        {isMobile ? (
          <button
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        ) : (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 hidden lg:block transition cursor-pointer"
          >
            <ChevronRight size={18} className={`transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        )}
      </div>

      {/* Quick Search */}
      {(!collapsed || isMobile) && (
        <div className="p-3 border-b border-slate-100 flex-shrink-0">
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
            {(!collapsed || isMobile) && (
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
                    onClick={() => handleSelectItem(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={collapsed && !isMobile ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={16} className={isActive ? 'text-white flex-shrink-0' : 'text-slate-500 flex-shrink-0'} />
                      {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                    </div>

                    {(!collapsed || isMobile) && item.badge && (
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
      {(!collapsed || isMobile) && (
        <div className="p-3 border-t border-slate-100 bg-slate-50 m-2 rounded-2xl text-xs space-y-2 flex-shrink-0">
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
    </>
  );

  return (
    <>
      {/* ─── DESKTOP SIDEBAR (Visible on lg and above) ───────────────────── */}
      <aside className={`hidden lg:flex bg-white border-r border-slate-200 text-slate-700 flex-col transition-all duration-300 z-30 shadow-sm h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-72'}`}>
        {renderNavContent(isCollapsed, false)}
      </aside>

      {/* ─── MOBILE & TABLET DRAWER (Visible on < lg) ────────────────────── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Sliding Drawer */}
          <aside className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white text-slate-700 z-50 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {renderNavContent(false, true)}
          </aside>
        </div>
      )}
    </>
  );
}
