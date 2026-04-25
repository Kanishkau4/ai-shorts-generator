"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, Zap, LayoutTemplate, Clock } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need to go viral
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform provides all the tools you need to create, edit, and schedule high-performing short-form content.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          {/* Feature 1 - Large Span (Workflow Video) */}
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden border border-border bg-muted/30 group">
            <video
              src="/videos/workflow-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            ></video>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md mb-4 border border-primary/30">
                <LayoutTemplate className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Intelligent Workflow</h3>
              <p className="text-muted-foreground max-w-md">
                Turn long videos or text prompts into fully edited shorts with captions, B-roll, and music in just one click.
              </p>
            </div>
          </div>

          {/* Feature 2 - Small (Image) */}
          <div className="relative rounded-3xl overflow-hidden border border-border bg-muted/30 group">
            <Image
              src="/images/feature-render-2.jpg"
              alt="Feature Render"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md mb-4 border border-primary/30">
                <Sparkles className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Subtitles</h3>
              <p className="text-muted-foreground text-sm">
                Engaging, dynamic subtitles generated automatically to keep your viewers hooked.
              </p>
            </div>
          </div>

          {/* Feature 3 - Small (Image) */}
          <div className="relative rounded-3xl overflow-hidden border border-border bg-muted/30 group">
            <Image
              src="/images/feature-render-3.jpg"
              alt="Feature Render"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md mb-4 border border-primary/30">
                <Clock className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Scheduler</h3>
              <p className="text-muted-foreground text-sm">
                Schedule your shorts for optimal times across all major platforms simultaneously.
              </p>
            </div>
          </div>

          {/* Feature 4 - Large Span (Transitions Video) */}
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden border border-border bg-muted/30 group">
            <video
              src="/videos/transitions-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            ></video>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md mb-4 border border-primary/30">
                <Zap className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Dynamic Transitions</h3>
              <p className="text-muted-foreground max-w-md">
                Keep audience retention high with AI-selected viral transitions and effects that match the beat of your audio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
