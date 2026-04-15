import Link from 'next/link';
import { QrCode, Zap, Shield, BarChart, ArrowRight, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050B14] font-sans selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0A1128] pb-20 pt-24 lg:pb-28 lg:pt-36 border-b border-white/5">
        <div className="absolute inset-y-0 w-full h-full bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 font-bold text-blue-400 text-sm mb-8 border border-blue-500/20 tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Activity size={16} /> Premium QR Marketing Platform
          </p>
          <h1 className="mx-auto max-w-4xl tracking-tighter text-white text-5xl sm:text-7xl font-black pb-2">
            Quick Scan <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              Marketing
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl tracking-tight text-blue-100/70 leading-relaxed font-light">
            Connect offline advertisements with digital content seamlessly. Customers simply scan your dynamic QR codes to access offers, forms, or products. Update your content anytime without reprinting.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/dashboard" className="group inline-flex items-center justify-center rounded-full py-3.5 px-8 text-base font-bold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1">
              Start Building <ArrowRight size={18} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link href="#features" className="group inline-flex items-center justify-center rounded-full py-3.5 px-8 text-base font-bold bg-[#14213D] text-white hover:bg-[#1C2541] focus:outline-none transition-all border border-white/10 hover:border-white/20 shadow-lg hover:-translate-y-1">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-[#050B14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl lg:text-5xl">Market Smarter, Not Harder</h2>
            <p className="mt-4 text-lg text-blue-100/60 font-light">Our platform uses dynamic QR codes to bring your physical advertisements to life while giving you the analytics you need.</p>
          </div>

          <div className="mx-auto max-w-5xl">
            <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4">
              {[
                { name: 'High Quality', desc: 'Generate crystal clear, print-ready QR codes in multiple vector and raster formats.', icon: QrCode },
                { name: 'Instantly Updatable', desc: 'Change the destination link anytime without ever needing to reprint physical materials.', icon: Zap },
                { name: 'Deep Tracking', desc: 'Monitor scans, view heatmaps, and analyze geographic data via our dashboard.', icon: BarChart },
                { name: 'Bank-Grade Secure', desc: 'Your generated URLs are validated and encrypted, securing them from interference.', icon: Shield },
              ].map((feature) => (
                <div key={feature.name} className="relative bg-[#0A1128] p-8 rounded-2xl shadow-xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-2 group">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                  <dt className="text-base font-bold leading-7 text-white flex flex-col items-center text-center relative z-10">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#14213D] text-blue-400 border border-white/10 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-colors shadow-inner">
                      <feature.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <span className="text-lg tracking-tight">{feature.name}</span>
                  </dt>
                  <dd className="mt-4 text-sm leading-relaxed text-blue-100/50 text-center relative z-10 font-light">{feature.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Concept/Cards Section */}
      <section className="py-24 bg-[#0A1128] border-y border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl lg:text-5xl">Creative QR Standees</h2>
               <p className="mt-4 text-lg text-blue-100/60 font-light max-w-2xl mx-auto">We provide customizable and absolutely beautiful standee designs to naturally engage your customers in physical spaces.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 "https://i.pinimg.com/736x/f8/71/26/f87126bcb2450e5cbe4d3b7adec824d8.jpg",
                 "https://i.pinimg.com/736x/a2/a2/20/a2a220d5a5f4d8efb6eb7b628ec85e5e.jpg",
                 "https://i.pinimg.com/1200x/fb/03/a3/fb03a300aed1ece3aed9c13c43c3acb5.jpg"
               ].map((src, i) => (
                 <div key={i} className="group overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-[#14213D] relative">
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay"></div>
                    <img src={src} alt={`QR Display ${i+1}`} className="w-full h-80 object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" />
                 </div>
               ))}
            </div>
         </div>
      </section>
      
      {/* Testimonial / Experience */}
      <section className="py-24 bg-[#050B14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/1200x/fc/65/2b/fc652bc912d0d8c50f2cc26a550b1a15.jpg')] bg-cover bg-center opacity-[0.03] mix-blend-screen"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl mb-6 text-white drop-shadow-lg">
              The Best Experience
            </h2>
            <p className="text-xl md:text-2xl font-light text-blue-300 italic mb-16 max-w-3xl mx-auto">
              &ldquo;Scan. Connect. Promote - Smart marketing made professional.&rdquo;
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {[
                "https://i.pinimg.com/1200x/fd/9e/43/fd9e4380ae60b1c7aded7d40a31690ee.jpg",
                "https://i.pinimg.com/1200x/b7/76/04/b776046a45b4f9c985f1bc843deda757.jpg",
                "https://i.pinimg.com/1200x/5b/19/ee/5b19eec686d4e02aaf50e697898bfd1e.jpg",
                "https://i.pinimg.com/1200x/1d/aa/5c/1daa5cf5210b436e23dd74fd29e455ee.jpg"
              ].map((src, idx) => (
                <div key={idx} className="w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 relative group bg-[#1A254B]">
                  <div className="absolute inset-0 bg-blue-600/30 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                  <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal" alt="Experience preview" />
                </div>
              ))}
            </div>
            
            <div className="mt-20">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-full py-4 px-10 text-lg font-bold bg-white text-[#0A1128] hover:bg-blue-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                 Start Your Free Trial Today
              </Link>
            </div>
        </div>
      </section>
    </div>
  );
}