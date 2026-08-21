import React, { useState } from 'react';
import { Truck, Plus, Edit2, Trash2, Search, CheckCircle2, Phone, Mail, FileText, ArrowRight, DollarSign, X } from 'lucide-react';

export default function SuppliersView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers' | 'purchase_orders'
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isCreatePoOpen, setIsCreatePoOpen] = useState(false);

  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'Amul Dairy Distributors Ltd',
      contactPerson: 'Ramesh Patel',
      phone: '+91 9811002233',
      email: 'orders@amuldist.in',
      gstin: '07AAACA9812A1Z4',
      categories: 'Milk, Curd, Butter, Cheese, Ghee',
      paymentTerms: 'Net 15 Days',
      pendingAmount: 18450,
      status: 'ACTIVE'
    },
    {
      id: 2,
      name: 'ITC Foods Wholesale Hub',
      contactPerson: 'Sunil Sen',
      phone: '+91 9822113344',
      email: 'orders.delhi@itcwholesale.com',
      gstin: '07AAACI1289K1Z2',
      categories: 'Aashirvaad Atta, Sunfeast, Bingo',
      paymentTerms: 'Net 30 Days',
      pendingAmount: 32000,
      status: 'ACTIVE'
    },
    {
      id: 3,
      name: 'Mother Dairy Fruit & Veg Mandi',
      contactPerson: 'Harish Varma',
      phone: '+91 9833224455',
      email: 'mandi.procure@motherdairy.com',
      gstin: '07AAACM3401M1Z8',
      categories: 'Fresh Fruits, Onions, Potatoes, Greens',
      paymentTerms: 'Immediate / COD',
      pendingAmount: 4200,
      status: 'ACTIVE'
    }
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: 'PO-8041', supplier: 'Amul Dairy Distributors Ltd', items: '200x Milk 500ml, 50x Butter 100g, 40x Paneer', amount: 14200, status: 'RECEIVED', date: '20 Aug 2026' },
    { id: 'PO-8040', supplier: 'ITC Foods Wholesale Hub', items: '100x Aashirvaad Atta 5kg, 80x Sunfeast Biscuits', amount: 28900, status: 'PENDING_DELIVERY', date: '19 Aug 2026' },
    { id: 'PO-8039', supplier: 'Mother Dairy Fruit & Veg Mandi', items: '50kg Tomatoes, 80kg Potatoes, 40kg Onions', amount: 5600, status: 'RECEIVED', date: '18 Aug 2026' }
  ]);

  // Form states
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supGstin, setSupGstin] = useState('');
  const [supTerms, setSupTerms] = useState('Net 15 Days');

  const handleAddSupplier = (e) => {
    e.preventDefault();
    const newS = {
      id: Date.now(),
      name: supName,
      contactPerson: supContact,
      phone: supPhone,
      email: supEmail,
      gstin: supGstin.toUpperCase(),
      categories: 'General FMCG Goods',
      paymentTerms: supTerms,
      pendingAmount: 0,
      status: 'ACTIVE'
    };
    setSuppliers([newS, ...suppliers]);
    setIsAddSupplierOpen(false);
    setSupName('');
    setSupPhone('');
    alert(`Supplier "${supName}" registered successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Purchase & Supplier Management</h2>
          <p className="text-xs text-slate-500">Manage FMCG suppliers, purchase orders (PO), vendor GST invoices & inventory restock</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreatePoOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} /> Create Purchase Order (PO)
          </button>
          <button
            onClick={() => setIsAddSupplierOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} /> Add Supplier
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition ${
            activeTab === 'suppliers' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Registered Suppliers ({suppliers.length})
        </button>
        <button
          onClick={() => setActiveTab('purchase_orders')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition ${
            activeTab === 'purchase_orders' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Purchase Orders & Invoices ({purchaseOrders.length})
        </button>
      </div>

      {/* View: Suppliers List */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-purple-50 text-purple-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                    {s.paymentTerms}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-200">
                    {s.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900">{s.name}</h3>
                <span className="text-[10px] font-mono text-slate-400 block mb-2">GSTIN: {s.gstin}</span>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs text-slate-700 mb-3">
                  <div className="flex justify-between"><span>Contact:</span> <strong>{s.contactPerson}</strong></div>
                  <div className="flex justify-between"><span>Phone:</span> <strong className="text-purple-700">{s.phone}</strong></div>
                  <div className="flex justify-between"><span>Supplies:</span> <span className="truncate max-w-[130px] font-medium">{s.categories}</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">PAYABLE DUE</span>
                  <span className="text-xs font-black text-rose-600">₹{s.pendingAmount.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => alert(`Creating Purchase Order for ${s.name}...`)}
                  className="bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-extrabold text-xs px-3 py-1.5 rounded-xl transition"
                >
                  Order Stock →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View: Purchase Orders List */}
      {activeTab === 'purchase_orders' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-black text-sm text-slate-900">Recent Purchase Invoices & Stock Inward</h3>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-slate-900">{po.id}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      po.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {po.status}
                    </span>
                    <span className="text-slate-400 text-[11px]">• {po.date}</span>
                  </div>
                  <div className="font-bold text-slate-800">{po.supplier}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{po.items}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold">TOTAL COST</span>
                    <span className="font-black text-slate-900 text-sm">₹{po.amount.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading PO invoice PDF for ${po.id}`)}
                    className="bg-purple-50 text-purple-700 font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-purple-100"
                  >
                    View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsAddSupplierOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Add FMCG Vendor / Supplier</h3>
            <form onSubmit={handleAddSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company / Supplier Name</label>
                <input type="text" required value={supName} onChange={(e) => setSupName(e.target.value)} placeholder="e.g. Parle Agro Wholesale" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Person Name</label>
                <input type="text" required value={supContact} onChange={(e) => setSupContact(e.target.value)} placeholder="e.g. Anil Gupta" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input type="text" required value={supPhone} onChange={(e) => setSupPhone(e.target.value)} placeholder="+91 98..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">GSTIN Number</label>
                  <input type="text" required value={supGstin} onChange={(e) => setSupGstin(e.target.value)} placeholder="07AAA..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono uppercase font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Credit Terms</label>
                <select value={supTerms} onChange={(e) => setSupTerms(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold">
                  <option>Net 7 Days</option>
                  <option>Net 15 Days</option>
                  <option>Net 30 Days</option>
                  <option>Immediate / COD</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Save Supplier</button>
            </form>
          </div>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {isCreatePoOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsCreatePoOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Create Purchase Order (PO)</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert("Purchase order generated and sent to vendor email!");
              setIsCreatePoOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Supplier</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold">
                  {suppliers.map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">SKU Items & Quantities to Order</label>
                <textarea rows={3} placeholder="e.g. 100x Amul Milk 500ml, 50x Aashirvaad Atta 5kg" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium" required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Expected Delivery Date</label>
                <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold" required />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Issue Purchase Order</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
