import React from 'react';
import { Store, RefreshCw, Clock, ShieldCheck, ExternalLink } from 'lucide-react';

export default function AdminHeader({ onRefresh, isRefreshing }) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white p-2 rounded-xl shadow-lg">
            <Store size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-white">Kirana<span className="text-purple-400">Control</span></h1>
              <span className="bg-purple-900/60 text-purple-300 border border-purple-700/50 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                DARK STORE MANAGER
              </span>
            </div>
            <p className="text-xs text-slate-400">Dark Store #402 — Sector 62 Noida Hub</p>
          </div>
        </div>

        {/* Live Status & Quick Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>STORE ONLINE — 10 MIN DISPATCH ACTIVE</span>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-xl transition"
          >
            <span>Customer App</span>
            <ExternalLink size={14} />
          </a>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

      </div>
    </header>
  );
}
