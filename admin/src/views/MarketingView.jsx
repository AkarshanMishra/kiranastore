import React, { useState } from 'react';
import { Send, Plus, Users, Sparkles, Clock, Target, CheckCircle2, TrendingUp, X } from 'lucide-react';

export default function MarketingView() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Weekend Fresh Dairy Blast',
      type: 'PUSH_NOTIFICATION',
      target: 'All Customers (1,240)',
      sentCount: 1240,
      openRate: '38.4%',
      conversion: '14.2%',
      status: 'COMPLETED',
      date: '17 Aug 2026'
    },
    {
      id: 2,
      name: 'Abandoned Cart 1-Hour Reminder',
      type: 'AUTOMATED_CRM',
      target: 'Customers with Cart > ₹300',
      sentCount: 86,
      openRate: '62.0%',
      conversion: '28.5%',
      status: 'ACTIVE_AUTOMATION',
      date: 'Ongoing'
    },
    {
      id: 3,
      name: 'Win-Back 14-Day Inactive Users',
      type: 'COUPON_CAMPAIGN',
      target: 'Inactive > 14 Days',
      sentCount: 310,
      openRate: '41.2%',
      conversion: '18.0%',
      status: 'ACTIVE_AUTOMATION',
      date: 'Ongoing'
    },
    {
      id: 4,
      name: 'First Order Discount Prompt',
      type: 'WELCOME_SERIES',
      target: 'New Signups',
      sentCount: 195,
      openRate: '75.6%',
      conversion: '44.1%',
      status: 'ACTIVE_AUTOMATION',
      date: 'Ongoing'
    }
  ]);

  // Form states
  const [campName, setCampName] = useState('');
  const [campType, setCampType] = useState('PUSH_NOTIFICATION');
  const [campTarget, setCampTarget] = useState('All Customers');
  const [campMessage, setCampMessage] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    const newC = {
      id: Date.now(),
      name: campName,
      type: campType,
      target: campTarget,
      sentCount: 0,
      openRate: '0%',
      conversion: '0%',
      status: 'SCHEDULED',
      date: 'Today'
    };
    setCampaigns([newC, ...campaigns]);
    setIsAddOpen(false);
    alert(`Campaign "${campName}" launched!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Marketing & CRM Automation</h2>
          <p className="text-xs text-slate-500">Run push campaigns, automated abandoned cart recovery, reorder reminders & customer win-back</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={15} /> Create Marketing Campaign
        </button>
      </div>

      {/* Automated Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-purple-50 text-purple-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                  {c.type}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                  c.status.includes('ACTIVE') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {c.status}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 mb-1">{c.name}</h3>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Target size={12} className="text-purple-600" /> {c.target}
              </p>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 my-3 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">OPEN RATE</span>
                  <span className="font-black text-slate-900 text-xs">{c.openRate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">CONVERSION</span>
                  <span className="font-black text-emerald-600 text-xs">{c.conversion}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{c.sentCount} Dispatched</span>
              <button onClick={() => alert(`Viewing analytics for ${c.name}`)} className="text-purple-600 font-bold text-xs hover:underline">
                View Stats →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsAddOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Create Marketing Campaign</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campaign Title</label>
                <input type="text" required value={campName} onChange={(e) => setCampName(e.target.value)} placeholder="e.g. Evening Snacks Flash Deal" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Audience Segment</label>
                <select value={campTarget} onChange={(e) => setCampTarget(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold">
                  <option>All Customers</option>
                  <option>VIP Customers (Spent Above ₹5,000)</option>
                  <option>Inactive Users (Over 14 Days)</option>
                  <option>Abandoned Cart Users</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Push / SMS Message Content</label>
                <textarea rows={3} required value={campMessage} onChange={(e) => setCampMessage(e.target.value)} placeholder="Get ₹50 OFF on your next grocery basket with code FRESH50!" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Launch Campaign</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
