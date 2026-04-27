"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";

export const CAPTION_STYLES = [
  {
    id: "hormozi",
    label: "Hormozi Style",
    description: "Bold, punchy, yellow highlights",
  },
  {
    id: "minimalist",
    label: "Minimalist",
    description: "Clean, elegant, subtle fade",
  },
  {
    id: "neon",
    label: "Neon Glow",
    description: "Vibrant glowing text effect",
  },
  {
    id: "typewriter",
    label: "Typewriter",
    description: "Classic monospace typing effect",
  },
  {
    id: "karaoke",
    label: "Karaoke",
    description: "Smooth continuous highlight",
  },
  {
    id: "boxed",
    label: "Boxed Bold",
    description: "High contrast solid background",
  },
];

const DEMO_TEXT = "Watch this incredible video now!";
const WORDS = DEMO_TEXT.split(" ");

interface StepCaptionStyleProps {
  onNext: (data: { captionStyle: string }) => void;
  onBack: () => void;
  defaultValue?: string;
}

export function StepCaptionStyle({
  onNext,
  onBack,
  defaultValue = "",
}: StepCaptionStyleProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>(defaultValue);
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  // Animation loop for previews
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % (WORDS.length + 1));
    }, 600); // Change word every 600ms

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (!selectedStyle) return;
    onNext({ captionStyle: selectedStyle });
  };

  const isValid = !!selectedStyle;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Caption Style</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select an animated caption style for your videos. These captions will
          be automatically generated and synced with the audio.
        </p>
      </div>

      {/* Grid of Styles */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2"
        style={{ maxHeight: "400px" }}
      >
        {CAPTION_STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <div
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`relative flex flex-col p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-foreground bg-foreground/5 shadow-md"
                  : "border-border/50 hover:border-border hover:bg-muted/30"
              }`}
            >
              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-foreground flex items-center justify-center shadow-sm animate-in zoom-in-75 duration-200 z-10">
                  <Check size={12} strokeWidth={3} className="text-background" />
                </div>
              )}

              {/* Header */}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">{style.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {style.description}
                </p>
              </div>

              {/* Preview Box */}
              <div className="relative h-28 bg-muted/40 rounded-xl overflow-hidden flex items-center justify-center border border-border/40">
                <CaptionPreview styleId={style.id} activeIndex={activeWordIndex} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-border/40 mt-auto">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
        >
          Back
        </button>
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

// ─── Reusable Preview Renderer ──────────────────────────────────────────────

function CaptionPreview({ styleId, activeIndex }: { styleId: string; activeIndex: number }) {
  if (activeIndex === WORDS.length) {
    // Show empty state briefly between loops
    return <div className="opacity-0 transition-opacity duration-300">...</div>;
  }

  // 1. HORMOZI
  if (styleId === "hormozi") {
    return (
      <div className="flex flex-wrap justify-center gap-2 px-4 text-center">
        {WORDS.map((word, i) => (
          <span
            key={i}
            className={`text-2xl font-black uppercase tracking-tight transition-all duration-150 ${
              i === activeIndex
                ? "text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] scale-110"
                : "text-foreground opacity-30 scale-100"
            }`}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  // 2. MINIMALIST
  if (styleId === "minimalist") {
    return (
      <div className="flex flex-wrap justify-center gap-1.5 px-4 text-center">
        {WORDS.map((word, i) => (
          <span
            key={i}
            className={`text-xl font-medium tracking-wide transition-all duration-500 ease-out ${
              i <= activeIndex
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  // 3. NEON
  if (styleId === "neon") {
    return (
      <div className="flex flex-wrap justify-center gap-2 px-4 text-center bg-black/80 w-full h-full items-center">
        {WORDS.map((word, i) => (
          <span
            key={i}
            className={`text-xl font-bold italic transition-all duration-300 ${
              i === activeIndex
                ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] scale-110"
                : "text-zinc-600"
            }`}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  // 4. TYPEWRITER
  if (styleId === "typewriter") {
    // For typewriter, we show words up to active index
    const displayedText = WORDS.slice(0, activeIndex + 1).join(" ");
    return (
      <div className="font-mono text-lg font-semibold text-foreground px-6 text-center">
        {displayedText}
        <span className="animate-pulse inline-block w-2 h-5 bg-foreground ml-1 align-middle" />
      </div>
    );
  }

  // 5. KARAOKE
  if (styleId === "karaoke") {
    return (
      <div className="flex flex-wrap justify-center gap-2 px-4 text-center">
        {WORDS.map((word, i) => (
          <span
            key={i}
            className={`text-2xl font-bold transition-colors duration-300 ${
              i <= activeIndex ? "text-primary" : "text-foreground/20"
            }`}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  // 6. BOXED
  if (styleId === "boxed") {
    return (
      <div className="flex flex-wrap justify-center gap-2 px-4 text-center">
        {WORDS.map((word, i) => (
          <span
            key={i}
            className={`text-lg font-bold px-2 py-1 rounded-md transition-all duration-200 ${
              i === activeIndex
                ? "bg-foreground text-background scale-110 shadow-lg"
                : "bg-transparent text-foreground/40 scale-100"
            }`}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }

  return null;
}
