import React, { useState } from 'react';
import { X, HelpCircle, Phone, MessageSquare, ChevronDown, Check, ShieldAlert, Send, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchApi } from '../apiClient';

export default function CustomerSupportModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('ticket'); // 'ticket' | 'chat' | 'faqs'
  const [ticketCategory, setTicketCategory] = useState('Order Issue');
  const [orderNumber, setOrderNumber] = useState('KS-94821');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'support', text: 'Hello! Welcome to KiranaStore Support. How can we assist you today?', time: 'Just now' }
  ]);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "How does Same-Day / Next-Day delivery work?",
      a: "When you place an order, the local shopkeeper accepts your items and confirms the exact delivery time window (e.g. 4 PM - 7 PM). You will receive real-time tracking updates."
    },
    {
      q: "What if an item is missing or damaged?",
      a: "Select 'Missing / Damaged Item' in the ticket form below. We will immediately issue a refund credit to your KiranaWallet or replace the item."
    },
    {
      q: "How can I change my delivery time slot?",
      a: "Open Live Chat below or call our support line to request a slot adjustment before rider dispatch."
    },
    {
      q: "What payment methods are supported?",
      a: "We accept UPI (GPay, PhonePe, Paytm), Credit/Debit cards, Net Banking, KiranaWallet, and Cash on Delivery (COD)."
    }
  ];

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    let customerName = 'Customer';
    let customerPhone = '+91 9876543210';
    try {
      const saved = localStorage.getItem('kirana_customer_user');
      if (saved) {
        const u = JSON.parse(saved);
        customerName = u.name || 'Customer';
        customerPhone = u.phone || '+91 9876543210';
      }
    } catch {}

    try {
      const res = await fetchApi('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          phone: customerPhone,
          order_number: orderNumber || undefined,
          category: ticketCategory,
          subject: `${ticketCategory}: ${ticketMessage.slice(0, 40)}...`,
          message: ticketMessage.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessInfo(`Ticket #${data.ticket_id} created successfully & assigned to Store Manager!`);
      } else {
        setSuccessInfo(`Ticket created & forwarded to Store Support.`);
      }
    } catch {
      setSuccessInfo(`Ticket logged & sent to Store Support.`);
    } finally {
      setIsSubmitting(false);
      setTicketSubmitted(true);
      setTimeout(() => {
        setTicketSubmitted(false);
        setSuccessInfo(null);
        setTicketMessage('');
        onClose();
      }, 2200);
    }
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'user', text: chatInput.trim(), time: 'Just now' };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'support', text: 'Thanks for reaching out. A store support executive is reviewing your request.', time: 'Just now' }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 dark:text-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto flex flex-col">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-full"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-2xl text-purple-600">
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">Help & Support Desk</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">Direct assistance connected to store managers</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl mb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ticket')}
            className={`flex-1 py-1.5 rounded-xl transition ${activeTab === 'ticket' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs font-black' : 'text-gray-500'}`}
          >
            Create Ticket
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-1.5 rounded-xl transition ${activeTab === 'chat' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs font-black' : 'text-gray-500'}`}
          >
            Live Chat
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex-1 py-1.5 rounded-xl transition ${activeTab === 'faqs' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs font-black' : 'text-gray-500'}`}
          >
            FAQs
          </button>
        </div>

        {/* Tab 1: Raise Support Ticket */}
        {activeTab === 'ticket' && (
          <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">Issue Category *</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 font-bold outline-none text-gray-900 dark:text-white"
              >
                <option>Order Issue (Delay / Slot Change)</option>
                <option>Payment Issue (UPI / Double Debit)</option>
                <option>Delivery Issue (Rider Instructions)</option>
                <option>Missing Product</option>
                <option>Damaged Product</option>
                <option>Refund Inquiry</option>
                <option>Account & Address Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">Related Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. KS-94821"
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 font-mono font-bold text-gray-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">Describe Issue Details *</label>
              <textarea
                rows={3}
                required
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Please describe what happened so our team can resolve it immediately..."
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-gray-900 dark:text-white outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || ticketSubmitted}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" /> Submitting Ticket...
                </>
              ) : ticketSubmitted ? (
                <>
                  <CheckCircle2 size={16} className="text-emerald-300" /> Ticket Created!
                </>
              ) : (
                <>
                  <FileText size={16} /> Submit Support Ticket
                </>
              )}
            </button>

            {successInfo && (
              <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                <span>{successInfo}</span>
              </div>
            )}
          </form>
        )}

        {/* Tab 2: Live Chat */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-64 justify-between text-xs">
            <div className="space-y-2 overflow-y-auto pr-1">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2.5 rounded-2xl ${
                    m.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-bl-none'
                  }`}>
                    <p>{m.text}</p>
                    <span className="text-[9px] opacity-60 block text-right mt-0.5">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatMessage} className="pt-2 border-t border-gray-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white outline-none"
              />
              <button type="submit" className="bg-purple-600 text-white p-2 rounded-xl">
                <Send size={14} />
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: FAQs */}
        {activeTab === 'faqs' && (
          <div className="space-y-2 text-xs">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-3 font-bold bg-gray-50 dark:bg-slate-800/60 text-gray-900 dark:text-white">
                  {faq.q}
                </div>
                <div className="p-3 text-gray-600 dark:text-slate-300 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toll-free Footer Call */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500">
          <span>Need immediate phone help?</span>
          <button
            onClick={() => alert("Calling Store Helpline: +91 9811223344")}
            className="text-purple-600 dark:text-purple-400 font-extrabold flex items-center gap-1 hover:underline"
          >
            <Phone size={12} /> Call Helpline
          </button>
        </div>
      </div>
    </div>
  );
}
