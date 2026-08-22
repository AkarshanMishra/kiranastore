import React, { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, Phone, CheckCircle2, Clock, AlertCircle, Send, X, User, RefreshCw } from 'lucide-react';

export default function SupportView() {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const defaultMockTickets = [
    {
      id: 'TICK-401',
      ticket_id: 'TICK-401',
      customer: 'Priya Sharma',
      customer_name: 'Priya Sharma',
      phone: '+91 9811223344',
      orderNumber: 'KS-94820',
      order_number: 'KS-94820',
      category: 'Delivery Slot Change',
      subject: 'Please change delivery slot from 4 PM to 6 PM',
      message: 'Hi, I will not be home at 4 PM. Can you please deliver between 6 PM - 8 PM?',
      messages: [
        { sender: 'customer', text: 'Hi, I will not be home at 4 PM. Can you please deliver between 6 PM - 8 PM?', time: '2:15 PM' },
        { sender: 'support', text: 'Hello Priya, we have updated your delivery slot to 6:00 PM - 8:00 PM today.', time: '2:18 PM' }
      ],
      status: 'RESOLVED',
      priority: 'HIGH',
      date: 'Today, 2:15 PM'
    }
  ];

  const [tickets, setTickets] = useState(defaultMockTickets);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/support/tickets');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(t => ({
            id: t.ticket_id || `TICK-${t.id}`,
            ticket_id: t.ticket_id || `TICK-${t.id}`,
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
          }));
          setTickets(formatted);
          if (!selectedTicket && formatted.length > 0) {
            setSelectedTicket(formatted[0]);
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch support tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleUpdateStatus = async (ticketId, newStatus) => {
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

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    const newMsg = {
      sender: 'support',
      text: replyText.trim(),
      time: 'Just now'
    };
    const updatedMessages = [...(selectedTicket.messages || []), newMsg];
    selectedTicket.messages = updatedMessages;
    setReplyText('');
    handleUpdateStatus(selectedTicket.id, 'RESOLVED');
  };

  const filteredTickets = tickets.filter(t =>
    filterStatus === 'ALL' || t.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Customer Support & Helpdesk Hub</h2>
          <p className="text-xs text-slate-500">Live chat assistance, order dispute resolution, refund authorizations & ticket assignments</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
              filterStatus === status ? 'bg-purple-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`bg-white border p-4 rounded-2xl cursor-pointer transition shadow-xs ${
                selectedTicket?.id === t.id ? 'border-purple-600 ring-2 ring-purple-100' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-black text-slate-900">{t.id}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                  t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : t.status === 'OPEN' ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-amber-100 text-amber-800'
                }`}>
                  {t.status}
                </span>
              </div>

              <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{t.subject}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{t.customer} • #{t.orderNumber}</p>
              <span className="text-[10px] text-slate-400 block mt-1">{t.date}</span>
            </div>
          ))}
        </div>

        {/* Ticket Chat / Resolution Pane */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[450px]">
          {selectedTicket ? (
            <>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="font-black text-base text-slate-900">{selectedTicket.subject}</h3>
                    <p className="text-xs text-slate-500">Ticket #{selectedTicket.id} • Customer: {selectedTicket.customer} ({selectedTicket.phone})</p>
                  </div>
                  <span className="bg-purple-50 text-purple-700 font-extrabold text-xs px-2.5 py-1 rounded-xl">
                    Order #{selectedTicket.orderNumber}
                  </span>
                </div>

                {/* Chat Messages */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 text-xs">
                  {selectedTicket.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl ${
                        m.sender === 'support' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-900 rounded-bl-none'
                      }`}>
                        <div className="font-bold text-[10px] opacity-75 mb-0.5">{m.sender === 'support' ? 'Kirana Support' : selectedTicket.customer}</div>
                        <p>{m.text}</p>
                        <span className="text-[9px] opacity-60 block text-right mt-1">{m.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 flex gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Type support reply or refund resolution..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-purple-600 font-medium"
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1">
                  <Send size={14} /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 text-slate-400">
              <MessageSquare size={36} className="mb-2 opacity-50" />
              <h4 className="font-bold text-slate-700 text-sm">Select a support ticket</h4>
              <p className="text-xs">Choose any customer ticket from the left to view messages & reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
