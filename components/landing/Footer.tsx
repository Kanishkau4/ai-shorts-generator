"use client";

import * as React from "react";
import Link from "next/link";
import { X, Camera, Video, Code, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-background pt-32 pb-12 border-t border-border/40 overflow-hidden">
      {/* Massive Text Branding - Positioned behind content */}
      <div className="absolute inset-x-0 bottom-0 select-none pointer-events-none z-0 overflow-hidden">
        <h1 className="text-[30vw] font-bold leading-none tracking-tighter opacity-[0.03] dark:opacity-[0.05] text-foreground text-center translate-y-1/4">
          VIBIO
        </h1>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Newsletter / CTA Section - Restored Premium Style */}
        <div className="bg-zinc-950 text-white rounded-[3rem] p-12 md:p-24 mb-32 flex flex-col items-center text-center relative overflow-hidden border border-white/5 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <video
              src="/videos/hero-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover grayscale"
            />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 font-serif italic">
              Join the future of <br /> content creation.
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 mb-12">
              Stay ahead of the curve with our latest AI video techniques and product updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded-full px-8 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 w-full sm:w-80 backdrop-blur-md"
              />
              <button className="bg-white text-black px-10 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Get Started
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-32">
          <div className="md:col-span-4">
            <Link href="/" className="text-3xl font-bold tracking-tight mb-6 inline-block font-bold">
              Vibio
            </Link>
            <p className="text-muted-foreground mt-4 mb-8 max-w-xs">
              Empowering creators with AI-driven tools to dominate the short-form landscape.
            </p>
            <div className="flex items-center gap-6 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors"><X size={20} /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Camera size={20} /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Video size={20} /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Code size={20} /></a>
            </div>
          </div>
          
          <div className="md:col-span-2 md:offset-1">
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground">Product</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Templates</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground">Resources</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Support</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Docs</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground">Social</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">TikTok</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Twitter (X)</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6 relative">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            © {new Date().getFullYear()} Vibio AI Studio. High Retention Systems.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
