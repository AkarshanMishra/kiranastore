import React, { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, TrendingUp, AlertTriangle, Package, BrainCircuit, 
  CheckCircle2, Zap, RefreshCw, Plus, Trash2, Edit, X, ArrowUpRight, 
  DollarSign, Users, ShoppingCart, ShieldAlert, Check, ChevronRight, Sliders
} from 'lucide-react';

export default function AiAnalyticsView() {
  const [activeTab, setActiveTab] = useState('stockout'); // 'stockout' | 'churn' | 'pricing' | 'rules'
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState({
    engine_version: 'Neural Kirana ML v4.6 (Active)',
    accuracy_rate: 96.8,
    critical_stockouts_count: 0,
    forecast_items: [],
    churn_predictions: [],
    pricing_recommendations: []
  });

  // Forecasting Rules CRUD State
  const [forecastRules, setForecastRules] = useState([]);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [ruleFormData, setRuleFormData] = useState({
    name: '',
    category: 'Dairy & Breakfast',
    demand_multiplier: 1.5,
    stockout_threshold_hours: 6,
    auto_restock_enabled: true,
    status: 'ACTIVE',
    notes: ''
  });

  // Custom PO Restock Modal State
  const [selectedPoItem, setSelectedPoItem] = useState(null);
  const [poQuantity, setPoQuantity] = useState(30);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/admin/ai/forecast/overview');
      if (res.ok) {
        const data = await res.json();
        setForecastData(data);
      }
    } catch (e) {
      console.warn('Could not fetch AI overview:', e);
    }
  };

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/admin/ai/forecast/rules');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setForecastRules(data);
      }
    } catch (e) {
      console.warn('Could not fetch forecast rules:', e);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchRules();
    const interval = setInterval(fetchOverview, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // 1-Click Auto PO Restock
  const handleExecutePo = async (productId, quantity, productName) => {
    try {
      const res = await fetch('/api/admin/ai/forecast/auto-po', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: quantity })
      });
      if (res.ok) {
        showNotification(`⚡ Restocked +${quantity} units for ${productName}! New inventory updated in store.`);
        fetchOverview();
        setSelectedPoItem(null);
      }
    } catch (e) {
      console.warn('Auto PO execution error:', e);
    }
  };

  // 1-Click Churn Win-Back
  const handleTriggerWinback = async (customerId, customerName) => {
    try {
      const res = await fetch('/api/admin/ai/forecast/winback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, bonus_amount: 50.0 })
      });
      if (res.ok) {
        showNotification(`🎁 ₹50 Win-Back wallet bonus & alert sent to ${customerName}!`);
        fetchOverview();
      }
    } catch (e) {
      console.warn('Winback error:', e);
    }
  };

  // 1-Click Dynamic Pricing Apply
  const handleApplyPricing = async (productId, newDiscountPrice, newPrice, productName) => {
    try {
      const res = await fetch('/api/admin/ai/forecast/apply-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          new_discount_price: newDiscountPrice,
          new_price: newPrice
        })
      });
      if (res.ok) {
        showNotification(`🏷️ Updated dynamic price for ${productName}! Live on customer app.`);
        fetchOverview();
      }
    } catch (e) {
      console.warn('Pricing update error:', e);
    }
  };

  // Forecast Rules CRUD Handlers
  const handleOpenCreateRule = () => {
    setEditingRule(null);
    setRuleFormData({
      name: '',
      category: 'Dairy & Breakfast',
      demand_multiplier: 1.5,
      stockout_threshold_hours: 6,
      auto_restock_enabled: true,
      status: 'ACTIVE',
      notes: ''
    });
    setIsRuleModalOpen(true);
  };

  const handleOpenEditRule = (r) => {
    setEditingRule(r);
    setRuleFormData({
      name: r.name,
      category: r.category,
      demand_multiplier: r.demand_multiplier,
      stockout_threshold_hours: r.stockout_threshold_hours,
      auto_restock_enabled: r.auto_restock_enabled,
      status: r.status,
      notes: r.notes || ''
    });
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    if (!ruleFormData.name) return;

    if (editingRule) {
      try {
        await fetch(`/api/admin/ai/forecast/rules/${editingRule.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ruleFormData)
        });
      } catch {}
      setForecastRules(forecastRules.map(r => r.id === editingRule.id ? { ...r, ...ruleFormData } : r));
    } else {
      try {
        const res = await fetch('/api/admin/ai/forecast/rules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ruleFormData)
        });
        if (res.ok) {
          const created = await res.json();
          setForecastRules([created, ...forecastRules]);
        }
      } catch {}
    }
    setIsRuleModalOpen(false);
    fetchOverview();
  };

  const handleDeleteRule = async (id, name) => {
    if (!confirm(`Delete demand forecast rule "${name}"?`)) return;
    try {
      await fetch(`/api/admin/ai/forecast/rules/${id}`, { method: 'DELETE' });
    } catch {}
    setForecastRules(forecastRules.filter(r => r.id !== id));
    fetchOverview();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Action Notification Toast */}
      {actionSuccessMsg && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl text-xs font-black shadow-lg flex items-center justify-between animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="opacity-80 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BrainCircuit size={24} className="text-purple-600" />
            AI Intelligence & Demand Forecasting
          </h2>
          <p className="text-xs text-slate-500">
            Machine learning stockout prediction, 1-click auto-purchase orders, customer churn retention & dynamic pricing
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-2xl text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{forecastData.engine_version}</span>
          </div>

          <button
            onClick={() => {
              fetchOverview();
              fetchRules();
            }}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="Refresh Forecast"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Forecast Accuracy</div>
          <div className="text-xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
            {forecastData.accuracy_rate}%
            <span className="text-[10px] text-emerald-600 font-bold">Neural Live</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Critical Stockouts</div>
          <div className="text-xl font-black text-rose-600 mt-1 flex items-baseline gap-1">
            {forecastData.critical_stockouts_count} items
            <span className="text-[10px] text-slate-400 font-medium">Alerts</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Active Multipliers</div>
          <div className="text-xl font-black text-purple-700 mt-1">
            {forecastRules.length} Rules
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Revenue Protection</div>
          <div className="text-xl font-black text-emerald-600 mt-1">
            +₹42,800 <span className="text-[10px] text-slate-400 font-medium">Est. / mo</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 text-xs font-bold w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('stockout')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
            activeTab === 'stockout' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap size={14} className="text-amber-500" /> Stockout Alerts & Auto-PO ({forecastData.forecast_items?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('churn')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
            activeTab === 'churn' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users size={14} className="text-purple-600" /> Customer Churn Prevention ({forecastData.churn_predictions?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
            activeTab === 'pricing' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp size={14} className="text-emerald-600" /> Dynamic Pricing ({forecastData.pricing_recommendations?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
            activeTab === 'rules' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders size={14} /> Forecast Multiplier Rules ({forecastRules.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STOCKOUT PREDICTION & AUTO-PO */}
      {/* ========================================================================= */}
      {activeTab === 'stockout' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecastData.forecast_items?.map((f, i) => (
              <div
                key={i}
                className={`bg-white border rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition ${
                  f.urgency === 'CRITICAL' ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/10' :
                  f.urgency === 'HIGH' ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {f.category}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      f.urgency === 'CRITICAL' ? 'bg-rose-600 text-white animate-pulse' :
                      f.urgency === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                      f.urgency === 'MEDIUM' ? 'bg-purple-100 text-purple-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {f.stockoutRisk}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{f.name}</h4>
                  
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-2.5 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Stock:</span>
                      <strong className="text-slate-900">{f.current_stock} {f.unit}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">AI 24h Demand:</span>
                      <strong className="text-purple-700">{f.predicted_demand}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Shelf Price:</span>
                      <strong className="text-slate-800">₹{f.discount_price || f.price}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-extrabold text-emerald-700">
                    AI PO: +{f.recommended_order || 25} {f.unit}
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleExecutePo(f.product_id, f.recommended_order || 30, f.name)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition"
                    >
                      1-Click Restock
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPoItem(f);
                        setPoQuantity(f.recommended_order || 30);
                      }}
                      className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition"
                      title="Custom PO Quantity"
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CUSTOMER CHURN PREDICTION & RETENTION */}
      {/* ========================================================================= */}
      {activeTab === 'churn' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" />
              Machine Learning Customer Inactivity & Churn Risk Detector
            </h3>
            <p className="text-xs text-slate-500">Automatically identifies shoppers missing their regular ordering cadence</p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {forecastData.churn_predictions?.map((c, i) => (
              <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{c.name}</span>
                    <span className="text-slate-400 font-medium">({c.phone})</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      c.churn_risk === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.churn_risk} RISK • {c.days_inactive} Days Inactive
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1">{c.recommended_action}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    KiranaWallet: ₹{c.wallet_balance?.toFixed(0)} • Recovery Probability: <strong className="text-emerald-700">{c.recovery_chance}</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerWinback(c.customer_id, c.name)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition whitespace-nowrap"
                >
                  🎁 Send ₹50 Win-Back Bonus
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DYNAMIC PRICING RECOMMENDATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forecastData.pricing_recommendations?.map((p, i) => (
            <div key={i} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-black text-sm text-slate-900">{p.name}</h4>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {p.margin_impact}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  {p.reason}
                </p>

                <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Current Price</span>
                    <strong className="text-slate-800">₹{p.current_discount || p.current_price}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-600 block text-[10px] font-bold">AI Recommended</span>
                    <strong className="text-emerald-700 font-black text-sm">
                      ₹{p.suggested_discount_price || p.suggested_price}
                    </strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleApplyPricing(
                  p.product_id, 
                  p.suggested_discount_price || p.current_discount, 
                  p.suggested_price || p.current_price, 
                  p.name
                )}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-2xl shadow-xs transition"
              >
                1-Click Apply AI Price
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FORECAST MULTIPLIER RULES CRUD */}
      {/* ========================================================================= */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Neural Demand Surge Multiplier Rules</h3>
              <p className="text-xs text-slate-500">Define peak slot, seasonal, and weather demand multipliers</p>
            </div>

            <button
              onClick={handleOpenCreateRule}
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus size={14} /> Add Forecast Rule
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forecastRules.map((r) => (
              <div key={r.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{r.name}</span>
                      <span className="bg-purple-50 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-purple-200">
                        {r.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditRule(r)}
                        className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
                        title="Edit Rule"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(r.id, r.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Delete Rule"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {r.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                      {r.notes}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Multiplier</span>
                      <strong className="text-purple-700 font-black">{r.demand_multiplier}x Surge</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Alert Window</span>
                      <strong className="text-slate-800">{r.stockout_threshold_hours} Hours</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Auto-PO</span>
                      <strong className={r.auto_restock_enabled ? 'text-emerald-600' : 'text-slate-400'}>
                        {r.auto_restock_enabled ? 'ENABLED' : 'MANUAL'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT FORECAST RULE */}
      {/* ========================================================================= */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setIsRuleModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">
              {editingRule ? 'Edit Forecast Rule' : 'Create Forecast Multiplier Rule'}
            </h3>

            <form onSubmit={handleSaveRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Morning Dairy Surge"
                  value={ruleFormData.name}
                  onChange={(e) => setRuleFormData({ ...ruleFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Category</label>
                  <select
                    value={ruleFormData.category}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="Dairy & Breakfast">Dairy & Breakfast</option>
                    <option value="Snacks & Munchies">Snacks & Munchies</option>
                    <option value="Tea, Coffee & Beverages">Tea & Beverages</option>
                    <option value="Atta, Rice & Dal">Atta, Rice & Dal</option>
                    <option value="Instant Food">Instant Food</option>
                    <option value="ALL">All Categories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Demand Multiplier (x)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="5.0"
                    required
                    value={ruleFormData.demand_multiplier}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, demand_multiplier: parseFloat(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stockout Threshold (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="48"
                    required
                    value={ruleFormData.stockout_threshold_hours}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, stockout_threshold_hours: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Auto-PO Enabled</label>
                  <select
                    value={ruleFormData.auto_restock_enabled ? 'true' : 'false'}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, auto_restock_enabled: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="true">YES (Auto-PO)</option>
                    <option value="false">NO (Manual Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Operational Notes / Reason</label>
                <textarea
                  rows={2}
                  placeholder="Explain why this demand multiplier applies (e.g. monsoon weather, weekend peak)..."
                  value={ruleFormData.notes}
                  onChange={(e) => setRuleFormData({ ...ruleFormData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                Save Forecast Rule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CUSTOM PO RESTOCK QUANTITY */}
      {/* ========================================================================= */}
      {selectedPoItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setSelectedPoItem(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">
              Create Custom Purchase Order
            </h3>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="font-bold text-slate-900">{selectedPoItem.name}</div>
              <div>Current Stock: <strong>{selectedPoItem.current_stock} {selectedPoItem.unit}</strong></div>
              <div>Predicted 24h Demand: <strong className="text-purple-700">{selectedPoItem.predicted_demand}</strong></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Restock Quantity ({selectedPoItem.unit})</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={poQuantity}
                  onChange={(e) => setPoQuantity(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-sm outline-none focus:border-purple-600"
                />
              </div>

              <button
                onClick={() => handleExecutePo(selectedPoItem.product_id, poQuantity, selectedPoItem.name)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition"
              >
                Execute Purchase Order & Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
