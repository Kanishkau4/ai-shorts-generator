"use client";

import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Niche" },
  { id: 2, label: "Language & Voice" },
  { id: 3, label: "Music" },
  { id: 4, label: "Style" },
  { id: 5, label: "Captions" },
  { id: 6, label: "Details" },
];

interface StepperProgressProps {
  currentStep: number;
}

export function StepperProgress({ currentStep }: StepperProgressProps) {
  return (
    <div className="w-full px-4">
      {/* Step indicators */}
      <div className="flex items-center justify-between relative">
        {/* Connecting line behind steps */}
        <div 
          className="absolute top-4 h-px bg-border/60 z-0" 
          style={{ left: "1rem", right: "1rem" }}
        />
        <div
          className="absolute top-4 h-px bg-foreground z-0 transition-all duration-500 ease-in-out"
          style={{
            left: "1rem",
            width: `calc(((100% - 2rem) / ${STEPS.length - 1}) * ${currentStep - 1})`,
          }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2.5 relative z-10"
            >
              {/* No more per-step connector overlays needed */}

              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border-2 ${
                  isCompleted
                    ? "bg-foreground border-foreground text-background"
                    : isCurrent
                    ? "bg-background border-foreground text-foreground ring-4 ring-foreground/10"
                    : "bg-background border-border/50 text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  isCurrent
                    ? "text-foreground"
                    : isCompleted
                    ? "text-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1 w-full bg-border/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Step label */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="font-medium text-foreground">
          {STEPS[currentStep - 1]?.label}
        </span>
      </div>
    </div>
  );
}
