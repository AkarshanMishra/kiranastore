import React, { useState } from 'react';
import { Bot, Sparkles, TrendingUp, AlertTriangle, Package, BrainCircuit, CheckCircle2, Zap } from 'lucide-react';

export default function AiAnalyticsView() {
  const [aiEngineStatus] = useState('ONLINE (v4.2 Neural Forecast)');

  const forecastItems = [
    { name: 'Amul Taaza Milk 500ml', currentStock: 48, predictedDemand: '85 pcs', stockoutRisk: 'HIGH (in ~6 hours)', recommendedOrder: '+60 pcs immediately', urgency: 'CRITICAL' },
    { name: 'Fresh Malai Paneer 200g', currentStock: 18, predictedDemand: '32 pcs', stockoutRisk: 'MEDIUM (Weekend Surge)', recommendedOrder: '+25 pcs', urgency: 'MEDIUM' },
    { name: 'Aashirvaad Atta 5kg', currentStock: 35, predictedDemand: '20 pcs', stockoutRisk: 'LOW', recommendedOrder: 'Normal Schedule', urgency: 'LOW' },
    { name: 'Lay\'s Magic Masala 50g', currentStock: 12, predictedDemand: '40 pcs', stockoutRisk: 'HIGH (Evening Peak)', recommendedOrder: '+40 pcs', urgency: 'CRITICAL' }
  ];

  const churnPrediction = [
    { customer: 'Rohan Verma', daysInactive: 12, risk: 'HIGH', recommendation: 'Send ₹50 OFF notification (78% recovery chance)' },
    { customer: 'Simran Kaur', daysInactive: 9, risk: 'MEDIUM', recommendation: 'Send Weekend Dairy Reminder' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">AI Intelligence & Demand Forecasting</h2>
          <p className="text-xs text-slate-500">Machine learning stockout prediction, AI purchase quantity recommendations & customer churn prevention</p>
        </div>

        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-2xl text-xs font-bold">
          <BrainCircuit size={16} className="text-purple-600 animate-pulse" />
          <span>AI Engine: {aiEngineStatus}</span>
        </div>
      </div>

      {/* AI Stockout Prediction Cards */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
          <Zap size={18} className="text-amber-500" />
          AI Predicted Stockout Alerts & Auto-PO Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forecastItems.map((f, i) => (
            <div key={i} className={`p-4 rounded-2xl border flex flex-col justify-between ${
              f.urgency === 'CRITICAL' ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-xs text-slate-900">{f.name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    f.urgency === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {f.stockoutRisk}
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <div>Current Stock: <strong>{f.currentStock} pcs</strong></div>
                  <div>AI Demand Forecast (Next 24h): <strong className="text-purple-700">{f.predictedDemand}</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-emerald-700">
                  AI Action: {f.recommendedOrder}
                </span>
                <button
                  onClick={() => alert(`Auto PO generated for ${f.name}!`)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3 py-1 rounded-xl shadow-xs"
                >
                  Create PO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Churn Prediction */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
          <Sparkles size={18} className="text-purple-600" />
          AI Customer Churn Prediction & Retention Triggers
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {churnPrediction.map((c, i) => (
            <div key={i} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
              <div>
                <div className="font-extrabold text-slate-900">{c.customer} ({c.daysInactive} days since last order)</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{c.recommendation}</div>
              </div>
              <button
                onClick={() => alert(`Sent automated retention coupon to ${c.customer}!`)}
                className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-extrabold text-xs px-3 py-1.5 rounded-xl"
              >
                Send Win-Back Offer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
