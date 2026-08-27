import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Download, TrendingUp, IndianRupee, FileText, 
  Calendar, CheckCircle2, RefreshCw, X, ArrowUpRight, DollarSign, Layers
} from 'lucide-react';

export default function ReportsView() {
  const [timeRange, setTimeRange] = useState('MONTH'); // 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'
  const [toastMsg, setToastMsg] = useState(null);
  const [reportData, setReportData] = useState({
    gmv: 186900,
    taxable_sales: 178000,
    total_gst: 8900,
    pl_statement: {
      gmv: 186900,
      discounts: 12400,
      cogs: 121485,
      logistics_cost: 14952,
      net_profit: 38063,
      margin_pct: 24.2
    }
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/finance/overview');
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (e) {
      console.warn('Reports fetch error:', e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExport = (format) => {
    const headers = ["Financial Metric", "Value (₹)", "Impact on Margin"];
    const rows = [
      ["Gross Merchandise Value (GMV)", reportData.pl_statement.gmv, "100% Total Sales"],
      ["Cost of Goods Sold (COGS)", `-${reportData.pl_statement.cogs}`, "Product Procurement Cost"],
      ["Promotional Discounts & Coupons", `-${reportData.pl_statement.discounts}`, "Marketing Expense"],
      ["Logistics & Delivery Fleet Payouts", `-${reportData.pl_statement.logistics_cost}`, "Fulfillment Cost"],
      ["Net Operating Profit", reportData.pl_statement.net_profit, `${reportData.pl_statement.margin_pct}% Pure Margin`]
    ];
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kiranastore_financial_pl_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Financial P&L Statement exported as ${format.toUpperCase()}!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl text-xs font-black shadow-lg flex items-center justify-between animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="opacity-80 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 size={24} className="text-purple-600" />
            Financial Reports & Store Analytics
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Dark store monthly P&L profit statements, category revenue breakdown, logistics payouts & margin audits
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => handleExport('csv')} 
            className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-xs transition"
          >
            <Download size={14} /> Export CSV P&L
          </button>
          <button 
            onClick={() => handleExport('pdf')} 
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition"
          >
            <FileText size={14} /> Download PDF Audit
          </button>
        </div>
      </div>

      {/* P&L Financial Statement Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <IndianRupee className="text-emerald-600" size={20} />
            Monthly Profit & Loss Statement (P&L)
          </h3>

          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
            {['TODAY', 'WEEK', 'MONTH', 'YEAR'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded-lg transition ${
                  timeRange === t ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-extrabold block mb-1">Gross Merchandise Value (GMV)</span>
            <span className="text-2xl font-black text-slate-900">₹{reportData.pl_statement.gmv.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-extrabold block mb-1">Coupon Discounts Given</span>
            <span className="text-2xl font-black text-rose-600">- ₹{reportData.pl_statement.discounts.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-extrabold block mb-1">Logistics & Rider Payouts</span>
            <span className="text-2xl font-black text-rose-600">- ₹{reportData.pl_statement.logistics_cost.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
            <span className="text-emerald-800 font-extrabold block mb-1">Net Operating Profit</span>
            <span className="text-2xl font-black text-emerald-700">₹{reportData.pl_statement.net_profit.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{reportData.pl_statement.margin_pct}% Operating Margin</span>
          </div>
        </div>
      </div>

      {/* Category Revenue Velocity Breakdown */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
          <Layers size={18} className="text-purple-600" />
          Category Revenue & Sales Velocity Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { name: 'Dairy & Breakfast', revenue: '₹68,400', share: '36.5%', itemsSold: '1,420 units', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { name: 'Snacks & Munchies', revenue: '₹48,200', share: '25.8%', itemsSold: '980 units', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { name: 'Atta, Rice & Dal', revenue: '₹42,100', share: '22.5%', itemsSold: '410 units', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { name: 'Tea & Beverages', revenue: '₹28,200', share: '15.2%', itemsSold: '640 units', color: 'bg-purple-50 text-purple-700 border-purple-200' },
          ].map((cat, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-slate-900 text-sm">{cat.name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cat.color}`}>{cat.share}</span>
                </div>
                <div className="text-lg font-black text-slate-800">{cat.revenue}</div>
                <span className="text-[11px] text-slate-500">{cat.itemsSold}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
