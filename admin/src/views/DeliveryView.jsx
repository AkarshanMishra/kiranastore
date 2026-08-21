import React, { useState } from 'react';
import { Bike, MapPin, Clock, Plus, Star, Phone, ShieldCheck, Check, Trash2, Edit2, X } from 'lucide-react';

export default function DeliveryView() {
  const [activeSubTab, setActiveSubTab] = useState('riders');
  const [isAddRiderOpen, setIsAddRiderOpen] = useState(false);

  const [riders, setRiders] = useState([
    { id: 1, name: 'Rahul Kumar', phone: '+91 9811223344', rating: 4.9, active: true, completedCount: 1240, earnings: 38400, docsVerified: true },
    { id: 2, name: 'Vikram Singh', phone: '+91 9822334455', rating: 4.8, active: true, completedCount: 890, earnings: 26700, docsVerified: true },
    { id: 3, name: 'Amit Sharma', phone: '+91 9833445566', rating: 4.7, active: false, completedCount: 450, earnings: 13500, docsVerified: true }
  ]);

  const [zones, setZones] = useState([
    { id: 1, zone: 'Noida Sector 62 Hub', pincodes: '201301, 201309', fee: '₹15 (Free > ₹500)', eta: 'Same-Day / Next-Day Slots', status: 'ACTIVE' },
    { id: 2, zone: 'Indirapuram Hub', pincodes: '201014, 201012', fee: '₹15 (Free > ₹500)', eta: 'Same-Day / Next-Day Slots', status: 'ACTIVE' },
    { id: 3, zone: 'Sector 63 Commercial', pincodes: '201307', fee: '₹20 (Free > ₹600)', eta: 'Same-Day Slots', status: 'ACTIVE' },
  ]);

  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');

  const handleAddRiderSubmit = (e) => {
    e.preventDefault();
    if (!riderName.trim()) return;
    const newRider = {
      id: Date.now(),
      name: riderName,
      phone: riderPhone || '+91 9811223300',
      rating: 5.0,
      active: true,
      completedCount: 0,
      earnings: 0,
      docsVerified: true
    };
    setRiders([...riders, newRider]);
    setRiderName('');
    setRiderPhone('');
    setIsAddRiderOpen(false);
    alert(`Rider ${newRider.name} added!`);
  };

  const handleToggleRiderStatus = (id) => {
    setRiders(riders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleDeleteRider = (id) => {
    if (confirm("Delete delivery rider?")) {
      setRiders(riders.filter(r => r.id !== id));
    }
  };

  const handleAddZone = () => {
    const name = prompt("Enter Zone Name:", "Indirapuram Ghaziabad");
    if (name) {
      setZones([...zones, { id: Date.now(), zone: name, pincodes: '201014', fee: '₹15 (Free > ₹500)', eta: '10 Mins', status: 'ACTIVE' }]);
    }
  };

  const handleDeleteZone = (id) => {
    if (confirm("Delete delivery zone?")) {
      setZones(zones.filter(z => z.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          {[
            { id: 'riders', label: 'Delivery Partners (Riders)', icon: Bike },
            { id: 'zones', label: 'Zones & Pincodes', icon: MapPin },
            { id: 'slots', label: 'Delivery Slots', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition flex items-center gap-2 ${
                  activeSubTab === tab.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {activeSubTab === 'riders' && (
          <button onClick={() => setIsAddRiderOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs">
            <Plus size={16} /> Add Delivery Partner
          </button>
        )}

        {activeSubTab === 'zones' && (
          <button onClick={handleAddZone} className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs">
            <Plus size={16} /> Add Zone
          </button>
        )}
      </div>

      {activeSubTab === 'riders' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riders.map((r) => (
            <div key={r.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-800 font-bold rounded-2xl flex items-center justify-center text-lg">
                      🛵
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{r.name}</h4>
                      <span className="text-[11px] text-slate-500">{r.phone}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleRiderStatus(r.id)}
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded cursor-pointer ${r.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {r.active ? 'ONLINE' : 'OFFLINE'}
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs text-slate-700 mb-3 border border-slate-100">
                  <div className="flex justify-between"><span>Rating:</span> <strong className="text-amber-500">⭐ {r.rating} / 5.0</strong></div>
                  <div className="flex justify-between"><span>Completed Deliveries:</span> <strong className="text-slate-900">{r.completedCount} trips</strong></div>
                  <div className="flex justify-between"><span>Total Rider Earnings:</span> <strong className="text-emerald-700">₹{r.earnings.toLocaleString()}</strong></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck size={14} /> KYC Verified
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => alert(`Calling rider ${r.name}...`)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl">
                    <Phone size={14} />
                  </button>
                  <button onClick={() => handleDeleteRider(r.id)} className="p-2 bg-slate-100 hover:bg-slate-200 text-rose-600 rounded-xl">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activeSubTab === 'zones' ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Dark Store Delivery Radius & Pincodes</h3>
          <div className="space-y-3">
            {zones.map((z) => (
              <div key={z.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{z.zone}</h4>
                  <p className="text-slate-500 mt-0.5">Serviced Pincodes: {z.pincodes} • Delivery Fee: {z.fee}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-50 text-purple-700 font-extrabold text-[11px] px-3 py-1 rounded-xl border border-purple-200">
                    ⚡ {z.eta}
                  </span>
                  <button onClick={() => handleDeleteZone(z.id)} className="p-1.5 text-rose-600 hover:bg-slate-200 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Customer Delivery Slots Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs">
              <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase">Instant Express</span>
              <h4 className="font-black text-slate-900 text-base mt-2">⚡ 10-Minute Dark Store Dispatch</h4>
              <p className="text-slate-500 mt-1">Active 24/7 for all orders under 1.5 km radius</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs">
              <span className="bg-purple-100 text-purple-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase">Scheduled Slots</span>
              <h4 className="font-black text-slate-900 text-base mt-2">📅 Morning (7:00 AM - 9:00 AM) & Evening Slots</h4>
              <p className="text-slate-500 mt-1">Available for scheduled milk, bread & bulk grocery orders</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Rider Modal */}
      {isAddRiderOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsAddRiderOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Add Delivery Partner Rider</h3>
            <form onSubmit={handleAddRiderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Rider Full Name</label>
                <input type="text" required value={riderName} onChange={(e) => setRiderName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input type="text" required value={riderPhone} onChange={(e) => setRiderPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Onboard Delivery Partner</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
