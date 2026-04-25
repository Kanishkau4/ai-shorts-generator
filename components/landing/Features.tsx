"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, Zap, LayoutTemplate, Clock, ArrowUpRight } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header Section - Inspired by "Sustainability Projects" header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <div className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Features</div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95]">
              Engineered for <br /> <span className="text-muted-foreground">High Retention.</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-lg text-muted-foreground mb-6">
              Stop wasting hours in the editor. Our AI analyzes what makes videos go viral and applies those patterns to your content automatically.
            </p>
            <button className="group flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-bold hover:bg-secondary/80 transition-all">
              Explore All Tools
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Artistic Overlapping Grid - Inspired by "Visa Travels means Going Places" */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-32">
          <div className="lg:col-span-7 relative h-[500px] md:h-[700px] rounded-[3rem] overflow-hidden group">
            <video
              src="/videos/workflow-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <h3 className="text-4xl font-bold mb-4 italic font-serif">Smart Scene Analysis</h3>
              <p className="text-white/70 max-w-md">
                Our AI identifies the most engaging hooks in your long-form content and extracts them instantly.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="relative h-[300px] rounded-[2.5rem] overflow-hidden group">
              <Image 
                src="/images/feature-render-1.jpg" 
                alt="Feature" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute top-8 left-8">
                <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/30 text-white font-bold">
                  AI Captioning
                </div>
              </div>
            </div>
            
            <div className="relative h-[300px] rounded-[2.5rem] overflow-hidden group">
              <Image 
                src="/images/feature-render-2.jpg" 
                alt="Feature" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute top-8 left-8">
                <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/30 text-white font-bold">
                  B-Roll Engine
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards - Inspired by "Pick the Place" grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Viral Transitions", icon: Zap, video: "/videos/transitions-video.mp4", desc: "Dynamic transitions that match the beat." },
            { title: "One-Click Scheduling", icon: Clock, img: "/images/feature-render-3.jpg", desc: "Post to TikTok, Reels, and Shorts at once." },
            { title: "Custom Templates", icon: LayoutTemplate, img: "/images/feature-render-4.jpg", desc: "Keep your brand consistent with AI presets." },
          ].map((item, i) => (
            <div key={i} className="group bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-[2.5rem] p-8 transition-all hover:-translate-y-2">
              <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center mb-6 shadow-sm">
                <item.icon className="text-primary" size={28} />
              </div>
              <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
              <p className="text-muted-foreground mb-8">{item.desc}</p>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-background">
                {item.video ? (
                  <video src={item.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : (
                  <Image src={item.img!} alt={item.title} fill className="object-cover" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
