"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Zap, Check, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UpgradeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function UpgradeDialog({
  isOpen,
  onOpenChange,
  title = "Ready to Supercharge your Content?",
  description = "You've reached the limit of your current plan. Upgrade to Pro to unlock more videos, higher resolution, and automated publishing.",
}: UpgradeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-primary/10 p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
            <Zap size={32} fill="currentColor" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <DialogDescription className="text-base pt-2">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6 bg-background">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              Pro features include:
            </h4>
            <ul className="space-y-2.5">
              {[
                "30 AI Shorts per month",
                "1080p Full HD (No Watermark)",
                "Unlimited Active Series",
                "Auto-publish to Social Media",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                  <div className="bg-green-500/10 text-green-600 rounded-full p-0.5">
                    <Check size={14} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              href="/dashboard/billing" 
              className={cn(
                buttonVariants({ variant: "default" }), 
                "w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
              )}
            >
              View All Plans
            </Link>
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full h-11 text-muted-foreground">
              Maybe later
            </Button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            Trusted by 5,000+ creators worldwide.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
