import React, { useState } from 'react';
import { Store, MapPin, Clock, Phone, Mail, ShieldCheck, CheckCircle2, Save, Power, Navigation, AlertCircle } from 'lucide-react';

export default function StoresView() {
  const [storeData, setStoreData] = useState({
    shopName: 'KiranaStore Supermarket',
    tagline: 'Your Trusted Neighborhood Grocery Store',
    ownerName: 'Akarshan Mishra',
    phone: '+91 9876543210',
    email: 'contact@kiranastore.com',
    address: 'Shop #12, Ground Floor, Central Market, Sector 62, Noida, UP - 201309',
    deliveryRadius: '3.5',
    minOrderValue: '99',
    freeDeliveryAbove: '499',
    openingTime: '07:00',
    closingTime: '23:00',
    serviceablePincodes: '201301, 201307, 201309, 201310',
    isStoreOpen: true,
    acceptingOrders: true,
    autoAcceptOrders: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Kirana Store Profile & Store Operations</h2>
          <p className="text-xs text-slate-500">Configure your single store operations, operating hours, delivery radius & business info</p>
        </div>

        {/* Live Store Status Switch */}
        <div className="flex items-center gap-3 bg-white border border-slate-200/80 p-2 px-3 rounded-2xl shadow-xs">
          <span className="text-xs font-bold text-slate-700">Store Live Status:</span>
          <button
            onClick={() => setStoreData(prev => ({ ...prev, isStoreOpen: !prev.isStoreOpen }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition ${
              storeData.isStoreOpen
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-rose-600 text-white shadow-xs'
            }`}
          >
            <Power size={13} />
            {storeData.isStoreOpen ? 'OPEN (Accepting Orders)' : 'CLOSED (Paused)'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Store details and delivery settings updated successfully!
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Business & Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shop Basic Details */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Store size={18} className="text-purple-600" />
              General Shop Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shop / Store Name</label>
                <input
                  type="text"
                  value={storeData.shopName}
                  onChange={(e) => setStoreData({ ...storeData, shopName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Owner / Manager Name</label>
                <input
                  type="text"
                  value={storeData.ownerName}
                  onChange={(e) => setStoreData({ ...storeData, ownerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Store Helpline / WhatsApp</label>
                <input
                  type="text"
                  value={storeData.phone}
                  onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={storeData.email}
                  onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Complete Store Physical Address</label>
              <textarea
                rows={2}
                value={storeData.address}
                onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition resize-none"
                required
              />
            </div>
          </div>

          {/* Delivery & Pincode Coverage */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Navigation size={18} className="text-purple-600" />
              Delivery Radius & Pricing Thresholds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max Delivery Radius</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={storeData.deliveryRadius}
                    onChange={(e) => setStoreData({ ...storeData, deliveryRadius: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">km</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Order Value</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={storeData.minOrderValue}
                    onChange={(e) => setStoreData({ ...storeData, minOrderValue: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Free Delivery Above</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={storeData.freeDeliveryAbove}
                    onChange={(e) => setStoreData({ ...storeData, freeDeliveryAbove: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Serviceable Pincodes (Comma separated)</label>
              <input
                type="text"
                value={storeData.serviceablePincodes}
                onChange={(e) => setStoreData({ ...storeData, serviceablePincodes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">Orders outside these pincodes will be prompted about distance limitations.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Store Timings & Quick Actions */}
        <div className="space-y-6">
          {/* Working Hours */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Clock size={18} className="text-purple-600" />
              Store Daily Operating Timings
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Morning Opening Time</label>
                <input
                  type="time"
                  value={storeData.openingTime}
                  onChange={(e) => setStoreData({ ...storeData, openingTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Night Closing Time</label>
                <input
                  type="time"
                  value={storeData.closingTime}
                  onChange={(e) => setStoreData({ ...storeData, closingTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-purple-600 transition"
                />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 p-3 rounded-2xl text-[11px] text-purple-900 font-medium space-y-1">
              <div className="font-extrabold flex items-center gap-1 text-purple-800">
                <AlertCircle size={13} />
                Automated Off-Hours Message
              </div>
              <p>Customers can still pre-order after hours for next morning 7:00 AM express delivery.</p>
            </div>
          </div>

          {/* Quick Stats / Summary */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-3">
            <div className="text-[10px] font-black text-purple-300 uppercase tracking-wider">Single Store Overview</div>
            <div className="text-xl font-black">{storeData.shopName}</div>
            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-400 flex-shrink-0" />
              <span>Sector 62, Noida (Coverage: {storeData.deliveryRadius} km)</span>
            </div>
            
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">Min Order</span>
                <span className="font-black text-emerald-400">₹{storeData.minOrderValue}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">Free Delivery</span>
                <span className="font-black text-purple-300">₹{storeData.freeDeliveryAbove}+</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 active:scale-98"
          >
            <Save size={16} /> Save Store Configuration
          </button>
        </div>

      </form>
    </div>
  );
}
