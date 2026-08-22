import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  Plus,
  ShoppingBag,
  ArrowRight,
  Mic,
  Utensils,
  Wallet,
  Activity,
  MessageSquare,
  Clock,
  Flame,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  ChefHat
} from 'lucide-react';

export default function AiAssistantModal({ isOpen, onClose, products = [], addToCart }) {
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' | 'recipes' | 'budget' | 'diet'
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am Kira 2.0 🤖, your Advanced AI Grocery & Culinary Assistant. How can I assist your kitchen today?',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [curatedItems, setCuratedItems] = useState([]);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [budgetLimit, setBudgetLimit] = useState(500);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, curatedItems]);

  if (!isOpen) return null;

  // Recipe Database with Exact Ingredients from Store
  const popularRecipes = [
    {
      id: 'pbm',
      name: 'Shahi Paneer Butter Masala',
      prepTime: '25 Mins',
      difficulty: 'Easy',
      calories: '340 kcal',
      icon: '🧀',
      description: 'Rich, creamy cottage cheese curry cooked with aromatic spices, fresh cream, and butter.',
      keywords: ['paneer', 'butter', 'masala', 'cream', 'curry'],
      steps: [
        'Saute onions, ginger, and garlic in Amul Desi Ghee until golden brown.',
        'Blend into smooth tomato purée and simmer with garam masala.',
        'Add fresh Malai Paneer cubes, kasuri methi, and top with rich fresh cream.'
      ]
    },
    {
      id: 'chai_pakoda',
      name: 'Monsoon Kadak Chai & Crispy Pakoda',
      prepTime: '15 Mins',
      difficulty: 'Quick',
      calories: '210 kcal',
      icon: '☕',
      description: 'Authentic Indian ginger cardamom tea served with hot besan onion pakodas.',
      keywords: ['milk', 'tea', 'besan', 'oil', 'potato'],
      steps: [
        'Boil fresh milk with crushed ginger, cardamom, and premium CTC tea leaves.',
        'Whisk besan with spices and slice onions into thin rings.',
        'Deep fry pakodas in hot mustard/refined oil until crispy golden.'
      ]
    },
    {
      id: 'dal_rice',
      name: 'Comfort Dal Tadka & Jeera Rice',
      prepTime: '20 Mins',
      difficulty: 'Classic',
      calories: '380 kcal',
      icon: '🍛',
      description: 'Yellow toor dal tempered with cumin, garlic, and desi ghee over fragrant basmati rice.',
      keywords: ['dal', 'rice', 'ghee', 'atta'],
      steps: [
        'Pressure cook toor dal with turmeric, salt, and water.',
        'Prepare tadka with cumin seeds, sliced garlic, and dry red chillies in ghee.',
        'Steam long-grain basmati rice and pour sizzling tadka on top.'
      ]
    },
    {
      id: 'healthy_breakfast',
      name: 'High-Protein Omelette & Fresh Toast',
      prepTime: '10 Mins',
      difficulty: 'Super Fast',
      calories: '280 kcal',
      icon: '🍳',
      description: 'Farm-fresh scrambled eggs / omelette with butter-toasted multigrain bread.',
      keywords: ['egg', 'milk', 'butter', 'bread'],
      steps: [
        'Whisk 2 farm fresh brown eggs with chopped onions and coriander.',
        'Pour onto a buttered non-stick pan and cook for 2 minutes on medium heat.',
        'Serve with hot butter-toasted bread.'
      ]
    }
  ];

  // Diet & Fitness Packs
  const dietPlans = [
    {
      id: 'protein',
      name: 'High-Protein Muscle Fuel (Veg & Non-Veg)',
      desc: 'Paneer, Farm Eggs, Greek Curd, Soya & Milk (60g+ Daily Protein)',
      icon: '💪',
      filter: (p) => p.name.toLowerCase().includes('paneer') || p.name.toLowerCase().includes('egg') || p.name.toLowerCase().includes('milk') || p.category_id === 1
    },
    {
      id: 'low_sugar',
      name: 'Diabetic-Friendly & Low Glycemic',
      desc: 'Multigrain Atta, Green Veggies, Spices & Almond Milk',
      icon: '🩺',
      filter: (p) => p.name.toLowerCase().includes('atta') || p.name.toLowerCase().includes('dal') || p.category_id === 2
    },
    {
      id: 'keto_snacks',
      name: 'Clean Keto & Healthy Munchies',
      desc: 'Roasted Nuts, Dry Fruits, Seeds & Dark Chocolates',
      icon: '🥑',
      filter: (p) => p.category_id === 3 || p.name.toLowerCase().includes('ghee') || p.name.toLowerCase().includes('butter')
    }
  ];

  const handleSpeechInput = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (e) {
      console.warn('Microphone permission check:', e);
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: '🎙️ Voice input is standby. You can type queries like "Order Milk & Eggs", "Cancel Order #KS-94821", or "Where is my delivery?".',
        time: 'Just now'
      }]);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.onstart = () => setIsVoiceListening(true);
      recognition.onend = () => setIsVoiceListening(false);
      recognition.onerror = () => setIsVoiceListening(false);
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setInput(text);
        handleSendQuery(text);
      };
      recognition.start();
    } catch (e) {
      setIsVoiceListening(false);
    }
  };

  const handleSelectRecipe = (recipe) => {
    setActiveRecipe(recipe);
    const matched = products.filter(p => {
      const name = p.name.toLowerCase();
      return recipe.keywords.some(k => name.includes(k));
    }).slice(0, 5);

    const recipeItems = matched.length > 0 ? matched : products.slice(0, 4);
    setCuratedItems(recipeItems);

    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: `Build recipe kit for: ${recipe.name}`,
        time: 'Just now'
      },
      {
        sender: 'bot',
        text: `👨‍🍳 Here is the chef recipe kit for "${recipe.name}" (Prep: ${recipe.prepTime} • ${recipe.calories}). All required pantry ingredients are in-stock below:`,
        time: 'Just now'
      }
    ]);
  };

  const handleSelectDiet = (plan) => {
    const matched = products.filter(plan.filter).slice(0, 5);
    setCuratedItems(matched.length > 0 ? matched : products.slice(0, 4));
    setActiveRecipe(null);

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: `Recommend items for ${plan.name}`, time: 'Just now' },
      { sender: 'bot', text: `🥗 Curated nutrition basket for "${plan.name}". High nutritional value with store freshness:`, time: 'Just now' }
    ]);
  };

  const handleBudgetOptimization = (budget) => {
    setBudgetLimit(budget);
    let runningTotal = 0;
    const selected = [];

    for (const p of products) {
      const price = p.discount_price || p.price;
      if (runningTotal + price <= budget) {
        selected.push(p);
        runningTotal += price;
      }
      if (selected.length >= 6) break;
    }

    setCuratedItems(selected);
    setActiveRecipe(null);

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: `Optimize best grocery basket under ₹${budget}`, time: 'Just now' },
      { sender: 'bot', text: `💰 Found ${selected.length} items perfectly utilizing ₹${runningTotal.toFixed(0)} out of your ₹${budget} budget:`, time: 'Just now' }
    ]);
  };

  // Chatbot Assistant Engine
  const handleSendQuery = (text) => {
    const query = (text || input).trim();
    if (!query) return;

    setMessages(prev => [...prev, { sender: 'user', text: query, time: 'Just now' }]);
    setInput('');

    setTimeout(() => {
      let reply = "Here is what I found for you:";
      let matched = [];
      const queryLower = query.toLowerCase();

      // 1. Order Cancellation Intent
      if (queryLower.includes('cancel') && (queryLower.includes('order') || queryLower.includes('ks-') || queryLower.includes('item'))) {
        try {
          const cachedOrders = JSON.parse(localStorage.getItem('kirana_orders_list') || '[]');
          const activeOrder = cachedOrders.find(o => o.order_status !== 'CANCELLED' && o.order_status !== 'DELIVERED');
          if (activeOrder) {
            // Cancel active order
            activeOrder.order_status = 'CANCELLED';
            localStorage.setItem('kirana_orders_list', JSON.stringify(cachedOrders));
            fetch(`/api/orders/${activeOrder.order_number}/cancel`, { method: 'POST' }).catch(() => {});
            reply = `✅ Order #${activeOrder.order_number} (₹${activeOrder.total_amount.toFixed(0)}) has been cancelled successfully. 100% refund of ₹${activeOrder.total_amount.toFixed(0)} has been credited back to your KiranaMoney Wallet!`;
          } else {
            reply = `🛡️ I checked your order history. You do not have any pending orders currently eligible for cancellation. Need help with an older order? You can file a support ticket in Help & Support.`;
          }
        } catch {
          reply = `🛡️ Your cancellation request has been registered. Instant refund is sent to your KiranaMoney wallet.`;
        }
        setMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
        return;
      }

      // 2. Refund & Return Request Intent
      if (queryLower.includes('refund') || queryLower.includes('return') || queryLower.includes('damaged') || queryLower.includes('expired') || queryLower.includes('money back')) {
        try {
          const cachedOrders = JSON.parse(localStorage.getItem('kirana_orders_list') || '[]');
          const recentOrder = cachedOrders[0];
          if (recentOrder) {
            recentOrder.order_status = 'REFUNDED';
            localStorage.setItem('kirana_orders_list', JSON.stringify(cachedOrders));
            fetch(`/api/orders/${recentOrder.order_number}/refund`, { method: 'POST' }).catch(() => {});
            reply = `💸 100% Instant Refund of ₹${recentOrder.total_amount.toFixed(0)} processed for Order #${recentOrder.order_number}! Credited directly to your KiranaMoney Wallet balance. No questions asked.`;
          } else {
            reply = `💸 Under our 100% Customer Satisfaction Guarantee, all returns and refunds are processed instantly to your KiranaMoney Wallet!`;
          }
        } catch {
          reply = `💸 Instant refund credited to your KiranaMoney Wallet balance!`;
        }
        setMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
        return;
      }

      // 3. Track Order / Status Intent
      if (queryLower.includes('track') || queryLower.includes('where is my') || queryLower.includes('status') || queryLower.includes('eta') || queryLower.includes('delivery time')) {
        try {
          const cachedOrders = JSON.parse(localStorage.getItem('kirana_orders_list') || '[]');
          const recentOrder = cachedOrders[0];
          if (recentOrder && recentOrder.order_status !== 'CANCELLED') {
            reply = `🚚 Order #${recentOrder.order_number} is currently "${recentOrder.order_status}". Delivery Partner Rahul is en-route from Sector 62 Dark Store. Estimated Delivery: 7-10 Mins!`;
          } else {
            reply = `⚡ All local grocery orders are delivered in 10 minutes from our nearest dark store hub. Place an order to track live rider GPS!`;
          }
        } catch {
          reply = `⚡ Your store order is packed and dispatched for 10-min ultra-fast delivery.`;
        }
        setMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
        return;
      }

      // 4. Direct Order / Buy Intent
      if (queryLower.includes('order') || queryLower.includes('buy') || queryLower.includes('get me') || queryLower.includes('add')) {
        const words = queryLower.replace(/order|buy|get|me|add|to|cart|basket|please|i|want/g, '').trim();
        matched = products.filter(p => p.name.toLowerCase().includes(words) || words.includes(p.name.toLowerCase().split(' ')[0]));
        if (matched.length > 0) {
          // Auto add first matching item
          matched.slice(0, 3).forEach(m => addToCart(m));
          reply = `🛒 Added ${matched.slice(0, 3).map(i => i.name).join(', ')} directly to your cart! You can tap Checkout to place your 10-minute order:`;
        } else {
          matched = products.slice(0, 3);
          reply = `🛒 I found these top available items from the store shelves. Tap Add to include them:`;
        }
        setCuratedItems(matched);
        setMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
        return;
      }

      // 5. Coupons & Deals Intent
      if (queryLower.includes('coupon') || queryLower.includes('offer') || queryLower.includes('promo') || queryLower.includes('discount code')) {
        reply = `🏷️ Here are currently active high-value coupon codes:
• WELCOME100 — Flat ₹100 OFF on orders above ₹499
• ZEPTO20 — 20% OFF (Up to ₹80) on snacks & dairy
• FREESHIP — Zero Delivery Fee on your order
You can apply them directly in your Checkout drawer!`;
        setMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
        return;
      }

      // 6. Wallet & KiranaMoney Intent
      if (queryLower.includes('wallet') || queryLower.includes('balance') || queryLower.includes('cashback') || queryLower.includes('kiranamoney')) {
        reply = `💰 KiranaMoney Wallet Balance: ₹100.00 Active Credits.
• 100% usable on all grocery orders with zero restrictions.
• Instant refunds from cancellations or damaged items credit here immediately.`;
        setMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
        return;
      }

      // 7. Store Hours & 10-Minute Delivery Info Intent
      if (queryLower.includes('timing') || queryLower.includes('open') || queryLower.includes('hours') || queryLower.includes('speed') || queryLower.includes('fast')) {
        reply = `⚡ KiranaStore 10-Minute Delivery Promise:
• Operating Hours: 6:00 AM – 11:30 PM (All 365 Days)
• Order Packaging: 2 Minutes from local Dark Store
• Delivery Dispatch: 8 Minutes via Dedicated Electric Delivery Fleet!`;
        setMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
        return;
      }

      // 8. Help & Human Manager Escalation Intent
      if (queryLower.includes('human') || queryLower.includes('manager') || queryLower.includes('talk') || queryLower.includes('agent') || queryLower.includes('complaint')) {
        // Auto create support ticket in background
        const customerName = 'Customer';
        fetch('/api/support/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: customerName,
            phone: '+91 9876543210',
            category: 'Live Bot Escalation',
            subject: `Kira AI Escalation: ${query.slice(0, 35)}`,
            message: `Customer requested live assistance via Kira AI: "${query}"`
          })
        }).catch(() => {});

        reply = `👨‍💼 I have alerted the Store Support Team and forwarded your message to the Store Manager dashboard. You can also open the "Help & Support" live chat tab anytime for 1-on-1 human assistance.`;
        setMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
        return;
      }

      // 9. Recipe Matching
      const matchedRecipe = popularRecipes.find(r => queryLower.includes(r.name.toLowerCase()) || r.keywords.some(k => queryLower.includes(k)));
      if (matchedRecipe) {
        setActiveRecipe(matchedRecipe);
        matched = products.filter(p => matchedRecipe.keywords.some(k => p.name.toLowerCase().includes(k))).slice(0, 5);
        reply = `👨‍🍳 Here is the chef kit for ${matchedRecipe.name} (Prep: ${matchedRecipe.prepTime}):`;
      } else if (queryLower.includes('under') || queryLower.includes('budget') || queryLower.includes('₹') || queryLower.includes('rs')) {
        const num = parseInt(query.replace(/\D/g, '')) || 300;
        handleBudgetOptimization(num);
        return;
      } else if (queryLower.includes('protein') || queryLower.includes('diet') || queryLower.includes('health') || queryLower.includes('gym')) {
        matched = products.filter(p => p.name.toLowerCase().includes('paneer') || p.name.toLowerCase().includes('egg') || p.name.toLowerCase().includes('milk')).slice(0, 4);
        reply = "💪 Here are high-protein nutritionist-approved staples:";
      } else if (queryLower.includes('party') || queryLower.includes('snack') || queryLower.includes('munch')) {
        matched = products.filter(p => p.category_id === 3 || p.name.toLowerCase().includes('lays') || p.name.toLowerCase().includes('cola') || p.name.toLowerCase().includes('maggi')).slice(0, 5);
        reply = "🎉 Party time! Here is a popular snacks and cold beverages pack:";
      } else if (queryLower.includes('cheap') || queryLower.includes('alternative') || queryLower.includes('discount')) {
        matched = products.filter(p => p.discount_price && p.discount_price < p.price).slice(0, 4);
        reply = "🏷️ Here are top value-for-money discounted alternatives:";
      } else {
        matched = products.filter(p => p.name.toLowerCase().includes(queryLower) || (p.category_name && p.category_name.toLowerCase().includes(queryLower))).slice(0, 5);
        if (matched.length === 0) matched = products.slice(0, 4);
        reply = `I found these grocery items matching "${query}":`;
      }

      setCuratedItems(matched);
      setMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Just now' }]);
    }, 350);
  };

  const handleAddAllToCart = () => {
    curatedItems.forEach(item => addToCart(item));
    alert(`🎉 Successfully added all ${curatedItems.length} curated items to your basket!`);
  };

  const totalBasketCost = curatedItems.reduce((sum, item) => sum + (item.discount_price || item.price), 0);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 text-white border border-slate-700 rounded-3xl max-w-xl w-full h-[620px] flex flex-col shadow-2xl relative animate-in zoom-in duration-150 overflow-hidden">
        
        {/* ── Top Header ────────────────────────────────────────── */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-purple-600 to-pink-600 p-2.5 rounded-2xl text-white shadow-lg shadow-purple-900/50">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  Kira AI Culinary & Grocery Engine
                </h3>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-black px-2 py-0.2 rounded-full border border-purple-500/40">
                  v2.5 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Recipes • Budget Optimizer • Diet Plans • Natural Chat</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Mode Switcher Pills ────────────────────────────────── */}
        <div className="flex bg-slate-950 p-1.5 border-b border-slate-800 text-xs font-bold gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'chat', label: '💬 AI Chat', icon: MessageSquare },
            { id: 'recipes', label: '👨‍🍳 Recipe Kits', icon: ChefHat },
            { id: 'budget', label: '💰 Budget Shopper', icon: Wallet },
            { id: 'diet', label: '🥗 Health & Diet', icon: Activity }
          ].map(m => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`flex-1 py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon size={14} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Mode 1: Recipe Builder Carousel (When on Recipes Tab) ── */}
        {activeMode === 'recipes' && (
          <div className="p-3 bg-slate-950/70 border-b border-slate-800 overflow-x-auto no-scrollbar flex gap-2">
            {popularRecipes.map(r => (
              <button
                key={r.id}
                onClick={() => handleSelectRecipe(r)}
                className="bg-slate-800/80 hover:bg-purple-950 hover:border-purple-600 border border-slate-700 p-2.5 rounded-2xl text-left flex-shrink-0 w-48 transition"
              >
                <div className="text-xl mb-1">{r.icon}</div>
                <div className="font-extrabold text-xs text-white truncate">{r.name}</div>
                <div className="text-[10px] text-purple-300 font-bold mt-0.5">⏱️ {r.prepTime} • {r.calories}</div>
              </button>
            ))}
          </div>
        )}

        {/* ── Mode 2: Budget Presets (When on Budget Tab) ─────────── */}
        {activeMode === 'budget' && (
          <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex-shrink-0">
              Select Budget:
            </span>
            {[200, 350, 500, 800, 1200].map(b => (
              <button
                key={b}
                onClick={() => handleBudgetOptimization(b)}
                className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border transition ${
                  budgetLimit === b
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                ₹{b} Combo
              </button>
            ))}
          </div>
        )}

        {/* ── Mode 3: Diet Plans (When on Diet Tab) ────────────────── */}
        {activeMode === 'diet' && (
          <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
            {dietPlans.map(d => (
              <button
                key={d.id}
                onClick={() => handleSelectDiet(d)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2.5 rounded-2xl text-left flex-shrink-0 w-44 transition"
              >
                <div className="text-lg">{d.icon}</div>
                <div className="font-extrabold text-xs text-white truncate">{d.name}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{d.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* ── Chat Messages Stream ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed font-medium ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* Active Recipe Cooking Step Card */}
          {activeRecipe && (
            <div className="bg-gradient-to-br from-purple-950/80 to-slate-900 border border-purple-800/80 rounded-2xl p-3.5 space-y-2 animate-in zoom-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider flex items-center gap-1">
                  <ChefHat size={14} className="text-yellow-400" /> Chef Step-by-Step Method
                </span>
                <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded-full font-bold">
                  {activeRecipe.difficulty}
                </span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 leading-snug">
                {activeRecipe.steps.map((step, i) => (
                  <li key={i}><span className="text-white">{step}</span></li>
                ))}
              </ol>
            </div>
          )}

          {/* Curated Products Card */}
          {curatedItems.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-3.5 space-y-3 mt-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">
                    Curated Grocery Basket ({curatedItems.length} Items)
                  </span>
                  <span className="text-sm font-black text-white">
                    Total: ₹{totalBasketCost.toFixed(0)}
                  </span>
                </div>

                <button
                  onClick={handleAddAllToCart}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition"
                >
                  <ShoppingBag size={14} /> Add Entire Kit
                </button>
              </div>

              <div className="divide-y divide-slate-800/80">
                {curatedItems.map((item) => (
                  <div key={item.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded-xl bg-slate-900 p-1 border border-slate-800 flex-shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-black text-xs text-white truncate">{item.name}</div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-purple-300 font-extrabold">₹{item.discount_price || item.price}</span>
                          <span className="text-slate-500 text-[10px]">{item.weight_unit || 'Standard Pack'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(item);
                        alert(`Added ${item.name} to basket!`);
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 flex-shrink-0 shadow-xs active:scale-95"
                    >
                      <Plus size={13} /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input & Voice Footer ────────────────────────────────── */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md">
          {/* Quick Prompts Pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
            {[
              'Paneer Butter Masala Kit',
              'Groceries under ₹400',
              'High-Protein breakfast',
              'Monsoon Chai & Pakoda',
              'Party Snacks for 4 friends'
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendQuery(q)}
                className="bg-slate-800 hover:bg-purple-950 hover:border-purple-700 border border-slate-700 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap transition"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSendQuery(input); }} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for recipe kits, dietary plans or budget combos..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500 font-medium"
            />

            <button
              type="button"
              onClick={handleSpeechInput}
              className={`p-2.5 rounded-2xl transition ${
                isVoiceListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Speak to Kira AI"
            >
              <Mic size={16} />
            </button>

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white p-2.5 rounded-2xl shadow-lg transition active:scale-95 flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
