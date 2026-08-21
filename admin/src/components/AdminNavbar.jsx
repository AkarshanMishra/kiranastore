import React from 'react';
import { Search, Store, ShieldCheck, RefreshCw, LogOut, ExternalLink } from 'lucide-react';

export default function AdminNavbar({ activeDarkStore, setActiveDarkStore, onRefresh, isRefreshing, adminUser, onLogout }) {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-20 px-6 py-3 flex items-center justify-between shadow-xs">
      {/* Left Search & Store Selector */}
      <div className="flex items-center gap-4">
        {/* Dark Store Selector */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-800">
          <Store size={16} className="text-purple-600" />
          <select
            value={activeDarkStore}
            onChange={(e) => setActiveDarkStore(e.target.value)}
            className="bg-transparent outline-none cursor-pointer font-extrabold text-slate-900"
          >
            <option value="NOIDA_402">Dark Store #402 — Sector 62 Noida</option>
            <option value="GURUGRAM_108">Dark Store #108 — Cyber City Gurugram</option>
            <option value="DELHI_205">Dark Store #205 — South Ex Delhi</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative hidden md:block w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, SKU, customer..."
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none focus:border-purple-600 focus:bg-white text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Live Customer App Link */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-purple-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-xl transition"
        >
          <span>Customer App</span>
          <ExternalLink size={14} />
        </a>

        {/* Refresh Data */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Sync Data</span>
        </button>

        {/* User / Role Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-purple-50 text-purple-900 border border-purple-200 font-extrabold px-3 py-1 rounded-xl text-xs">
          <ShieldCheck size={14} className="text-purple-600 flex-shrink-0" />
          <span className="truncate max-w-[130px]">{adminUser?.name || 'Admin'}</span>
          <span className="text-[10px] bg-purple-200 text-purple-950 px-1.5 py-0.2 rounded font-black">
            {adminUser?.role?.split(' ')[0] || 'SuperAdmin'}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
          title="Sign Out"
        >
          <LogOut size={15} />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
