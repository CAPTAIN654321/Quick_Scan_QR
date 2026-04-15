"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Target, Globe, Shield, Sparkles } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0B132B] text-white font-sans relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:3s] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] animate-fade-in">
            <Sparkles size={12} /> The Future of Engagement
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
            Bridging. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400">Physical & Digital</span>
          </h1>
          <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
            Smart QR is a specialized marketing engine designed to turn static physical advertisements into dynamic, trackable digital gateways.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="relative group">
          <div className="absolute -inset-4 bg-linear-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            alt="Technology" 
            className="relative rounded-[2.5rem] border border-white/10 shadow-2xl object-cover aspect-square md:aspect-video lg:aspect-square"
          />
          <div className="absolute bottom-8 left-8 right-8 p-6 bg-[#1C2541]/80 backdrop-blur-xl border border-white/10 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="font-black italic uppercase tracking-tighter">Real-time Intel</h4>
                <p className="text-xs text-slate-400 font-medium">Track every scan as it happens.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Our Mission</h3>
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
              Always help businesses <span className="text-slate-500">share more</span> with less.
            </h2>
          </div>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Businesses can place a QR code on standees, posters, or banners. When customers scan the code using their smartphones, they instantly access product details, offers, or services. This creates a fast and simple connection through a single scan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/contact" className="px-8 py-4 bg-white text-[#0B132B] rounded-2xl font-black italic uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-blue-400 transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl">
              Talk to us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Skills/Features Grid */}
      <section className="bg-[#080E1E] py-32 px-6 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Our. <span className="text-blue-400">Capabilities</span></h2>
            <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Creative Branding",
                desc: "Designing high-impact standees and physical media that command attention in crowded environments.",
                icon: <Target className="w-8 h-8" />,
                color: "blue"
              },
              {
                title: "Dynamic Management",
                desc: "Update your target URLs and marketing content instantly without ever needing to reprint your physical QR codes.",
                icon: <Zap className="w-8 h-8" />,
                color: "indigo"
              },
              {
                title: "Digital Engagement",
                desc: "Create seamless interactive experiences that capture lead data and boost your conversion rates.",
                icon: <Globe className="w-8 h-8" />,
                color: "purple"
              }
            ].map((skill, i) => (
              <div key={i} className="group bg-[#1C2541]/30 border border-white/5 p-10 rounded-[2.5rem] hover:bg-[#1C2541]/50 hover:border-blue-500/30 transition-all duration-500">
                <div className={`w-16 h-16 rounded-[1.5rem] bg-${skill.color}-500/10 flex items-center justify-center text-${skill.color}-400 mb-8 group-hover:scale-110 group-hover:bg-${skill.color}-500 group-hover:text-white transition-all duration-500`}>
                  {skill.icon}
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">{skill.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed group-hover:text-slate-300 transition-colors">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 md:p-20 text-center space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
              <Shield size={200} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-200">Get Started Today</p>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              Ready to make your marketing <br className="hidden md:block" /> smarter?
            </h2>
            <div className="flex justify-center pt-4">
              <Link href="/signup" className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black italic uppercase tracking-widest text-xs hover:bg-[#0B132B] hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-2xl">
                Initialize Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
