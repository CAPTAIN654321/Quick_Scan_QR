"use client";
import React from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, Globe } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#0B132B] text-white font-sans relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:3s] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] animate-fade-in">
            <Globe size={12} className="animate-spin-slow" /> Global Support Network
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
            Get in. <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">Touch</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
            Have questions about Smart QR? Our team of specialists is ready to help you bridge the physical-to-digital gap.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1C2541]/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] group hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Phone size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">Call Support</h4>
              <p className="text-slate-400 font-medium mb-4">Direct line to our technical specialists.</p>
              <p className="text-blue-400 font-black tracking-widest uppercase text-sm italic underline decoration-2 underline-offset-4">(+91) xxxxx xxxxx</p>
            </div>

            <div className="bg-[#1C2541]/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] group hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">Email Inquiry</h4>
              <p className="text-slate-400 font-medium mb-4">Response time within 12 business hours.</p>
              <p className="text-purple-400 font-black tracking-widest uppercase text-sm italic underline decoration-2 underline-offset-4">support@qscan.id</p>
            </div>

            <div className="bg-[#1C2541]/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] group hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">Location</h4>
              <p className="text-slate-400 font-medium mb-4">Visit our HQ for a live demo.</p>
              <p className="text-indigo-400 font-black tracking-widest uppercase text-sm italic underline decoration-2 underline-offset-4">Lucknow, India</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#1C2541]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={120} className="text-blue-400" />
              </div>
              
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-10">Send a. <span className="text-blue-400">Message</span></h3>
              
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Account Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-[#0B132B]/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-700"
                      placeholder="you@nexus.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Contact Line</label>
                    <input 
                      type="tel" 
                      className="w-full bg-[#0B132B]/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-700"
                      placeholder="+91 (000) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Identity</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#0B132B]/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-700"
                    placeholder="Full Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Inquiry Data</label>
                  <textarea 
                    className="w-full bg-[#0B132B]/50 border border-white/5 rounded-3xl px-6 py-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all h-40 resize-none placeholder:text-slate-700"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-5 rounded-2xl font-black italic uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 shadow-[0_15px_40px_rgba(59,130,246,0.3)]"
                >
                  Broadcast Message <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
