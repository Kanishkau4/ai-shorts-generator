"use client";

import { useState } from "react";
import { StepperProgress } from "@/components/dashboard/create/StepperProgress";
import { StepNiche } from "@/components/dashboard/create/StepNiche";
import { StepLanguageVoice } from "@/components/dashboard/create/StepLanguageVoice";
import { StepBackgroundMusic } from "@/components/dashboard/create/StepBackgroundMusic";
import { StepVideoStyle } from "@/components/dashboard/create/StepVideoStyle";
import { StepCaptionStyle } from "@/components/dashboard/create/StepCaptionStyle";
import { StepSeriesDetails, SeriesDetails } from "@/components/dashboard/create/StepSeriesDetails";

// Global form data accumulated across all steps
type FormData = {
  niche?: string;
  language?: string;
  voice?: string;
  backgroundMusic?: string[];
  videoStyle?: string;
  captionStyle?: string;
  // from the final step
  seriesName?: string;
  videoDuration?: string;
  platforms?: string[];
  publishTime?: string;
};

export default function CreateSeriesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStepData = (step: number, data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(step + 1);
  };

  const handleFinalSubmit = async (details: SeriesDetails) => {
    const fullData = { ...formData, ...details };
    setIsSubmitting(true);
    // TODO: save series to Supabase
    console.log("Creating series with data:", fullData);
    await new Promise((r) => setTimeout(r, 1500)); // simulate API call
    setIsSubmitting(false);
    // TODO: redirect to /dashboard/series or show success toast
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Series</h1>
        <p className="mt-1.5 text-muted-foreground text-sm">
          Set up your AI-powered short video series in a few steps.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-10">
        <StepperProgress currentStep={currentStep} />
      </div>

      {/* Step content card */}
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm">
        {currentStep === 1 && (
          <StepNiche
            defaultValue={formData.niche}
            onNext={(data) => handleStepData(1, data)}
          />
        )}
        {currentStep === 2 && (
          <StepLanguageVoice
            defaultValues={{ language: formData.language, voice: formData.voice }}
            onBack={() => setCurrentStep(1)}
            onNext={(data) => handleStepData(2, data)}
          />
        )}
        {currentStep === 3 && (
          <StepBackgroundMusic
            defaultValues={formData.backgroundMusic}
            onBack={() => setCurrentStep(2)}
            onNext={(data) => handleStepData(3, data)}
          />
        )}
        {currentStep === 4 && (
          <StepVideoStyle
            defaultValue={formData.videoStyle}
            onBack={() => setCurrentStep(3)}
            onNext={(data) => handleStepData(4, data)}
          />
        )}
        {currentStep === 5 && (
          <StepCaptionStyle
            defaultValue={formData.captionStyle}
            onBack={() => setCurrentStep(4)}
            onNext={(data) => handleStepData(5, data)}
          />
        )}
        {currentStep === 6 && (
          <StepSeriesDetails
            defaultValues={{
              seriesName: formData.seriesName,
              videoDuration: formData.videoDuration,
              platforms: formData.platforms,
              publishTime: formData.publishTime,
            }}
            onBack={() => setCurrentStep(5)}
            onSubmit={handleFinalSubmit}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
