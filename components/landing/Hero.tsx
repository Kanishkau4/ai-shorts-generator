"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Wand2, Search } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pt-40 md:pt-46">
      {/* Background Video with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          src="/videos/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-105 opacity-80 dark:opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/40 to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/50 text-foreground text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={12} className="text-primary" />
            AI-Powered Short Video Studio
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-[1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Create <span className="text-primary italic font-serif">Viral</span> <br /> 
            Shorts in <span className="opacity-70">Seconds.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Vibio uses state-of-the-art AI to transform your ideas, long videos, or scripts into engaging shorts for social media.
          </p>

          {/* AI Prompt Bar - Inspired by the search/input bars in references */}
          <div className="max-w-xl bg-background/80 backdrop-blur-2xl border border-border/50 p-1.5 rounded-[2rem] flex items-center shadow-2xl animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Wand2 className="text-primary" size={18} />
              <input
                type="text"
                placeholder="Describe your video idea..."
                className="bg-transparent border-none outline-none w-full text-base placeholder:text-muted-foreground/50"
              />
            </div>
            <button className="bg-foreground text-background px-6 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Generate
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-12 flex items-center gap-8 animate-in fade-in duration-1000 delay-500">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                  <img src={`/images/feature-render-${i}.jpg`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm font-medium">
              <span className="text-primary">10,000+</span> creators trust Vibio
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element - Inspired by the travel reference's circles */}
      <div className="absolute -right-20 top-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
