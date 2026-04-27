"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Plus, LayoutGrid, Sparkles } from "lucide-react";
import { SeriesCard, VideoSeries } from "@/components/dashboard/SeriesCard";

// ─── Skeleton loader card ────────────────────────────────────────────────────

function SeriesCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border/40 bg-card/60 overflow-hidden animate-pulse">
      <div className="aspect-[9/14] w-full bg-muted/50" />
      <div className="p-3 flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 w-3/4 rounded bg-muted/70" />
            <div className="h-3 w-1/2 rounded bg-muted/50" />
          </div>
          <div className="w-7 h-7 rounded-lg bg-muted/60" />
        </div>
        <div className="pt-1 border-t border-border/40 flex flex-col gap-2">
          <div className="h-8 rounded-xl bg-muted/50" />
          <div className="h-9 rounded-xl bg-muted/60" />
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-muted/50 border border-border/50 flex items-center justify-center mb-5 shadow-inner">
        <Sparkles size={32} className="text-muted-foreground/60" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">No series yet</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-7">
        Create your first AI-powered short video series to get started. It only takes a few minutes!
      </p>
      <Link
        href="/dashboard/create"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
      >
        <Plus size={16} />
        Create Your First Series
      </Link>
    </div>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const [series, setSeries] = useState<VideoSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync user to Supabase on first load
  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;
      const { error } = await supabase.from("users").upsert({
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName,
        updated_at: new Date().toISOString(),
      });
      if (error) console.error("Error syncing user:", error);
    };
    syncUser();
  }, [user, supabase]);

  // Fetch series
  const fetchSeries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/series");
      if (!res.ok) throw new Error("Failed to load series");
      const data: VideoSeries[] = await res.json();
      setSeries(data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleEdit = (s: VideoSeries) => {
    router.push(`/dashboard/edit/${s.id}`);
  };

  const handleDelete = (id: string) => {
    setSeries((prev) => prev.filter((s) => s.id !== id));
  };

  const handleTogglePause = (id: string, newStatus: string) => {
    setSeries((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: newStatus as "active" | "pending" } : s
      )
    );
  };

  const handleGenerateVideo = async (s: VideoSeries) => {
    // TODO: call video generation API
    console.log("Generate video for series:", s.id);
  };

  const handleViewVideos = (s: VideoSeries) => {
    // TODO: navigate to videos page filtered by series
    console.log("View videos for series:", s.id);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <LayoutGrid size={22} className="text-muted-foreground" />
            <h1 className="text-2xl font-bold tracking-tight">My Series</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading your series…"
              : series.length === 0
              ? "No series created yet."
              : `${series.length} series — click a card to manage.`}
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shrink-0"
        >
          <Plus size={16} />
          New Series
        </Link>
      </div>

      {/* ── Error banner ──────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-medium">
          <span>⚠️</span>
          <span>{error}</span>
          <button
            onClick={fetchSeries}
            className="ml-auto text-xs underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SeriesCardSkeleton key={i} />)
        ) : series.length === 0 ? (
          <EmptyState />
        ) : (
          series.map((s) => (
            <SeriesCard
              key={s.id}
              series={s}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePause={handleTogglePause}
              onGenerateVideo={handleGenerateVideo}
              onViewVideos={handleViewVideos}
            />
          ))
        )}
      </div>
    </div>
  );
}
