"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PricingTable } from "@clerk/nextjs";
import { Zap, ShieldCheck, Star } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Zap size={14} />
              Pricing Plans
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Ready to go <span className="text-primary italic font-serif">Viral?</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your content goals. From hobbyists to professional agencies, we've got you covered.
            </p>
          </div>

          <div className="clerk-billing-container max-w-5xl mx-auto bg-card border rounded-3xl shadow-2xl overflow-hidden p-2 md:p-8">
            <PricingTable />
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-lg">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">Encryption-protected transactions handled via Stripe.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-lg">Instant Access</h3>
              <p className="text-sm text-muted-foreground">Get your premium features immediately after upgrade.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Star size={24} />
              </div>
              <h3 className="font-bold text-lg">Cancel Anytime</h3>
              <p className="text-sm text-muted-foreground">No long-term contracts. Cancel your subscription with one click.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
