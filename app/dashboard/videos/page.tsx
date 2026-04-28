"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Video, Sparkles, FilterX, RefreshCcw } from "lucide-react";
import { VideoCard, VideoCardSkeleton, GeneratedVideo } from "@/components/dashboard/VideoCard";

function VideosContent() {
  const searchParams = useSearchParams();
  const seriesIdFilter = searchParams.get("seriesId");

  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchVideos = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      else setIsLoading(true);
      
      setError(null);
      const url = seriesIdFilter 
        ? `/api/videos?seriesId=${seriesIdFilter}`
        : "/api/videos";
        
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load videos");
      const data: GeneratedVideo[] = await res.json();
      setVideos(data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [seriesIdFilter]);

  // Initial fetch on mount or filter change
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Polling for status updates
  useEffect(() => {
    const hasProcessing = videos.some(v => v.status === "processing");
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchVideos(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchVideos, videos.some(v => v.status === "processing")]);

  const handleDelete = async (id: string) => {
    // TODO: implement delete API
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Video size={22} className="text-muted-foreground" />
            <h1 className="text-2xl font-bold tracking-tight">
              {seriesIdFilter ? "Series Videos" : "My Videos"}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading your videos…"
              : videos.length === 0
              ? "No videos generated yet."
              : `${videos.length} videos — click to play or download.`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           <button
            onClick={() => fetchVideos(true)}
            disabled={isRefreshing || isLoading}
            className="p-2.5 rounded-xl border border-border/50 hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Error banner ──────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-medium">
          <span>⚠️</span>
          <span>{error}</span>
          <button
            onClick={() => fetchVideos()}
            className="ml-auto text-xs underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => <VideoCardSkeleton key={i} />)
        ) : videos.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-muted/50 border border-border/50 flex items-center justify-center mb-5 shadow-inner">
              <Sparkles size={32} className="text-muted-foreground/60" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No videos yet</h2>
            <p className="text-sm text-muted-foreground max-w-xs mb-7">
              {seriesIdFilter 
                ? "This series hasn't generated any videos yet."
                : "You haven't generated any AI shorts yet. Go to your series and click 'Generate Video'."}
            </p>
            {seriesIdFilter && (
              <a
                href="/dashboard/videos"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border/50 text-sm font-medium hover:bg-muted/50 transition-all"
              >
                <FilterX size={16} />
                Clear Filter
              </a>
            )}
          </div>
        ) : (
          videos.map((v) => (
            <VideoCard
              key={v.id}
              video={v}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => <VideoCardSkeleton key={i} />)}
      </div>
    }>
      <VideosContent />
    </Suspense>
  );
}
