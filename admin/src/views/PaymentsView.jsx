import React, { useState, useEffect } from 'react';
import { 
  CreditCard, IndianRupee, Wallet, RotateCcw, CheckCircle2, ShieldCheck, 
  RefreshCw, Search, Download, Filter, X, ArrowUpRight, Check, AlertCircle, Sparkles
} from 'lucide-react';

export default function PaymentsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'UPI' | 'CARD' | 'WALLET' | 'COD'
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PAID' | 'REFUNDED' | 'PENDING'
  const [toastMsg, setToastMsg] = useState(null);
  const [isRefunding, setIsRefunding] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [refundReason, setRefundReason] = useState('Damaged item replacement / Customer request');
  const [refundMode, setRefundMode] = useState('WALLET');

  const [financeData, setFinanceData] = useState({
    gmv: 186900,
    total_orders: 0,
    taxable_sales: 178000,
    total_gst: 8900,
    channel_breakdown: [
      { mode: 'UPI (GPay / PhonePe / QR)', amount: 115800, share: '62% Share', color: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
      { mode: 'Credit & Debit Cards', amount: 42800, share: '23% Share', color: 'text-blue-700 border-blue-200 bg-blue-50' },
      { mode: 'KiranaWallet', amount: 18500, share: '10% Share', color: 'text-purple-700 border-purple-200 bg-purple-50' },
      { mode: 'Cash on Delivery (COD)', amount: 9800, share: '5% Share', color: 'text-amber-700 border-amber-200 bg-amber-50' },
    ],
    ledger: []
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchFinance = async () => {
    try {
      const res = await fetch('/api/admin/finance/overview');
      if (res.ok) {
        const data = await res.json();
        setFinanceData(data);
      }
    } catch (e) {
      console.warn('Finance overview fetch error:', e);
    }
  };

  useEffect(() => {
    fetchFinance();
    const interval = setInterval(fetchFinance, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleReconcile = async () => {
    try {
      const res = await fetch('/api/admin/finance/reconcile', { method: 'POST' });
      if (res.ok) {
        showToast('⚡ Payment Gateway & UPI settlement reconciliation complete!');
        fetchFinance();
      }
    } catch {}
  };

  const handleProcessRefund = async (e) => {
    e.preventDefault();
    if (!selectedTxn) return;
    setIsRefunding(true);

    try {
      const res = await fetch('/api/admin/finance/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedTxn.order_id,
          amount: selectedTxn.amount,
          reason: refundReason,
          refund_mode: refundMode
        })
      });

      if (res.ok) {
        showToast(`💸 Refund of ₹${selectedTxn.amount} processed back to ${selectedTxn.customer}'s ${refundMode === 'WALLET' ? 'KiranaWallet' : 'original payment method'}!`);
        setSelectedTxn(null);
        fetchFinance();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process refund');
    } finally {
      setIsRefunding(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Txn Ref", "Order Number", "Customer", "Phone", "Amount", "Payment Mode", "Status", "Time"];
    const rows = financeData.ledger.map(t => [
      t.id,
      `"${t.order_number}"`,
      `"${t.customer}"`,
      `"${t.phone}"`,
      t.amount,
      `"${t.mode}"`,
      t.status,
      `"${t.time}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payment_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLedger = (financeData.ledger || []).filter(t => {
    const matchesSearch = (t.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.phone || '').includes(searchQuery);

    const matchesMode = filterMode === 'ALL' || (t.mode || '').toUpperCase().includes(filterMode);
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;

    return matchesSearch && matchesMode && matchesStatus;
  });

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
            <CreditCard size={24} className="text-purple-600" />
            Payment Collections & Reconciliation
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Live gateway settlements, Razorpay/UPI reconciliations, refund disbursements & instant ledger audits
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleReconcile}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <ShieldCheck size={14} /> Auto-Reconcile Gateway
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition"
          >
            <Download size={14} /> Export Ledger CSV
          </button>
        </div>
      </div>

      {/* Payment Channels Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {financeData.channel_breakdown.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider block mb-1">{item.mode}</span>
              <div className="text-2xl font-black text-slate-900 mt-1">₹{item.amount.toLocaleString('en-IN')}</div>
            </div>
            <span className={`text-[10px] font-black mt-3 inline-block px-2.5 py-0.5 rounded-full border w-fit ${item.color}`}>
              {item.share}
            </span>
          </div>
        ))}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search txn ID, order number, customer..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Channel Filters */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
            {[
              { id: 'ALL', label: 'All Modes' },
              { id: 'UPI', label: 'UPI' },
              { id: 'CARD', label: 'Cards' },
              { id: 'WALLET', label: 'Wallet' },
              { id: 'COD', label: 'COD' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setFilterMode(m.id)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  filterMode === m.id ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-purple-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">PAID / SUCCESS</option>
            <option value="REFUNDED">REFUNDED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Transaction Ref</th>
                <th className="py-3.5 px-4">Order Reference</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Gateway Status</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLedger.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{t.id}</td>
                  <td className="py-3.5 px-4 font-extrabold text-purple-700">#{t.order_number}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{t.customer}</div>
                    <span className="text-slate-400 text-[11px]">{t.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">₹{t.amount.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-bold">{t.mode}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      t.status === 'REFUNDED' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{t.time}</td>
                  <td className="py-3.5 px-4 text-right">
                    {t.status !== 'REFUNDED' ? (
                      <button
                        onClick={() => setSelectedTxn(t)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition"
                      >
                        Issue Refund
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-bold">Refunded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLedger.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No transactions found matching your active filter.
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150 space-y-4">
            <button onClick={() => setSelectedTxn(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full">
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">Issue Instant Refund</h3>
            
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Reference:</span>
                <strong className="text-slate-900">#{selectedTxn.order_number}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <strong className="text-slate-900">{selectedTxn.customer} ({selectedTxn.phone})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Refund Amount:</span>
                <strong className="text-rose-600 text-sm">₹{selectedTxn.amount.toFixed(2)}</strong>
              </div>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Disbursement Channel</label>
                <select
                  value={refundMode}
                  onChange={(e) => setRefundMode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                >
                  <option value="WALLET">⚡ KiranaWallet (Instant - 100% Recommended)</option>
                  <option value="GATEWAY">🏦 Original Payment Gateway / UPI / Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Refund Reason *</label>
                <textarea
                  rows={2}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                disabled={isRefunding}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition"
              >
                {isRefunding ? 'Processing Refund...' : `Authorize ₹${selectedTxn.amount.toFixed(2)} Refund`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
