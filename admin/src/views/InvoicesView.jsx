import React, { useState, useEffect } from 'react';
import { 
  Receipt, FileText, Download, Printer, Search, CheckCircle2, Send, 
  ExternalLink, X, Plus, Edit2, ShieldCheck, QrCode, Globe
} from 'lucide-react';

export default function InvoicesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadInvoices = async () => {
    try {
      const res = await fetch('/api/admin/finance/invoices');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setInvoices(data);
      }
    } catch (e) {
      console.warn('Invoices fetch error:', e);
    }
  };

  useEffect(() => {
    loadInvoices();
    const interval = setInterval(loadInvoices, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePrint = (inv) => {
    setSelectedInvoice(inv);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleExportGSTR1 = () => {
    const headers = ["Invoice Number", "Order Number", "Date", "Customer Name", "Phone", "GSTIN", "Taxable Value (₹)", "CGST (2.5%)", "SGST (2.5%)", "Total Invoice Value (₹)"];
    const rows = invoices.map(inv => [
      inv.id,
      `"${inv.order_number}"`,
      `"${inv.date}"`,
      `"${inv.customer}"`,
      `"${inv.phone}"`,
      `"${inv.gstin}"`,
      inv.taxable_amount,
      inv.cgst,
      inv.sgst,
      inv.total
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GSTR1_sales_register_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('GSTR-1 Monthly Sales Register CSV downloaded!');
  };

  const filteredInvoices = invoices.filter(inv =>
    (inv.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.gstin || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGstCollected = invoices.reduce((acc, curr) => acc + (curr.gst_amount || 0), 0);
  const b2bCount = invoices.filter(i => i.gstin && i.gstin !== 'Consumer (B2C)').length;

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
            <Receipt size={24} className="text-purple-600" />
            Tax Invoices & GST Compliance
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Automated GST tax invoice generation, customer B2B GSTIN validation, HSN breakdown & GSTR-1 filings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportGSTR1}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Download size={14} /> Export GSTR-1 Sales Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">TOTAL GST COLLECTED</span>
          <div className="text-2xl font-black text-purple-700">₹{totalGstCollected.toFixed(2)}</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">CGST 2.5% + SGST 2.5% (Food & Grocery)</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">B2B BUSINESS INVOICES</span>
          <div className="text-2xl font-black text-slate-900">{b2bCount} Invoices</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Valid GSTIN Registered</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">STORE GSTIN</span>
          <div className="text-xl font-mono font-black text-slate-900">07AAACK9842K1Z9</div>
          <span className="text-[11px] text-purple-600 font-bold mt-1 block">KiranaStore Principal Hub (Noida)</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice ID, customer, GSTIN..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
          />
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Showing {filteredInvoices.length} Official GST Tax Invoices
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 text-xs">
          {filteredInvoices.map((inv) => (
            <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono font-black text-slate-900">{inv.id}</span>
                  <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md border border-purple-200">
                    Order #{inv.order_number}
                  </span>
                  <span className="text-slate-400 text-[11px]">• {inv.date}</span>
                </div>
                <div className="font-extrabold text-slate-800 text-sm">{inv.customer} ({inv.phone})</div>
                <span className="text-slate-400 font-mono text-[10px] block mt-0.5">GSTIN: {inv.gstin}</span>
              </div>

              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">
                    TAX (5% GST): ₹{inv.gst_amount.toFixed(2)} (CGST ₹{inv.cgst} + SGST ₹{inv.sgst})
                  </span>
                  <span className="font-black text-slate-900 text-sm">Invoice Total: ₹{inv.total.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs rounded-xl flex items-center gap-1 transition"
                  >
                    <FileText size={14} /> View Invoice
                  </button>
                  <button
                    onClick={() => handlePrint(inv)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    title="Print Receipt"
                  >
                    <Printer size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No tax invoices found matching your query.
          </div>
        )}
      </div>

      {/* Invoice Detail / Print Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-in zoom-in duration-150 max-h-[90vh] overflow-y-auto space-y-4">
            <button onClick={() => setSelectedInvoice(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full">
              <X size={16} />
            </button>

            {/* Official GST Invoice Receipt Header */}
            <div className="border-b border-slate-200 pb-3 text-center space-y-1">
              <div className="text-base font-black tracking-wider text-slate-900">KIRANASTORE QUICK COMMERCE PVT LTD</div>
              <div className="text-[11px] text-slate-500 font-medium">Sector 62, Electronic City, Noida, UP - 201309</div>
              <div className="text-xs font-mono font-bold text-purple-700">GSTIN: 07AAACK9842K1Z9 | FSSAI: 10021051000123</div>
              <div className="text-xs font-black uppercase text-slate-800 pt-1">TAX INVOICE / BILL OF SUPPLY</div>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Invoice No & Date</span>
                <strong className="text-slate-900">{selectedInvoice.id}</strong>
                <span className="block text-slate-600">{selectedInvoice.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Billed To (Customer)</span>
                <strong className="text-slate-900">{selectedInvoice.customer}</strong>
                <span className="block text-slate-600">{selectedInvoice.phone}</span>
                <span className="text-slate-400 font-mono text-[10px]">{selectedInvoice.gstin}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5">HSN</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-slate-900">{it.name}</td>
                      <td className="p-2.5 font-mono text-slate-500 text-[10px]">{it.hsn}</td>
                      <td className="p-2.5 text-center">{it.quantity}</td>
                      <td className="p-2.5 text-right font-black">₹{(it.price * it.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tax Breakup */}
            <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span className="font-mono">₹{selectedInvoice.taxable_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (2.5%):</span>
                <span className="font-mono">₹{selectedInvoice.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (2.5%):</span>
                <span className="font-mono">₹{selectedInvoice.sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Invoice Total:</span>
                <span className="text-purple-700 font-mono">₹{selectedInvoice.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handlePrint(selectedInvoice)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Printer size={15} /> Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
