import React, { useState, useEffect } from 'react';
import { 
  Star, CheckCircle2, XCircle, Trash2, Heart, Search, Filter, 
  ShieldCheck, MessageSquare, RefreshCw, X, Plus, Sparkles, Send, ShoppingCart
} from 'lucide-react';

export default function ReviewsView() {
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'wishlist'
  const [filterRating, setFilterRating] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  // Reviews Data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: 'Akarshan Mishra',
      product: 'Amul Taaza Toned Milk (500 ml)',
      rating: 5,
      comment: 'Super fresh milk delivered chilled in 8 minutes! Best grocery delivery in Noida.',
      date: '24 Aug 2026',
      status: 'APPROVED',
      admin_reply: 'Thank you Akarshan! We deliver morning batches fresh from daily dairy.'
    },
    {
      id: 2,
      customer: 'Priya Sharma',
      product: 'Fresh Malai Paneer (200 g)',
      rating: 5,
      comment: 'Very soft and tasty paneer. Exactly like farm dairy.',
      date: '23 Aug 2026',
      status: 'APPROVED',
      admin_reply: null
    }
  ]);

  // Modals
  const [replyingReview, setReplyingReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    customer: '',
    product: 'Amul Taaza Toned Milk (500 ml)',
    rating: 5,
    comment: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      }
    } catch (e) {
      console.warn('Could not fetch reviews:', e);
    }
  };

  useEffect(() => {
    loadReviews();
    const interval = setInterval(loadReviews, 3500);
    return () => clearInterval(interval);
  }, []);

  const [mostWishedProducts] = useState([
    { id: 1, name: 'Amul Desi Ghee (1 L)', count: 184, price: 589, inStock: true, category: 'Dairy & Breakfast' },
    { id: 2, name: 'Fresh Paneer Block (200 g)', count: 156, price: 89, inStock: true, category: 'Dairy & Breakfast' },
    { id: 3, name: 'Aashirvaad Chakki Atta (5 kg)', count: 142, price: 219, inStock: true, category: 'Atta, Rice & Dal' },
    { id: 4, name: 'Nutella Hazelnut Spread (350 g)', count: 118, price: 340, inStock: false, category: 'Snacks & Munchies' },
  ]);

  const handleApprove = async (id) => {
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' })
      });
    } catch {}
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    showToast('Review approved & published on product page!');
  };

  const handleReject = async (id) => {
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' })
      });
    } catch {}
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    showToast('Review hidden from storefront.');
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this customer review?')) {
      try {
        await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      } catch {}
      setReviews(reviews.filter(r => r.id !== id));
      showToast('Review deleted permanently.');
    }
  };

  const handleSaveReply = async (e) => {
    e.preventDefault();
    if (!replyingReview) return;
    try {
      await fetch(`/api/admin/reviews/${replyingReview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_reply: replyText.trim() })
      });
    } catch {}
    setReviews(reviews.map(r => r.id === replyingReview.id ? { ...r, admin_reply: replyText.trim() } : r));
    showToast('Store official reply posted to customer review!');
    setReplyingReview(null);
    setReplyText('');
  };

  const handleCreateReview = (e) => {
    e.preventDefault();
    if (!newReviewForm.customer || !newReviewForm.comment) return;

    const created = {
      id: Date.now(),
      customer: newReviewForm.customer.trim(),
      product: newReviewForm.product,
      rating: parseInt(newReviewForm.rating),
      comment: newReviewForm.comment.trim(),
      date: 'Just now',
      status: 'APPROVED',
      admin_reply: null
    };

    setReviews([created, ...reviews]);
    showToast('Verified review added successfully!');
    setIsAddReviewOpen(false);
    setNewReviewForm({
      customer: '',
      product: 'Amul Taaza Toned Milk (500 ml)',
      rating: 5,
      comment: ''
    });
  };

  const filteredReviews = reviews.filter(r => {
    const matchesRating = filterRating === 'ALL' || r.rating === parseInt(filterRating);
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch = (r.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.product || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.comment || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl text-xs font-black shadow-lg flex items-center justify-between animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="opacity-80 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Star size={24} className="text-amber-500 fill-amber-500" />
            Wishlist & Product Reviews Moderation
          </h2>
          <p className="text-xs text-slate-500">
            Moderate customer ratings, approve feedback, post official replies & analyze most-wishlisted inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Star size={14} className="fill-current" /> Customer Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === 'wishlist' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart size={14} className="fill-current text-rose-500" /> Most Wished ({mostWishedProducts.length})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: REVIEWS MODERATION */}
      {/* ========================================================================= */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews by customer, product or comment..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              {/* Star Filter Pills */}
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
                {['ALL', '5', '4', '3', '2', '1'].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFilterRating(star)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      filterRating === star
                        ? 'bg-white text-purple-700 shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {star === 'ALL' ? 'All Stars' : `⭐ ${star}`}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddReviewOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus size={14} /> Add Review
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-3">
            {filteredReviews.map((r) => (
              <div key={r.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-900 text-sm">{r.customer}</span>
                    <span className="text-slate-400 text-xs">• {r.date}</span>
                    
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                        />
                      ))}
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      r.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="text-xs text-purple-700 font-bold flex items-center gap-1.5">
                    <ShoppingCart size={13} />
                    <span>{r.product}</span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
                    "{r.comment}"
                  </p>

                  {r.admin_reply && (
                    <div className="text-xs text-slate-600 bg-purple-50/70 p-2.5 rounded-xl border border-purple-100 flex items-start gap-2">
                      <MessageSquare size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-purple-900 block text-[11px]">Store Reply:</strong>
                        <span>{r.admin_reply}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center md:flex-col gap-2 flex-shrink-0">
                  {r.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-extrabold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                    >
                      <CheckCircle2 size={13} /> Approve
                    </button>
                  )}

                  {r.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleReject(r.id)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-extrabold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setReplyingReview(r);
                      setReplyText(r.admin_reply || '');
                    }}
                    className="bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 font-extrabold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                  >
                    <MessageSquare size={13} /> Reply
                  </button>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition"
                    title="Delete Review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium">
              No reviews found matching your filter criteria.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WISHLIST ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'wishlist' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Heart size={18} className="text-rose-500 fill-rose-500" />
              Most Wishlisted Products & Unmet Customer Demand
            </h3>
            <p className="text-xs text-slate-500">Products saved by active shoppers to target with restocks or flash discounts</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mostWishedProducts.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-slate-900 text-sm">{p.name}</span>
                    <span className="bg-rose-50 text-rose-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                      <Heart size={11} className="fill-rose-500" /> {p.count} Wished
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{p.category} • Shelf Price: <strong>₹{p.price}</strong></span>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {p.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                  </span>

                  <button
                    onClick={() => showToast(`Triggered demand promotion alert for ${p.name}!`)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition"
                  >
                    Run Flash Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyingReview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150 space-y-4">
            <button onClick={() => setReplyingReview(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full">
              <X size={16} />
            </button>
            <h3 className="font-black text-base text-slate-900">Post Official Store Reply</h3>
            
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="font-bold text-slate-900">{replyingReview.customer} on {replyingReview.product}</div>
              <div className="text-slate-600 italic">"{replyingReview.comment}"</div>
            </div>

            <form onSubmit={handleSaveReply} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Store Response *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Thank the customer or address their feedback directly..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Send size={14} /> Publish Reply
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {isAddReviewOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-150 space-y-4">
            <button onClick={() => setIsAddReviewOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full">
              <X size={16} />
            </button>
            <h3 className="font-black text-base text-slate-900">Add Verified Customer Review</h3>

            <form onSubmit={handleCreateReview} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newReviewForm.customer}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, customer: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product</label>
                  <input
                    type="text"
                    required
                    value={newReviewForm.product}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, product: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rating (Stars)</label>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Star)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Star)</option>
                    <option value={3}>⭐⭐⭐ (3 Star)</option>
                    <option value={2}>⭐⭐ (2 Star)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Feedback *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Feedback comments..."
                  value={newReviewForm.comment}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition"
              >
                Save Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
