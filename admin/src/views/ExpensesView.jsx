import React, { useState } from 'react';
import { DollarSign, Plus, Edit2, Trash2, Search, CheckCircle2, TrendingDown, Calendar, X } from 'lucide-react';

export default function ExpensesView() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Dark Store Electricity & Cold Storage', category: 'Store Utilities', amount: 8400, date: '19 Aug 2026', paidTo: 'PVVNL Electricity Board', status: 'PAID' },
    { id: 2, title: 'Delivery Riders Weekly Fuel & Payout', category: 'Logistics / Riders', amount: 14200, date: '18 Aug 2026', paidTo: 'In-House Rider Team (3 Riders)', status: 'PAID' },
    { id: 3, title: 'Eco-Friendly Packing Bags & Crates', category: 'Packaging', amount: 3200, date: '16 Aug 2026', paidTo: 'GreenPack Packaging Pvt Ltd', status: 'PAID' },
    { id: 4, title: 'Digital Social Media Ads', category: 'Marketing', amount: 4500, date: '15 Aug 2026', paidTo: 'Meta / Google Ads', status: 'PAID' },
    { id: 5, title: 'Store POS Machine & Roll Paper', category: 'Store Operations', amount: 1100, date: '12 Aug 2026', paidTo: 'PineLabs POS Support', status: 'PAID' },
  ]);

  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState('Store Operations');
  const [expAmount, setExpAmount] = useState('');
  const [expPaidTo, setExpPaidTo] = useState('');

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newE = {
      id: Date.now(),
      title: expTitle,
      category: expCategory,
      amount: parseFloat(expAmount),
      date: 'Today',
      paidTo: expPaidTo || 'Vendor',
      status: 'PAID'
    };
    setExpenses([newE, ...expenses]);
    setIsAddOpen(false);
    setExpTitle('');
    setExpAmount('');
    alert('Expense recorded successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Expense & Cash Flow Ledger</h2>
          <p className="text-xs text-slate-500">Track dark store operations, rider payouts, utility bills, packaging costs & net profits</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={15} /> Record New Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">THIS MONTH EXPENSES</span>
          <div className="text-2xl font-black text-rose-600">₹{totalExpense.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">5 Operating Line Items</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">ESTIMATED GROSS PROFIT</span>
          <div className="text-2xl font-black text-emerald-600">₹94,800</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Revenue: ₹1,26,200</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">NET OPERATING MARGIN</span>
          <div className="text-2xl font-black text-purple-700">₹{(94800 - totalExpense).toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">+49.6% Net Margin</span>
        </div>
      </div>

      {/* Expense Ledger Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-black text-sm text-slate-900">Recorded Operating Expenses</h3>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {expenses.map((e) => (
            <div key={e.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-slate-900">{e.title}</span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    {e.category}
                  </span>
                </div>
                <span className="text-slate-400 text-[11px]">Paid to: <strong>{e.paidTo}</strong> • {e.date}</span>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-rose-600 block">₹{e.amount.toLocaleString()}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.2 rounded border border-emerald-200">
                  {e.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Record Store Expense</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Expense Title / Description</label>
                <input type="text" required value={expTitle} onChange={(e) => setExpTitle(e.target.value)} placeholder="e.g. Inverter Battery Maintenance" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold">
                    <option>Store Utilities</option>
                    <option>Logistics / Riders</option>
                    <option>Packaging</option>
                    <option>Marketing</option>
                    <option>Store Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Amount (₹)</label>
                  <input type="number" required value={expAmount} onChange={(e) => setExpAmount(e.target.value)} placeholder="e.g. 2500" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Paid To (Vendor / Person)</label>
                <input type="text" value={expPaidTo} onChange={(e) => setExpPaidTo(e.target.value)} placeholder="e.g. Local Electrician" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Record Expense</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
