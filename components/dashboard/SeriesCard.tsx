"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  PauseCircle,
  PlayCircle,
  Film,
  Wand2,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ─── Type ───────────────────────────────────────────────────────────────────

export type VideoSeries = {
  id: string;
  user_id: string;
  series_name: string;
  niche: string;
  language: string;
  voice: string;
  background_music: string[];
  video_style: string;
  caption_style: string;
  video_duration: string;
  platforms: string[];
  publish_time: string;
  status?: "active" | "pending";
  created_at: string;
};

// ─── Niche → gradient / emoji map ───────────────────────────────────────────

const NICHE_META: Record<string, { emoji: string; gradient: string }> = {
  "scary-stories":  { emoji: "👻", gradient: "from-violet-900 via-slate-900 to-zinc-900" },
  motivation:       { emoji: "🔥", gradient: "from-orange-600 via-red-700 to-rose-900" },
  "did-you-know":   { emoji: "🤯", gradient: "from-cyan-700 via-sky-800 to-indigo-900" },
  history:          { emoji: "📜", gradient: "from-amber-700 via-yellow-800 to-stone-900" },
  science:          { emoji: "🔬", gradient: "from-emerald-700 via-teal-800 to-cyan-900" },
  "life-hacks":     { emoji: "⚡", gradient: "from-yellow-500 via-amber-700 to-orange-900" },
  "dark-humor":     { emoji: "😈", gradient: "from-purple-800 via-violet-900 to-slate-900" },
  mystery:          { emoji: "🕵️", gradient: "from-indigo-800 via-slate-900 to-zinc-900" },
  animals:          { emoji: "🦁", gradient: "from-lime-700 via-green-800 to-emerald-900" },
  finance:          { emoji: "💰", gradient: "from-green-600 via-emerald-800 to-teal-900" },
  relationships:    { emoji: "💕", gradient: "from-pink-600 via-rose-700 to-red-900" },
  technology:       { emoji: "🤖", gradient: "from-blue-600 via-indigo-800 to-violet-900" },
};

function getNicheMeta(niche: string) {
  return NICHE_META[niche] ?? { emoji: "🎬", gradient: "from-slate-700 via-slate-800 to-zinc-900" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Popover Menu ────────────────────────────────────────────────────────────

function PopoverMenu({
  isOpen,
  onClose,
  isPending,
  onEdit,
  onDelete,
  onTogglePause,
}: {
  isOpen: boolean;
  onClose: () => void;
  isPending: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePause: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      label: "Edit Series",
      icon: Pencil,
      onClick: () => { onEdit(); onClose(); },
      className: "text-foreground hover:bg-muted/60",
    },
    {
      label: isPending ? "Resume Series" : "Pause Series",
      icon: isPending ? PlayCircle : PauseCircle,
      onClick: () => { onTogglePause(); onClose(); },
      className: "text-foreground hover:bg-muted/60",
    },
    {
      label: "Delete Series",
      icon: Trash2,
      onClick: () => { onDelete(); onClose(); },
      className: "text-destructive hover:bg-destructive/10",
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1.5 z-50 min-w-[172px] rounded-xl border border-border/60 bg-popover shadow-xl backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-150"
      style={{ transformOrigin: "top right" }}
    >
      <div className="p-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${item.className}`}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Confirm Delete Dialog ───────────────────────────────────────────────────

function DeleteDialog({
  seriesName,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  seriesName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle size={20} className="text-destructive" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Delete Series?</h3>
            <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          You are about to permanently delete{" "}
          <span className="font-semibold text-foreground">&ldquo;{seriesName}&rdquo;</span> and all
          associated data.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-bold transition-all hover:bg-destructive/90 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main SeriesCard ─────────────────────────────────────────────────────────

interface SeriesCardProps {
  series: VideoSeries;
  onEdit: (series: VideoSeries) => void;
  onDelete: (id: string) => void;
  onTogglePause: (id: string, currentStatus: string) => void;
  onGenerateVideo: (series: VideoSeries) => void;
  onViewVideos: (series: VideoSeries) => void;
}

export function SeriesCard({
  series,
  onEdit,
  onDelete,
  onTogglePause,
  onGenerateVideo,
  onViewVideos,
}: SeriesCardProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { emoji, gradient } = getNicheMeta(series.niche);
  const isPending = series.status === "pending";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/series/${series.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      onDelete(series.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleTogglePause = async () => {
    try {
      const newStatus = isPending ? "active" : "pending";
      const res = await fetch(`/api/series/${series.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      onTogglePause(series.id, newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await onGenerateVideo(series);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {confirmDelete && (
        <DeleteDialog
          seriesName={series.series_name}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          isDeleting={isDeleting}
        />
      )}

      <div className="group relative flex flex-col rounded-2xl border border-border/50 bg-card/80 overflow-hidden shadow-sm hover:shadow-lg hover:border-border/80 transition-all duration-300 backdrop-blur-sm">
        {/* ── Thumbnail ─────────────────────────────────────────────────── */}
        <div className={`relative aspect-[9/14] w-full bg-gradient-to-b ${gradient} flex flex-col items-center justify-center overflow-hidden`}>
          {/* Decorative noise overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vertical short-video aspect ratio indicator bars */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Main emoji */}
          <span className="text-7xl drop-shadow-2xl select-none z-10 group-hover:scale-110 transition-transform duration-500">
            {emoji}
          </span>

          {/* Series name overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pt-8 pb-3 z-10">
            <p className="text-white text-[11px] font-semibold uppercase tracking-widest opacity-70 truncate">
              {series.niche.replace(/-/g, " ")}
            </p>
          </div>

          {/* Status badge */}
          {isPending && (
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
              <PauseCircle size={11} className="text-yellow-400" />
              <span className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wide">Pending</span>
            </div>
          )}
          {!isPending && (
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">Active</span>
            </div>
          )}

          {/* Edit icon overlay — top right of thumbnail */}
          <button
            onClick={() => onEdit(series)}
            className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80 hover:scale-110 active:scale-95"
            title="Edit series"
          >
            <Pencil size={13} className="text-white" />
          </button>
        </div>

        {/* ── Card Body ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 p-3">
          {/* Title row + 3-dot menu */}
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground leading-snug truncate">
                {series.series_name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock size={11} className="text-muted-foreground shrink-0" />
                <p className="text-[11px] text-muted-foreground truncate">
                  Created {formatDate(series.created_at)}
                </p>
              </div>
            </div>

            {/* 3-dot popover trigger */}
            <div className="relative shrink-0">
              <button
                onClick={() => setPopoverOpen((v) => !v)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150"
                title="More options"
              >
                <MoreVertical size={15} />
              </button>
              <PopoverMenu
                isOpen={popoverOpen}
                onClose={() => setPopoverOpen(false)}
                isPending={isPending}
                onEdit={() => onEdit(series)}
                onDelete={() => setConfirmDelete(true)}
                onTogglePause={handleTogglePause}
              />
            </div>
          </div>

          {/* ── Action row ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-2 pt-1 border-t border-border/40">
            {/* View previously generated videos */}
            <button
              onClick={() => onViewVideos(series)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground bg-muted/40 hover:bg-muted/70 hover:text-foreground transition-all duration-150 group/view"
            >
              <span className="flex items-center gap-2">
                <Film size={13} />
                View Generated Videos
              </span>
              <ChevronRight size={13} className="group-hover/view:translate-x-0.5 transition-transform" />
            </button>

            {/* Generate new video */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || isPending}
              className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200 shadow-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Wand2 size={13} />
                  {isPending ? "Resume to Generate" : "Generate Video"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
