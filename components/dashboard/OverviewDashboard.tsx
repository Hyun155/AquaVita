"use client"

import { DigitalTwin } from "@/components/environment/DigitalTwin"

export function OverviewDashboard() {
  const snapshotCards = [
    { label: "System Stability", value: "98%", detail: "Sensor mesh synced" },
    { label: "Active Layers", value: "5", detail: "All racks online" },
    { label: "Water Balance", value: "+4%", detail: "Reclaimed today" },
    { label: "AI Confidence", value: "93%", detail: "Decision accuracy" },
  ]

  const optimizationMetrics = [
    { label: "Energy Offset", value: "-12%", detail: "Adaptive LED scheduling" },
    { label: "Yield Projection", value: "+8%", detail: "AI nutrient tuning" },
    { label: "Waste Reuse", value: "87%", detail: "Closed-loop recovery" },
  ]

  return (
    <>
      <section className="relative overflow-hidden rounded-[32px] border border-border/40 bg-gradient-to-br from-[#f8fafc] via-[#edf3ff] to-[#e7f0ff] px-6 py-8 md:px-10 md:py-10 shadow-[0_40px_80px_rgba(60,80,120,0.2)]">
        <div className="pointer-events-none absolute inset-0 twin-atmosphere" />
        <div className="pointer-events-none absolute inset-0 twin-grid" />
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-neon-aqua/30 bg-neon-aqua/10 px-4 py-2 text-xs font-semibold text-neon-aqua">
                Vertical Farming OS
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                AquaVita Command Nexus
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-muted-foreground">
                A live digital twin of the farm ecosystem. Interact with racks, systems, and automation
                to unlock contextual intelligence in real time.
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-xs text-muted-foreground">
              <p className="uppercase tracking-[0.3em]">System pulse</p>
              <p className="mt-1 text-sm font-semibold text-foreground">All subsystems synchronized</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {snapshotCards.map((card) => (
              <div
                key={card.label}
                className="min-w-[180px] flex-1 rounded-2xl border border-white/60 bg-white/70 px-4 py-3"
              >
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.detail}</p>
              </div>
            ))}
          </div>

          <DigitalTwin />

          <div className="rounded-3xl border border-white/60 bg-white/70 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Resource optimization</p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">Adaptive gains from AI decisions</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {optimizationMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-border/50 bg-white/80 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{metric.label}</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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