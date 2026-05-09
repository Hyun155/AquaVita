"use client"

import { AnalyticsCharts } from "@/components/charts/AnalyticsCharts"
import { SustainabilityPanel } from "@/components/dashboard/SustainabilityPanel"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl border border-border/50 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Analytics & Sustainability</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">Trends, forecasts, and resource impact</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Consolidated historical performance and sustainability insights for executive-level review.
        </p>
      </div>

      <div className="glass-card rounded-3xl border border-border/50 p-6">
        <AnalyticsCharts />
      </div>

      <div className="glass-card rounded-3xl border border-border/50 p-6">
        <SustainabilityPanel />
      </div>
    </div>
  )
}