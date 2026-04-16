import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata = {
  title: "Vision QR Pro | Command Center & Marketing Nexus",
  description: "Next-generation QR analytics, user telemetry, and high-fidelity lead generation platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body
        className="antialiased font-sans bg-[#0B132B]"
      >
        <Toaster position = "top-right"/>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
