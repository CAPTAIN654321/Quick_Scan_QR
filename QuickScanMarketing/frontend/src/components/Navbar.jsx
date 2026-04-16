"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { EyeOff, Eye, Menu, X, QrCode, LogOut, ShoppingBag } from 'lucide-react'

const Navbar = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsAdmin(user.role === 'admin');
        setIsLoggedIn(true);
      } catch (e) {
        setIsAdmin(false);
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)} 
        className="fixed top-4 right-4 z-[9999] p-3 bg-blue-600 text-white rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-500 transition-transform hover:scale-110"
        title="Show Navbar"
      >
        <Eye size={20} />
      </button>
    );
  }

  return (
    <div className="relative z-50 bg-[#0A1128] border-b border-white/5 shadow-lg transition-all duration-300">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <header className="flex items-center justify-between py-4">
          {/* logo - start */}
          <Link
            href="/home"
            className="inline-flex items-center gap-2.5 text-2xl font-black text-white md:text-3xl tracking-tighter z-20"
          >
            <QrCode size={28} className="text-blue-500 stroke-[2.5]" />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              Smart QR
            </span>
          </Link>
          {/* logo - end */}
          
          {/* nav - start */}
          <nav className="hidden gap-8 lg:flex items-center">
            <Link href="/home" className="text-[10px] font-black text-blue-100/40 transition duration-300 hover:text-blue-400 uppercase tracking-[0.2em]">Home</Link>
            <Link href="/dashboard" className="text-[10px] font-black text-blue-100/40 transition duration-300 hover:text-blue-400 uppercase tracking-[0.2em]">Dashboard</Link>
            <Link href="/my-orders" className="text-[10px] font-black text-blue-100/40 transition duration-300 hover:text-blue-400 uppercase tracking-[0.2em]">My Orders</Link>
            {isAdmin && (
              <Link href="/admin-dashboard" className="text-[10px] font-black text-indigo-400 transition duration-300 hover:text-indigo-300 uppercase tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">Command Center</Link>
            )}
            <Link href="/login?mode=admin" className="text-[10px] font-black text-amber-500/40 transition duration-300 hover:text-amber-400 uppercase tracking-[0.2em] border border-amber-500/20 px-3 py-1 rounded-full hover:bg-amber-500/5">Admin Portal</Link>
          </nav>
          {/* nav - end */}

          {/* buttons - start */}
          <div className="hidden flex-col gap-2.5 sm:flex-row sm:justify-center lg:flex lg:justify-start items-center">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-full transition uppercase tracking-wider border border-transparent hover:border-indigo-500/20"
                >
                   Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 rounded-full transition uppercase tracking-wider border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`inline-block px-6 py-2.5 text-center text-sm font-bold transition-all rounded-full uppercase tracking-wider ${
                    pathname === '/login' 
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-500' 
                    : 'text-blue-100/70 hover:bg-blue-600/20 hover:text-blue-300'
                  }`}
                >
                  LOGIN
                </Link>
                <Link 
                  href="/signup" 
                  className={`inline-block px-6 py-2.5 text-center text-sm font-bold transition-all rounded-full uppercase tracking-wider ${
                    pathname === '/signup' || (pathname !== '/login')
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transform hover:-translate-y-0.5' 
                    : 'text-blue-100/70 hover:bg-blue-600/20 hover:text-blue-300'
                  }`}
                >
                  Sign up
                </Link>
              </>
            )}
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button 
              onClick={() => setIsVisible(false)} 
              className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors" 
              title="Hide Navbar"
            >
                <EyeOff size={18} />
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex flex-1 justify-end items-center gap-4 lg:hidden z-20">
            <button 
              onClick={() => setIsVisible(false)} 
              className="p-2 text-slate-500 hover:text-blue-400"
            >
              <EyeOff size={20} />
            </button>
            <button 
              type="button" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#14213D] border border-white/5 px-3 py-2 text-sm font-bold text-blue-100 hover:bg-[#1C2541]"
            >
              {isMobileMenuOpen ? <X size={20} className="text-rose-400" /> : <Menu size={20} className="text-blue-400" />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
           <div className="lg:hidden absolute top-full left-0 w-full bg-[#0A1128] shadow-2xl border-b border-white/5 py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
             <Link href="/home" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-base font-bold text-blue-100/80 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg">Home</Link>
             <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-base font-bold text-blue-100/80 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg">Dashboard</Link>
             <Link href="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-base font-bold text-blue-100/80 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg">My Orders</Link>
             {isAdmin && (
               <Link href="/admin-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-base font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">Command Center</Link>
             )}
             <hr className="border-white/5 my-2" />
             <div className="flex flex-col gap-3">
               {isLoggedIn ? (
                 <button
                   onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                   className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-rose-400 border border-rose-500/20 rounded-lg hover:bg-rose-500/10 transition-colors uppercase tracking-wider"
                 >
                   <LogOut size={15} /> Logout
                 </button>
               ) : (
                 <>
                   <Link 
                     href="/login" 
                     onClick={() => setIsMobileMenuOpen(false)} 
                     className={`block text-center px-4 py-2 text-sm font-bold rounded-lg transition-colors uppercase tracking-wider ${
                       pathname === '/login' 
                       ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:bg-blue-500' 
                       : 'text-blue-100/80 border border-white/10 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/30'
                     }`}
                   >
                     LOGIN
                   </Link>
                   <Link 
                     href="/signup" 
                     onClick={() => setIsMobileMenuOpen(false)} 
                     className={`block text-center px-4 py-2 text-sm font-bold rounded-lg transition-colors uppercase tracking-wider ${
                       pathname === '/signup' || pathname !== '/login'
                       ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:bg-blue-500' 
                       : 'text-blue-100/80 border border-white/10 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/30'
                     }`}
                   >
                     Sign up
                   </Link>
                 </>
               )}
             </div>
           </div>
        )}
      </div>
    </div>
  )
}

export default Navbar