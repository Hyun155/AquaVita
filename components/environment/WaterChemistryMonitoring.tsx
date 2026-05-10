"use client"

import { AlertTriangle, Zap, Droplets, Thermometer, Leaf, Activity } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  target: string
  status: "Stable" | "Optimal" | "Nominal" | "Warning" | "Critical"
}

function MetricCard({ label, value, unit, target, status }: MetricCardProps) {
  const statusColor = {
    Stable: "bg-neon-green/10 border-neon-green/30 text-neon-green",
    Optimal: "bg-neon-aqua/10 border-neon-aqua/30 text-neon-aqua",
    Nominal: "bg-neon-aqua/10 border-neon-aqua/30 text-neon-aqua",
    Warning: "bg-warning/10 border-warning/30 text-warning",
    Critical: "bg-destructive/10 border-destructive/30 text-destructive",
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">{label}</p>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      <div className="mb-3 space-y-1">
        <p className="text-xs text-muted-foreground">{target}</p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-background mb-2">
        <div className={`h-full rounded-full ${status === "Optimal" || status === "Stable" ? "bg-neon-green" : status === "Nominal" ? "bg-neon-aqua" : "bg-warning"}`} style={{ width: "75%" }} />
      </div>
      <div className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium ${statusColor[status]}`}>
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${status === "Optimal" || status === "Stable" ? "bg-neon-green" : status === "Nominal" ? "bg-neon-aqua" : "bg-warning"}`} />
        {status}
      </div>
    </div>
  )
}

interface NutrientCircleProps {
  element: string
  uptake: number
  color: string
}

function NutrientCircle({ element, uptake, color }: NutrientCircleProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (uptake / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120" className="mb-2">
        <circle cx="60" cy="60" r="45" fill="none" stroke="oklch(0.30 0.04 230)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="65" textAnchor="middle" className="text-xl font-bold" fill="currentColor">
          {uptake}%
        </text>
      </svg>
      <p className="text-sm font-semibold text-foreground">{element}</p>
      <p className="text-xs text-muted-foreground">UPTAKE</p>
    </div>
  )
}

interface SystemComponentProps {
  name: string
  status: "STABLE" | "STANDBY" | "MONITORING" | "WARNING"
  efficiency: number
  runtime: string
  icon?: React.ReactNode
}

function SystemComponent({ name, status, efficiency, runtime, icon }: SystemComponentProps) {
  const statusColor = {
    STABLE: "bg-neon-green/10 text-neon-green border-neon-green/30",
    STANDBY: "bg-neon-aqua/10 text-neon-aqua border-neon-aqua/30",
    MONITORING: "bg-warning/10 text-warning border-warning/30",
    WARNING: "bg-destructive/10 text-destructive border-destructive/30",
  }

  return (
    <div className="rounded-xl border border-border/40 bg-white p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <div className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 mt-2 text-xs font-medium ${statusColor[status]}`}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            {status}
          </div>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">EFFICIENCY</span>
          <span className="font-mono font-semibold text-foreground">{efficiency}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
          <div className="h-full rounded-full bg-neon-aqua" style={{ width: `${efficiency}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs pt-2 border-t border-border/30">
          <span className="text-muted-foreground">RUNTIME</span>
          <span className="font-mono text-foreground">{runtime}</span>
        </div>
      </div>
    </div>
  )
}

interface MaintenanceAlertProps {
  probability: number
  title: string
  description: string
  icon?: React.ReactNode
}

function MaintenanceAlert({ probability, title, description, icon }: MaintenanceAlertProps) {
  const probColor = probability > 70 ? "text-destructive" : probability > 40 ? "text-warning" : "text-neon-aqua"

  return (
    <div className="rounded-xl border border-border/40 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className={`text-3xl font-bold ${probColor} pt-1`}>{probability}%</div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">PROB.</p>
          <p className="text-sm font-semibold text-foreground mb-2">{title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function WaterChemistryMonitoring() {
  return (
    <div className="space-y-8">
      {/* Water Chemistry Monitoring */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Water Chemistry Monitoring</h2>
          <p className="text-sm text-muted-foreground mt-1">Precision sensor array · 2-second telemetry</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <MetricCard label="PH" value="6.20" target="Target 5.8 – 6.5" status="Stable" />
          <MetricCard label="EC" value="1.82" unit="mS/cm" target="Target 1.6 – 2.0" status="Optimal" />
          <MetricCard label="DISSOLVED O₂" value="8.2" unit="mg/L" target="Target > 6.0" status="Optimal" />
          <MetricCard label="TEMPERATURE" value="20.4" unit="°C" target="Target 18 – 22" status="Stable" />
          <MetricCard label="NUTRIENT CONC." value="1140" unit="ppm" target="Target 1050 – 1250" status="Stable" />
          <MetricCard label="CONDUCTIVITY DRIFT" value="0.04" unit="Δ/h" target="Target < 0.10" status="Nominal" />
        </div>
      </section>

      {/* Nutrient Balance Panel */}
      <section className="rounded-xl border border-border/40 bg-white p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Nutrient Balance Panel</h2>
            <p className="text-sm text-muted-foreground mb-8">N · P · K · Ca · Mg saturation per 24h cycle</p>

            <div className="grid grid-cols-5 gap-4">
              <NutrientCircle element="N" uptake={84} color="oklch(0.78 0.16 210)" />
              <NutrientCircle element="P" uptake={76} color="oklch(0.78 0.16 210)" />
              <NutrientCircle element="K" uptake={91} color="oklch(0.78 0.18 140)" />
              <NutrientCircle element="Ca" uptake={68} color="oklch(0.82 0.18 75)" />
              <NutrientCircle element="Mg" uptake={79} color="oklch(0.78 0.16 210)" />
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-white p-6">
            <h3 className="text-xs uppercase tracking-[0.25em] text-neon-aqua font-semibold mb-4">SYSTEM RECOMMENDATIONS</h3>
            <div className="space-y-3">
              <div className="flex gap-3 pb-3 border-b border-border/30">
                <div className="flex-shrink-0 w-1 bg-neon-aqua rounded-full" />
                <p className="text-sm text-muted-foreground">Nitrogen absorption slightly below expected uptake range in Layer 2.</p>
              </div>
              <div className="flex gap-3 pb-3 border-b border-border/30">
                <div className="flex-shrink-0 w-1 bg-warning rounded-full" />
                <p className="text-sm text-muted-foreground">Calcium utilization reduced during peak lighting cycle (14:00–17:00).</p>
              </div>
              <div className="flex gap-3 pb-3 border-b border-border/30">
                <div className="flex-shrink-0 w-1 bg-neon-aqua rounded-full" />
                <p className="text-sm text-muted-foreground">Minor EC drift detected in Layer 3 return circulation — auto-correction queued.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-1 bg-neon-green rounded-full" />
                <p className="text-sm text-muted-foreground">Phosphorus injection cycle nominal; next dose in 02:14:00.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Stability Analytics */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Historical Stability Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">Rolling 24h window · 1m resolution</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border/40 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">PH HISTORY</p>
            <p className="text-2xl font-bold text-foreground mb-4">6.20</p>
            <div className="h-12 mb-3 relative">
              <svg viewBox="0 0 200 50" className="w-full h-full" preserveAspectRatio="none">
                <polyline points="0,25 25,20 50,22 75,18 100,20 125,19 150,21 175,18 200,22" fill="none" stroke="oklch(0.78 0.16 210)" strokeWidth="2" />
                <polyline points="0,25 25,20 50,22 75,18 100,20 125,19 150,21 175,18 200,22 200,50 0,50" fill="oklch(0.78 0.16 210)" opacity="0.15" />
              </svg>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">STABLE ZONE</p>
              <p className="text-neon-green font-medium">NO RECOVERY EVENTS</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">EC FLUCTUATION</p>
            <p className="text-2xl font-bold text-foreground mb-4">1.82 mS/cm</p>
            <div className="h-12 mb-3 relative">
              <svg viewBox="0 0 200 50" className="w-full h-full" preserveAspectRatio="none">
                <polyline points="0,28 25,24 50,26 75,22 100,25 125,23 150,27 175,21 200,25" fill="none" stroke="oklch(0.78 0.16 210)" strokeWidth="2" />
                <polyline points="0,28 25,24 50,26 75,22 100,25 125,23 150,27 175,21 200,25 200,50 0,50" fill="oklch(0.78 0.16 210)" opacity="0.15" />
              </svg>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">STABLE ZONE</p>
              <p className="text-neon-green font-medium">NO RECOVERY EVENTS</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">RESERVOIR TEMP</p>
            <p className="text-2xl font-bold text-foreground mb-4">20.4 °C</p>
            <div className="h-12 mb-3 relative">
              <svg viewBox="0 0 200 50" className="w-full h-full" preserveAspectRatio="none">
                <polyline points="0,26 25,22 50,24 75,20 100,23 125,21 150,25 175,19 200,23" fill="none" stroke="oklch(0.78 0.16 210)" strokeWidth="2" />
                <polyline points="0,26 25,22 50,24 75,20 100,23 125,21 150,25 175,19 200,23 200,50 0,50" fill="oklch(0.78 0.16 210)" opacity="0.15" />
              </svg>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">STABLE ZONE</p>
              <p className="text-neon-green font-medium">NO RECOVERY EVENTS</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">NUTRIENT STABILITY</p>
            <p className="text-2xl font-bold text-foreground mb-4">99%</p>
            <div className="h-12 mb-3 relative">
              <svg viewBox="0 0 200 50" className="w-full h-full" preserveAspectRatio="none">
                <polyline points="0,8 25,10 50,9 75,11 100,8 125,10 150,9 175,11 200,9" fill="none" stroke="oklch(0.78 0.18 140)" strokeWidth="2" />
                <polyline points="0,8 25,10 50,9 75,11 100,8 125,10 150,9 175,11 200,9 200,50 0,50" fill="oklch(0.78 0.18 140)" opacity="0.15" />
              </svg>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">STABLE ZONE</p>
              <p className="text-neon-green font-medium">NO RECOVERY EVENTS</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Flow Status */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">System Flow Status</h2>
          <p className="text-sm text-muted-foreground mt-1">Infrastructure node operational summary</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SystemComponent name="Main Pump" status="STABLE" efficiency={99.4} runtime="12,408 h" icon={<Activity className="w-5 h-5" />} />
          <SystemComponent name="Backup Pump" status="STANDBY" efficiency={100} runtime="1,204 h" icon={<Activity className="w-5 h-5" />} />
          <SystemComponent name="UV Sterilizer" status="STABLE" efficiency={94} runtime="6,120 h" icon={<Zap className="w-5 h-5" />} />
          <SystemComponent name="Filtration Unit" status="MONITORING" efficiency={87.2} runtime="4,860 h" icon={<Droplets className="w-5 h-5" />} />
          <SystemComponent name="Oxygenation System" status="STABLE" efficiency={96.8} runtime="8,340 h" icon={<Leaf className="w-5 h-5" />} />
          <SystemComponent name="Nutrient Injector" status="STABLE" efficiency={98.1} runtime="3,220 h" icon={<Leaf className="w-5 h-5" />} />
        </div>
      </section>

      {/* Predictive Maintenance */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Predictive Maintenance</h2>
          <p className="text-sm text-muted-foreground mt-1">Hydroponic infrastructure failure forecasting</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MaintenanceAlert
            probability={73}
            title="Filter clog probability rising"
            description="Estimated service window: 18 days. Sediment accumulation 27%."
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <MaintenanceAlert
            probability={9}
            title="Pump efficiency reduced by 9% over 48h"
            description="Vibration spectrum drifting from baseline. Inspection recommended."
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <MaintenanceAlert
            probability={64}
            title="UV sterilization cycle nearing maintenance"
            description="Lamp output at 94%; threshold 90%. Replace within 22 days."
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <MaintenanceAlert
            probability={22}
            title="Circulation pressure irregularity"
            description="Layer 3 return shows transient 0.18 bar dips at 03:00 cycle."
            icon={<AlertTriangle className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* Summary Metrics */}
      <section className="rounded-xl border border-border/40 bg-white p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">CLOSED-LOOP EFFICIENCY</p>
            <p className="text-3xl font-bold text-neon-green">97.3%</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">WATER REUSE</p>
            <p className="text-3xl font-bold text-neon-aqua">94%</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">RESERVOIR UPTIME</p>
            <p className="text-3xl font-bold text-foreground">412d 06h</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">BACKUP READINESS</p>
            <p className="text-2xl font-bold text-neon-green">Ready</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">TELEMETRY SYNC</p>
            <p className="text-3xl font-bold text-foreground">1.2s</p>
          </div>
        </div>
      </section>
    </div>
  )
}
