import React from 'react';
import { BarChart3, Download, TrendingUp, IndianRupee, FileText } from 'lucide-react';

export default function ReportsView() {
  const handleExport = (format) => {
    alert(`Exporting dark store sales report as ${format.toUpperCase()} file...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Financial Reports & Store Analytics</h2>
          <p className="text-xs text-slate-500">Download Excel/CSV reports for sales, P&L profit, and tax GST filings</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('csv')} className="bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-xs">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => handleExport('pdf')} className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5">
            <FileText size={14} /> Download PDF P&L
          </button>
        </div>
      </div>

      {/* P&L Financial Statement Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <IndianRupee className="text-emerald-600" size={18} /> Monthly Profit & Loss Statement (P&L)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-bold block mb-1">Gross Merchandise Value (GMV)</span>
            <span className="text-xl font-black text-slate-900">₹1,86,900</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-bold block mb-1">Coupon Discounts Given</span>
            <span className="text-xl font-black text-rose-600">- ₹12,400</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-bold block mb-1">Logistics & Rider Payouts</span>
            <span className="text-xl font-black text-rose-600">- ₹18,500</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-bold block mb-1">Net Operating Profit</span>
            <span className="text-xl font-black text-emerald-600">₹38,450 (24.2%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
