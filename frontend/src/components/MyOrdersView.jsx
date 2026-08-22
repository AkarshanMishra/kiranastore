import React, { useState, useEffect } from 'react';
import {
  Package,
  RefreshCw,
  FileText,
  Star,
  X,
  Check,
  ArrowRight,
  Download,
  Printer,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Send,
  ThumbsUp,
  AlertCircle,
  RotateCcw,
  Ban,
  HelpCircle,
  Clock,
  ChevronRight,
  Plus,
  ShoppingBag,
  Info
} from 'lucide-react';
import { fetchApi } from '../apiClient';

export default function MyOrdersView({ user, onSelectTrackOrder, onReorder, addToCart, onOpenSupport }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'DELIVERED' | 'BUY_AGAIN' | 'CANCELLED' | 'REFUNDED'

  // Modals
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedRatingOrder, setSelectedRatingOrder] = useState(null);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
  const [selectedDetailsOrder, setSelectedDetailsOrder] = useState(null);
  const [viewSlipPhotoUrl, setViewSlipPhotoUrl] = useState(null);

  // Rating State
  const [userRating, setUserRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [ratedOrders, setRatedOrders] = useState({});

  // Cancel & Return Forms
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [returnReason, setReturnReason] = useState('Damaged Product');
  const [refundMode, setRefundMode] = useState('WALLET');
  const [returnSuccess, setReturnSuccess] = useState(false);

  const fetchUserOrders = async () => {
    setLoading(true);
    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('kirana_orders_list') || '[]');
    } catch {}

    try {
      const activePhone = user?.phone || (() => {
        try {
          const saved = localStorage.getItem('kirana_customer_user');
          return saved ? JSON.parse(saved)?.phone : null;
        } catch {
          return null;
        }
      })();

      const phoneParam = activePhone ? `?phone=${encodeURIComponent(activePhone.replace(/\D/g, '').slice(-10))}` : '';
      const res = await fetchApi(`/api/orders${phoneParam}`);
      if (res.ok) {
        const serverOrders = await res.json();
        if (Array.isArray(serverOrders)) {
          // Merge local cache and server orders
          const map = new Map();
          localOrders.forEach(o => { if (o && o.order_number) map.set(o.order_number, o); });
          serverOrders.forEach(o => { if (o && o.order_number) map.set(o.order_number, o); });
          const merged = Array.from(map.values()).sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));
          setOrders(merged);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Could not fetch server orders, displaying local orders:', err);
    }
    setOrders(localOrders);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserOrders();
    const handleOrderPlaced = () => fetchUserOrders();
    const handleUrlChange = () => fetchUserOrders();
    window.addEventListener('order_placed', handleOrderPlaced);
    window.addEventListener('api_base_url_changed', handleUrlChange);
    return () => {
      window.removeEventListener('order_placed', handleOrderPlaced);
      window.removeEventListener('api_base_url_changed', handleUrlChange);
    };
  }, [user]);

  // Filter Orders based on active Tab
  const filteredOrders = orders.filter((o) => {
    const status = o.order_status?.toUpperCase() || 'PLACED';
    if (activeTab === 'ACTIVE') return status !== 'DELIVERED' && status !== 'CANCELLED' && status !== 'RETURNED';
    if (activeTab === 'DELIVERED') return status === 'DELIVERED';
    if (activeTab === 'CANCELLED') return status === 'CANCELLED';
    if (activeTab === 'REFUNDED') return status === 'RETURNED' || status === 'REFUNDED';
    return true;
  });

  // Extract all previous unique purchases for Buy Again tab
  const previousPurchases = [];
  const seenProductIds = new Set();
  orders.forEach((ord) => {
    ord.items?.forEach((item) => {
      if (!seenProductIds.has(item.product_id || item.id)) {
        seenProductIds.add(item.product_id || item.id);
        previousPurchases.push({
          id: item.product_id || item.id,
          name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80',
          lastOrderedDate: new Date(ord.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
        });
      }
    });
  });

  // Submit Rating to Backend
  const handleRateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRatingOrder) return;
    const orderIdentifier = selectedRatingOrder.id || selectedRatingOrder.order_number;

    // Update local rated orders
    setRatedOrders((prev) => ({
      ...prev,
      [orderIdentifier]: {
        rating: userRating,
        comment: ratingComment || 'Excellent quality and on-time store delivery!'
      }
    }));

    // Update cached orders list in localStorage
    try {
      const cached = JSON.parse(localStorage.getItem('kirana_orders_list') || '[]');
      const updated = cached.map((o) =>
        (o.id === selectedRatingOrder.id || o.order_number === selectedRatingOrder.order_number)
          ? { ...o, rating: userRating, rating_comment: ratingComment }
          : o
      );
      localStorage.setItem('kirana_orders_list', JSON.stringify(updated));
    } catch {}

    // Send to backend API
    try {
      await fetchApi(`/api/orders/${orderIdentifier}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: userRating,
          comment: ratingComment || 'Excellent store delivery and product quality.'
        })
      });
    } catch (err) {
      console.warn('Could not post rating to API:', err);
    }

    setRatingSuccess(true);
    setTimeout(() => {
      setRatingSuccess(false);
      setSelectedRatingOrder(null);
      setRatingComment('');
      fetchUserOrders();
    }, 1000);
  };

  // Submit Cancel Order
  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCancelOrder) return;
    const orderIdentifier = selectedCancelOrder.id || selectedCancelOrder.order_number;

    setOrders((prev) =>
      prev.map((o) => (o.id === selectedCancelOrder.id ? { ...o, order_status: 'CANCELLED' } : o))
    );

    // Update local cache
    try {
      const cached = JSON.parse(localStorage.getItem('kirana_orders_list') || '[]');
      const updated = cached.map((o) =>
        (o.id === selectedCancelOrder.id || o.order_number === selectedCancelOrder.order_number)
          ? { ...o, order_status: 'CANCELLED' }
          : o
      );
      localStorage.setItem('kirana_orders_list', JSON.stringify(updated));
    } catch {}

    try {
      await fetchApi(`/api/orders/${orderIdentifier}/cancel`, { method: 'POST' });
    } catch (err) {
      console.warn('Could not cancel on backend:', err);
    }

    setCancelSuccess(true);
    setTimeout(() => {
      setCancelSuccess(false);
      setSelectedCancelOrder(null);
      fetchUserOrders();
    }, 900);
  };

  // Submit Return / Refund Request
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReturnOrder) return;
    const orderIdentifier = selectedReturnOrder.id || selectedReturnOrder.order_number;

    setOrders((prev) =>
      prev.map((o) => (o.id === selectedReturnOrder.id ? { ...o, order_status: 'REFUNDED' } : o))
    );

    // Update local cache
    try {
      const cached = JSON.parse(localStorage.getItem('kirana_orders_list') || '[]');
      const updated = cached.map((o) =>
        (o.id === selectedReturnOrder.id || o.order_number === selectedReturnOrder.order_number)
          ? { ...o, order_status: 'REFUNDED' }
          : o
      );
      localStorage.setItem('kirana_orders_list', JSON.stringify(updated));
    } catch {}

    try {
      await fetchApi(`/api/orders/${orderIdentifier}/refund`, { method: 'POST' });
    } catch (err) {
      console.warn('Could not process refund on backend:', err);
    }

    setReturnSuccess(true);
    setTimeout(() => {
      setReturnSuccess(false);
      setSelectedReturnOrder(null);
      fetchUserOrders();
    }, 900);
  };

  // Individual Product Reorder
  const handleReorderSingleItem = (item) => {
    if (addToCart) {
      addToCart({
        id: item.product_id || item.id,
        name: item.product_name || item.name,
        price: item.price,
        image_url: item.image_url
      });
      alert(`Added ${item.product_name || item.name} to basket! 🛍️`);
    }
  };

  // GST Tax Invoice PDF & Print Generator
  const handleDownloadInvoicePdf = (order) => {
    const cgst = (order.total_amount * 0.025).toFixed(2);
    const sgst = (order.total_amount * 0.025).toFixed(2);
    const taxableValue = (order.total_amount - order.total_amount * 0.05).toFixed(2);

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>GST Tax Invoice - ${order.order_number}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
          .invoice-box { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #7c3aed; padding-bottom: 20px; margin-bottom: 20px; }
          .brand-title { font-size: 24px; font-weight: 900; color: #7c3aed; margin: 0; }
          .badge { background: #fef08a; color: #854d0e; padding: 4px 8px; font-weight: bold; border-radius: 6px; font-size: 11px; text-transform: uppercase; }
          .info-table { width: 100%; margin-bottom: 20px; font-size: 13px; }
          .info-table td { padding: 4px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
          .items-table th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px; text-align: left; font-weight: 800; }
          .items-table td { padding: 10px; border-bottom: 1px solid #f1f5f9; }
          .total-box { margin-top: 20px; float: right; width: 300px; font-size: 13px; }
          .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .grand-total { border-top: 2px solid #1e293b; margin-top: 8px; padding-top: 8px; font-weight: 900; font-size: 16px; color: #7c3aed; }
          .footer { clear: both; margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 20px; font-size: 11px; color: #64748b; text-align: center; }
          @media print { body { padding: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <h1 class="brand-title">KiranaStore QuickCommerce</h1>
              <p style="margin: 4px 0; font-size: 12px; color: #64748b;">Direct Local Kirana Fulfillment Hub • Sector 62, Noida, UP</p>
              <p style="margin: 0; font-size: 12px;"><strong>GSTIN:</strong> 07AAACK9842K1Z9 | <strong>FSSAI Lic:</strong> 10020051003492</p>
            </div>
            <div style="text-align: right;">
              <span class="badge">TAX INVOICE</span>
              <h3 style="margin: 6px 0 0 0; font-size: 16px;">INV-${order.order_number}</h3>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Date: ${new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <table class="info-table">
            <tr>
              <td style="width: 50%;">
                <strong>Billed To / Delivery Address:</strong><br>
                ${order.user_name || 'Customer'}<br>
                ${order.delivery_address || 'Sector 62, Noida, UP'}<br>
                Phone: ${order.user_phone || '+91 9876543210'}
              </td>
              <td style="width: 50%; text-align: right; vertical-align: top;">
                <strong>Payment Mode:</strong> ${order.payment_method || 'Online UPI'}<br>
                <strong>Delivery Type:</strong> ${order.delivery_slot_type === 'NEXT_DAY' ? 'Next-Day Express' : 'Same-Day Local Express'}<br>
                <strong>Slot:</strong> ${order.scheduled_delivery_date || 'Standard'} (${order.scheduled_delivery_time || '4 PM - 7 PM'})
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th>HSN</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Rate</th>
                <th style="text-align: right;">Total (INR)</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${item.product_name}</strong></td>
                  <td>HSN-2106</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">₹${item.price}</td>
                  <td style="text-align: right;">₹${item.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-box">
            <div class="total-row"><span>Taxable Amount:</span><span>₹${taxableValue}</span></div>
            <div class="total-row"><span>CGST (2.5%):</span><span>₹${cgst}</span></div>
            <div class="total-row"><span>SGST (2.5%):</span><span>₹${sgst}</span></div>
            <div class="total-row"><span>Delivery & Handling:</span><span>FREE (₹0)</span></div>
            <div class="total-row grand-total"><span>Grand Total:</span><span>₹${order.total_amount.toFixed(2)}</span></div>
          </div>

          <div class="footer">
            <p>This is a computer-generated tax invoice issued by KiranaStore. No physical signature required.</p>
            <p>For support, email care@kiranastore.com or WhatsApp +91 9811223344.</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.focus();
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = `GST_Invoice_${order.order_number}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 pb-28">
      {/* ── Top Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Orders & Buy Again</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">Track live orders, download invoices, return & reorder staples</p>
        </div>
        <button
          onClick={fetchUserOrders}
          className="text-xs text-purple-600 dark:text-purple-400 font-extrabold hover:underline flex items-center gap-1 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 transition"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh Orders
        </button>
      </div>

      {/* ── Order Filter Tabs (Sections 16 & 17) ────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'ALL', label: 'All Orders', count: orders.length },
          { id: 'ACTIVE', label: '⚡ Active & Live', count: orders.filter(o => o.order_status !== 'DELIVERED' && o.order_status !== 'CANCELLED' && o.order_status !== 'RETURNED').length },
          { id: 'DELIVERED', label: '✅ Delivered / Previous', count: orders.filter(o => o.order_status === 'DELIVERED').length },
          { id: 'BUY_AGAIN', label: '🔄 Buy Again Hub', count: previousPurchases.length },
          { id: 'CANCELLED', label: '🚫 Cancelled', count: orders.filter(o => o.order_status === 'CANCELLED').length },
          { id: 'REFUNDED', label: '↩️ Returned / Refunded', count: orders.filter(o => o.order_status === 'RETURNED' || o.order_status === 'REFUNDED').length }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-extrabold px-3.5 py-2 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-102 font-black'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-purple-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-white/30 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── View 1: Buy Again / Previous Purchases Hub (Section 17) ── */}
      {activeTab === 'BUY_AGAIN' ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                1-Click Fast Reorder
              </span>
              <h3 className="text-lg font-black mt-1">Frequently Ordered Grocery Staples</h3>
              <p className="text-xs text-emerald-100">Restock everyday milk, paneer, atta and snacks with a single tap</p>
            </div>
            <ShoppingBag size={36} className="opacity-80 hidden sm:block" />
          </div>

          {previousPurchases.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-700">
              <Package className="mx-auto text-gray-300 mb-2" size={40} />
              <h4 className="font-extrabold text-sm text-gray-800 dark:text-slate-200">No previous purchases yet</h4>
              <p className="text-xs text-gray-400 mt-1">Once you complete orders, your frequently bought items will appear here for fast reordering.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {previousPurchases.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-purple-300 transition"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-12 h-12 object-contain rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-black text-xs text-purple-700 dark:text-purple-300">₹{item.price}</span>
                      <span className="text-[10px] text-gray-400">Last: {item.lastOrderedDate}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReorderSingleItem(item)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-xs flex-shrink-0 active:scale-95 transition"
                    title="Buy this product again"
                  >
                    <Plus size={13} /> Buy
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Past Order Bundles Reorder Cards */}
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider pt-2">
            Reorder Entire Past Orders
          </h4>
          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-gray-900 dark:text-white">Order #{o.order_number}</span>
                    <span className="text-[10px] bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full">
                      {o.items?.length || 0} Items • ₹{o.total_amount.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {o.items?.map((i) => i.product_name).slice(0, 3).join(', ')}...
                  </p>
                </div>

                <button
                  onClick={() => onReorder(o.items)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <RotateCcw size={13} /> Reorder Entire Basket (₹{o.total_amount.toFixed(0)})
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── View 2: Orders List (Section 16) ────────────────────── */
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-xs font-bold text-gray-500">
              <RefreshCw className="animate-spin text-purple-600 mx-auto mb-2" size={28} />
              Loading your orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-700">
              <Package className="mx-auto text-gray-300 mb-3" size={44} />
              <h3 className="font-bold text-gray-800 dark:text-slate-200 text-base">No orders under this tab</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Tap 'All Orders' or start shopping from our store catalog.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isDelivered = order.order_status === 'DELIVERED';
              const isCancelled = order.order_status === 'CANCELLED';
              const isRefunded = order.order_status === 'RETURNED' || order.order_status === 'REFUNDED';
              const userReview = ratedOrders[order.id];

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100 dark:border-slate-700">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-gray-900 dark:text-white">
                            #{order.order_number}
                          </span>
                          {order.order_type === 'MONTHLY_RASHAN_SLIP' ? (
                            <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-black px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                              📸 Rashan Slip Order
                            </span>
                          ) : order.order_type === 'MONTHLY_RASHAN_LIST' ? (
                            <span className="text-[10px] bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 font-black px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-700 flex items-center gap-1">
                              📋 Monthly Rashan List
                            </span>
                          ) : null}
                          <button
                            onClick={() => setSelectedDetailsOrder(order)}
                            className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-0.5"
                          >
                            <Info size={11} /> Order Details
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-gray-400 font-medium">
                            {new Date(order.created_at).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {order.hub_name && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                              🏬 {order.hub_name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Badges */}
                      <span
                        className={`text-[11px] font-black px-3 py-1 rounded-full ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isCancelled
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : isRefunded
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 animate-pulse'
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </div>

                    {/* Slip Photo Card if uploaded via Rashan Hub */}
                    {order.slip_image_url && (
                      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3 mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={order.slip_image_url}
                            alt="Rashan Slip"
                            className="w-14 h-14 object-cover rounded-xl border border-amber-300 shadow-xs cursor-pointer hover:opacity-90 flex-shrink-0"
                            onClick={() => setViewSlipPhotoUrl(order.slip_image_url)}
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-black text-amber-950 dark:text-amber-200 block truncate">
                              📸 Handwritten Rashan Slip Attached
                            </span>
                            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 truncate">
                              {order.special_instructions || 'Dark store team is verifying items & packing fresh stock.'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setViewSlipPhotoUrl(order.slip_image_url)}
                          className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-black text-[11px] px-3 py-1.5 rounded-xl shadow-xs flex-shrink-0"
                        >
                          View Slip
                        </button>
                      </div>
                    )}

                    {/* Items List with Individual Reorder Buttons */}
                    {order.items && order.items.length > 0 ? (
                      <div className="bg-gray-50 dark:bg-slate-900/60 rounded-2xl p-3 mb-3 divide-y divide-gray-100 dark:divide-slate-800">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800 dark:text-slate-200">
                                {item.quantity}x {item.product_name}
                              </span>
                              <span className="font-black text-gray-900 dark:text-white">
                                (₹{item.price * item.quantity})
                              </span>
                            </div>

                            <button
                              onClick={() => handleReorderSingleItem(item)}
                              className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold hover:bg-purple-50 dark:hover:bg-purple-950/60 px-2 py-1 rounded-lg border border-purple-200 dark:border-purple-800 transition"
                              title="Reorder this product"
                            >
                              + Reorder Item
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : order.order_type === 'MONTHLY_RASHAN_SLIP' ? (
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-2.5 mb-3 text-xs text-emerald-800 dark:text-emerald-300">
                        ⚡ Store staff is calculating item weights & final total from your slip.
                      </div>
                    ) : null}

                    {/* Special Instructions / Additional Note */}
                    {order.special_instructions && (
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 mb-3 flex items-start gap-2 text-xs">
                        <span className="font-black text-slate-700 dark:text-slate-300 flex-shrink-0">📝 Note:</span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          {order.special_instructions}
                        </span>
                      </div>
                    )}

                    {/* Rating Feedback badge if rated */}
                    {(userReview || order.rating) && (
                      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Star size={14} className="fill-amber-500 text-amber-500" />
                          <span className="font-black text-amber-900 dark:text-amber-200">
                            Rated {userReview?.rating || order.rating}.0 Stars
                          </span>
                        </div>
                        <span className="text-[11px] text-amber-800 dark:text-amber-300 italic truncate max-w-[200px]">
                          "{userReview?.comment || order.rating_comment || 'Great service!'}"
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── Action Buttons Toolbar (Section 16 Complete) ── */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700 gap-2 flex-wrap">
                    <div className="text-sm font-black text-gray-900 dark:text-white">
                      Total: ₹{order.total_amount.toFixed(0)}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* 1. GST Invoice Download */}
                      <button
                        onClick={() => handleDownloadInvoicePdf(order)}
                        className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-extrabold text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 border border-purple-200 dark:border-purple-800 transition"
                        title="Download official GST Invoice PDF"
                      >
                        <Download size={12} /> Invoice PDF
                      </button>

                      {/* 2. Rate Order */}
                      <button
                        onClick={() => {
                          setSelectedRatingOrder(order);
                          setUserRating(userReview?.rating || 5);
                          setRatingComment(userReview?.comment || '');
                        }}
                        className="bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 border border-amber-200 dark:border-amber-800 transition"
                      >
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span>{userReview ? 'Edit Rating' : 'Rate'}</span>
                      </button>

                      {/* 3. Live Tracking (for active orders) */}
                      {!isDelivered && !isCancelled && !isRefunded && (
                        <>
                          <button
                            onClick={() => onSelectTrackOrder(order.order_number)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow flex items-center gap-1"
                          >
                            Track 🛵
                          </button>
                          <button
                            onClick={() => setSelectedCancelOrder(order)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] px-2.5 py-1.5 rounded-xl border border-rose-200"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* 4. Return Order & Request Refund (for delivered orders) */}
                      {isDelivered && (
                        <button
                          onClick={() => setSelectedReturnOrder(order)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-extrabold text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1"
                        >
                          <RotateCcw size={12} /> Return / Refund
                        </button>
                      )}

                      {/* 5. Reorder Entire Order */}
                      <button
                        onClick={() => onReorder(order.items)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow flex items-center gap-1"
                      >
                        Reorder 🛒
                      </button>

                      {/* 6. Contact Support */}
                      {onOpenSupport && (
                        <button
                          onClick={onOpenSupport}
                          className="text-gray-400 hover:text-purple-600 p-1.5 rounded-xl"
                          title="Contact Customer Support"
                        >
                          <HelpCircle size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Modal 1: 5-Star Interactive Rating ───────────────────── */}
      {selectedRatingOrder && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 relative text-center shadow-2xl animate-in zoom-in duration-150 border border-gray-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedRatingOrder(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-2 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/80 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-500 shadow-xs">
              <Star size={28} className="fill-amber-500 text-amber-500 animate-bounce" />
            </div>

            <h3 className="font-black text-lg text-gray-900 dark:text-white">Rate your Grocery Experience</h3>
            <p className="text-xs text-gray-500 mb-4">How was order #{selectedRatingOrder.order_number}?</p>

            <form onSubmit={handleRateSubmit} className="space-y-4">
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 text-3xl transition transform hover:scale-125 active:scale-95 focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={userRating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-slate-600'}
                    />
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  rows={3}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Share feedback on packaging freshness, rider behavior, or speed..."
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-gray-900 dark:text-white outline-none font-medium"
                />
              </div>

              {ratingSuccess ? (
                <div className="bg-emerald-100 text-emerald-800 font-black text-xs p-3 rounded-2xl flex items-center justify-center gap-2">
                  <Check size={16} /> Thank you! Rating saved.
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Submit Rating
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 2: Cancel Order Form ──────────────────────────── */}
      {selectedCancelOrder && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150">
            <button
              onClick={() => setSelectedCancelOrder(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-2 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                <Ban size={24} />
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white">Cancel Order #{selectedCancelOrder.order_number}</h3>
                <p className="text-xs text-gray-500">Instant full refund of ₹{selectedCancelOrder.total_amount.toFixed(0)}</p>
              </div>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">Reason for cancellation *</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 font-bold outline-none text-gray-900 dark:text-white"
                >
                  <option>Ordered by mistake</option>
                  <option>Need to change delivery address</option>
                  <option>Delivery slot not convenient</option>
                  <option>Forgot to add additional items</option>
                  <option>Other personal reason</option>
                </select>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                🛡️ <strong>Instant Refund:</strong> ₹{selectedCancelOrder.total_amount.toFixed(0)} will be refunded immediately to your KiranaMoney Wallet with 0 cancellation charges.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCancelOrder(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black shadow"
                >
                  Confirm Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 3: Return Order & Request Refund Form ──────────── */}
      {selectedReturnOrder && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150">
            <button
              onClick={() => setSelectedReturnOrder(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-2 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
                <RotateCcw size={24} />
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white">Return & Refund Request</h3>
                <p className="text-xs text-gray-500">Order #{selectedReturnOrder.order_number}</p>
              </div>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">Issue Type *</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 font-bold outline-none text-gray-900 dark:text-white"
                >
                  <option>Damaged or Leaking Product</option>
                  <option>Missing Product in Bag</option>
                  <option>Quality / Freshness Issue</option>
                  <option>Received Wrong Item / Variant</option>
                  <option>Expired or Past Best-Before Date</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">Refund Method *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRefundMode('WALLET')}
                    className={`p-2.5 rounded-xl border text-left font-bold ${
                      refundMode === 'WALLET'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="block text-xs font-black">KiranaWallet</span>
                    <span className="text-[10px] text-gray-400">⚡ Instant in 60 secs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRefundMode('ORIGINAL')}
                    className={`p-2.5 rounded-xl border text-left font-bold ${
                      refundMode === 'ORIGINAL'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="block text-xs font-black">Original UPI/Card</span>
                    <span className="text-[10px] text-gray-400">2-4 Business Days</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow mt-2"
              >
                Submit Refund Request (₹{selectedReturnOrder.total_amount.toFixed(0)})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 4: Full Order Details Breakdown ────────────────── */}
      {selectedDetailsOrder && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDetailsOrder(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-2 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="font-black text-lg text-gray-900 dark:text-white mb-1">
              Order Details #{selectedDetailsOrder.order_number}
            </h3>
            <p className="text-xs text-gray-500 mb-4">Complete fulfillment and tax breakdown</p>

            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Status:</span>
                  <span className="font-extrabold text-purple-600">{selectedDetailsOrder.order_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Placed Date:</span>
                  <span className="font-bold">{new Date(selectedDetailsOrder.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Mode:</span>
                  <span className="font-bold">{selectedDetailsOrder.payment_method || 'Online UPI'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Address:</span>
                  <span className="font-bold truncate max-w-[200px]">{selectedDetailsOrder.delivery_address || 'Sector 62, Noida, UP'}</span>
                </div>
              </div>

              <div className="border border-gray-100 dark:border-slate-800 rounded-2xl p-3 space-y-2">
                <h4 className="font-black text-xs">Items ({selectedDetailsOrder.items?.length || 0})</h4>
                {selectedDetailsOrder.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span>{item.quantity}x {item.product_name}</span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl space-y-1 text-xs">
                <div className="flex justify-between"><span>Taxable Amount:</span><span>₹{(selectedDetailsOrder.total_amount * 0.95).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>GST (5%):</span><span>₹{(selectedDetailsOrder.total_amount * 0.05).toFixed(2)}</span></div>
                <div className="flex justify-between font-black text-sm text-purple-900 dark:text-purple-200 pt-1 border-t border-purple-200 dark:border-purple-800">
                  <span>Grand Total Paid:</span>
                  <span>₹{selectedDetailsOrder.total_amount.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={() => handleDownloadInvoicePdf(selectedDetailsOrder)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow"
              >
                <Download size={14} /> Download GST Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rashan Slip Photo Zoom Modal */}
      {viewSlipPhotoUrl && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 relative shadow-2xl animate-in zoom-in duration-150 flex flex-col items-center">
            <button
              onClick={() => setViewSlipPhotoUrl(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-2 rounded-full z-10"
            >
              <X size={18} />
            </button>

            <h3 className="font-black text-base text-gray-900 dark:text-white mb-3 self-start flex items-center gap-2">
              <span>📸 Handwritten Rashan Slip</span>
            </h3>

            <div className="max-h-[70vh] overflow-auto rounded-2xl border border-gray-200 dark:border-slate-700 w-full flex items-center justify-center bg-black/5 p-2">
              <img
                src={viewSlipPhotoUrl}
                alt="Rashan Slip Full Preview"
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Our dark store team is reading this slip to pack all items directly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
