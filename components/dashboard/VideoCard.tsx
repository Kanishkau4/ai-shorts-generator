"use client";

import { Clock, Play, Download, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { getNicheMeta } from "./SeriesCard";
import Image from "next/image";

export type GeneratedVideo = {
  id: string;
  series_id: string;
  user_id: string;
  title: string;
  description: string;
  status: "processing" | "completed" | "failed";
  image_urls: string[] | null;
  video_url: string | null;
  created_at: string;
  video_series?: {
    series_name: string;
    niche: string;
  };
};

interface VideoCardProps {
  video: GeneratedVideo;
  onDelete?: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VideoCard({ video, onDelete }: VideoCardProps) {
  const isProcessing = video.status === "processing";
  const isFailed = video.status === "failed";
  const thumbnail = video.image_urls && video.image_urls.length > 0 ? video.image_urls[0] : null;
  const niche = video.video_series?.niche || "general";
  const { emoji, gradient } = getNicheMeta(niche);

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border/50 bg-card/80 overflow-hidden shadow-sm hover:shadow-lg hover:border-border/80 transition-all duration-300 backdrop-blur-sm">
      {/* ── Thumbnail / Preview ────────────────────────────────────────── */}
      <div className={`relative aspect-[9/14] w-full overflow-hidden bg-gradient-to-b ${gradient}`}>
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={video.title || "Video thumbnail"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-6xl drop-shadow-2xl select-none opacity-50">
              {emoji}
            </span>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] z-20">
            <Loader2 size={32} className="text-white animate-spin mb-3" />
            <span className="text-white text-sm font-bold uppercase tracking-widest">Generating...</span>
          </div>
        )}

        {isFailed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/60 backdrop-blur-[2px] z-20">
            <span className="text-white text-sm font-bold uppercase tracking-widest text-center px-4">Generation Failed</span>
          </div>
        )}

        {video.video_url && !isProcessing && (
          <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:scale-110 transition-transform">
              <Play size={24} className="text-white fill-white ml-1" />
            </div>
          </button>
        )}

        {/* Status Badge */}
        {!isProcessing && !isFailed && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">Ready</span>
          </div>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground leading-snug truncate">
            {video.title || "Untitled Video"}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock size={11} className="text-muted-foreground shrink-0" />
            <p className="text-[11px] text-muted-foreground truncate">
              {formatDate(video.created_at)}
            </p>
          </div>
          {video.video_series && (
            <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-tight mt-1">
              Series: {video.video_series.series_name}
            </p>
          )}
        </div>

        {/* ── Actions ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/40">
          <button
            disabled={!video.video_url || isProcessing}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-bold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-all"
          >
            <Download size={13} />
            Download
          </button>
          <button
            onClick={() => onDelete?.(video.id)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border/50 transition-all"
            title="Delete video"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border/40 bg-card/60 overflow-hidden animate-pulse">
      <div className="aspect-[9/14] w-full bg-muted/50" />
      <div className="p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-3/4 rounded bg-muted/70" />
          <div className="h-3 w-1/2 rounded bg-muted/50" />
        </div>
        <div className="pt-1 border-t border-border/40 flex gap-2">
          <div className="h-8 flex-1 rounded-xl bg-muted/50" />
          <div className="h-8 w-9 rounded-xl bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
