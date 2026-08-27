import React, { useState, useEffect, useRef } from 'react';
import { 
  HelpCircle, MessageSquare, Phone, CheckCircle2, Clock, AlertCircle, 
  Send, X, User, RefreshCw, Bot, Sparkles, Star, Plus, Trash2, Edit, 
  Search, Filter, ShieldCheck, Zap, ArrowRight, CornerDownRight, Check, AlertTriangle
} from 'lucide-react';

export default function SupportView() {
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'ai_studio' | 'ratings'
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [ticketSearch, setTicketSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // --- Tickets & Chats State ---
  const [tickets, setTickets] = useState([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    customer_name: '',
    phone: '',
    order_number: '',
    category: 'Order Issue',
    subject: '',
    message: ''
  });

  // --- Kira AI Knowledge Base State ---
  const [aiKnowledge, setAiKnowledge] = useState([]);
  const [aiSearch, setAiSearch] = useState('');
  const [aiCategoryFilter, setAiCategoryFilter] = useState('ALL');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [editingAiEntry, setEditingAiEntry] = useState(null);
  const [aiFormData, setAiFormData] = useState({
    topic: '',
    category: 'GENERAL',
    keywords: '',
    intent: 'FAQ',
    response_template: '',
    action_trigger: '',
    confidence_score: 0.95,
    is_active: true
  });

  // AI Live Playground / Tester
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isTestingAi, setIsTestingAi] = useState(false);

  // --- Customer Ratings & Feedback State ---
  const [ratingsList, setRatingsList] = useState([]);
  const [ratingStarFilter, setRatingStarFilter] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // 1. Fetch Tickets & Live Chats
  const loadTickets = async () => {
    try {
      const [ticketsRes, chatsRes] = await Promise.all([
        fetch('/api/admin/support/tickets'),
        fetch('/api/admin/support/chats')
      ]);

      let loadedTickets = [];
      let loadedChats = [];

      if (ticketsRes.ok) loadedTickets = await ticketsRes.json();
      if (chatsRes.ok) loadedChats = await chatsRes.json();

      const ticketMap = {};

      if (Array.isArray(loadedTickets)) {
        loadedTickets.forEach(t => {
          const tid = t.ticket_id || `TICK-${t.id}`;
          ticketMap[tid] = {
            id: tid,
            ticket_id: tid,
            customer: t.customer_name,
            customer_name: t.customer_name,
            phone: t.phone,
            orderNumber: t.order_number || 'General',
            order_number: t.order_number,
            category: t.category,
            subject: t.subject,
            message: t.message,
            messages: [
              { sender: 'customer', text: t.message, time: new Date(t.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ],
            status: t.status || 'OPEN',
            priority: t.priority || 'HIGH',
            date: new Date(t.created_at || Date.now()).toLocaleDateString()
          };
        });
      }

      if (Array.isArray(loadedChats)) {
        loadedChats.forEach(c => {
          const tid = c.ticket_id || (c.phone ? `LIVE-${c.phone.slice(-10)}` : 'LIVE-CHAT');
          if (!ticketMap[tid]) {
            ticketMap[tid] = {
              id: tid,
              ticket_id: tid,
              customer: c.customer_name || 'App Customer',
              customer_name: c.customer_name || 'App Customer',
              phone: c.phone || '+91 9876543210',
              orderNumber: 'Live Chat',
              order_number: null,
              category: 'Live In-App Chat',
              subject: `Live Chat: ${c.text.slice(0, 30)}...`,
              message: c.text,
              messages: [],
              status: 'OPEN',
              priority: 'HIGH',
              date: new Date(c.created_at || Date.now()).toLocaleDateString()
            };
          }

          ticketMap[tid].messages.push({
            sender: c.sender,
            text: c.text,
            time: new Date(c.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        });
      }

      const allList = Object.values(ticketMap);
      if (allList.length > 0) {
        setTickets(allList);
        setSelectedTicket(prev => {
          if (!prev) return allList[0];
          return allList.find(t => t.id === prev.id) || allList[0];
        });
      }
    } catch (err) {
      console.warn('Could not fetch tickets/chats:', err);
    }
  };

  // 2. Fetch AI Knowledge Base
  const loadAiKnowledge = async () => {
    try {
      const res = await fetch('/api/admin/ai/knowledge');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAiKnowledge(data);
        }
      }
    } catch (e) {
      console.warn('Could not fetch AI knowledge:', e);
    }
  };

  // 3. Fetch Ratings
  const loadRatings = async () => {
    try {
      const res = await fetch('/api/admin/support/ratings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRatingsList(data);
        }
      }
    } catch (e) {
      console.warn('Could not fetch ratings:', e);
    }
  };

  useEffect(() => {
    loadTickets();
    loadAiKnowledge();
    loadRatings();
    const interval = setInterval(() => {
      loadTickets();
      loadRatings();
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages]);

  // --- Ticket Actions ---
  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {}
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!confirm(`Delete ticket #${ticketId}?`)) return;
    try {
      await fetch(`/api/admin/support/tickets/${ticketId}`, { method: 'DELETE' });
    } catch {}
    const remaining = tickets.filter(t => t.id !== ticketId);
    setTickets(remaining);
    setSelectedTicket(remaining[0] || null);
  };

  const handleSendReply = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    const textToSend = replyText.trim();
    setReplyText('');

    const newMsg = {
      sender: 'support',
      text: textToSend,
      time: 'Just now'
    };
    const updatedMessages = [...(selectedTicket.messages || []), newMsg];
    selectedTicket.messages = updatedMessages;

    try {
      await fetch('/api/admin/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: selectedTicket.ticket_id || selectedTicket.id,
          phone: selectedTicket.phone,
          sender: 'support',
          text: textToSend
        })
      });
      loadTickets();
    } catch (err) {
      console.warn('Could not send admin reply:', err);
    }
  };

  const sendCannedReply = (quickMsg) => {
    setReplyText(quickMsg);
  };

  const handleCreateNewTicket = async (e) => {
    e.preventDefault();
    if (!newTicketForm.customer_name || !newTicketForm.phone || !newTicketForm.subject) return;

    try {
      const res = await fetch('/api/admin/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicketForm)
      });
      if (res.ok) {
        await loadTickets();
      }
    } catch {}

    setIsTicketModalOpen(false);
    setNewTicketForm({
      customer_name: '',
      phone: '',
      order_number: '',
      category: 'Order Issue',
      subject: '',
      message: ''
    });
  };

  // --- AI Knowledge Base CRUD ---
  const handleOpenCreateAi = () => {
    setEditingAiEntry(null);
    setAiFormData({
      topic: '',
      category: 'GENERAL',
      keywords: '',
      intent: 'FAQ',
      response_template: '',
      action_trigger: '',
      confidence_score: 0.95,
      is_active: true
    });
    setIsAiModalOpen(true);
  };

  const handleOpenEditAi = (entry) => {
    setEditingAiEntry(entry);
    setAiFormData({
      topic: entry.topic,
      category: entry.category,
      keywords: entry.keywords,
      intent: entry.intent,
      response_template: entry.response_template,
      action_trigger: entry.action_trigger || '',
      confidence_score: entry.confidence_score || 0.95,
      is_active: entry.is_active ?? true
    });
    setIsAiModalOpen(true);
  };

  const handleSaveAiEntry = async (e) => {
    e.preventDefault();
    if (!aiFormData.topic || !aiFormData.keywords || !aiFormData.response_template) return;

    if (editingAiEntry) {
      try {
        await fetch(`/api/admin/ai/knowledge/${editingAiEntry.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aiFormData)
        });
      } catch {}
      setAiKnowledge(aiKnowledge.map(k => k.id === editingAiEntry.id ? { ...k, ...aiFormData } : k));
    } else {
      try {
        const res = await fetch('/api/admin/ai/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aiFormData)
        });
        if (res.ok) {
          const created = await res.json();
          setAiKnowledge([created, ...aiKnowledge]);
        }
      } catch {}
    }
    setIsAiModalOpen(false);
  };

  const handleDeleteAiEntry = async (id, topic) => {
    if (!confirm(`Delete AI knowledge entry for "${topic}"?`)) return;
    try {
      await fetch(`/api/admin/ai/knowledge/${id}`, { method: 'DELETE' });
    } catch {}
    setAiKnowledge(aiKnowledge.filter(k => k.id !== id));
  };

  const handleTestAiQuery = async (e) => {
    e.preventDefault();
    if (!testQuery.trim()) return;
    setIsTestingAi(true);
    try {
      const res = await fetch('/api/admin/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
      }
    } catch {} finally {
      setIsTestingAi(false);
    }
  };

  // --- Ratings Actions ---
  const handleSaveResolution = async (orderId) => {
    try {
      await fetch(`/api/admin/support/ratings/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution_notes: resolutionNotes })
      });
      setRatingsList(ratingsList.map(r => r.order_id === orderId ? { ...r, resolution_notes: resolutionNotes, status: 'RESOLVED' } : r));
      setSelectedRating(null);
      setResolutionNotes('');
    } catch {}
  };

  // Filtered Tickets
  const filteredTickets = tickets.filter(t => {
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesSearch = t.customer.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                          t.phone.includes(ticketSearch) ||
                          t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                          t.id.toLowerCase().includes(ticketSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered AI Knowledge
  const filteredAiKnowledge = aiKnowledge.filter(k => {
    const matchesCat = aiCategoryFilter === 'ALL' || k.category === aiCategoryFilter;
    const matchesSearch = k.topic.toLowerCase().includes(aiSearch.toLowerCase()) ||
                          k.keywords.toLowerCase().includes(aiSearch.toLowerCase()) ||
                          k.response_template.toLowerCase().includes(aiSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Ratings
  const filteredRatings = ratingsList.filter(r => {
    if (ratingStarFilter === 'ALL') return true;
    if (ratingStarFilter === '5') return r.rating === 5;
    if (ratingStarFilter === '4') return r.rating === 4;
    if (ratingStarFilter === 'CRITICAL') return r.rating <= 3;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <HelpCircle size={24} className="text-purple-600" />
            Support & Kira AI Intelligence Center
          </h2>
          <p className="text-xs text-slate-500">
            Real-time live customer chat, automated Kira AI knowledge base, instant order refund actions & rating feedback
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Module Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'tickets' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare size={14} /> Live Tickets ({tickets.length})
            </button>

            <button
              onClick={() => setActiveTab('ai_studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'ai_studio' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot size={14} /> Kira AI Studio ({aiKnowledge.length})
            </button>

            <button
              onClick={() => setActiveTab('ratings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                activeTab === 'ratings' ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star size={14} className="text-amber-500 fill-amber-500" /> Ratings & Reviews ({ratingsList.length})
            </button>
          </div>

          <button
            onClick={() => {
              loadTickets();
              loadAiKnowledge();
              loadRatings();
            }}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="Refresh All"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE CUSTOMER CHAT & TICKETS */}
      {/* ========================================================================= */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tickets by customer name, phone, ticket ID, or issue..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-purple-600"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
                {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      filterStatus === st ? 'bg-white text-purple-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus size={14} /> Create Ticket
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Tickets Sidebar */}
            <div className="lg:col-span-1 space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`bg-white border p-4 rounded-2xl cursor-pointer transition shadow-xs flex flex-col justify-between space-y-2 ${
                    selectedTicket?.id === t.id 
                      ? 'border-purple-600 ring-2 ring-purple-100 bg-purple-50/20' 
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-black text-slate-900">{t.id}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'OPEN' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{t.subject}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.customer} • {t.phone}</p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>{t.date}</span>
                    <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                      {t.messages?.length || 1} msgs
                    </span>
                  </div>
                </div>
              ))}

              {filteredTickets.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-medium">
                  No support tickets found matching your criteria.
                </div>
              )}
            </div>

            {/* Chat & Ticket Resolution Pane */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[520px]">
              {selectedTicket ? (
                <>
                  <div>
                    {/* Ticket Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-sm text-slate-900">{selectedTicket.subject}</h3>
                          <span className="bg-purple-50 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-purple-200">
                            {selectedTicket.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          Customer: <strong className="text-slate-800">{selectedTicket.customer}</strong> ({selectedTicket.phone})
                          {selectedTicket.orderNumber && ` • Order #${selectedTicket.orderNumber}`}
                        </p>
                      </div>

                      {/* Status Selector & Delete */}
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedTicket.status}
                          onChange={(e) => handleUpdateTicketStatus(selectedTicket.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 outline-none"
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>

                        <button
                          onClick={() => handleDeleteTicket(selectedTicket.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Delete Ticket"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 text-xs">
                      {selectedTicket.messages?.map((m, i) => (
                        <div key={i} className={`flex ${m.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl ${
                            m.sender === 'support' 
                              ? 'bg-purple-600 text-white rounded-br-none shadow-xs' 
                              : 'bg-slate-100 text-slate-900 rounded-bl-none'
                          }`}>
                            <div className="font-bold text-[10px] opacity-80 mb-0.5">
                              {m.sender === 'support' ? 'Kirana Support (You)' : selectedTicket.customer}
                            </div>
                            <p className="font-medium">{m.text}</p>
                            <span className="text-[9px] opacity-60 block text-right mt-1">{m.time}</span>
                          </div>
                        </div>
                      ))}
                      <div ref={chatBottomRef} />
                    </div>
                  </div>

                  {/* Bottom Action / Reply Section */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 mt-3">
                    {/* Canned Quick Actions */}
                    <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-bold text-slate-600">
                      <span className="text-slate-400">Quick Reply:</span>
                      <button
                        type="button"
                        onClick={() => sendCannedReply("Namaste! Your order is currently being packed and will arrive in 10 minutes.")}
                        className="bg-slate-50 hover:bg-purple-50 hover:text-purple-700 px-2 py-1 rounded-lg border border-slate-200 whitespace-nowrap transition"
                      >
                        🚚 10-Min Delivery ETA
                      </button>
                      <button
                        type="button"
                        onClick={() => sendCannedReply("We have processed an instant 100% refund credit to your KiranaWallet balance.")}
                        className="bg-slate-50 hover:bg-purple-50 hover:text-purple-700 px-2 py-1 rounded-lg border border-slate-200 whitespace-nowrap transition"
                      >
                        💸 Instant Refund Sent
                      </button>
                      <button
                        type="button"
                        onClick={() => sendCannedReply("Your requested delivery slot has been confirmed and assigned to our express rider.")}
                        className="bg-slate-50 hover:bg-purple-50 hover:text-purple-700 px-2 py-1 rounded-lg border border-slate-200 whitespace-nowrap transition"
                      >
                        ⏰ Slot Updated
                      </button>
                    </div>

                    {/* Reply Form */}
                    <form onSubmit={handleSendReply} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type customer reply or instant support message..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
                      />
                      <button 
                        type="submit" 
                        className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-xs flex items-center gap-1.5 transition"
                      >
                        <Send size={14} /> Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 text-slate-400">
                  <MessageSquare size={40} className="mb-2 opacity-40 text-purple-600" />
                  <h4 className="font-bold text-slate-700 text-sm">Select a live chat or support ticket</h4>
                  <p className="text-xs">Choose any customer ticket from the left panel to reply in real time</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KIRA AI CHATBOT STUDIO & KNOWLEDGE BASE */}
      {/* ========================================================================= */}
      {activeTab === 'ai_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: AI Knowledge Base Rules List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search AI rules by topic, keywords, or response..."
                  value={aiSearch}
                  onChange={(e) => setAiSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={aiCategoryFilter}
                  onChange={(e) => setAiCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="REFUNDS">REFUNDS</option>
                  <option value="ORDERS">ORDERS</option>
                  <option value="RECIPES">RECIPES</option>
                  <option value="DELIVERY">DELIVERY</option>
                  <option value="GENERAL">GENERAL</option>
                </select>

                <button
                  onClick={handleOpenCreateAi}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition whitespace-nowrap"
                >
                  <Plus size={14} /> Add AI Knowledge Rule
                </button>
              </div>
            </div>

            {/* Knowledge Cards */}
            <div className="space-y-3">
              {filteredAiKnowledge.map((entry) => (
                <div key={entry.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:border-purple-300 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot size={18} className="text-purple-600" />
                      <span className="font-extrabold text-slate-900 text-sm">{entry.topic}</span>
                      <span className="bg-purple-50 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-200">
                        {entry.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditAi(entry)}
                        className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
                        title="Edit Knowledge Rule"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteAiEntry(entry.id, entry.topic)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Delete Rule"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium leading-relaxed">
                    "{entry.response_template}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2 pt-1">
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="font-bold text-slate-400">Trigger Keywords:</span>
                      <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                        {entry.keywords}
                      </span>
                    </div>

                    {entry.action_trigger && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Action: {entry.action_trigger}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredAiKnowledge.length === 0 && (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium">
                  No AI rules found. Click "Add AI Knowledge Rule" to train Kira Bot.
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Live AI Test Console / Playground */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-purple-600" />
                  Kira AI Live Test Console
                </h3>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                  ONLINE
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Type customer questions to test keyword matching, intent resolution, and instant response templates.
              </p>

              <form onSubmit={handleTestAiQuery} className="space-y-2">
                <input
                  type="text"
                  placeholder="e.g. Can I get a refund for damaged milk?"
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs outline-none focus:border-purple-600 font-medium"
                />
                <button
                  type="submit"
                  disabled={isTestingAi}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs py-2.5 rounded-2xl shadow-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Zap size={14} className={isTestingAi ? 'animate-spin' : ''} />
                  {isTestingAi ? 'Processing...' : 'Test AI Match'}
                </button>
              </form>

              {testResult && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs animate-in zoom-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-900">{testResult.topic}</span>
                    <span className="bg-purple-100 text-purple-800 font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                      {(testResult.confidence * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{testResult.response}</p>
                  {testResult.action_trigger && (
                    <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                      Trigger: {testResult.action_trigger}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CUSTOMER RATINGS & IN-APP REVIEWS */}
      {/* ========================================================================= */}
      {activeTab === 'ratings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">In-App Customer Order Ratings</h3>
              <p className="text-xs text-slate-500">Live feedback submitted from the customer mobile app</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Stars:</span>
              <select
                value={ratingStarFilter}
                onChange={(e) => setRatingStarFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="ALL">All Ratings ({ratingsList.length})</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                <option value="CRITICAL">⚠️ Critical (≤ 3 Stars)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRatings.map((r, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={i < (r.rating || 5) ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-200'}
                        />
                      ))}
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      r.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-xs">
                    Order #{r.order_number} • ₹{r.total_amount?.toFixed(0)}
                  </h4>
                  <div className="text-[11px] text-slate-500">{r.customer_name} ({r.phone})</div>

                  {r.rating_comment && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2 italic font-medium">
                      "{r.rating_comment}"
                    </p>
                  )}

                  {r.rating_tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.rating_tags.split(',').map((tag, tIdx) => (
                        <span key={tIdx} className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-100">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {r.resolution_notes && (
                    <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 mt-2">
                      <strong>Admin Resolution:</strong> {r.resolution_notes}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {new Date(r.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedRating(r);
                      setResolutionNotes(r.resolution_notes || '');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-3 py-1.5 rounded-xl transition"
                  >
                    Add Resolution
                  </button>
                </div>
              </div>
            ))}

            {filteredRatings.length === 0 && (
              <div className="col-span-full p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium">
                No customer ratings submitted for the selected filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE NEW TICKET */}
      {/* ========================================================================= */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setIsTicketModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">Create Support Ticket</h3>

            <form onSubmit={handleCreateNewTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newTicketForm.customer_name}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, customer_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9811223344"
                    value={newTicketForm.phone}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Order # (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. KS-94821"
                    value={newTicketForm.order_number}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, order_number: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Issue Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Damaged Milk Bottle Replacement"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Issue Details & Initial Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide complete details about the customer inquiry..."
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                Create Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT AI KNOWLEDGE RULE */}
      {/* ========================================================================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">
              {editingAiEntry ? 'Edit AI Knowledge Rule' : 'Add AI Knowledge Rule'}
            </h3>

            <form onSubmit={handleSaveAiEntry} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Topic Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Delivery Threshold"
                  value={aiFormData.topic}
                  onChange={(e) => setAiFormData({ ...aiFormData, topic: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={aiFormData.category}
                    onChange={(e) => setAiFormData({ ...aiFormData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="GENERAL">GENERAL</option>
                    <option value="ORDERS">ORDERS</option>
                    <option value="REFUNDS">REFUNDS</option>
                    <option value="DELIVERY">DELIVERY</option>
                    <option value="RECIPES">RECIPES</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Action Trigger</label>
                  <select
                    value={aiFormData.action_trigger}
                    onChange={(e) => setAiFormData({ ...aiFormData, action_trigger: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-none"
                  >
                    <option value="">None (FAQ Only)</option>
                    <option value="INITIATE_REFUND">INITIATE_REFUND</option>
                    <option value="FETCH_ORDER_STATUS">FETCH_ORDER_STATUS</option>
                    <option value="SHOW_RECIPE">SHOW_RECIPE</option>
                    <option value="OPEN_RASHAN">OPEN_RASHAN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Trigger Keywords (Comma Separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. delivery fee, free delivery, charges, threshold"
                  value={aiFormData.keywords}
                  onChange={(e) => setAiFormData({ ...aiFormData, keywords: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">AI Generated Response Template *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="The exact smart response Kira bot will deliver to the customer..."
                  value={aiFormData.response_template}
                  onChange={(e) => setAiFormData({ ...aiFormData, response_template: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition mt-2"
              >
                Save Knowledge Rule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD RATING RESOLUTION */}
      {/* ========================================================================= */}
      {selectedRating && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setSelectedRating(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>

            <h3 className="font-black text-base text-slate-900">
              Resolve Order Feedback: #{selectedRating.order_number}
            </h3>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div>Customer: <strong>{selectedRating.customer_name}</strong> ({selectedRating.phone})</div>
              <div>Rating: <strong>{selectedRating.rating} / 5 Stars</strong></div>
              {selectedRating.rating_comment && (
                <div className="text-slate-600 italic">"{selectedRating.rating_comment}"</div>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Action & Resolution Note</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Called customer, apologized for delayed delivery, credited ₹50 wallet compensation..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <button
                onClick={() => handleSaveResolution(selectedRating.order_id)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-2xl shadow-sm transition"
              >
                Mark Feedback as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
