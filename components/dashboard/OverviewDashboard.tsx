"use client"

import { KPICards } from "@/components/dashboard/KPICards"
import { DigitalTwin } from "@/components/environment/DigitalTwin"
import { AIRecommendationPanel } from "@/components/insights/AIRecommendationPanel"
import { AlertSystem } from "@/components/insights/AlertSystem"
import { AnalyticsCharts } from "@/components/charts/AnalyticsCharts"
import { SustainabilityPanel } from "@/components/dashboard/SustainabilityPanel"

export function OverviewDashboard() {
  return (
    <>
      <KPICards />

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DigitalTwin />
        </div>
        <div>
          <AIRecommendationPanel />
        </div>
      </section>

      <section>
        <AlertSystem />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">Analytics & Insights</h2>
          <p className="text-sm text-muted-foreground">Performance metrics and trends</p>
        </div>
        <AnalyticsCharts />
      </section>

      <section>
        <SustainabilityPanel />
      </section>

      <footer className="text-center py-6 border-t border-border/30">
        <p className="text-sm text-muted-foreground">
          <span className="gradient-text font-semibold">AquaVita</span> • Intelligent water-based agriculture dashboard
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Powered by IoT Sensors • AI Plant Vision • Smart Automation
        </p>
      </footer>
    </>
  )
}