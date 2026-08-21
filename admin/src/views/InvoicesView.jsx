import React, { useState } from 'react';
import { Receipt, FileText, Download, Printer, Search, CheckCircle2, Send, ExternalLink } from 'lucide-react';

export default function InvoicesView({ orders = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const invoices = [
    { id: 'INV-94821', orderNumber: 'KS-94821', customer: 'Akarshan Mishra', gstin: '07AAAAA0000A1Z5', taxableAmount: 304.76, gstAmount: 15.24, total: 320.0, date: '20 Aug 2026', status: 'PAID' },
    { id: 'INV-94820', orderNumber: 'KS-94820', customer: 'Priya Sharma', gstin: 'Consumer (B2C)', taxableAmount: 466.67, gstAmount: 23.33, total: 490.0, date: '20 Aug 2026', status: 'PAID' },
    { id: 'INV-94819', orderNumber: 'KS-94819', customer: 'Vikram Mehta', gstin: '07AAACM9981K1Z3', taxableAmount: 809.52, gstAmount: 40.48, total: 850.0, date: '19 Aug 2026', status: 'PAID' },
    { id: 'INV-94818', orderNumber: 'KS-94818', customer: 'Rohan Gupta', gstin: 'Consumer (B2C)', taxableAmount: 133.33, gstAmount: 6.67, total: 140.0, date: '19 Aug 2026', status: 'PAID' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Tax Invoices & GST Compliance</h2>
          <p className="text-xs text-slate-500">Automated GST tax invoice generation, customer B2B GSTIN validation & HSN/SAC reporting</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Exporting GSTR-1 monthly sales summary Excel sheet...")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Download size={15} /> Export GSTR-1 Sales Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">TOTAL GST COLLECTED</span>
          <div className="text-2xl font-black text-purple-700">₹6,840.00</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">CGST 2.5% + SGST 2.5% (5% Food Items)</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">B2B BUSINESS INVOICES</span>
          <div className="text-2xl font-black text-slate-900">28 Invoices</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Valid GSTIN Registered</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">STORE GSTIN</span>
          <div className="text-xl font-mono font-black text-slate-900">07AAACK9842K1Z9</div>
          <span className="text-[11px] text-purple-600 font-bold mt-1 block">Sector 62, Noida Principal Hub</span>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900">Tax Invoices Generated</h3>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-black text-slate-900">{inv.id}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">Order #{inv.orderNumber}</span>
                  <span className="text-slate-400 text-[11px]">• {inv.date}</span>
                </div>
                <div className="font-bold text-slate-800">{inv.customer}</div>
                <span className="text-slate-400 font-mono text-[10px]">{inv.gstin}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">TAX (5% GST): ₹{inv.gstAmount.toFixed(2)}</span>
                  <span className="font-black text-slate-900 text-sm">Total: ₹{inv.total.toFixed(0)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => alert(`Downloading official PDF Tax Invoice: ${inv.id}`)}
                    className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    <Download size={14} /> PDF
                  </button>
                  <button
                    onClick={() => alert(`Printing invoice for ${inv.id}`)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    <Printer size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
