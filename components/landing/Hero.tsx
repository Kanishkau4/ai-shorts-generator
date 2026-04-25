"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-8 border border-border">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Introducing Vibio AI 1.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Automate Your Shorts with AI
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Vibio is the ultimate Shorts Generator and Scheduler for Instagram, TikTok, YouTube Shorts, and X. Create viral content in seconds, not hours.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              Get Started for Free
              <ArrowRight size={18} />
            </Link>
            
            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/80 transition-all border border-border">
              <Play size={18} />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Video Presentation */}
        <div className="mt-20 md:mt-24 relative mx-auto max-w-5xl rounded-2xl md:rounded-[2rem] border border-border/50 bg-muted/20 p-2 md:p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent blur-3xl -z-10 rounded-full"></div>
          <div className="relative rounded-xl md:rounded-[1.5rem] overflow-hidden aspect-video bg-black shadow-2xl">
            <video
              src="/videos/hero-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster="/images/feature-render-1.jpg"
            ></video>
          </div>
        </div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 -z-10 pointer-events-none"></div>
    </section>
  );
}
