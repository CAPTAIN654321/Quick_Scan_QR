'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any existing session data when the website first appears
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to the login portal
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Initializing Nexus Portal...</p>
      </div>
    </div>
  );
}