"use client";

import { useState } from "react";
import {
  Rocket,
  Clock,
  Info,
  ChevronDown,
} from "lucide-react";

// ─── TikTok Icon (no lucide equivalent) ──────────────────────────────────────
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

// ─── X / Twitter icon ────────────────────────────────────────────────────────
function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── Social Icons ────────────────────────────────────────────────────────────
function YoutubeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 00-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 001.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 001.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const PLATFORMS = [
  { id: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { id: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { id: "instagram", label: "Instagram", Icon: InstagramIcon },
  { id: "facebook", label: "Facebook", Icon: FacebookIcon },
  { id: "x", label: "X / Twitter", Icon: XIcon },
];

const VIDEO_DURATIONS = [
  { value: "30-60", label: "30–60 seconds", description: "Quick, punchy shorts" },
  { value: "60-90", label: "60–90 seconds", description: "Standard short-form length" },
];

// Publish times in 30-min increments
const PUBLISH_TIMES = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const ampm = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: `${String(hour).padStart(2, "0")}:${minute}`,
    label: `${displayHour}:${minute} ${ampm}`,
  };
});

export type SeriesDetails = {
  seriesName: string;
  videoDuration: string;
  platforms: string[];
  publishTime: string;
};

interface StepSeriesDetailsProps {
  onSubmit: (data: SeriesDetails) => void;
  onBack: () => void;
  defaultValues?: Partial<SeriesDetails>;
  isLoading?: boolean;
}

export function StepSeriesDetails({
  onSubmit,
  onBack,
  defaultValues,
  isLoading = false,
}: StepSeriesDetailsProps) {
  const [seriesName, setSeriesName] = useState(defaultValues?.seriesName || "");
  const [videoDuration, setVideoDuration] = useState(
    defaultValues?.videoDuration || "30-60"
  );
  const [platforms, setPlatforms] = useState<string[]>(
    defaultValues?.platforms || []
  );
  const [publishTime, setPublishTime] = useState(
    defaultValues?.publishTime || "08:00"
  );

  const togglePlatform = (id: string) => {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const isValid =
    seriesName.trim().length > 0 &&
    videoDuration !== "" &&
    platforms.length > 0 &&
    publishTime !== "";

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({ seriesName: seriesName.trim(), videoDuration, platforms, publishTime });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Series Details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Give your series a name, set the video length, choose your platforms, and schedule publishing.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Series Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor="series-name">
            Series Name
          </label>
          <input
            id="series-name"
            type="text"
            value={seriesName}
            onChange={(e) => setSeriesName(e.target.value)}
            placeholder="e.g. Daily Motivation, Scary Stories Weekly…"
            className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video Duration */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Video Duration
            </label>
            <div className="relative">
              <select
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all cursor-pointer pr-10 [&>option]:bg-card [&>option]:text-foreground"
              >
                {VIDEO_DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label} — {d.description}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          </div>

          {/* Publish Time */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Daily Publish Time
            </label>
            <div className="relative">
              <select
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all cursor-pointer pr-10 [&>option]:bg-card [&>option]:text-foreground"
              >
                {PUBLISH_TIMES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <Clock
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
            {/* Note */}
            <div className="flex items-start gap-2 mt-1 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/40">
              <Info size={13} className="text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your video will be generated <span className="font-medium text-foreground">1–2 hours before</span> the scheduled publish time to ensure it&apos;s ready on time.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Publish Platforms
          </label>
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.map(({ id, label, Icon }) => {
              const isActive = platforms.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePlatform(id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-foreground bg-foreground text-background shadow-sm"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>
          {platforms.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Select at least one platform to publish your series.
            </p>
          )}
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
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              Scheduling…
            </>
          ) : (
            <>
              <Rocket size={16} />
              Schedule Series
            </>
          )}
        </button>
      </div>
    </div>
  );
}
