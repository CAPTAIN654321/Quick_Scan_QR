"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, User, Minimize2, Maximize2, Sparkles } from "lucide-react";

export default function Chatbot({ role = "user" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: role === "admin" 
        ? "Welcome to Command Intelligence. I am your Nexus assistant. How can I help you manage the network today?"
        : "Hello! I'm your Nexus AI assistant. Need help creating a QR code or tracking your leads?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "";
      const lowerInput = input.toLowerCase();

      if (role === "admin") {
        if (lowerInput.includes("user") || lowerInput.includes("agent")) {
          botResponse = "Directing to Agent Registry. You can manage all active agents under the 'AGENTS' tab.";
        } else if (lowerInput.includes("scan") || lowerInput.includes("telemetry")) {
          botResponse = "Real-time telemetry is available in the 'SIGNAL' dashboard. We are currently seeing active bursts.";
        } else if (lowerInput.includes("order")) {
          botResponse = "Order fulfillment can be monitored in the 'LOGISTICS' section. You can update delivery agent numbers there.";
        } else {
          botResponse = "I have logged your query to the Nexus core. How else can I assist with network operations?";
        }
      } else {
        if (lowerInput.includes("qr") || lowerInput.includes("generate")) {
          botResponse = "You can initiate a new QR node from the 'Create QR' section. Choose between Static or Dynamic nodes.";
        } else if (lowerInput.includes("lead") || lowerInput.includes("intel")) {
          botResponse = "All captured lead intelligence is stored in your 'Data Feed'. You can export this as a CSV at any time.";
        } else if (lowerInput.includes("order") || lowerInput.includes("standee")) {
          botResponse = "Check your physical deployments in 'My Orders'. Status updates are synchronized in real-time.";
        } else {
          botResponse = "I'm processing your request. Our system is currently operational. Is there anything specific about your QR nodes you'd like to know?";
        }
      }

      setMessages(prev => [...prev, { role: "bot", content: botResponse, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isVisible) return null;

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#14213D] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all border border-white/10 group overflow-hidden p-0"
        >
          <img src="/cutie-logo.png" alt="Nexus AI" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0B132B] animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-[350px] sm:w-[380px] ${isMinimized ? 'h-16' : 'h-[500px] sm:h-[550px]'} bg-[#14213D] border border-white/10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col z-50 overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-10`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shadow-inner overflow-hidden bg-black/20">
            <img src="/cutie-logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-sm font-black italic uppercase tracking-tighter text-white">Nexus AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Neural Link Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsVisible(false)} 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Terminate Session"
          >
            <X size={16} />
          </button>
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg active:scale-95 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>
            <Minimize2 size={14} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#0B132B]/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-purple-600/20 border-purple-500/30 text-purple-400' : 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-[12px] font-medium leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-900/20' : 'bg-[#1F2B4B] text-slate-200 border border-white/5 rounded-tl-none shadow-lg'}`}>
                    {msg.content}
                    <div className={`text-[8px] mt-2 opacity-40 font-black uppercase tracking-tighter ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1F2B4B] border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-5 border-t border-white/5 bg-white/[0.01]">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Transmission details..."
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs font-bold text-white placeholder:text-slate-700 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition-all disabled:opacity-30 disabled:grayscale"
              >
                <Send size={14} />
              </button>
            </form>
            <div className="mt-3 flex items-center justify-center gap-2 relative group-footer">
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute left-0 p-1.5 text-slate-600 hover:text-rose-500 transition-all hover:scale-125"
                title="Minimize Assistant"
              >
                <X size={14} />
              </button>
              <div className="flex items-center gap-2 opacity-20 group-hover-footer:opacity-50 transition-opacity">
                <Sparkles size={10} className="text-indigo-400" />
                <p className="text-[8px] font-black uppercase tracking-[0.3em]">Neural Engine 2.0</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
