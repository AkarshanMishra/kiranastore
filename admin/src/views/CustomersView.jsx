import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, ShieldAlert, CheckCircle2, UserX, UserCheck, MapPin, Plus, Trash2, Edit2, X, RefreshCw, Sparkles, Phone, Mail } from 'lucide-react';

export default function CustomersView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [addressInput, setAddressInput] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error('Error fetching customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !phoneInput.trim()) {
      alert("Please provide at least customer name and phone number.");
      return;
    }

    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput.trim(),
          phone: phoneInput.trim(),
          email: emailInput.trim() || `${phoneInput.replace(/\D/g, '')}@kiranastore.com`,
          address: addressInput.trim() || 'Sector 62, Noida',
          wallet_balance: 100.0
        })
      });

      if (res.ok) {
        const created = await res.json();
        setCustomers(prev => [created, ...prev.filter(c => c.id !== created.id)]);
        setNameInput('');
        setPhoneInput('');
        setEmailInput('');
        setAddressInput('');
        setIsAddCustomerOpen(false);
        alert(`✓ Customer "${created.name}" registered successfully in database!`);
      }
    } catch (err) {
      console.error('Error adding customer', err);
    }
  };

  const handleEditCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      const res = await fetch(`/api/admin/customers/${editingCustomer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingCustomer.name,
          phone: editingCustomer.phone,
          email: editingCustomer.email,
          address: editingCustomer.address,
          status: editingCustomer.status
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
        setEditingCustomer(null);
        alert("✓ Customer details updated!");
      }
    } catch (err) {
      console.error('Error updating customer', err);
    }
  };

  const handleToggleBlock = async (c) => {
    const newStatus = c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/customers/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        setCustomers(prev => prev.map(item => item.id === c.id ? updated : item));
      }
    } catch (err) {
      console.error('Error toggling status', err);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!confirm("Are you sure you want to delete this customer profile from database?")) return;
    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Error deleting customer', err);
    }
  };

  const filtered = customers.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery) ||
    (c.address || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Customer Database & Lifetime Value</h2>
          <p className="text-xs text-slate-500">View registered shoppers, total spending & block/unblock controls</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer name/phone..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-purple-600"
            />
          </div>

          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={15} /> Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Default Address</th>
                <th className="p-3.5">Orders</th>
                <th className="p-3.5">Lifetime Value (CLV)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                      {c.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{c.email}</div>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-700 font-medium">{c.phone}</td>
                  <td className="p-3.5 text-slate-500">{c.address || 'Sector 62, Noida'}</td>
                  <td className="p-3.5 font-bold text-slate-900">{c.total_orders ?? c.ordersCount ?? 0} orders</td>
                  <td className="p-3.5 font-black text-emerald-600">₹{(c.total_spent ?? 0).toLocaleString()}</td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded ${
                      c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {c.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => setEditingCustomer(c)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-purple-700 rounded-lg"
                      title="Edit Customer"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleToggleBlock(c)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                        c.status === 'ACTIVE'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {c.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(c.id)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-rose-600 rounded-lg"
                      title="Delete Customer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsAddCustomerOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Add New Customer Profile</h3>
            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Full Name</label>
                <input type="text" required value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input type="text" required value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Delivery Address</label>
                <input type="text" value={addressInput} onChange={(e) => setAddressInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Save Customer Profile</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setEditingCustomer(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Edit Customer: {editingCustomer.name}</h3>
            <form onSubmit={handleEditCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Full Name</label>
                <input type="text" value={editingCustomer.name} onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone</label>
                <input type="text" value={editingCustomer.phone} onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Delivery Address</label>
                <input type="text" value={editingCustomer.address} onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
