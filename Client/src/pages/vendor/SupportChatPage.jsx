import React, { useState, useMemo, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const INITIAL_CHATS = [
  {
    id: "c1",
    customerName: "Michael Chen",
    lastMessage: "Is the keyboard cross-compatible with Unix operating systems?",
    messages: [
      { id: 1, sender: "customer", text: "Hello! I just placed an order for the mechanical keyboard.", timestamp: "11:45 AM" },
      { id: 2, sender: "customer", text: "Is the keyboard cross-compatible with Unix operating systems?", timestamp: "11:46 AM" }
    ]
  },
  {
    id: "c2",
    customerName: "Sarah Jenkins",
    lastMessage: "Thanks for the fast shipping delivery!",
    messages: [
      { id: 1, sender: "customer", text: "Can you confirm if my stoneware order requires a signature delivery?", timestamp: "Yesterday" },
      { id: 2, sender: "vendor", text: "Hi Sarah! No signature needed, it will be left safely at your doorstep.", timestamp: "Yesterday" },
      { id: 3, sender: "customer", text: "Thanks for the fast shipping delivery!", timestamp: "Yesterday" }
    ]
  }
];

const SupportChatPage = () => {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState("c1");
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef(null);

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId), [chats, activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, chats]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const outbound = { id: Date.now(), sender: "vendor", text: chatInput, timestamp: time };

    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMessage: chatInput, messages: [...c.messages, outbound] } : c));
    setChatInput("");

    // Simulate standard incoming customer websocket reply trigger after 1.5s
    setTimeout(() => {
      setChats(prev => prev.map(c => c.id === activeChatId ? { 
        ...c, 
        lastMessage: "Got it, thank you!", 
        messages: [...c.messages, { id: Date.now()+1, sender: "customer", text: "Got it! Thanks for the quick clarification.", timestamp: time }] 
      } : c));
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-slate-200/60 rounded-[24px] overflow-hidden shadow-xs h-[550px]">
      
      {/* SIDEBAR ACTIVE USER CONVERSATION QUEUE */}
      <div className="md:col-span-1 border-r border-slate-200/80 flex flex-col bg-slate-50/40">
        <div className="p-4 border-b border-slate-100 bg-white font-bold text-xs tracking-wider uppercase text-slate-400">
          Active Customer Inquiries
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60">
          {chats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChatId(c.id)}
              className={`w-full p-4 text-left flex flex-col transition-all cursor-pointer ${c.id === activeChatId ? "bg-white border-l-4 border-l-slate-900" : "hover:bg-slate-50/80"}`}
            >
              <span className="text-xs font-bold text-slate-900 mb-1">{c.customerName}</span>
              <p className="text-xs text-slate-500 truncate font-medium">{c.lastMessage}</p>
            </button>
          ))}
        </div>
      </div>

      {/* SUPPORT MESSENGER INTERCOM STREAM */}
      <div className="md:col-span-2 flex flex-col bg-white">
        <div className="p-4 border-b border-slate-100 bg-white shadow-2xs font-extrabold text-xs text-slate-800">
          Chatting with: <span className="text-slate-900 underline font-black">{activeChat?.customerName}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
          {activeChat?.messages.map((m) => {
            const isVendor = m.sender === "vendor";
            return (
              <div key={m.id} className={`flex max-w-[80%] flex-col ${isVendor ? "ml-auto items-end" : "mr-auto items-start"}`}>
                <div className={`p-3 rounded-xl text-xs font-medium ${isVendor ? "bg-slate-950 text-white rounded-tr-none shadow-sm" : "bg-white text-slate-800 border border-slate-200/60 rounded-tl-none shadow-2xs"}`}>
                  {m.text}
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 block px-1">{m.timestamp}</span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2 bg-white">
          <input 
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a support reply response here..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
          />
          <button type="submit" className="h-9 w-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 cursor-pointer active:scale-95 transition-all flex-shrink-0">
            <Send className="w-3.5 h-3.5"/>
          </button>
        </form>
      </div>

    </div>
  );
};

export default SupportChatPage;