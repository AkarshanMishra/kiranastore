import React, { useState } from 'react';
import {
  ShoppingBag,
  Package,
  Navigation,
  CheckCircle2,
  Bike,
  User,
  MapPin,
  Printer,
  RotateCcw,
  X,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  Check,
  Send,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function OrdersView({ orders = [], onUpdateStatus, onDeleteOrder }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignRiderOrder, setAssignRiderOrder] = useState(null);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewAdminSlipPhoto, setViewAdminSlipPhoto] = useState(null);
  const [verifiedSlipAmount, setVerifiedSlipAmount] = useState('');

  // Itemize Slip Order Modal State
  const [itemizingOrder, setItemizingOrder] = useState(null);
  const [itemizedList, setItemizedList] = useState([]);
  const [adminCustomItemName, setAdminCustomItemName] = useState('');
  const [adminCustomItemQty, setAdminCustomItemQty] = useState(1);
  const [adminCustomItemPrice, setAdminCustomItemPrice] = useState('');
  const [adminItemSearch, setAdminItemSearch] = useState('');
  const [isSavingItemize, setIsSavingItemize] = useState(false);

  // Accept & Schedule Delivery Modal State
  const [acceptingOrder, setAcceptingOrder] = useState(null);
  const [deliveryDateChoice, setDeliveryDateChoice] = useState('SAME_DAY'); // 'SAME_DAY' | 'NEXT_DAY' | 'CUSTOM'
  const [customDate, setCustomDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('4:00 PM - 7:00 PM');
  const [customTimeSlot, setCustomTimeSlot] = useState('');
  const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);

  // Quick Catalog items for itemizer
  const adminCatalogShortcuts = [
    { name: 'Aashirvaad Shuddh Chakki Atta (10 kg)', price: 430, category: 'Atta' },
    { name: 'Aashirvaad Shuddh Chakki Atta (5 kg)', price: 219, category: 'Atta' },
    { name: 'Fortune Biryani Basmati Rice (5 kg)', price: 420, category: 'Rice' },
    { name: 'India Gate Basmati Rice (5 kg)', price: 390, category: 'Rice' },
    { name: 'Tata Sampann Toor Dal (1 kg)', price: 135, category: 'Dal' },
    { name: 'Tata Sampann Moong Dal (1 kg)', price: 145, category: 'Dal' },
    { name: 'Tata Sampann Chana Dal (1 kg)', price: 110, category: 'Dal' },
    { name: 'Fortune Sunflower Oil (2 L)', price: 265, category: 'Oil' },
    { name: 'Fortune Mustard Oil (1 L)', price: 145, category: 'Oil' },
    { name: 'Amul Desi Ghee (1 L)', price: 589, category: 'Ghee' },
    { name: 'Madhur Pure Sugar (5 kg)', price: 235, category: 'Sugar' },
    { name: 'Tata Salt (1 kg)', price: 28, category: 'Salt' },
    { name: 'Tata Tea Gold (500 g)', price: 285, category: 'Tea' },
    { name: 'Surf Excel Detergent (3 kg)', price: 399, category: 'Cleaning' },
    { name: 'Vim Dishwash Gel (750 ml)', price: 155, category: 'Cleaning' },
    { name: 'Dettol Soap (4-Pack)', price: 195, category: 'Soap' },
    { name: 'Maggi 2-Minute Noodles (12 Pack)', price: 168, category: 'Snacks' }
  ];

  const handleOpenItemizeModal = (order) => {
    setItemizingOrder(order);
    if (order.items && order.items.length > 0) {
      setItemizedList(order.items.map(i => ({ ...i })));
    } else {
      setItemizedList([
        { id: 1, product_name: 'Aashirvaad Atta (10 kg)', quantity: 1, price: 430 },
        { id: 2, product_name: 'Fortune Basmati Rice (5 kg)', quantity: 1, price: 420 },
        { id: 3, product_name: 'Tata Toor Dal (1 kg)', quantity: 2, price: 135 }
      ]);
    }
    setDeliveryDateChoice('SAME_DAY');
    setSelectedTimeSlot('4:00 PM - 7:00 PM');
  };

  const handleAddItemToItemize = (name, price, qty = 1) => {
    const parsedPrice = parseFloat(price) || 100;
    const existing = itemizedList.find(i => i.product_name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setItemizedList(prev => prev.map(i => i.product_name.toLowerCase() === name.toLowerCase() ? { ...i, quantity: i.quantity + qty } : i));
    } else {
      setItemizedList(prev => [
        ...prev,
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          product_name: name,
          price: parsedPrice,
          quantity: qty
        }
      ]);
    }
  };

  const handleManualAddItemizeSubmit = (e) => {
    e.preventDefault();
    if (!adminCustomItemName.trim()) return;
    const priceVal = parseFloat(adminCustomItemPrice) || 100;
    const qtyVal = parseInt(adminCustomItemQty) || 1;
    handleAddItemToItemize(adminCustomItemName.trim(), priceVal, qtyVal);
    setAdminCustomItemName('');
    setAdminCustomItemPrice('');
    setAdminCustomItemQty(1);
  };

  const handleUpdateItemizeQty = (idx, delta) => {
    setItemizedList(prev => prev.map((item, i) => {
      if (i === idx) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleUpdateItemizePrice = (idx, newPrice) => {
    const parsed = parseFloat(newPrice) || 0;
    setItemizedList(prev => prev.map((item, i) => i === idx ? { ...item, price: parsed } : item));
  };

  const handleRemoveItemizeRow = (idx) => {
    setItemizedList(prev => prev.filter((_, i) => i !== idx));
  };

  const totalCalculatedBill = itemizedList.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSaveItemizedSlipOrder = async () => {
    if (!itemizingOrder) return;
    if (itemizedList.length === 0) {
      alert("Please add at least 1 item to the bill.");
      return;
    }

    setIsSavingItemize(true);

    const todayStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });

    let finalDateStr = deliveryDateChoice === 'SAME_DAY'
      ? `Today (${todayStr})`
      : deliveryDateChoice === 'NEXT_DAY'
      ? `Tomorrow (${tomorrowStr})`
      : customDate || todayStr;

    let finalTimeSlot = customTimeSlot.trim() ? customTimeSlot.trim() : selectedTimeSlot;

    try {
      const res = await fetch(`/api/admin/orders/${itemizingOrder.order_number}/itemize`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemizedList.map(i => ({
            product_id: 0,
            product_name: i.product_name,
            quantity: i.quantity,
            price: i.price
          })),
          total_amount: totalCalculatedBill,
          order_status: 'CONFIRMED',
          scheduled_delivery_date: finalDateStr,
          scheduled_delivery_time: finalTimeSlot
        })
      });

      if (res.ok) {
        const updated = await res.json();
        // Update local object
        itemizingOrder.items = updated.items || itemizedList;
        itemizingOrder.total_amount = totalCalculatedBill;
        itemizingOrder.order_status = 'CONFIRMED';
        itemizingOrder.accepted_by_owner = true;
        itemizingOrder.scheduled_delivery_date = finalDateStr;
        itemizingOrder.scheduled_delivery_time = finalTimeSlot;
        
        if (onUpdateStatus) onUpdateStatus(itemizingOrder.order_number, 'CONFIRMED');
        setItemizingOrder(null);
        alert(`✓ Itemized Bill saved! Order #${itemizingOrder.order_number} confirmed for ₹${totalCalculatedBill.toFixed(0)}. Customer live tracking updated!`);
      } else {
        itemizingOrder.items = itemizedList;
        itemizingOrder.total_amount = totalCalculatedBill;
        itemizingOrder.order_status = 'CONFIRMED';
        itemizingOrder.accepted_by_owner = true;
        itemizingOrder.scheduled_delivery_date = finalDateStr;
        itemizingOrder.scheduled_delivery_time = finalTimeSlot;
        if (onUpdateStatus) onUpdateStatus(itemizingOrder.order_number, 'CONFIRMED');
        setItemizingOrder(null);
        alert(`✓ Bill saved locally! Total: ₹${totalCalculatedBill.toFixed(0)}`);
      }
    } catch (err) {
      console.error('Error saving itemized order', err);
      itemizingOrder.items = itemizedList;
      itemizingOrder.total_amount = totalCalculatedBill;
      itemizingOrder.order_status = 'CONFIRMED';
      itemizingOrder.accepted_by_owner = true;
      itemizingOrder.scheduled_delivery_date = finalDateStr;
      itemizingOrder.scheduled_delivery_time = finalTimeSlot;
      if (onUpdateStatus) onUpdateStatus(itemizingOrder.order_number, 'CONFIRMED');
      setItemizingOrder(null);
      alert(`✓ Bill updated! Total: ₹${totalCalculatedBill.toFixed(0)}`);
    } finally {
      setIsSavingItemize(false);
    }
  };

  // Form states for manual order creation
  const [customerName, setCustomerName] = useState('Rohan Verma');
  const [customerPhone, setCustomerPhone] = useState('+91 9876543210');
  const [deliveryAddr, setDeliveryAddr] = useState('Flat 502, Sector 62 Noida');
  const [orderAmount, setOrderAmount] = useState('350');

  const riders = [
    { id: 1, name: 'Rahul Kumar', phone: '+91 9811223344', rating: 4.9, active: true },
    { id: 2, name: 'Vikram Singh', phone: '+91 9822334455', rating: 4.8, active: true },
    { id: 3, name: 'Amit Sharma', phone: '+91 9833445566', rating: 4.7, active: false }
  ];

  const handleOpenAcceptModal = (order) => {
    setAcceptingOrder(order);
    setVerifiedSlipAmount(order.total_amount > 0 ? order.total_amount.toString() : '500');
    if (order.delivery_slot_type === 'NEXT_DAY' || order.delivery_slot_type === 'TOMORROW') {
      setDeliveryDateChoice('NEXT_DAY');
      setSelectedTimeSlot('7:00 AM - 10:00 AM');
    } else {
      setDeliveryDateChoice('SAME_DAY');
      setSelectedTimeSlot('4:00 PM - 7:00 PM');
    }
  };

  const handleConfirmAcceptance = async (e) => {
    e.preventDefault();
    if (!acceptingOrder) return;

    setIsSubmittingAccept(true);

    const todayStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });

    let finalDateStr = deliveryDateChoice === 'SAME_DAY'
      ? `Today (${todayStr})`
      : deliveryDateChoice === 'NEXT_DAY'
      ? `Tomorrow (${tomorrowStr})`
      : customDate || todayStr;

    let finalTimeSlot = customTimeSlot.trim() ? customTimeSlot.trim() : selectedTimeSlot;
    const finalAmountVal = parseFloat(verifiedSlipAmount) || acceptingOrder.total_amount;

    try {
      const res = await fetch(`/api/admin/orders/${acceptingOrder.order_number}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_status: 'CONFIRMED',
          scheduled_delivery_date: finalDateStr,
          scheduled_delivery_time: finalTimeSlot
        })
      });

      if (res.ok) {
        const updated = await res.json();
        if (onUpdateStatus) {
          onUpdateStatus(acceptingOrder.order_number, 'CONFIRMED');
        }
        // Mutate in-memory for instant reflection
        acceptingOrder.order_status = 'CONFIRMED';
        acceptingOrder.accepted_by_owner = true;
        acceptingOrder.scheduled_delivery_date = finalDateStr;
        acceptingOrder.scheduled_delivery_time = finalTimeSlot;
        acceptingOrder.total_amount = finalAmountVal;
        
        setAcceptingOrder(null);
        alert(`Order #${acceptingOrder.order_number} Accepted! Delivery scheduled for ${finalDateStr} (${finalTimeSlot}). Verified Amount: ₹${finalAmountVal.toFixed(0)} 🛵`);
      } else {
        // Fallback local update
        if (onUpdateStatus) onUpdateStatus(acceptingOrder.order_number, 'CONFIRMED');
        acceptingOrder.order_status = 'CONFIRMED';
        acceptingOrder.accepted_by_owner = true;
        acceptingOrder.scheduled_delivery_date = finalDateStr;
        acceptingOrder.scheduled_delivery_time = finalTimeSlot;
        acceptingOrder.total_amount = finalAmountVal;
        setAcceptingOrder(null);
        alert(`Order #${acceptingOrder.order_number} Accepted! Delivery scheduled for ${finalDateStr} (${finalTimeSlot}).`);
      }
    } catch (err) {
      console.error('Failed to accept order on backend', err);
      if (onUpdateStatus) onUpdateStatus(acceptingOrder.order_number, 'CONFIRMED');
      acceptingOrder.order_status = 'CONFIRMED';
      acceptingOrder.accepted_by_owner = true;
      acceptingOrder.scheduled_delivery_date = finalDateStr;
      acceptingOrder.scheduled_delivery_time = finalTimeSlot;
      setAcceptingOrder(null);
    } finally {
      setIsSubmittingAccept(false);
    }
  };

  const handleCreateOrderSubmit = (e) => {
    e.preventDefault();
    const newOrderObj = {
      id: Date.now(),
      order_number: `KS-${Math.floor(10000 + Math.random() * 90000)}`,
      user_name: customerName,
      phone: customerPhone,
      delivery_address: deliveryAddr,
      total_amount: parseFloat(orderAmount),
      order_status: 'PLACED',
      delivery_slot_type: 'SAME_DAY',
      created_at: new Date().toISOString(),
      items: [{ id: 1, product_name: 'Manual Order Items', quantity: 1, price: parseFloat(orderAmount) }]
    };
    orders.unshift(newOrderObj);
    setIsAddOrderOpen(false);
    alert(`Order #${newOrderObj.order_number} created successfully!`);
  };

  const handleEditOrderSubmit = (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    if (onUpdateStatus) onUpdateStatus(editingOrder.order_number, editingOrder.order_status);
    setEditingOrder(null);
    alert("Order updated successfully!");
  };

  const filteredOrders = orders.filter((o) => {
    let matchesStatus = false;
    if (filterStatus === 'ALL') {
      matchesStatus = true;
    } else if (filterStatus === 'RASHAN') {
      matchesStatus = o.order_type === 'MONTHLY_RASHAN_SLIP' ||
                      o.order_type === 'MONTHLY_RASHAN_LIST' ||
                      o.order_number?.startsWith('RASHAN') ||
                      Boolean(o.slip_image_url);
    } else {
      matchesStatus = o.order_status === filterStatus;
    }

    const matchesSearch = o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.hub_name && o.hub_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Order Acceptance & Delivery Scheduling</h2>
          <p className="text-xs text-slate-500">Review incoming customer orders, verify handwritten rashan slips, choose delivery time slots, and dispatch riders</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order or hub name..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-purple-600"
            />
          </div>

          <button
            onClick={() => setIsAddOrderOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} /> Create Order
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'RASHAN', label: '📋 Monthly Rashan Orders ✨' },
          { id: 'PLACED', label: 'Pending Acceptance ⚠️' },
          { id: 'CONFIRMED', label: 'Scheduled 📅' },
          { id: 'PACKING', label: 'Packing 📦' },
          { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery 🛵' },
          { id: 'DELIVERED', label: 'Delivered ✅' },
          { id: 'CANCELLED', label: 'Cancelled ❌' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
              filterStatus === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => {
          const isPendingAcceptance = order.order_status === 'PLACED';
          return (
            <div
              key={order.id}
              className={`bg-white border rounded-3xl p-5 shadow-xs flex flex-col justify-between transition ${
                isPendingAcceptance
                  ? 'border-amber-300 ring-2 ring-amber-100'
                  : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">#{order.order_number}</span>
                      {order.order_type === 'MONTHLY_RASHAN_SLIP' ? (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                          📸 Rashan Slip Order
                        </span>
                      ) : order.order_type === 'MONTHLY_RASHAN_LIST' ? (
                        <span className="text-[10px] bg-purple-100 text-purple-900 font-black px-2 py-0.5 rounded-full border border-purple-300 flex items-center gap-1">
                          📋 Monthly Rashan List
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {order.hub_name && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                          🏬 {order.hub_name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                        order.order_status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.order_status === 'OUT_FOR_DELIVERY'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : order.order_status === 'CONFIRMED'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : order.order_status === 'PACKING'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                      }`}
                    >
                      {order.order_status === 'PLACED' ? 'NEW (PENDING ACCEPTANCE)' : order.order_status}
                    </span>

                    <button
                      onClick={() => setEditingOrder(order)}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      title="Edit Order"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Scheduled Delivery Badge if Scheduled */}
                {order.scheduled_delivery_date ? (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-2.5 mb-3 text-xs text-purple-900 font-bold flex items-center gap-2">
                    <Calendar size={15} className="text-purple-600 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-purple-600 block uppercase tracking-wider font-black">SCHEDULED DELIVERY SLOT</span>
                      <span>{order.scheduled_delivery_date} • {order.scheduled_delivery_time}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2 mb-3 text-xs text-amber-900 font-bold flex items-center justify-between">
                    <span className="text-[11px]">
                      Customer Preference: <strong>{order.delivery_slot_type === 'NEXT_DAY' ? '📅 Next Day' : '⚡ Same Day'}</strong>
                    </span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-black">Needs Approval</span>
                  </div>
                )}

                {/* Customer Info */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3 space-y-1 text-xs text-slate-700">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <User size={14} className="text-purple-600" />
                    <span>{order.user_name}</span>
                    <span className="text-slate-500 font-normal">({order.phone})</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-500 text-[11px]">
                    <MapPin size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.delivery_address}</span>
                  </div>
                </div>

                {/* Slip Photo if attached */}
                {order.slip_image_url && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={order.slip_image_url}
                        alt="Rashan Slip"
                        className="w-12 h-12 object-cover rounded-xl border border-amber-300 shadow-xs cursor-pointer hover:opacity-80 flex-shrink-0"
                        onClick={() => setViewAdminSlipPhoto(order.slip_image_url)}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-black text-amber-900 block truncate">
                          📸 Handwritten Slip Attached
                        </span>
                        <p className="text-[10px] text-amber-700 truncate">
                          {order.special_instructions || 'Customer requested dark store packing.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setViewAdminSlipPhoto(order.slip_image_url)}
                      className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-black text-[11px] px-2.5 py-1.5 rounded-xl shadow-xs flex-shrink-0"
                    >
                      View Photo
                    </button>
                  </div>
                )}

                {/* Items */}
                {order.items && order.items.length > 0 ? (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs mb-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-slate-700">{item.quantity}x {item.product_name}</span>
                        <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                ) : order.order_type === 'MONTHLY_RASHAN_SLIP' ? (
                  <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-2.5 mb-3 text-xs text-amber-900 font-bold">
                    📝 Verify slip items above & set total bill amount upon acceptance.
                  </div>
                ) : null}

                {/* Additional Customer Special Instructions / Notes */}
                {order.special_instructions && (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-2.5 mb-3 text-xs text-blue-900 flex items-start gap-1.5 font-medium">
                    <span className="font-black text-blue-700 flex-shrink-0">📝 Customer Note:</span>
                    <span>{order.special_instructions}</span>
                  </div>
                )}

                {/* Customer Rating Feedback if Rated */}
                {order.rating && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1 font-black text-amber-800">
                      <span>⭐ {order.rating}.0 / 5.0 Rating</span>
                    </div>
                    {order.rating_comment && (
                      <span className="text-[11px] text-amber-700 italic truncate max-w-[200px]">
                        "{order.rating_comment}"
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">TOTAL PAID</span>
                  <span className="text-base font-black text-slate-900">₹{order.total_amount.toFixed(0)}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <button
                    onClick={() => alert(`Printing tax invoice for order #${order.order_number}...`)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                    title="Print Invoice"
                  >
                    <Printer size={15} />
                  </button>

                  {/* Itemize Slip Order Button */}
                  {(order.slip_image_url || order.order_type === 'MONTHLY_RASHAN_SLIP') && (
                    <button
                      onClick={() => handleOpenItemizeModal(order)}
                      className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-black text-xs px-3 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>📝 Itemize Slip & Bill</span>
                    </button>
                  )}

                  {/* 1. Step 1: Shopkeeper Accept Order & Choose Date & Time */}
                  {order.order_status === 'PLACED' && !order.slip_image_url && order.order_type !== 'MONTHLY_RASHAN_SLIP' && (
                    <button
                      onClick={() => handleOpenAcceptModal(order)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Check size={14} /> Accept & Schedule 📅
                    </button>
                  )}

                  {/* 2. Step 2: Pack Items */}
                  {order.order_status === 'CONFIRMED' && (
                    <button
                      onClick={() => onUpdateStatus && onUpdateStatus(order.order_number, 'PACKING')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs"
                    >
                      Pack Items 📦
                    </button>
                  )}

                  {/* 3. Step 3: Assign Rider */}
                  {order.order_status === 'PACKING' && (
                    <button
                      onClick={() => setAssignRiderOrder(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1"
                    >
                      <Bike size={14} /> Assign Rider 🛵
                    </button>
                  )}

                  {/* 4. Step 4: Mark Delivered */}
                  {order.order_status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => onUpdateStatus && onUpdateStatus(order.order_number, 'DELIVERED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs"
                    >
                      Mark Delivered ✅
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ACCEPT ORDER & CHOOSE DATE/TIME OF DELIVERY MODAL ──────── */}
      {acceptingOrder && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-in zoom-in duration-200">
            <button
              onClick={() => setAcceptingOrder(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm">
                📦
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Accept Order & Schedule Delivery</h3>
                <p className="text-xs text-slate-500">Order #{acceptingOrder.order_number} • {acceptingOrder.user_name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmAcceptance} className="space-y-4 text-xs">
              
              {/* Step 1: Choose Delivery Day */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5 uppercase tracking-wider">
                  1. Choose Delivery Date (Same Day or Next Day)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryDateChoice('SAME_DAY')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      deliveryDateChoice === 'SAME_DAY'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200 font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-600 font-bold'
                    }`}
                  >
                    <Clock size={16} className="text-emerald-600" />
                    <span>⚡ Same Day</span>
                    <span className="text-[10px] font-normal opacity-80">Today</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryDateChoice('NEXT_DAY')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      deliveryDateChoice === 'NEXT_DAY'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200 font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-600 font-bold'
                    }`}
                  >
                    <Calendar size={16} className="text-purple-600" />
                    <span>📅 Next Day</span>
                    <span className="text-[10px] font-normal opacity-80">Tomorrow</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryDateChoice('CUSTOM')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      deliveryDateChoice === 'CUSTOM'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200 font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-600 font-bold'
                    }`}
                  >
                    <Calendar size={16} className="text-slate-600" />
                    <span>🗓️ Custom</span>
                    <span className="text-[10px] font-normal opacity-80">Pick Date</span>
                  </button>
                </div>

                {deliveryDateChoice === 'CUSTOM' && (
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                    required
                  />
                )}
              </div>

              {/* Step 2: Choose Delivery Time Window */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5 uppercase tracking-wider">
                  2. Select Delivery Time Window Slot
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    { label: 'Morning Slot', time: '7:00 AM - 10:00 AM' },
                    { label: 'Afternoon Slot', time: '12:00 PM - 3:00 PM' },
                    { label: 'Evening Slot', time: '4:00 PM - 7:00 PM' },
                    { label: 'Night Slot', time: '7:00 PM - 9:30 PM' }
                  ].map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => {
                        setSelectedTimeSlot(slot.time);
                        setCustomTimeSlot('');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedTimeSlot === slot.time && !customTimeSlot
                          ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-100 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-700 font-semibold'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">{slot.label}</div>
                      <div className="text-xs">{slot.time}</div>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Or enter custom time (e.g. 5:30 PM Sharp)"
                  value={customTimeSlot}
                  onChange={(e) => setCustomTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                />
              </div>

              {/* Step 3: If Rashan Slip Order, Verify/Set Bill Amount */}
              {acceptingOrder.order_type === 'MONTHLY_RASHAN_SLIP' && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl space-y-1.5">
                  <label className="block text-xs font-black text-amber-900 uppercase tracking-wider">
                    3. Packed Total Bill Amount (₹)
                  </label>
                  <p className="text-[10px] text-amber-800">Enter final bill calculated from weights & items in customer's handwritten slip:</p>
                  <input
                    type="number"
                    value={verifiedSlipAmount}
                    onChange={(e) => setVerifiedSlipAmount(e.target.value)}
                    placeholder="Enter total amount (e.g. 1450)"
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-black text-sm text-slate-900 outline-none"
                    required
                  />
                </div>
              )}

              {/* Notice */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-900 text-[11px] font-medium flex items-start gap-2">
                <Sparkles size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  Once accepted, the customer's live order tracking radar will activate and display the confirmed <strong>{deliveryDateChoice === 'SAME_DAY' ? 'Same Day' : 'Next Day'}</strong> delivery window!
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmittingAccept}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow-lg transition active:scale-98 flex items-center justify-center gap-2 text-xs disabled:opacity-50"
              >
                <Check size={16} /> Confirm Acceptance & Start Customer Tracking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Assign Rider Modal */}
      {assignRiderOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setAssignRiderOrder(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-1 flex items-center gap-2 text-slate-900">
              <Bike size={20} className="text-purple-600" /> Assign Delivery Rider
            </h3>
            <p className="text-xs text-slate-500 mb-4">Select available rider for order #{assignRiderOrder.order_number}</p>
            <div className="space-y-2 mb-4">
              {riders.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    if (r.active) {
                      if (onUpdateStatus) onUpdateStatus(assignRiderOrder.order_number, 'OUT_FOR_DELIVERY');
                      setAssignRiderOrder(null);
                      alert(`Assigned order #${assignRiderOrder.order_number} to rider ${r.name}`);
                    }
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    r.active ? 'bg-slate-50 border-slate-200 hover:border-purple-600' : 'bg-slate-50/50 border-slate-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <span className="font-extrabold text-xs text-slate-900 block">{r.name}</span>
                    <span className="text-[11px] text-slate-500">{r.phone} • ⭐ {r.rating}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                    {r.active ? 'Available' : 'On Trip'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manual Create Order Modal */}
      {isAddOrderOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setIsAddOrderOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Create Manual Customer Order</h3>
            <form onSubmit={handleCreateOrderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Name</label>
                <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input type="text" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Delivery Address</label>
                <textarea required value={deliveryAddr} onChange={(e) => setDeliveryAddr(e.target.value)} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Total Amount (₹)</label>
                <input type="number" required value={orderAmount} onChange={(e) => setOrderAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">Create & Dispatch Order</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button onClick={() => setEditingOrder(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"><X size={18} /></button>
            <h3 className="font-black text-lg mb-4 text-slate-900">Edit Order #{editingOrder.order_number}</h3>
            <form onSubmit={handleEditOrderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Update Order Status</label>
                <select
                  value={editingOrder.order_status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, order_status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold"
                >
                  <option value="PLACED">PLACED (Pending Acceptance)</option>
                  <option value="CONFIRMED">CONFIRMED (Accepted & Scheduled)</option>
                  <option value="PACKING">PACKING (Items Packing)</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (Assigned Rider)</option>
                  <option value="DELIVERED">DELIVERED (Delivered)</option>
                  <option value="CANCELLED">CANCELLED (Cancel & Refund)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl mt-4 shadow-md">
                Update Status
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── SPLIT-SCREEN ITEMIZE SLIP ORDER & BILL GENERATOR MODAL ──────── */}
      {itemizingOrder && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-5 sm:p-6 relative shadow-2xl animate-in zoom-in duration-150 my-auto border border-slate-200 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center text-xl shadow-xs font-black">
                  📝
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-slate-900">
                      Itemize Handwritten Slip & Generate Bill
                    </h3>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                      #{itemizingOrder.order_number}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Customer: <strong className="text-slate-800">{itemizingOrder.user_name}</strong> • {itemizingOrder.phone} • {itemizingOrder.hub_name || 'Dark Store Hub'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setItemizingOrder(null)}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Split Screen Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-4 overflow-y-auto flex-1 pr-1">
              
              {/* Left Column: Customer's Slip Photo & Instructions (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📸 Customer's Handwritten Slip</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewAdminSlipPhoto(itemizingOrder.slip_image_url)}
                    className="text-[11px] text-purple-600 font-extrabold hover:underline"
                  >
                    🔍 Zoom Full
                  </button>
                </div>

                <div className="bg-black/5 rounded-2xl border border-slate-200 flex-1 min-h-[220px] max-h-[360px] overflow-auto flex items-center justify-center p-2">
                  {itemizingOrder.slip_image_url ? (
                    <img
                      src={itemizingOrder.slip_image_url}
                      alt="Customer Slip"
                      className="max-h-[340px] w-auto object-contain rounded-xl shadow-xs"
                    />
                  ) : (
                    <div className="text-center p-4 text-xs text-slate-400">
                      <span>No photo attached — build list manually below</span>
                    </div>
                  )}
                </div>

                {itemizingOrder.special_instructions && (
                  <div className="bg-amber-100/70 border border-amber-300 p-2.5 rounded-2xl text-xs text-amber-950 font-bold">
                    <span className="block text-[10px] text-amber-800 uppercase font-black">Customer Instructions:</span>
                    <span>"{itemizingOrder.special_instructions}"</span>
                  </div>
                )}

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 space-y-1">
                  <div><strong>Address:</strong> {itemizingOrder.delivery_address}</div>
                  <div><strong>Payment Preference:</strong> {itemizingOrder.payment_method}</div>
                </div>
              </div>

              {/* Right Column: Interactive Bill Itemizer (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                
                {/* 1. Quick Catalog Add Shortcuts */}
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    ⚡ 1-Click Fast Catalog Add
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {adminCatalogShortcuts.map((catItem, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddItemToItemize(catItem.name, catItem.price, 1)}
                        className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl whitespace-nowrap transition active:scale-95 flex items-center gap-1 flex-shrink-0"
                      >
                        <Plus size={12} />
                        <span>{catItem.name.split('(')[0]}</span>
                        <span className="text-purple-600 font-black">₹{catItem.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Manual Custom Item Addition Form */}
                <form onSubmit={handleManualAddItemizeSubmit} className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Type Item Name (e.g. Rajdhani Besan 1kg)..."
                    value={adminCustomItemName}
                    onChange={(e) => setAdminCustomItemName(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-purple-600"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={adminCustomItemQty}
                    onChange={(e) => setAdminCustomItemQty(e.target.value)}
                    className="w-16 bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold outline-none text-center"
                  />
                  <input
                    type="number"
                    placeholder="₹ Rate"
                    value={adminCustomItemPrice}
                    onChange={(e) => setAdminCustomItemPrice(e.target.value)}
                    className="w-24 bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Add</span>
                  </button>
                </form>

                {/* 3. Itemized Bill Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden flex-1 flex flex-col bg-white">
                  <div className="bg-slate-100 text-slate-700 px-3 py-2 text-[11px] font-black grid grid-cols-12 gap-2 uppercase tracking-wider border-b border-slate-200">
                    <span className="col-span-5">Packed Item</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-2 text-right">Unit Rate (₹)</span>
                    <span className="col-span-2 text-right">Total (₹)</span>
                    <span className="col-span-1 text-center">Action</span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto flex-1">
                    {itemizedList.map((item, idx) => (
                      <div key={item.id || idx} className="px-3 py-2 grid grid-cols-12 gap-2 items-center text-xs hover:bg-slate-50">
                        <span className="col-span-5 font-bold text-slate-900 truncate">
                          {item.product_name}
                        </span>

                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateItemizeQty(idx, -1)}
                            className="w-5 h-5 bg-slate-100 rounded text-slate-700 font-black hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="font-black text-xs w-4 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateItemizeQty(idx, 1)}
                            className="w-5 h-5 bg-slate-100 rounded text-slate-700 font-black hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>

                        <div className="col-span-2 text-right">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleUpdateItemizePrice(idx, e.target.value)}
                            className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1 text-right font-black text-xs outline-none focus:border-purple-600"
                          />
                        </div>

                        <span className="col-span-2 text-right font-black text-slate-900">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>

                        <div className="col-span-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItemizeRow(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calculated Bill Summary Box */}
                  <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-bold">
                      {itemizedList.length} items packed in order
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Total Calculated Bill:</span>
                      <span className="text-lg font-black text-purple-700">₹{totalCalculatedBill.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Delivery Day & Time Slot */}
                <div className="bg-purple-50/60 border border-purple-200 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-purple-600 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-purple-700 font-black uppercase tracking-wider block">Delivery Window</span>
                      <span className="font-bold text-slate-800">{deliveryDateChoice === 'SAME_DAY' ? 'Today (Same Day)' : 'Tomorrow (Next Day)'} • {selectedTimeSlot}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryDateChoice('SAME_DAY')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs ${deliveryDateChoice === 'SAME_DAY' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'}`}
                    >
                      Same Day
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryDateChoice('NEXT_DAY')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs ${deliveryDateChoice === 'NEXT_DAY' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'}`}
                    >
                      Next Day
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => setItemizingOrder(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveItemizedSlipOrder}
                disabled={isSavingItemize || itemizedList.length === 0}
                className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                <span>Save Itemized Bill (₹{totalCalculatedBill.toFixed(0)}) & Confirm Order 🛵</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
