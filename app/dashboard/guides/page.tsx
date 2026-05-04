"use client";

import React from "react";
import {
  BookOpen,
  PlayCircle,
  Zap,
  Share2,
  Settings,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Info
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import Link from "next/link";

const guides = [
  {
    title: "Getting Started",
    description: "Learn the basics of creating your first AI-powered video series.",
    icon: PlayCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    content: (
      <div className="space-y-4">
        <p>Creating a video series with Vibio is easy. Follow these simple steps:</p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
          <li>Click on <strong>"Create New Series"</strong> in the sidebar.</li>
          <li>Choose a <strong>Niche</strong> (e.g., Scary Stories, Fun Facts, Motivational).</li>
          <li>Select your preferred <strong>Language</strong> and <strong>Voice</strong>.</li>
          <li>Pick a <strong>Video Style</strong> and <strong>Caption Style</strong>.</li>
          <li>Set your <strong>Publish Time</strong> and click Create.</li>
        </ol>
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm italic flex items-center gap-2">
            <Info size={16} className="text-blue-500" />
            Vibio will automatically generate scripts, voices, and images for each video in the series!
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "AI Scripting & Niches",
    description: "Master the art of prompt engineering for better video scripts.",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    content: (
      <div className="space-y-4">
        <p>The secret to a viral short is a great script. Our AI uses your niche to craft engaging stories.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 border rounded-md bg-card">
            <h4 className="font-semibold text-sm mb-1">Scary Stories</h4>
            <p className="text-xs text-muted-foreground">Focuses on suspense, dark atmospheres, and plot twists.</p>
          </div>
          <div className="p-3 border rounded-md bg-card">
            <h4 className="font-semibold text-sm mb-1">Fun Facts</h4>
            <p className="text-xs text-muted-foreground">Short, punchy, and educational snippets with high retention.</p>
          </div>
        </div>
        <p className="text-sm"><strong>Tip:</strong> Be specific in your series name. Instead of "History", use "Hidden Roman Secrets" for more targeted scripts.</p>
      </div>
    ),
  },
  {
    title: "Social Media Auto-Publishing",
    description: "Connect your accounts and let Vibio handle the posting.",
    icon: Share2,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    content: (
      <div className="space-y-4">
        <p>Vibio can post your videos directly to your social media channels.</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 border-b">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">YT</div>
            <p className="text-sm"><strong>YouTube Shorts:</strong> Connect via Google OAuth in Settings.</p>
          </div>
          <div className="flex items-center gap-3 p-2 border-b">
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white">TT</div>
            <p className="text-sm"><strong>TikTok:</strong> Coming soon! (Check settings for beta access).</p>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">FB</div>
            <p className="text-sm"><strong>Facebook Reels:</strong> Coming soon!</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Billing & Subscriptions",
    description: "Understand our plans and manage your billing cycle.",
    icon: ShieldCheck,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    content: (
      <div className="space-y-4">
        <p>We offer three main plans to suit your needs:</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-1 text-primary" /> <strong>Free:</strong> 2 videos/mo, 720p, Watermarked.</li>
          <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-1 text-primary" /> <strong>Pro:</strong> 30 videos/mo, 1080p, No Watermark.</li>
          <li className="flex items-start gap-2"><ChevronRight size={14} className="mt-1 text-primary" /> <strong>Agency:</strong> 150 videos/mo, 4K Support, API Access.</li>
        </ul>
        <Link
          href="/dashboard/billing"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex")}
        >
          Manage Subscription <ExternalLink size={14} className="ml-2" />
        </Link>
      </div>
    ),
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-primary">
          <BookOpen size={28} />
          <h1 className="text-3xl font-bold tracking-tight">Vibio Guides</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Master the tools and techniques to grow your social media presence with AI.
        </p>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="font-semibold">New Feature Alert!</AlertTitle>
        <AlertDescription>
          YouTube auto-publishing is now live! Connect your channel in the <a href="/dashboard/settings" className="underline font-medium decoration-primary/30 hover:decoration-primary">Settings</a> page.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-6">
        {guides.map((guide, index) => {
          const Icon = guide.icon;
          return (
            <Card key={index} className="overflow-hidden border-none bg-card/50 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                <div className={`p-3 rounded-xl ${guide.bgColor} ${guide.color}`}>
                  <Icon size={24} />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Accordion className="w-full">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium text-primary hover:text-primary/80">
                      Learn more
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed pt-2">
                      {guide.content}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-xl font-semibold">Still have questions?</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our support team is here to help you get the most out of Vibio.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button variant="default">Contact Support</Button>
            <Button variant="outline">Join Community</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
