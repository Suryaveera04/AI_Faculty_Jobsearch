import type { Metadata } from 'next';
import { Outfit, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ACADEXMATCH.AI | India\'s Intelligent Academic Recruitment Ecosystem',
  description: 'National academic hiring operating system for Indian Universities, IITs, NITs, Central Colleges, Faculty & Researchers. Powered by UGC/AICTE compliance, 7th CPC bands, and explainable AI matching.',
  keywords: 'academic jobs India, faculty recruitment, IIT professor jobs, UGC NET eligibility, 7th CPC faculty pay scale, AICTE recruitment, academic ATS, Indian higher education hiring',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
