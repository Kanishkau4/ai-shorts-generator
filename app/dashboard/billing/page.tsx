"use client";

import React from "react";
import { PricingTable } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your content goals. Scale your social presence with AI.
        </p>
      </div>

      <div className="clerk-billing-container">
        <PricingTable />
      </div>

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Need a custom plan?</h3>
              <p className="text-muted-foreground">
                We offer enterprise-grade solutions for large organizations and custom volume requirements.
              </p>
            </div>
            <Button variant="outline" size="lg">Talk to an Expert</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
