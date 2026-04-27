"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { SeriesForm, FormData } from "@/components/dashboard/create/SeriesForm";
import { Loader2 } from "lucide-react";

export default function EditSeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch(`/api/series/${id}`);
        if (!response.ok) throw new Error("Failed to fetch series");
        const data = await response.json();
        
        // Map DB fields back to form fields
        setInitialData({
          niche: data.niche,
          language: data.language,
          voice: data.voice,
          backgroundMusic: data.background_music,
          videoStyle: data.video_style,
          captionStyle: data.caption_style,
          seriesName: data.series_name,
          videoDuration: data.video_duration,
          platforms: data.platforms,
          publishTime: data.publish_time,
        });
      } catch (error) {
        console.error("Error fetching series:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, [id, router]);

  const handleFinalSubmit = async (fullData: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/series/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        throw new Error("Failed to update series");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error updating series:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 size={40} className="animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground font-medium">Loading series details...</p>
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <SeriesForm
      initialData={initialData}
      onSubmit={handleFinalSubmit}
      isSubmitting={isSubmitting}
      title="Edit Series"
      subtitle="Update your AI-powered short video series configuration."
    />
  );
}
