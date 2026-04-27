"use client";

import { useState, useRef } from "react";
import { ArrowRight, Play, Pause, Check, Music } from "lucide-react";

export const BACKGROUND_MUSIC_OPTIONS = [
  {
    id: "trending-reels",
    label: "Trending Reels",
    url: "https://ik.imagekit.io/Tubeguruji/BgMusic/trending-instagram-reels-music-447249.mp3",
    duration: "0:30",
  },
  {
    id: "basketball-beats",
    label: "Basketball Beats",
    url: "https://ik.imagekit.io/Tubeguruji/BgMusic/basketball-instagram-reels-music-461852.mp3",
    duration: "0:45",
  },
  {
    id: "marketing-vibe-1",
    label: "Marketing Vibe 1",
    url: "https://ik.imagekit.io/Tubeguruji/BgMusic/instagram-reels-marketing-music-384448.mp3",
    duration: "0:25",
  },
  {
    id: "marketing-vibe-2",
    label: "Marketing Vibe 2",
    url: "https://ik.imagekit.io/Tubeguruji/BgMusic/instagram-reels-marketing-music-469052.mp3",
    duration: "0:50",
  },
  {
    id: "dramatic-hip-hop-jazz",
    label: "Dramatic Hip-Hop Jazz",
    url: "https://ik.imagekit.io/Tubeguruji/BgMusic/dramatic-hip-hop-music-background-jazz-music-for-short-video-148505.mp3",
    duration: "1:15",
  },
];

interface StepBackgroundMusicProps {
  onNext: (data: { backgroundMusic: string[] }) => void;
  onBack: () => void;
  defaultValues?: string[];
}

export function StepBackgroundMusic({
  onNext,
  onBack,
  defaultValues = [],
}: StepBackgroundMusicProps) {
  const [selectedMusic, setSelectedMusic] = useState<string[]>(defaultValues);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPreview = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingPreview === url) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingPreview(null);
      return;
    }

    // Play new
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audio.onended = () => setPlayingPreview(null);
    audio.play().catch((err) => {
      console.warn("Audio playback failed:", err);
      setTimeout(() => setPlayingPreview(null), 2000);
    });
    audioRef.current = audio;
    setPlayingPreview(url);
  };

  const toggleSelection = (id: string) => {
    setSelectedMusic((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    onNext({ backgroundMusic: selectedMusic });
  };

  const isValid = selectedMusic.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Background Music</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select one or more background music tracks for your videos. We'll pick from these randomly.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div
          className="flex flex-col gap-3 overflow-y-auto pr-2"
          style={{ maxHeight: "400px" }}
        >
          {BACKGROUND_MUSIC_OPTIONS.map((music) => {
            const isSelected = selectedMusic.includes(music.id);
            const isPlaying = playingPreview === music.url;

            return (
              <div
                key={music.id}
                onClick={() => toggleSelection(music.id)}
                className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-foreground bg-foreground/5 shadow-sm"
                    : "border-border/50 hover:border-border hover:bg-muted/30"
                }`}
              >
                {/* Play Button */}
                <button
                  onClick={(e) => handlePlayPreview(music.url, e)}
                  className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? "bg-foreground text-background scale-110 shadow-md"
                      : "bg-muted border border-border/50 text-foreground group-hover:bg-foreground group-hover:text-background"
                  }`}
                >
                  {isPlaying ? (
                    <Pause size={20} className="fill-current" />
                  ) : (
                    <Play size={20} className="fill-current ml-1" />
                  )}
                </button>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-foreground truncate">
                      {music.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Music size={14} />
                      Audio Track
                    </span>
                  </div>
                </div>

                {/* Checkbox */}
                <div
                  className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-foreground border-foreground text-background"
                      : "border-border/50 bg-background"
                  }`}
                >
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
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
