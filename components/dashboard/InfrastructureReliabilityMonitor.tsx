"use client"

import { Activity, Zap, Shield } from "lucide-react"

export function InfrastructureReliabilityMonitor() {
  const metrics = [
    {
      label: "Pump Efficiency",
      value: "94%",
      status: "optimal",
      icon: Activity,
      detail: "Flow rate stable"
    },
    {
      label: "Sensor Stability",
      value: "97%",
      status: "excellent",
      icon: Shield,
      detail: "All sensors calibrated"
    },
    {
      label: "Power Status",
      value: "Grid",
      status: "active",
      icon: Zap,
      detail: "Primary power online"
    }
  ]

  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 px-5 py-4">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Infrastructure Reliability</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">System health overview</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border/50 bg-white/80 px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="h-4 w-4 text-muted-foreground" />
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{metric.label}</p>
            </div>
            <p className="text-lg font-semibold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}