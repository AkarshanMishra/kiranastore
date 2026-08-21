import React, { useState } from 'react';
import { CreditCard, IndianRupee, Wallet, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function PaymentsView({ orders = [] }) {
  const transactions = [
    { id: 'TXN-98421', orderNum: 'KS-94821', amount: 320, mode: 'UPI (GPay)', status: 'SUCCESS', date: 'Just now' },
    { id: 'TXN-98420', orderNum: 'KS-94820', amount: 490, mode: 'KiranaWallet', status: 'SUCCESS', date: '12 mins ago' },
    { id: 'TXN-98419', orderNum: 'KS-94819', amount: 850, mode: 'Credit Card', status: 'SUCCESS', date: '35 mins ago' },
    { id: 'TXN-98418', orderNum: 'KS-94818', amount: 140, mode: 'COD', status: 'PAID', date: '1 hour ago' },
  ];

  const handleRefund = (txn) => {
    alert(`Refund of ₹${txn.amount} for Order #${txn.orderNum} processed back to customer KiranaWallet!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Payment Collections & Reconciliation</h2>
          <p className="text-xs text-slate-500">Monitor digital gateway transactions, COD collections & refunds</p>
        </div>
      </div>

      {/* Payment Channels Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { mode: 'UPI Payments (GPay/PhonePe)', amount: '₹92,400', share: '62% Share', color: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
          { mode: 'Credit & Debit Cards', amount: '₹34,100', share: '23% Share', color: 'text-blue-700 border-blue-200 bg-blue-50' },
          { mode: 'KiranaWallet', amount: '₹14,200', share: '10% Share', color: 'text-purple-700 border-purple-200 bg-purple-50' },
          { mode: 'Cash on Delivery (COD)', amount: '₹7,800', share: '5% Share', color: 'text-amber-700 border-amber-200 bg-amber-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
            <span className="text-xs text-slate-500 font-bold block mb-1">{item.mode}</span>
            <div className="text-2xl font-black text-slate-900">{item.amount}</div>
            <span className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded border ${item.color}`}>{item.share}</span>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <CreditCard size={18} className="text-purple-600" /> Live Payment Ledger
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Transaction Ref</th>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Gateway Status</th>
                <th className="p-3.5">Time</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono text-slate-600 font-bold">{t.id}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">#{t.orderNum}</td>
                  <td className="p-3.5 font-black text-emerald-600">₹{t.amount}</td>
                  <td className="p-3.5 text-slate-700 font-medium">{t.mode}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded border border-emerald-200">
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">{t.date}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleRefund(t)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold px-3 py-1 rounded-xl"
                    >
                      Process Refund
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
