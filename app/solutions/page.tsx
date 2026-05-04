"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { 
  Users, 
  Building, 
  Rocket, 
  Smartphone,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const solutions = [
  {
    title: "Content Creators",
    description: "Automate your daily posting schedule and focus on high-level strategy while we handle the editing.",
    icon: Smartphone,
    features: ["Daily Auto-posting", "Viral Hook Analysis", "Multi-platform Sync"]
  },
  {
    title: "Marketing Agencies",
    description: "Scale content production for 100+ clients without increasing your headcount. Full white-label support.",
    icon: Building,
    features: ["White-label Rendering", "Bulk Generation", "Client Dashboards"]
  },
  {
    title: "SaaS & Startups",
    description: "Turn your product updates and documentation into engaging video shorts for your audience.",
    icon: Rocket,
    features: ["API Integration", "Custom Branding", "Automated Workflows"]
  }
];

export default function SolutionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              Tailored Solutions
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
              Built for every <span className="text-muted-foreground italic font-serif">Workflow.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you're a solo creator or a global marketing agency, Vibio provides the tools to dominate short-form video.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <div key={solution.title} className="group bg-card border border-border/50 rounded-[3rem] p-10 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col h-full">
                <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground mb-8 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                  <solution.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{solution.title}</h3>
                <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">
                  {solution.description}
                </p>
                <div className="space-y-4 pt-6 border-t">
                  {solution.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm font-medium">
                      <ChevronRight size={16} className="text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 p-12 md:p-20 bg-foreground text-background rounded-[4rem] relative overflow-hidden text-center">
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Ready to scale your production?</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 rounded-full px-10 h-14 text-lg font-bold">
                  Start for Free
                </Button>
                <Button size="lg" variant="outline" className="border-background/20 hover:bg-background/10 rounded-full px-10 h-14 text-lg font-bold">
                  Talk to Sales
                </Button>
              </div>
            </div>
            {/* Artistic Blur */}
            <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
