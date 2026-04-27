"use client";

import { useState, useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";

export const VIDEO_STYLES = [
  {
    id: "realistic",
    label: "Realistic",
    description: "Photorealistic visuals that look true to life",
    image: "/video-style/realistic.jpeg",
  },
  {
    id: "cinematic",
    label: "Cinematic",
    description: "Dramatic, film-quality frames with depth",
    image: "/video-style/cinematic.jpeg",
  },
  {
    id: "anime",
    label: "Anime",
    description: "Japanese animation style with vivid colors",
    image: "/video-style/anime.jpeg",
  },
  {
    id: "3d-render",
    label: "3D Render",
    description: "Clean, modern 3D generated imagery",
    image: "/video-style/3d-render.jpeg",
  },
  {
    id: "comic",
    label: "Comic",
    description: "Bold outlines and pop-art inspired visuals",
    image: "/video-style/comic.jpeg",
  },
  {
    id: "gta",
    label: "GTA",
    description: "Gritty, open-world video game aesthetic",
    image: "/video-style/gta.jpeg",
  },
];

interface StepVideoStyleProps {
  onNext: (data: { videoStyle: string }) => void;
  onBack: () => void;
  defaultValue?: string;
}

export function StepVideoStyle({
  onNext,
  onBack,
  defaultValue = "",
}: StepVideoStyleProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>(defaultValue);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleContinue = () => {
    if (!selectedStyle) return;
    onNext({ videoStyle: selectedStyle });
  };

  const isValid = !!selectedStyle;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Video Style</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the visual style for your AI-generated short videos. This
          determines how your scenes and imagery will look.
        </p>
      </div>

      {/* Horizontal scrollable style list */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
        >
          {VIDEO_STYLES.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`group relative shrink-0 snap-start rounded-2xl overflow-hidden border-2 transition-all duration-300 focus:outline-none ${
                  isSelected
                    ? "border-foreground shadow-xl scale-[1.02]"
                    : "border-border/40 hover:border-border hover:scale-[1.01] hover:shadow-md"
                }`}
                // 9:16 ratio card: width drives height
                style={{ width: "180px", height: "320px" }}
              >
                {/* Full-bleed image */}
                <Image
                  src={style.image}
                  alt={style.label}
                  fill
                  sizes="180px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-foreground flex items-center justify-center shadow-lg animate-in zoom-in-75 duration-200">
                    <Check size={14} strokeWidth={3} className="text-background" />
                  </div>
                )}

                {/* Label + description at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <p className="text-white font-bold text-base leading-tight">
                    {style.label}
                  </p>
                  <p className="text-white/70 text-[11px] mt-1 leading-snug">
                    {style.description}
                  </p>
                </div>

                {/* Selection ring animation */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-inset ring-foreground/40 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Scroll hint gradient on right */}
        <div className="absolute right-0 top-0 bottom-3 w-12 bg-gradient-to-l from-card/80 to-transparent pointer-events-none rounded-r-2xl" />
      </div>

      {/* Selected preview label */}
      {selectedStyle && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border/40 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="relative w-8 h-14 rounded-lg overflow-hidden shrink-0">
            <Image
              src={VIDEO_STYLES.find((s) => s.id === selectedStyle)?.image || ""}
              alt="selected"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Selected style</p>
            <p className="text-sm font-semibold text-foreground">
              {VIDEO_STYLES.find((s) => s.id === selectedStyle)?.label}
            </p>
          </div>
          <Check size={16} className="ml-auto text-foreground" />
        </div>
      )}

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
