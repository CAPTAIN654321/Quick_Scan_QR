"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Shield, Mail, Key, ArrowRight, ArrowLeft, 
  CheckCircle2, Sparkles, Terminal, Activity
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/user/send-otp`, { email });
      toast.success("Security burst sent! Check your email (and console).");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate reset protocol.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/user/reset-password`, { email, otp, newPassword });
      toast.success("Security credentials updated. Access restored.");
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed. Signal mismatch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 transition-all duration-500">
        <div className="bg-[#0A1128]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-linear-to-br from-blue-600 to-indigo-700 mb-6 shadow-[0_10px_30px_rgba(37,99,235,0.3)] border border-white/10 group-hover:scale-105 transition-transform duration-500">
              {step === 1 ? <Shield size={32} className="text-white" /> : <Key size={32} className="text-white" />}
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
                <Terminal size={14} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/70">Secure_Reset_Protocol</span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">
              {step === 1 ? "Access Recovery" : "Verification"}
            </h1>
            <p className="mt-3 text-sm text-slate-500 font-medium px-4">
              {step === 1 
                ? "Provide your registered email to receive the identity verification burst." 
                : `Security burst sent to your node. Re-verify identity below.`}
            </p>
          </div>

          <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Identity Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050B14] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800"
                    placeholder="Enter account email"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Verification Signal (OTP)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400">
                      <Activity size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-[#050B14] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800"
                      placeholder="6-digit bursted key"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">New Root Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-purple-400">
                      <Key size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#050B14] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-800"
                      placeholder="Establish new secure key"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-2xl font-black italic uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 shadow-[0_15px_40px_rgba(37,99,235,0.3)] relative overflow-hidden group/btn disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{step === 1 ? "Initialize Protocol" : "Update Credentials"}</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center">
             <Link href="/login" className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors group/back">
                <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" /> Back to Authorization Hub
             </Link>
          </div>

          <div className="absolute bottom-4 right-4 text-[8px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
             <Sparkles size={8} className="text-blue-500" /> Secure Transit Active
          </div>
        </div>
      </div>
    </div>
  );
}
