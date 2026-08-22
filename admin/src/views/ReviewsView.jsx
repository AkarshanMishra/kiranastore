import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Heart, Search, Filter, ShieldCheck, MessageSquare, RefreshCw } from 'lucide-react';

export default function ReviewsView() {
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'wishlist'
  const [filterRating, setFilterRating] = useState('ALL');

  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: 'Akarshan Mishra',
      product: 'Amul Taaza Toned Milk (500 ml)',
      rating: 5,
      comment: 'Super fresh milk delivered chilled! Best grocery delivery in Noida.',
      date: '20 Aug 2026',
      status: 'APPROVED'
    },
    {
      id: 2,
      customer: 'Priya Sharma',
      product: 'Fresh Malai Paneer (200 g)',
      rating: 5,
      comment: 'Very soft and tasty paneer. Exactly like farm dairy.',
      date: '19 Aug 2026',
      status: 'APPROVED'
    }
  ]);

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
    const interval = setInterval(loadReviews, 4000);
    return () => clearInterval(interval);
  }, []);

  const [mostWishedProducts] = useState([
    { id: 1, name: 'Amul Desi Ghee (1 L)', count: 184, price: 589, inStock: true },
    { id: 2, name: 'Fresh Paneer Block (200 g)', count: 156, price: 89, inStock: true },
    { id: 3, name: 'Aashirvaad Chakki Atta (5 kg)', count: 142, price: 219, inStock: true },
    { id: 4, name: 'Nutella Hazelnut Spread (350 g)', count: 118, price: 340, inStock: false },
  ]);

  const handleApprove = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  };

  const handleReject = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  const handleDelete = (id) => {
    if (confirm('Delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const filteredReviews = reviews.filter(r =>
    filterRating === 'ALL' || r.rating === parseInt(filterRating)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Wishlist & Product Reviews Moderation</h2>
          <p className="text-xs text-slate-500">Moderate customer ratings, approve feedback & analyze most-wishlisted inventory</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'reviews' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            ⭐ Customer Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'wishlist' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            ❤️ Most Wished Items
          </button>
        </div>
      </div>

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {['ALL', '5', '4', '3', '2', '1'].map((star) => (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  filterRating === star
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {star === 'ALL' ? 'All Ratings' : `⭐ ${star} Star`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} className={i < rev.rating ? 'text-amber-400' : 'text-slate-200'} />
                      ))}
                      <span className="font-extrabold text-xs text-slate-900 ml-1">({rev.rating}/5)</span>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      rev.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : rev.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {rev.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-900">{rev.product}</h4>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 my-2">
                    "{rev.comment}"
                  </p>

                  <div className="text-[11px] text-slate-400 font-medium">
                    By <strong>{rev.customer}</strong> • {rev.date}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    {rev.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleApprove(rev.id)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition"
                      >
                        Approve ✓
                      </button>
                    )}
                    {rev.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleReject(rev.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition"
                      >
                        Reject ✕
                      </button>
                    )}
                  </div>

                  <button onClick={() => handleDelete(rev.id)} className="p-1 text-slate-400 hover:text-rose-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-black text-sm text-slate-900">Most Wishlisted Grocery SKUs by Customers</h3>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {mostWishedProducts.map((p, idx) => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-purple-50 text-purple-700 rounded-full font-black flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-black text-slate-900">{p.name}</h4>
                    <span className="text-slate-500 font-semibold">₹{p.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-black text-rose-600 flex items-center gap-1">
                      <Heart size={13} fill="currentColor" /> {p.count} Customers
                    </span>
                    <span className={`text-[10px] font-bold ${p.inStock ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <button
                    onClick={() => alert(`Creating discount campaign for wishlisted item: ${p.name}`)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs px-3 py-1.5 rounded-xl transition"
                  >
                    Run Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
