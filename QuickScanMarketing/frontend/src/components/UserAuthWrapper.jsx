"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const UserAuthWrapper = ({ children }) => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      toast.error("Shield Status: Offline. Authorization required.");
      router.push("/login");
    } else {
      setIsLoaded(true);
    }
  }, [router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Establishing Secure Connection...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default UserAuthWrapper;
