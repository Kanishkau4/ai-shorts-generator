"use client";

import { useState } from "react";
import { ArrowRight, Pencil, Check } from "lucide-react";

const AVAILABLE_NICHES = [
  {
    id: "scary-stories",
    emoji: "👻",
    label: "Scary Stories",
    description: "Spine-chilling horror tales and paranormal encounters.",
  },
  {
    id: "motivation",
    emoji: "🔥",
    label: "Motivation",
    description: "Inspiring quotes and stories to fuel daily hustle.",
  },
  {
    id: "did-you-know",
    emoji: "🤯",
    label: "Did You Know?",
    description: "Mind-blowing facts and trivia across all topics.",
  },
  {
    id: "history",
    emoji: "📜",
    label: "History",
    description: "Untold events and fascinating moments from the past.",
  },
  {
    id: "science",
    emoji: "🔬",
    label: "Science",
    description: "Discoveries, experiments, and wonders of the natural world.",
  },
  {
    id: "life-hacks",
    emoji: "⚡",
    label: "Life Hacks",
    description: "Smart tips and tricks to simplify everyday life.",
  },
  {
    id: "dark-humor",
    emoji: "😈",
    label: "Dark Humor",
    description: "Edgy jokes and satirical takes on everyday situations.",
  },
  {
    id: "mystery",
    emoji: "🕵️",
    label: "Mystery",
    description: "Unsolved cases, conspiracies, and unexplained phenomena.",
  },
  {
    id: "animals",
    emoji: "🦁",
    label: "Animals",
    description: "Cute, wild, and surprising facts about the animal kingdom.",
  },
  {
    id: "finance",
    emoji: "💰",
    label: "Finance",
    description: "Money tips, investing basics, and financial freedom advice.",
  },
  {
    id: "relationships",
    emoji: "💕",
    label: "Relationships",
    description: "Dating advice, love stories, and human connection insights.",
  },
  {
    id: "technology",
    emoji: "🤖",
    label: "Technology",
    description: "AI, gadgets, and the future of tech in short-form content.",
  },
];

type Tab = "available" | "custom";

interface StepNicheProps {
  onNext: (data: { niche: string }) => void;
  defaultValue?: string;
}

export function StepNiche({ onNext, defaultValue = "" }: StepNicheProps) {
  const isAvailableNiche = AVAILABLE_NICHES.some((n) => n.id === defaultValue);

  const [activeTab, setActiveTab] = useState<Tab>(
    defaultValue && !isAvailableNiche ? "custom" : "available"
  );
  const [selectedNiche, setSelectedNiche] = useState<string>(
    isAvailableNiche ? defaultValue : ""
  );
  const [customNiche, setCustomNiche] = useState(
    defaultValue && !isAvailableNiche ? defaultValue : ""
  );

  const handleContinue = () => {
    const value = activeTab === "available" ? selectedNiche : customNiche.trim();
    if (!value) return;
    onNext({ niche: value });
  };

  const isValid =
    activeTab === "available" ? !!selectedNiche : customNiche.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Choose your niche</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a content niche for your AI-generated short videos. This helps
          tailor scripts and visuals to your audience.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/40 w-fit">
        {(["available", "custom"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-background text-foreground shadow-sm border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "custom" && <Pencil size={13} />}
            {tab === "available" ? "Available Niches" : "Custom Niche"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "available" ? (
        <div
          className="overflow-y-auto pr-1 rounded-xl"
          style={{ maxHeight: "500px" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AVAILABLE_NICHES.map((niche) => {
              const isSelected = selectedNiche === niche.id;
              return (
                <button
                  key={niche.id}
                  onClick={() => setSelectedNiche(niche.id)}
                  className={`group relative flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? "border-foreground bg-foreground/5 shadow-sm"
                      : "border-border/50 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  {/* Check badge */}
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                      <Check size={11} strokeWidth={2.5} className="text-background" />
                    </span>
                  )}

                  {/* Emoji */}
                  <span className="text-2xl leading-none mt-0.5 select-none">
                    {niche.emoji}
                  </span>

                  {/* Text */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-foreground leading-snug">
                      {niche.label}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {niche.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="custom-niche"
              className="text-sm font-medium text-foreground"
            >
              Your niche
            </label>
            <input
              id="custom-niche"
              type="text"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="e.g. True Crime, Space Exploration, Cooking Tips..."
              className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
            />
            <p className="text-xs text-muted-foreground">
              Describe your niche in a few words. Be specific for better AI results.
            </p>
          </div>

          {customNiche.trim() && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/40 border border-border/40 text-sm">
              <span className="text-muted-foreground">Selected:</span>
              <span className="font-medium text-foreground">{customNiche}</span>
            </div>
          )}
        </div>
      )}

      {/* Continue button */}
      <div className="flex justify-end pt-2 border-t border-border/40">
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
