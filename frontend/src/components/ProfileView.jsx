import React, { useState, useEffect } from 'react';
import {
  User,
  ShoppingBag,
  Wallet,
  HelpCircle,
  MapPin,
  Bookmark,
  Heart,
  Receipt,
  Gift,
  FileText,
  CreditCard,
  Ticket,
  Award,
  Share2,
  Info,
  ShieldCheck,
  Bell,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
  Upload,
  Phone,
  Mail,
  ExternalLink,
  X,
  Sparkles,
  ArrowRight,
  Globe,
  Moon,
  Sun,
  Calendar,
  Wifi,
  Radio,
  Server,
  Activity,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl } from '../apiClient';
import RazorpayModal from './RazorpayModal';

export default function ProfileView({
  user,
  userAddress,
  setUserAddress,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  onOpenSupport,
  onOpenNotifications,
  onNavigateToOrders,
  onOpenWishlist,
  wishlist = {},
  addToCart,
  onOpenAuth,
  onLogout
}) {
  // State for Modals & Drawers
  const [activeModal, setActiveModal] = useState(null); // 'wallet'|'address'|'gst'|'giftCard'|'prescription'|'payment'|'claimGift'|'rewards'|'share'|'about'|'privacy'|'notifications'|'bookmarks'|'editProfile'|'serverConfig'

  // Server & Cloud Tunnel Sync State
  const [serverUrlInput, setServerUrlInput] = useState(() => getApiBaseUrl());
  const [pingResult, setPingResult] = useState(null);
  const [isTestingPing, setIsTestingPing] = useState(false);

  // User Profile State
  const [userName, setUserName] = useState(user?.name || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userMembership, setUserMembership] = useState('GOLD VIP');

  useEffect(() => {
    if (user) {
      setUserName(user.name || '');
      setUserPhone(user.phone || '');
      setUserEmail(user.email || '');
    } else {
      setUserName('');
      setUserPhone('');
      setUserEmail('');
    }
  }, [user]);

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Kirana Money / Wallet State
  const [walletBalance, setWalletBalance] = useState(350);
  const [walletTransactions, setWalletTransactions] = useState([
    { id: 1, type: 'CREDIT', title: 'Scratch Card Reward Cashback', amount: 25, date: 'Today, 2:40 PM' },
    { id: 2, type: 'DEBIT', title: 'Order #ORD-849202 Payment', amount: 180, date: 'Yesterday, 6:15 PM' },
    { id: 3, type: 'CREDIT', title: 'UPI Add Money (GPay)', amount: 500, date: '18 Aug 2026' }
  ]);
  const [addAmountInput, setAddAmountInput] = useState('');

  // Rewards State
  const [rewardPoints, setRewardPoints] = useState(480);
  const [scratchCards, setScratchCards] = useState([
    { id: 1, title: 'Express Order Reward', amount: 25, scratched: false },
    { id: 2, title: 'Weekend Super Deal Bonus', amount: 50, scratched: true }
  ]);

  // Address Book State
  const [addresses, setAddresses] = useState([
    { id: 1, tag: 'Home', address: 'Flat 402, Block B, Sector 62, Noida, UP - 201309', isDefault: true },
    { id: 2, tag: 'Work', address: 'Tower C, Candor TechSpace, Sector 62, Noida, UP - 201309', isDefault: false },
    { id: 3, tag: 'Parents', address: 'Villa 14, Lotus Boulevard, Sector 100, Noida, UP - 201304', isDefault: false }
  ]);
  const [newAddrTag, setNewAddrTag] = useState('Home');
  const [newAddrText, setNewAddrText] = useState('');

  // GST Details State
  const [gstDetails, setGstDetails] = useState({
    gstin: '07AAAAA0000A1Z5',
    legalName: 'Mishra Retail & Tech Enterprises',
    registeredAddress: 'Sector 62, Noida, Uttar Pradesh - 201309'
  });
  const [isGstSaved, setIsGstSaved] = useState(true);

  // Bookmarks / Quick Re-orders
  const [bookmarkedItems, setBookmarkedItems] = useState([
    { id: 101, name: 'Amul Taaza Toned Milk (500 ml)', price: 27, discount_price: 25, image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80', weight_unit: '500 ml' },
    { id: 102, name: 'Fresh Malai Paneer (200 g)', price: 95, discount_price: 89, image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&q=80', weight_unit: '200 g' },
    { id: 103, name: 'Aashirvaad Chakki Atta (5 kg)', price: 245, discount_price: 219, image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80', weight_unit: '5 kg' },
    { id: 104, name: 'Farm Fresh Brown Eggs (6 pcs)', price: 68, discount_price: 62, image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200&q=80', weight_unit: '6 pcs' }
  ]);

  // Prescriptions State
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, title: 'Daily Health Vitamins & Supplements', doctor: 'Dr. R. Sharma (MBBS)', date: '12 Aug 2026', status: 'VERIFIED' },
    { id: 2, title: 'Ayurvedic Wellness & Immunity Pack', doctor: 'Dr. V. K. Gupta (BAMS)', date: '18 Aug 2026', status: 'VERIFIED' }
  ]);

  // Monthly Orders & Shopping Lists State
  const [monthlyTab, setMonthlyTab] = useState('lists'); // 'lists' | 'prescriptions'
  const [shoppingLists, setShoppingLists] = useState([
    {
      id: 1,
      name: 'Monthly Kitchen Staples',
      desc: 'Atta 5kg, Basmati Rice 5kg, Desi Ghee 1L, Toor Dal 1kg',
      total: 1148,
      itemCount: 4,
      items: [
        { id: 101, name: 'Aashirvaad Chakki Atta (5 kg)', price: 219 },
        { id: 102, name: 'Fortune Biryani Special Basmati Rice (5 kg)', price: 420 },
        { id: 103, name: 'Amul Pure Desi Ghee (1 L)', price: 380 },
        { id: 104, name: 'Tata Sampann Premium Toor Dal (1 kg)', price: 129 }
      ]
    },
    {
      id: 2,
      name: 'Party Snacks & Beverages Pack',
      desc: "Lay's Magic Masala, Coca-Cola Can 300ml, Maggi 4-Pack",
      total: 105,
      itemCount: 3,
      items: [
        { id: 201, name: "Lay's India's Magic Masala (50 g)", price: 20 },
        { id: 202, name: 'Coca-Cola Soft Drink Can (300 ml)', price: 40 },
        { id: 203, name: 'Maggi 2-Minute Masala Noodles (4 Pack)', price: 45 }
      ]
    }
  ]);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [newListEstimatedCost, setNewListEstimatedCost] = useState('500');

  // Saved Payment Methods
  const [savedUpis, setSavedUpis] = useState(['akarshan@oksbi', 'mishra1207@paytm']);
  const [savedCards, setSavedCards] = useState([
    { id: 1, bank: 'HDFC Bank', last4: '4111', type: 'Visa Platinum', isDefault: true },
    { id: 2, bank: 'ICICI Bank', last4: '8829', type: 'Mastercard Gold', isDefault: false }
  ]);
  const [paymentSubTab, setPaymentSubTab] = useState('upi'); // 'upi' | 'cards' | 'netbanking' | 'wallets'
  const [isAddingUpi, setIsAddingUpi] = useState(false);
  const [newUpiInput, setNewUpiInput] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardBank, setNewCardBank] = useState('HDFC Bank');

  const handleAddNewUpi = (e) => {
    e.preventDefault();
    if (!newUpiInput.trim() || !newUpiInput.includes('@')) {
      return;
    }
    setSavedUpis(prev => [...prev, newUpiInput.trim()]);
    setNewUpiInput('');
    setIsAddingUpi(false);
  };

  const handleDeleteUpi = (vpaToDelete) => {
    setSavedUpis(prev => prev.filter(v => v !== vpaToDelete));
  };

  const handleAddNewCard = (e) => {
    e.preventDefault();
    const cleanNum = newCardNumber.replace(/\s/g, '');
    if (cleanNum.length < 15) {
      return;
    }
    const last4 = cleanNum.slice(-4);
    const newCard = {
      id: Date.now(),
      bank: newCardBank,
      last4: last4,
      type: 'RuPay / Visa',
      isDefault: false
    };
    setSavedCards(prev => [...prev, newCard]);
    setNewCardNumber('');
    setNewCardHolder('');
    setNewCardExpiry('');
    setIsAddingCard(false);
  };

  const handleDeleteCard = (cardId) => {
    setSavedCards(prev => prev.filter(c => c.id !== cardId));
  };

  // Gift Card Claim Form
  const [claimCode, setClaimCode] = useState('');
  const [claimPin, setClaimPin] = useState('');
  const [claimStatus, setClaimStatus] = useState(null);

  // E-Gift Card Buy State
  const [giftCardAmount, setGiftCardAmount] = useState(500);
  const [recipientEmail, setRecipientEmail] = useState('');

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    sms: true,
    promos: false,
    orderRadar: true
  });

  // Copied link animation
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('https://kiranastore.com/ref/AKARSHAN100');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Recharge Payment Modal State
  const [isRechargePaymentOpen, setIsRechargePaymentOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(500);

  const handleAddWalletMoney = (amt) => {
    const parsed = parseFloat(amt);
    if (!isNaN(parsed) && parsed > 0) {
      setRechargeAmount(parsed);
      setIsRechargePaymentOpen(true);
    }
  };

  const handleRechargeSuccess = (paymentData) => {
    const payId = paymentData?.razorpay_payment_id || 'UPI-Direct';
    setWalletBalance(prev => prev + rechargeAmount);
    setWalletTransactions(prev => [
      { id: Date.now(), type: 'CREDIT', title: `Wallet Top-up (${payId.slice(-6)})`, amount: rechargeAmount, date: 'Just now' },
      ...prev
    ]);
    setAddAmountInput('');
    setIsRechargePaymentOpen(false);
  };

  const handleClaimVoucher = (e) => {
    e.preventDefault();
    if (claimCode.length >= 8) {
      const addedVal = 100;
      setWalletBalance(prev => prev + addedVal);
      setWalletTransactions(prev => [
        { id: Date.now(), type: 'CREDIT', title: `Gift Card Claimed (${claimCode})`, amount: addedVal, date: 'Just now' },
        ...prev
      ]);
      setClaimStatus({ success: true, message: `🎉 Gift Card redeemed! ₹${addedVal} added to your KiranaMoney.` });
      setClaimCode('');
      setClaimPin('');
    } else {
      setClaimStatus({ success: false, message: 'Invalid gift card voucher code. Please check code & PIN.' });
    }
  };

  const handleScratch = (id) => {
    setScratchCards(prev => prev.map(c => {
      if (c.id === id && !c.scratched) {
        setWalletBalance(w => w + c.amount);
        setWalletTransactions(t => [
          { id: Date.now(), type: 'CREDIT', title: `Reward Unlocked: ${c.title}`, amount: c.amount, date: 'Just now' },
          ...t
        ]);
        return { ...c, scratched: true };
      }
      return c;
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setActiveModal(null);
    alert("Profile details updated successfully! ✓");
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (newAddrText.trim()) {
      const newEntry = { id: Date.now(), tag: newAddrTag, address: newAddrText.trim(), isDefault: false };
      setAddresses(prev => [...prev, newEntry]);
      if (setUserAddress) setUserAddress(newAddrText.trim());
      setNewAddrText('');
    }
  };

  const handleDeleteAddress = (idToDelete) => {
    setAddresses(prev => prev.filter(a => a.id !== idToDelete));
  };

  const handleDeleteBookmark = (idToDelete) => {
    setBookmarkedItems(prev => prev.filter(b => b.id !== idToDelete));
  };

  const handleUploadPrescription = () => {
    const newRx = {
      id: Date.now(),
      title: `Rx - Grocery & Wellness #${Math.floor(1000 + Math.random() * 9000)}`,
      doctor: 'Dr. A. Verma (MD)',
      date: new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'VERIFIED'
    };
    setPrescriptions(prev => [newRx, ...prev]);
  };

  const handleCreateNewList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const cost = parseFloat(newListEstimatedCost) || 350;
    const newList = {
      id: Date.now(),
      name: newListName.trim(),
      desc: newListDesc.trim() || 'Custom curated recurring grocery list',
      total: cost,
      itemCount: 3,
      items: [
        { id: Date.now() + 1, name: `${newListName.trim()} Item #1`, price: Math.round(cost * 0.45) },
        { id: Date.now() + 2, name: `${newListName.trim()} Item #2`, price: Math.round(cost * 0.35) },
        { id: Date.now() + 3, name: `${newListName.trim()} Item #3`, price: Math.round(cost * 0.20) }
      ]
    };
    setShoppingLists(prev => [newList, ...prev]);
    setNewListName('');
    setNewListDesc('');
    setNewListEstimatedCost('500');
    setIsCreatingList(false);
  };

  const handleDeleteList = (idToDelete) => {
    setShoppingLists(prev => prev.filter(l => l.id !== idToDelete));
  };

  const handleDeletePrescription = (idToDelete) => {
    setPrescriptions(prev => prev.filter(p => p.id !== idToDelete));
  };

  const handleExportUserData = () => {
    const userData = {
      profile: { name: userName, phone: userPhone, email: userEmail, membership: userMembership },
      walletBalance: walletBalance,
      addresses: addresses,
      savedUpis: savedUpis,
      savedCards: savedCards,
      prescriptions: prescriptions,
      gstDetails: gstDetails,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KiranaStore_UserData_${userName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return;
    }
    setOldPassword('');
    setNewPassword('');
  };

  const handleDeleteAccount = () => {
    if (onLogout) onLogout();
  };

  const handleAddBookmarkToCart = (item) => {
    if (addToCart) {
      addToCart(item);
    }
  };

  // Profile Menu Items List
  const profileSections = [
    {
      group: "ORDERS & PAYMENTS",
      items: [
        { id: 'orders', label: 'Your Orders', icon: ShoppingBag, desc: 'Track live orders & view past invoices', badge: '1 Active', onClick: onNavigateToOrders },
        { id: 'wallet', label: 'Kirana Money (Wallet)', icon: Wallet, desc: `Balance: ₹${walletBalance} • Instant 1-Click Pay`, badge: `₹${walletBalance}`, highlight: true, onClick: () => setActiveModal('wallet') },
        { id: 'payment', label: 'Payment Settings', icon: CreditCard, desc: 'Manage saved UPI IDs & Cards', onClick: () => setActiveModal('payment') },
        { id: 'claimGift', label: 'Claim Gift Card / Voucher', icon: Ticket, desc: 'Redeem 16-digit voucher to wallet', onClick: () => setActiveModal('claimGift') },
        { id: 'rewards', label: 'Your Collected Rewards', icon: Award, desc: `${rewardPoints} Points • Scratch Cards`, badge: '2 Rewards', onClick: () => setActiveModal('rewards') },
      ]
    },
    {
      group: "SHOPPING PREFERENCES & SAVED",
      items: [
        { id: 'monthlyOrders', label: 'Monthly Orders & Lists', icon: Calendar, desc: 'Curated monthly grocery bundles & recurring healthcare lists', badge: `${shoppingLists.length + prescriptions.length} Active`, highlight: true, onClick: () => setActiveModal('monthlyOrders') },
        { id: 'priceAlerts', label: 'Price Drop & Stock Alerts', icon: Bell, desc: 'Wishlist price reduction alerts', onClick: () => setActiveModal('priceAlerts') },
        { id: 'address', label: 'Address Book', icon: MapPin, desc: `${addresses.length} Saved Addresses (Home, Work)`, onClick: () => setActiveModal('address') },
        { id: 'bookmarks', label: 'Bookmarks & Frequent Items', icon: Bookmark, desc: 'Fast 1-tap re-order staples', onClick: () => setActiveModal('bookmarks') },
        { id: 'wishlist', label: 'My Wishlist', icon: Heart, desc: `${Object.keys(wishlist).length} Saved Favorites`, badge: `${Object.keys(wishlist).length}`, onClick: onOpenWishlist },
        { id: 'giftCard', label: 'E-Gift Cards', icon: Gift, desc: 'Buy & gift grocery balance to loved ones', onClick: () => setActiveModal('giftCard') },
        { id: 'gst', label: 'GST Details & B2B Invoices', icon: Receipt, desc: 'Add GSTIN for business tax deductions', onClick: () => setActiveModal('gst') },
      ]
    },
    {
      group: "SUPPORT, APP & PRIVACY",
      items: [
        { id: 'liveNotifications', label: 'Live Notifications & Alerts', icon: Bell, desc: 'Order status, wallet cashback & flash deals', badge: '2 New', highlight: true, onClick: onOpenNotifications },
        { id: 'help', label: 'Need Help & Support', icon: HelpCircle, desc: '24/7 Customer Care & WhatsApp Assistance', onClick: onOpenSupport },
        { id: 'share', label: 'Share the App (Refer & Earn)', icon: Share2, desc: 'Earn ₹100 for every friend referred', badge: 'Get ₹100', highlight: true, onClick: () => setActiveModal('share') },
        { id: 'notifications', label: 'Notification Preferences', icon: Bell, desc: 'WhatsApp alerts, SMS & deal updates', onClick: () => setActiveModal('notifications') },
        { id: 'about', label: 'About KiranaStore', icon: Info, desc: 'Our single local store mission & FSSAI', onClick: () => setActiveModal('about') },
        { id: 'privacy', label: 'Account Privacy & Permissions', icon: ShieldCheck, desc: 'Data protection, GPS location & security', onClick: () => setActiveModal('privacy') },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28">
      
      {/* ── User Header Card ────────────────────────────────────────── */}
      {user ? (
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 rounded-3xl p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-2xl rounded-2xl flex items-center justify-center shadow-md">
              {(user.name || userName).slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">{user.name || userName}</h2>
                <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                  ⭐ {userMembership}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                <span>{user.phone || userPhone}</span>
                <span>•</span>
                <span className="text-gray-400">{user.email || userEmail}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('editProfile')}
              className="text-xs text-purple-600 dark:text-purple-400 font-extrabold bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200 dark:border-purple-800/60 px-3.5 py-2 rounded-2xl transition flex items-center gap-1 active:scale-95"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={onLogout}
              className="text-xs text-rose-600 dark:text-rose-400 font-extrabold bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-800/60 px-3.5 py-2 rounded-2xl transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
              👋
            </div>
            <div>
              <h2 className="text-xl font-black">Welcome to KiranaStore!</h2>
              <p className="text-xs text-emerald-100 font-medium mt-1">
                Sign in with your mobile number to unlock KiranaMoney wallet, saved addresses & exclusive offers.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            className="bg-white hover:bg-emerald-50 text-emerald-900 font-black px-6 py-3.5 rounded-2xl shadow-md text-xs flex items-center gap-2 transition active:scale-95 flex-shrink-0 cursor-pointer"
          >
            <span>SIGN IN / REGISTER</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* ── Quick Stat Highlights ──────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div
          onClick={() => setActiveModal('wallet')}
          className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-4 cursor-pointer shadow-sm hover:shadow-md transition active:scale-98"
        >
          <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider block mb-1">Kirana Money</span>
          <div className="text-2xl font-black">₹{walletBalance}</div>
          <span className="text-[11px] text-emerald-100 font-semibold mt-1 flex items-center gap-1">+ Add Cash →</span>
        </div>

        <div
          onClick={() => setActiveModal('rewards')}
          className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-4 cursor-pointer shadow-sm hover:shadow-md transition active:scale-98"
        >
          <span className="text-[10px] text-amber-100 font-bold uppercase tracking-wider block mb-1">Rewards</span>
          <div className="text-2xl font-black">{rewardPoints} pts</div>
          <span className="text-[11px] text-amber-100 font-semibold mt-1 flex items-center gap-1">Scratch Cards →</span>
        </div>

        <div
          onClick={onNavigateToOrders}
          className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl p-4 cursor-pointer shadow-sm hover:shadow-md transition active:scale-98"
        >
          <span className="text-[10px] text-purple-100 font-bold uppercase tracking-wider block mb-1">Your Orders</span>
          <div className="text-2xl font-black">1 Live</div>
          <span className="text-[11px] text-purple-100 font-semibold mt-1 flex items-center gap-1">Track Order →</span>
        </div>
      </div>

      {/* ── All Profile Sections List ──────────────────────────────── */}
      <div className="space-y-6">
        {profileSections.map((sec, sIdx) => (
          <div key={sIdx} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 rounded-3xl p-4 shadow-xs">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-400 px-3 pt-1 pb-2 uppercase tracking-wider">
              {sec.group}
            </h3>

            <div className="divide-y divide-gray-100 dark:divide-slate-700/60">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={item.onClick}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl cursor-pointer transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        item.highlight
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-brand-green border border-emerald-200 dark:border-emerald-800'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <div className="truncate">
                        <div className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="bg-brand-green/10 text-brand-green font-black text-[9px] px-2 py-0.5 rounded-full border border-brand-green/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium truncate mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <ChevronRight size={16} className="text-gray-300 dark:text-slate-500 group-hover:text-brand-green group-hover:translate-x-0.5 transition" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── App Preferences (Theme & Language) ──────────────────────── */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 rounded-3xl p-5 shadow-xs mt-6 space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-wider px-1">
          DEVICE PREFERENCES
        </h3>

        <div className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3 text-xs font-extrabold text-gray-800 dark:text-slate-200">
            <Globe size={18} className="text-purple-600" />
            <span>App Language (भाषा)</span>
          </div>
          <button
            onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
            className="bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-black text-xs px-3 py-1.5 rounded-xl"
          >
            {language === 'EN' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
          </button>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3 text-xs font-extrabold text-gray-800 dark:text-slate-200">
            {darkMode ? <Moon size={18} className="text-yellow-400" /> : <Sun size={18} className="text-amber-500" />}
            <span>Dark Theme</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
              darkMode ? 'bg-yellow-400 text-gray-900 shadow-sm' : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white'
            }`}
          >
            {darkMode ? 'DARK 🌙' : 'LIGHT ☀️'}
          </button>
        </div>
      </div>

      {/* ── Developer Credits Card ───────────────────────────────────── */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-sm mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/10">
            👨‍💻
          </div>
          <div>
            <div className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider">CREATOR & DEVELOPER</div>
            <h4 className="text-sm font-black text-white">App is developed by Akarshan Mishra</h4>
            <p className="text-[11px] text-purple-200/80 font-medium mt-0.5">Full Stack Quick-Commerce Platform • FastAPI & React</p>
          </div>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0">
          PROD VERIFIED ✓
        </span>
      </div>

      {/* ── MODALS / DRAWERS FOR EVERY PROFILE SECTION ───────────────── */}

      {/* 1. Kirana Money (Wallet) Modal */}
      {activeModal === 'wallet' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="bg-emerald-100 dark:bg-emerald-950 p-3 rounded-2xl text-brand-green">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Kirana Money Passbook</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">1-Click instant checkout on all grocery orders</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 rounded-3xl shadow-md mb-5">
              <span className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider block mb-1">Available KiranaMoney Balance</span>
              <div className="text-3xl font-black">₹{walletBalance.toFixed(2)}</div>
              <p className="text-[11px] text-emerald-100 mt-1">Zero payment failures • Instant refund destination</p>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-extrabold text-gray-700 dark:text-slate-300 mb-2">Top-Up Wallet Amount</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[200, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => handleAddWalletMoney(amt)}
                    className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-brand-green font-black text-xs py-2 rounded-xl hover:bg-emerald-100 transition"
                  >
                    + ₹{amt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Enter custom amount (e.g. 750)"
                  value={addAmountInput}
                  onChange={(e) => setAddAmountInput(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                />
                <button
                  onClick={() => handleAddWalletMoney(addAmountInput)}
                  className="bg-brand-green text-white font-black text-xs px-4 py-2 rounded-xl shadow"
                >
                  Add Money
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-extrabold text-xs text-gray-800 dark:text-slate-200 mb-2">Recent Passbook Activity</h4>
              <div className="space-y-2">
                {walletTransactions.map(tx => (
                  <div key={tx.id} className="bg-gray-50 dark:bg-slate-800/80 p-3 rounded-2xl flex items-center justify-between text-xs border border-gray-100 dark:border-slate-700">
                    <div>
                      <span className="font-extrabold block text-gray-900 dark:text-white">{tx.title}</span>
                      <span className="text-[10px] text-gray-400">{tx.date}</span>
                    </div>
                    <span className={`font-black ${tx.type === 'CREDIT' ? 'text-brand-green' : 'text-rose-600'}`}>
                      {tx.type === 'CREDIT' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Address Book Modal */}
      {activeModal === 'address' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 dark:bg-emerald-950 p-3 rounded-2xl text-brand-green">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Address Book</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Manage saved home, office & family addresses</p>
              </div>
            </div>

            <div className="space-y-2.5 mb-5">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                    addr.isDefault
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-brand-green text-gray-900 dark:text-white shadow-xs'
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'
                  }`}
                >
                  <div
                    onClick={() => {
                      if (setUserAddress) setUserAddress(addr.address);
                      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addr.id })));
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-xs">{addr.tag === 'Home' ? '🏠 Home' : addr.tag === 'Work' ? '🏢 Work' : '📍 ' + addr.tag}</span>
                      {addr.isDefault && (
                        <span className="bg-brand-green text-white text-[9px] font-black px-2 py-0.5 rounded-full">DEFAULT</span>
                      )}
                    </div>
                    <p className="text-xs font-medium leading-snug">{addr.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {addr.isDefault && <Check size={18} className="text-brand-green mt-1" />}
                    {!addr.isDefault && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                        className="text-gray-400 hover:text-rose-600 p-1.5 transition"
                        title="Delete Address"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNewAddress} className="border-t border-gray-100 dark:border-slate-700 pt-4 space-y-3">
              <h4 className="font-extrabold text-xs">Add New Address</h4>
              <div className="flex gap-2">
                {['Home', 'Work', 'Other'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNewAddrTag(tag)}
                    className={`flex-1 py-1.5 text-xs font-extrabold rounded-xl border transition ${
                      newAddrTag === tag ? 'bg-brand-green text-white border-brand-green' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                placeholder="Flat / Floor, Building Name, Street, Landmark, Pincode"
                value={newAddrText}
                onChange={(e) => setNewAddrText(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-brand-green hover:bg-green-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow transition"
              >
                + Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Bookmarks & Quick Re-order Modal */}
      {activeModal === 'bookmarks' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 dark:bg-amber-950 p-3 rounded-2xl text-amber-600">
                <Bookmark size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Bookmarked Essentials</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">1-Tap re-ordering for your frequent grocery staples</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {bookmarkedItems.map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <img src={item.image_url} alt={item.name} className="w-12 h-12 object-contain rounded-xl bg-gray-50 dark:bg-slate-800 p-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs truncate">{item.name}</h4>
                    <span className="text-[11px] text-gray-500">{item.weight_unit} • </span>
                    <span className="text-xs font-black text-gray-900 dark:text-white">₹{item.discount_price || item.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAddBookmarkToCart(item)}
                      className="bg-brand-green text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow hover:bg-green-800 transition active:scale-95"
                    >
                      + ADD
                    </button>
                    <button
                      onClick={() => handleDeleteBookmark(item.id)}
                      className="text-gray-400 hover:text-rose-600 p-1.5 transition"
                      title="Remove Bookmark"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. GST Details Modal */}
      {activeModal === 'gst' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-2xl text-blue-600">
                <Receipt size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">GSTIN & Business Invoicing</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Claim 18% input tax credit on business grocery purchases</p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('GST details saved successfully! Invoices will include your GSTIN.'); setActiveModal(null); }} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">15-Digit GSTIN Number</label>
                <input
                  type="text"
                  value={gstDetails.gstin}
                  onChange={(e) => setGstDetails({ ...gstDetails, gstin: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold uppercase"
                  placeholder="07AAAAA0000A1Z5"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Registered Legal Business Name</label>
                <input
                  type="text"
                  value={gstDetails.legalName}
                  onChange={(e) => setGstDetails({ ...gstDetails, legalName: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  placeholder="Company / Enterprise Name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Registered Billing Address</label>
                <textarea
                  rows={2}
                  value={gstDetails.registeredAddress}
                  onChange={(e) => setGstDetails({ ...gstDetails, registeredAddress: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl shadow transition"
              >
                Save GST Information
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Claim Gift Card / Voucher Modal */}
      {activeModal === 'claimGift' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-2xl text-purple-600">
                <Ticket size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Claim Gift Card / Voucher</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Instantly credit balance into your KiranaMoney</p>
              </div>
            </div>

            {claimStatus && (
              <div className={`p-3 rounded-xl text-xs font-bold mb-4 flex items-center gap-2 ${
                claimStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {claimStatus.success ? <CheckCircle2 size={16} className="text-emerald-600" /> : <X size={16} className="text-rose-600" />}
                <span>{claimStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleClaimVoucher} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">16-Digit Gift Card Number</label>
                <input
                  type="text"
                  placeholder="KIRANA-XXXX-XXXX-XXXX"
                  value={claimCode}
                  onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">4-Digit Security PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={claimPin}
                  onChange={(e) => setClaimPin(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-center"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs py-3 rounded-xl shadow transition"
              >
                Claim & Add to KiranaMoney
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Collected Rewards & Scratch Cards Modal */}
      {activeModal === 'rewards' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 dark:bg-amber-950 p-3 rounded-2xl text-amber-600">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Your Collected Rewards</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Scratch & win direct cash into KiranaMoney</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-2xl mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-100 uppercase">Loyalty Coins</span>
                <div className="text-2xl font-black">{rewardPoints} Points</div>
              </div>
              <button
                onClick={() => {
                  setWalletBalance(w => w + Math.floor(rewardPoints/10));
                  setRewardPoints(0);
                }}
                className="bg-white text-orange-700 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow"
              >
                Redeem ₹{Math.floor(rewardPoints/10)}
              </button>
            </div>

            <h4 className="font-extrabold text-xs text-gray-800 dark:text-slate-200 mb-2">Scratch Cards Available</h4>
            <div className="grid grid-cols-2 gap-3">
              {scratchCards.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleScratch(card.id)}
                  className={`p-4 rounded-2xl text-center cursor-pointer border transition flex flex-col justify-between min-h-[120px] ${
                    card.scratched
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-200'
                      : 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-transparent shadow hover:scale-102'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase">{card.title}</span>
                  <div className="my-2">
                    {card.scratched ? (
                      <span className="text-xl font-black">🎉 ₹{card.amount} Won</span>
                    ) : (
                      <span className="text-xs font-black bg-white/20 px-2.5 py-1 rounded-full animate-pulse">✨ Tap to Scratch</span>
                    )}
                  </div>
                  <span className="text-[9px] font-semibold opacity-80">{card.scratched ? 'Credited to Wallet' : 'Scratch & Win'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. E-Gift Cards Purchase Modal */}
      {activeModal === 'giftCard' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-pink-100 dark:bg-pink-950 p-3 rounded-2xl text-pink-600">
                <Gift size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Send E-Gift Card</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Gift fresh groceries to friends & family</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5">Select Card Denomination</label>
                <div className="grid grid-cols-4 gap-2">
                  {[250, 500, 1000, 2000].map(val => (
                    <button
                      key={val}
                      onClick={() => setGiftCardAmount(val)}
                      className={`py-2 rounded-xl text-xs font-black border transition ${
                        giftCardAmount === val ? 'bg-pink-600 text-white border-pink-600 shadow' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Recipient Email or Phone</label>
                <input
                  type="text"
                  placeholder="friend@example.com or +91 98765..."
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                />
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs py-3 rounded-xl shadow transition"
              >
                Purchase & Send Gift Card (₹{giftCardAmount})
              </button>
            </div>
          </div>
        </div>
      )}



      {/* 9. Payment Settings Modal (Full Management) */}
      {activeModal === 'payment' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-950 p-3 rounded-2xl text-indigo-600">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Manage Payment Methods</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Add, remove and manage saved UPI, cards & wallets</p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl mb-4 text-xs font-bold">
              {[
                { id: 'upi', label: '⚡ Saved UPI' },
                { id: 'cards', label: '💳 Cards' },
                { id: 'wallets', label: '💰 Wallets' },
                { id: 'netbanking', label: '🏦 NetBanking' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setPaymentSubTab(t.id)}
                  className={`flex-1 py-1.5 rounded-xl transition ${paymentSubTab === t.id ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs font-black' : 'text-gray-500'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: UPI Management */}
            {paymentSubTab === 'upi' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-gray-700 dark:text-slate-300">Saved UPI Handles ({savedUpis.length})</h4>
                  <button
                    onClick={() => setIsAddingUpi(!isAddingUpi)}
                    className="text-indigo-600 font-extrabold flex items-center gap-1 hover:underline text-xs"
                  >
                    <Plus size={13} /> Add New UPI
                  </button>
                </div>

                {isAddingUpi && (
                  <form onSubmit={handleAddNewUpi} className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-3 rounded-2xl space-y-2 animate-in slide-in-from-top duration-150">
                    <label className="font-black text-indigo-900 dark:text-indigo-200 block text-[11px]">Enter UPI ID / VPA</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newUpiInput}
                        onChange={(e) => setNewUpiInput(e.target.value)}
                        placeholder="e.g. mobile@paytm, user@okhdfcbank"
                        className="flex-1 p-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-mono outline-none text-gray-900 dark:text-white"
                      />
                      <button type="submit" className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-xl">Verify & Save</button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {savedUpis.map((vpa, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between border border-gray-200 dark:border-slate-700">
                      <div>
                        <span className="font-mono font-bold text-gray-900 dark:text-white block">{vpa}</span>
                        <span className="text-emerald-600 font-sans text-[10px] font-black">VERIFIED & LINKED ✓</span>
                      </div>
                      <button
                        onClick={() => handleDeleteUpi(vpa)}
                        className="text-gray-400 hover:text-rose-600 p-1.5 transition"
                        title="Delete UPI handle"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Cards Management */}
            {paymentSubTab === 'cards' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-gray-700 dark:text-slate-300">Saved Cards ({savedCards.length})</h4>
                  <button
                    onClick={() => setIsAddingCard(!isAddingCard)}
                    className="text-indigo-600 font-extrabold flex items-center gap-1 hover:underline text-xs"
                  >
                    <Plus size={13} /> Add New Card
                  </button>
                </div>

                {isAddingCard && (
                  <form onSubmit={handleAddNewCard} className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-3 rounded-2xl space-y-2 animate-in slide-in-from-top duration-150">
                    <div>
                      <label className="font-bold text-[10px] text-gray-600 block mb-0.5">Card Number (16 Digits)</label>
                      <input
                        type="text"
                        maxLength={19}
                        required
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-mono outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-[10px] text-gray-600 block mb-0.5">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={newCardHolder}
                          onChange={(e) => setNewCardHolder(e.target.value)}
                          placeholder="Akarshan Mishra"
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-[10px] text-gray-600 block mb-0.5">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          required
                          value={newCardExpiry}
                          onChange={(e) => setNewCardExpiry(e.target.value)}
                          placeholder="12/28"
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-mono outline-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-2 rounded-xl mt-1 shadow">
                      Save Tokenized Card
                    </button>
                  </form>
                )}

                <div className="space-y-2">
                  {savedCards.map(c => (
                    <div key={c.id} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between border border-gray-200 dark:border-slate-700">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-gray-900 dark:text-white">{c.bank}</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">{c.type}</span>
                        </div>
                        <span className="text-gray-400 font-mono text-[11px]">•••• •••• •••• {c.last4}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCard(c.id)}
                        className="text-gray-400 hover:text-rose-600 p-1.5 transition"
                        title="Delete Card"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Wallets */}
            {paymentSubTab === 'wallets' && (
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm block text-emerald-900 dark:text-emerald-200">KiranaMoney Wallet</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-black">₹{walletBalance} Balance</span>
                  </div>
                  <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full">ACTIVE</span>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold block">Paytm Wallet</span>
                    <span className="text-gray-400 text-[10px]">Linked to {user?.phone || '+91 9876543210'}</span>
                  </div>
                  <button className="text-indigo-600 font-extrabold text-xs">Linked ✓</button>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold block">Amazon Pay</span>
                    <span className="text-gray-400 text-[10px]">1-Click Checkout</span>
                  </div>
                  <button className="text-indigo-600 font-extrabold text-xs">Linked ✓</button>
                </div>
              </div>
            )}

            {/* Tab 4: Net Banking */}
            {paymentSubTab === 'netbanking' && (
              <div className="space-y-2 text-xs">
                <p className="text-gray-500 mb-2">Select your primary bank for direct net banking checkout:</p>
                {['HDFC Bank', 'State Bank of India (SBI)', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank (PNB)'].map((b, i) => (
                  <div key={i} className="p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-between border border-gray-200 dark:border-slate-700">
                    <span className="font-bold">{b}</span>
                    <button className="text-indigo-600 font-bold text-xs hover:underline">Select</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. Share the App / Refer & Earn Modal */}
      {activeModal === 'share' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 text-center">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="w-16 h-16 bg-gradient-to-tr from-brand-green to-teal-500 text-white rounded-3xl mx-auto flex items-center justify-center text-2xl mb-3 shadow-md">
              🎁
            </div>
            <h3 className="font-black text-lg">Refer Friends & Earn ₹100</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 mb-4">
              Give your neighbors ₹100 off their first grocery order, and get ₹100 credited to your KiranaMoney when they order!
            </p>

            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-3 rounded-2xl flex items-center justify-between gap-2 mb-4">
              <span className="font-mono text-xs font-bold truncate">kiranastore.com/ref/AKARSHAN100</span>
              <button
                onClick={handleCopyReferral}
                className="bg-brand-green text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow flex-shrink-0"
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <button
              onClick={handleCopyReferral}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-2xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Share Referral Link 💬</span>
            </button>
          </div>
        </div>
      )}

      {/* 11. Notification Preferences Modal */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 dark:bg-amber-950 p-3 rounded-2xl text-amber-600">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Notification Preferences</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Choose how you receive order and deal alerts</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { key: 'whatsapp', label: 'WhatsApp Order Updates', desc: 'Real-time rider dispatch & OTP updates' },
                { key: 'sms', label: 'SMS Delivery Receipts', desc: 'Order invoice & delivery confirmations' },
                { key: 'orderRadar', label: 'Live Dark Store Radar Chimes', desc: 'Sound alert when rider is within 500m' },
                { key: 'promos', label: 'Promotional Deals & Discounts', desc: 'Weekly fresh discounts & flash sales' }
              ].map(opt => (
                <div key={opt.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
                  <div>
                    <span className="font-extrabold block text-gray-900 dark:text-white">{opt.label}</span>
                    <span className="text-gray-400 text-[10px]">{opt.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[opt.key]}
                    onChange={(e) => setNotifications({ ...notifications, [opt.key]: e.target.checked })}
                    className="w-4 h-4 text-brand-green accent-brand-green rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 12. About Us Modal */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-brand-yellow text-gray-900 font-black text-xl rounded-2xl mx-auto flex items-center justify-center mb-2 shadow">
                ⚡
              </div>
              <h3 className="font-black text-lg">KiranaStore QuickCommerce</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Your Trusted Single Local Neighborhood Grocery Store</p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl space-y-2 text-xs text-gray-700 dark:text-slate-300 mb-4 border border-gray-100 dark:border-slate-700">
              <p>🌱 <strong>100% Farm Fresh:</strong> Daily sourced dairy, eggs, and farm vegetables.</p>
              <p>⚡ <strong>Hyper-Local Fulfillment:</strong> Dispatched from your neighborhood store hub.</p>
              <p>🛡️ <strong>FSSAI Certified:</strong> License #10020051003492.</p>
              <p>📍 <strong>Physical Hub:</strong> Sector 62, Noida, Uttar Pradesh.</p>
            </div>

            <div className="text-center text-[10px] text-gray-400">
              KiranaStore OS v2.4.0 • Built with Fast React & Python
            </div>
          </div>
        </div>
      )}

      {/* 13. Account Privacy & Security Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in duration-150 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-2xl text-blue-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Privacy & Account Security</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Control your personal data & active sessions</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="p-3.5 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-2">
                <span className="font-extrabold text-xs block text-gray-900 dark:text-white">Change Account Password</span>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Current Password"
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (min 6 chars)"
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl">
                  Update Password
                </button>
              </form>

              {/* Export Data */}
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <span className="font-extrabold block">Download Personal Data</span>
                  <span className="text-[10px] text-gray-400">Export profile, wallet & order receipts in JSON</span>
                </div>
                <button onClick={handleExportUserData} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs">
                  Export JSON
                </button>
              </div>

               {/* Active Sessions */}
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <span className="font-extrabold block">Active Logged-in Sessions</span>
                  <span className="text-[10px] text-emerald-600 font-bold">1 Active Device (Verified Session)</span>
                </div>
                <span className="text-emerald-600 font-bold text-xs">Secured ✓</span>
              </div>

              {/* Delete Account */}
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800/60 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-rose-700 dark:text-rose-300 block">Delete Account</span>
                  <span className="text-[10px] text-rose-500">Permanently erase all personal data & wallet balance</span>
                </div>
                <button onClick={handleDeleteAccount} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ─────────────────────────────────────── */}
      {activeModal === 'editProfile' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in duration-150">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <h3 className="font-black text-lg text-gray-900 dark:text-white mb-1">Edit Profile Details</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">Update your personal account information</p>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3 rounded-xl shadow mt-2"
              >
                Save Changes ✓
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 14. Combined Monthly Orders & Recurring Lists Modal */}
      {activeModal === 'monthlyOrders' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in duration-150 max-h-[88vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full">
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-2xl text-purple-600">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg">Monthly Orders & Recurring Lists</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Manage monthly grocery bundles & health prescriptions</p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl mb-4 text-xs font-bold">
              <button
                onClick={() => setMonthlyTab('lists')}
                className={`flex-1 py-2 rounded-xl transition ${monthlyTab === 'lists' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs font-black' : 'text-gray-500'}`}
              >
                📦 Monthly Lists ({shoppingLists.length})
              </button>
              <button
                onClick={() => setMonthlyTab('prescriptions')}
                className={`flex-1 py-2 rounded-xl transition ${monthlyTab === 'prescriptions' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs font-black' : 'text-gray-500'}`}
              >
                💊 Monthly Healthcare List ({prescriptions.length})
              </button>
            </div>

            {/* Tab 1: Monthly Lists & Custom Lists */}
            {monthlyTab === 'lists' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-gray-700 dark:text-slate-300">Your Saved Bundles</span>
                  <button
                    onClick={() => setIsCreatingList(!isCreatingList)}
                    className="text-purple-600 font-extrabold flex items-center gap-1 hover:underline text-xs"
                  >
                    <Plus size={13} /> {isCreatingList ? 'Cancel' : 'Create New List'}
                  </button>
                </div>

                {/* Create New List Form */}
                {isCreatingList && (
                  <form onSubmit={handleCreateNewList} className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 p-3 rounded-2xl space-y-2.5 animate-in slide-in-from-top duration-150">
                    <span className="font-black text-purple-900 dark:text-purple-200 block text-xs">Create Custom Shopping List</span>
                    <div>
                      <label className="font-bold text-[10px] text-gray-600 dark:text-slate-400 block mb-0.5">List Name *</label>
                      <input
                        type="text"
                        required
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="e.g. Monthly Atta & Dal Pack, Weekend Breakfast"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[10px] text-gray-600 dark:text-slate-400 block mb-0.5">Items Description</label>
                      <input
                        type="text"
                        value={newListDesc}
                        onChange={(e) => setNewListDesc(e.target.value)}
                        placeholder="e.g. Aashirvaad Atta 5kg, Fortune Oil 1L, Toor Dal"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[10px] text-gray-600 dark:text-slate-400 block mb-0.5">Estimated Budget (₹)</label>
                      <input
                        type="number"
                        value={newListEstimatedCost}
                        onChange={(e) => setNewListEstimatedCost(e.target.value)}
                        placeholder="500"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-2 rounded-xl shadow mt-1"
                    >
                      Save Shopping List ✓
                    </button>
                  </form>
                )}

                {/* List of Shopping Bundles */}
                <div className="space-y-3">
                  {shoppingLists.map(list => (
                    <div key={list.id} className="p-3.5 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-sm text-gray-900 dark:text-white block">{list.name}</span>
                          <span className="font-black text-purple-600 text-xs">₹{list.total} Total • {list.itemCount} Items</span>
                        </div>
                        <button
                          onClick={() => handleDeleteList(list.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 transition"
                          title="Delete List"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="text-gray-500 text-[11px] leading-snug">{list.desc}</p>
                      <button
                        onClick={() => {
                          list.items?.forEach(item => addToCart(item));
                          setActiveModal(null);
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-2 rounded-xl flex items-center justify-center gap-1.5 shadow active:scale-98 transition"
                      >
                        <ShoppingBag size={13} /> Add Entire List to Cart (₹{list.total})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Monthly Healthcare List */}
            {monthlyTab === 'prescriptions' && (
              <div className="space-y-3 text-xs">
                <div className="space-y-2.5 mb-3">
                  {prescriptions.map(p => (
                    <div key={p.id} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold block text-gray-900 dark:text-white">{p.title}</span>
                        <span className="text-gray-400 text-[10px]">{p.doctor} • {p.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">{p.status}</span>
                        <button
                          onClick={() => handleDeletePrescription(p.id)}
                          className="text-gray-400 hover:text-rose-600 p-1"
                          title="Delete Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleUploadPrescription}
                  className="w-full border-2 border-dashed border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 p-4 rounded-2xl text-center text-xs font-bold text-purple-600 dark:text-purple-300 flex flex-col items-center gap-1 transition active:scale-98"
                >
                  <Upload size={20} />
                  <span>+ Upload Monthly Healthcare List / Rx (Image / PDF)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 16. Price Drop & Stock Alerts Modal */}
      {activeModal === 'priceAlerts' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full"><X size={18} /></button>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 dark:bg-amber-950 p-3 rounded-2xl text-amber-600"><Bell size={24} /></div>
              <div>
                <h3 className="font-extrabold text-lg">Price Drop & Back-in-Stock Alerts</h3>
                <p className="text-xs text-gray-500">Get notified when wishlisted prices drop or restock</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-extrabold block">Amul Pure Cow Ghee (1 L)</span>
                  <span className="text-emerald-600 font-bold">Alert on: Price &lt; ₹580</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-extrabold block">Fresh Paneer Block (200 g)</span>
                  <span className="text-purple-600 font-bold">Alert on: Restock In-Stock</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instant Recharge Payment Gateway Modal */}
      {isRechargePaymentOpen && (
        <RazorpayModal
          isOpen={isRechargePaymentOpen}
          amount={rechargeAmount}
          onClose={() => setIsRechargePaymentOpen(false)}
          onPaymentSuccess={handleRechargeSuccess}
        />
      )}

    </div>
  );
}
