"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { 
  ArrowLeft, ShoppingCart, CreditCard, ShieldCheck, Truck, Package, Info, CheckCircle2, Zap, Plus, Minus
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function OrderPage() {
  const router = useRouter();
  const [order] = useState(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("pendingOrder");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse order data", e);
      return null;
    }
  });
  const [quantity, setQuantity] = useState(1);

  const getPrice = (formatId) => {
    const prices = {
      'standee': 119.99,
      'a4': 29.99,
      'poster': 79.99,
      'banner': 149.99
    };
    return prices[formatId] || 99.99;
  };

  const handleOrderNow = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/order/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...order,
          quantity: quantity,
          totalPrice: total
        })
      });

      if (response.ok) {
        toast.success("Ordered successfully", {
          duration: 4000,
          icon: '🚀',
          style: {
            borderRadius: '10px',
            background: '#1C2541',
            color: '#fff',
            border: '1px solid rgba(255,165,0,0.2)'
          },
        });
        // Clear pending order after success
        localStorage.removeItem('pendingOrder');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        toast.error("Failed to process order.");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("An error occurred during checkout.");
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex flex-col items-center justify-center p-6 text-center">
        <Package size={64} className="text-slate-700 mb-6 animate-pulse" />
        <h2 className="text-2xl font-black italic uppercase tracking-widest text-white mb-2">No Active Matrix Detected</h2>
        <p className="text-slate-500 mb-8 max-w-md">Your customization cache is empty. Please configure a standee before initiating the order sequence.</p>
        <button 
          onClick={() => router.push('/standee')}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all"
        >
          Return to Configurator
        </button>
      </div>
    );
  }

  const basePrice = getPrice(order.format?.id);
  const subtotal = basePrice * quantity;
  const tax = subtotal * 0.12;
  const shipping = 15.00;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-[#060B1A] text-white selection:bg-orange-500/30 font-sans pb-20">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="h-20 border-b border-white/5 bg-[#0B132B]/80 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-12 flex items-center justify-between">
        <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Editor
        </button>
        <div className="flex items-center gap-3">
            <span className="text-xl font-black italic tracking-widest text-white">Q</span>
            <span className="text-sm font-black italic tracking-[0.2em] text-white hidden sm:block">QUICK SCAN MARKETING</span>
        </div>
        <div className="w-20"></div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-16">
        
        {/* Left: Preview Section */}
        <div className="flex-1 space-y-8">
            <div className="space-y-2">
                <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-white">Review Order</h2>
                <p className="text-[10px] font-bold text-orange-400 tracking-[0.3em] uppercase">Deployment Preview & Final Verification</p>
            </div>

            {/* The Actual Preview Render */}
            <div className="bg-[#0B132B] rounded-[3rem] p-12 border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
                
                {/* Scaled Render of the Standee */}
                <div style={{ transform: 'scale(0.8)', transformOrigin: 'center center' }} className="flex items-center justify-center p-4">
                    <div className={`relative bg-[#0A1020] border-2 border-white/5 overflow-hidden shadow-2xl flex flex-col transition-all duration-500 ${order.format?.prevClass} bg-linear-to-br from-[#0A1020] to-[#010614] ${order.theme?.shadow}`}>
                       
                       {/* Accent Header */}
                       <div className={`w-full ${order.format?.id === 'banner' ? 'h-full w-24' : 'h-32'} bg-linear-to-br ${order.theme?.from} ${order.theme?.to} relative overflow-hidden shrink-0`}>
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                             <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                <span className="text-3xl font-black italic">Q</span>
                             </div>
                          </div>
                       </div>

                       {/* Central Content */}
                       <div className={`flex-1 flex flex-col relative ${order.format?.id === 'banner' ? 'items-start justify-center p-12' : 'items-center justify-start p-10 pt-16'}`}>
                          <div className="max-w-[70%] z-10">
                            <h1 style={{ color: order.textColors?.title }} className={`${order.format?.id === 'banner' ? 'text-4xl text-left' : 'text-3xl text-center'} font-black italic tracking-tighter uppercase leading-[0.85] mb-6`}>
                              {order.title}
                            </h1>
                            <div className={`h-1 bg-linear-to-r ${order.theme?.from} ${order.theme?.to} mb-6 ${order.format?.id === 'banner' ? 'w-32' : 'w-16 mx-auto'} rounded-full`}></div>
                            <p style={{ color: order.textColors?.subtitle }} className={`${order.format?.id === 'banner' ? 'text-sm text-left' : 'text-[8px] text-center'} font-bold tracking-[0.2em] uppercase leading-relaxed mb-8 opacity-90`}>
                              {order.subtitle}
                            </p>
                          </div>
                       </div>

                       {/* QR Codes */}
                       {order.addedQrs && order.addedQrs.map((qr) => (
                          <div key={qr.id} className="absolute z-40" style={{ left: `${qr.x}%`, top: `${qr.y}%`, transform: 'translate(-50%, -50%)', width: `${qr.size}%`, maxWidth: '90%', aspectRatio: '1/1' }}>
                             <div className="p-2 bg-white rounded-xl shadow-2xl w-full h-full relative">
                                {qr.qrId ? (
                                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                        <div className="opacity-40 blur-[1px]">
                                            <QRCode value="MOCKUP" size={100} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ShieldCheck size={20} className="text-blue-600" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        < Zap size={20} />
                                    </div>
                                )}
                             </div>
                          </div>
                       ))}

                       {/* Draggable Texts */}
                       {order.addedTexts && order.addedTexts.map((txt) => (
                          <div key={txt.id} className="absolute z-40 whitespace-nowrap" style={{ left: `${txt.x}%`, top: `${txt.y}%`, transform: 'translate(-50%, -50%)', fontSize: `${txt.size}px`, color: txt.color, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' }}>
                             {txt.content}
                          </div>
                       ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#1C2541]/40 border border-white/5 p-6 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Package className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Asset Specs</h4>
                        <p className="text-sm font-bold text-white">{order.format?.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Premium Vinyl Finish • UV Protect</p>
                    </div>
                </div>
                <div className="bg-[#1C2541]/40 border border-white/5 p-6 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                        <ShieldCheck className="text-orange-400" size={20} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Authenticity</h4>
                        <p className="text-sm font-bold text-white">Quick Scan V1.4</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Encrypted Redirects • Telemetry Active</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Checkout Sidebar */}
        <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-[#14213D] border border-white/10 rounded-[2.5rem] p-8 lg:p-10 sticky top-32 shadow-2xl">
                <div className="mb-8">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Checkout Details</h3>
                    <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
                </div>

                <div className="mb-8 space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Quantity Selection</p>
                    <div className="flex items-center gap-6 bg-white/5 p-3 rounded-2xl border border-white/10 w-fit backdrop-blur-sm">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/20 rounded-xl font-black transition-all transform active:scale-90 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                        >
                            <Minus size={20} />
                        </button>
                        <span className="text-2xl font-black italic w-10 text-center text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 flex items-center justify-center bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/20 rounded-xl font-black transition-all transform active:scale-90 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        <span>Unit Price</span>
                        <span className="text-white text-sm">${basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        <span>Subtotal</span>
                        <span className="text-white text-sm">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        <span>Tax (VAT 12%)</span>
                        <span className="text-white text-sm">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        <span>Priority Shipping</span>
                        <span className="text-white text-sm">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-orange-400 tracking-widest uppercase">Total Amount</p>
                            <p className="text-4xl font-black italic text-white">${total.toFixed(2)}</p>
                        </div>
                        <div className="pb-1">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">USD</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={handleOrderNow}
                        className="w-full bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black italic tracking-widest uppercase py-5 rounded-2xl flex justify-center items-center gap-2 shadow-[0_20px_40px_rgba(234,88,12,0.3)] transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        <ShoppingCart size={18} /> Order Now
                    </button>
                    <div className="flex items-center justify-center gap-6 mt-6 opacity-30 grayscale">
                        <CreditCard size={24} />
                        <Info size={24} />
                        <Zap size={24} />
                    </div>
                </div>

                <div className="mt-10 p-6 bg-black/30 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                        <Truck size={16} className="text-cyan-400" />
                        <span>Estimated delivery: 3-5 business days</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>Lifetime warranty on UV coating</span>
                    </div>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
