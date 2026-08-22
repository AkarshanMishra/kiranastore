import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Shield, Plus, Minus, Heart, Sparkles, CheckCircle2, Store, MessageSquare, Send } from 'lucide-react';
import { showToast } from './Toast';

export default function ProductDetailModal({
  product,
  onClose,
  cart,
  addToCart,
  removeFromCart,
  wishlist,
  toggleWishlist
}) {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState('details'); // 'details' | 'nutrition' | 'reviews' | 'frequently_bought'
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewsList, setReviewsList] = useState([
    { name: 'Akarshan M.', rating: 5, date: '2 days ago', comment: 'Always fresh and delivered in perfect chilled packaging!' },
    { name: 'Priya S.', rating: 5, date: '1 week ago', comment: 'Top grocery quality. Sealed and genuine product.' }
  ]);

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (product) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [product]);

  if (!product) return null;

  const cartItem = cart[product.id];
  const qty = cartItem ? cartItem.quantity : 0;
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const isWishlisted = !!wishlist?.[product.id];

  const galleryImages = [
    product.image_url,
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80"
  ];

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setReviewsList([
      { name: 'You (Verified Buyer)', rating: userRating, date: 'Just now', comment: userComment.trim() },
      ...reviewsList
    ]);
    setUserComment('');
    showToast("Thank you! Your review has been submitted.", "success");
  };

  return (
    <div 
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] overscroll-contain">
        
        {/* Top Header Buttons */}
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-2 rounded-full shadow ${
              isWishlisted ? 'bg-rose-50 text-rose-500' : 'bg-white/90 dark:bg-slate-800 text-gray-400'
            }`}
          >
            <Heart size={18} className={isWishlisted ? 'fill-rose-500' : ''} />
          </button>
          <button
            onClick={onClose}
            className="bg-white/90 dark:bg-slate-800 text-gray-500 hover:text-gray-700 dark:hover:text-white p-2 rounded-full shadow z-10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product Image Viewer */}
        <div className="bg-gray-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center relative">
          <div className="h-44 flex items-center justify-center">
            <img
              src={galleryImages[selectedImgIdx] || product.image_url}
              alt={product.name}
              className="h-full object-contain"
            />
          </div>

          {/* Alternate Thumbnail Dots */}
          <div className="flex gap-2 mt-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImgIdx(idx)}
                className={`w-3 h-3 rounded-full border transition ${
                  selectedImgIdx === idx ? 'bg-purple-600 border-purple-600 scale-110' : 'bg-gray-200 border-gray-300'
                }`}
              />
            ))}
          </div>

          <span className="absolute bottom-3 left-4 bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1">
            <Store size={12} /> Direct From Local Kirana Store
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              {product.weight_unit || 'Standard Pack'}
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              {product.name}
            </h2>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-slate-800 text-xs font-bold gap-4">
            {['details', 'nutrition', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`pb-2 capitalize transition border-b-2 ${
                  activeSubTab === tab
                    ? 'border-purple-600 text-purple-600 font-black'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'details' ? 'Product Info' : tab === 'nutrition' ? 'Ingredients & Nutrition' : 'Reviews & Ratings'}
              </button>
            ))}
          </div>

          {/* Tab 1: Product Info */}
          {activeSubTab === 'details' && (
            <div className="space-y-3 text-xs text-gray-600 dark:text-slate-300">
              <p className="leading-relaxed">
                {product.description || 'Premium fresh grocery staple sourced directly from authorized FMCG distributors and farm mandi.'}
              </p>

              <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{product.category_name || 'Grocery'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Country of Origin:</span>
                  <span className="font-bold text-gray-900 dark:text-white">India 🇮🇳</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage Advice:</span>
                  <span className="font-bold text-gray-900 dark:text-white">Store in a cool, dry place</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expiry / Shelf Life:</span>
                  <span className="font-bold text-emerald-600">Fresh Stock (Guaranteed 90+ Days)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Nutrition & Ingredients */}
          {activeSubTab === 'nutrition' && (
            <div className="space-y-3 text-xs text-gray-600 dark:text-slate-300">
              <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-2">
                <div className="font-black text-gray-900 dark:text-white mb-1">Nutrition per 100g (Approx):</div>
                <div className="flex justify-between"><span>Energy:</span> <strong>120 kcal</strong></div>
                <div className="flex justify-between"><span>Protein:</span> <strong>3.2 g</strong></div>
                <div className="flex justify-between"><span>Carbohydrates:</span> <strong>4.8 g</strong></div>
                <div className="flex justify-between"><span>Fat:</span> <strong>3.5 g</strong></div>
                <div className="flex justify-between"><span>Calcium:</span> <strong>110 mg</strong></div>
              </div>
            </div>
          )}

          {/* Tab 3: Customer Reviews */}
          {activeSubTab === 'reviews' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2.5">
                {reviewsList.map((r, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-gray-900 dark:text-white">{r.name}</span>
                      <div className="flex items-center text-amber-500 font-bold text-[11px]">
                        <Star size={12} fill="currentColor" /> {r.rating}.0
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-slate-300 italic">"{r.comment}"</p>
                    <span className="text-[10px] text-gray-400 block mt-1">{r.date}</span>
                  </div>
                ))}
              </div>

              {/* Write a Review Form */}
              <form onSubmit={handleAddReview} className="bg-purple-50 dark:bg-purple-950/40 p-3.5 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-2">
                <div className="font-black text-purple-900 dark:text-purple-200 flex items-center gap-1">
                  <MessageSquare size={14} /> Leave a Customer Review
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-600 dark:text-slate-300 text-[11px]">Rating:</span>
                  <select
                    value={userRating}
                    onChange={(e) => setUserRating(parseInt(e.target.value))}
                    className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl px-2 py-1 font-bold text-gray-900 dark:text-white text-xs"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars - Good)</option>
                    <option value="3">⭐⭐⭐ (3 Stars - Average)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Write your review experience..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none"
                  />
                  <button type="submit" className="bg-purple-600 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                    <Send size={12} /> Post
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Cart Action Bar */}
        <div className="p-4 bg-white dark:bg-slate-850 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">TOTAL PRICE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-900 dark:text-white">
                ₹{product.discount_price ? product.discount_price : product.price}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
          </div>

          <div>
            {qty === 0 ? (
              <button
                onClick={() => addToCart(product)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition"
              >
                <Plus size={16} /> Add to Basket
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-purple-600 text-white rounded-2xl px-3 py-1.5 shadow-md">
                <button onClick={() => removeFromCart(product.id)} className="p-1 hover:bg-purple-700 rounded-lg">
                  <Minus size={16} />
                </button>
                <span className="font-black text-sm">{qty}</span>
                <button onClick={() => addToCart(product)} className="p-1 hover:bg-purple-700 rounded-lg">
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
