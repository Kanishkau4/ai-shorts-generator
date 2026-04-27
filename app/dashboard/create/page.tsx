"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SeriesForm, FormData } from "@/components/dashboard/create/SeriesForm";

export default function CreateSeriesPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = async (fullData: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        throw new Error("Failed to save series");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error saving series:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SeriesForm
      onSubmit={handleFinalSubmit}
      isSubmitting={isSubmitting}
      title="Create New Series"
      subtitle="Set up your AI-powered short video series in a few steps."
    />
  );
}
