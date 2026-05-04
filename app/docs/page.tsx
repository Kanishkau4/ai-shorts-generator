"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { 
  BookOpen, 
  Search, 
  Terminal, 
  Lightbulb, 
  Zap,
  PlayCircle,
  Code
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const docSections = [
  {
    title: "Quick Start",
    icon: PlayCircle,
    items: [
      { name: "How Vibio Works", href: "#" },
      { name: "Creating your first series", href: "#" },
      { name: "Understanding Credits", href: "#" },
    ]
  },
  {
    title: "AI & Generation",
    icon: Zap,
    items: [
      { name: "Optimizing Prompts", href: "#" },
      { name: "Choosing the right Voice", href: "#" },
      { name: "Scene Analysis logic", href: "#" },
    ]
  },
  {
    title: "API & Integrations",
    icon: Code,
    items: [
      { name: "Webhooks setup", href: "#" },
      { name: "YouTube OAuth guide", href: "#" },
      { name: "Exporting raw data", href: "#" },
    ]
  }
];

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar */}
            <aside className="lg:col-span-3 space-y-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Search docs..." 
                  className="w-full bg-muted/50 border border-border/50 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-primary/50 transition-all text-sm"
                />
              </div>

              {docSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <section.icon size={14} />
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm hover:text-primary transition-colors">{item.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>

            {/* Content */}
            <div className="lg:col-span-9 space-y-12">
              <div className="space-y-4 border-b pb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Documentation</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Everything you need to build and scale your social media presence with the power of Vibio AI.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20 p-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="text-primary" />
                      Platform Guides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to use our dashboard, create series, and manage your generated videos effectively.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">Browse Guides</Button>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/5 border-secondary/20 p-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="text-secondary-foreground" />
                      API Reference
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Developers can use our API to automate video generation and integrate Vibio into their own apps.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">View API Docs</Button>
                  </CardContent>
                </Card>
              </div>

              <article className="prose dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold">Introduction</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Vibio is designed to be the ultimate studio for short-form video creators. By combining advanced Large Language Models with powerful rendering engines, we enable anyone to produce high-retention content at scale.
                </p>
                <div className="p-6 bg-muted rounded-2xl border my-8">
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <BookOpen size={18} className="text-primary" />
                    Key Concept: The "Series"
                  </h4>
                  <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                    A Series is the core organizational unit in Vibio. Instead of creating one-off videos, you define a concept (like "Daily Stoic Wisdom") and the AI handles the consistent generation and scheduling for you.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
