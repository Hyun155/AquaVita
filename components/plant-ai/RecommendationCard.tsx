import type { PlantRecommendation } from "@/components/plant-ai/types"
import { AlertTriangle, CircleAlert, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecommendationCardProps {
  recommendation: PlantRecommendation
  actionStatus?: "in-progress" | "resolved" | "manual-overridden"
  onManualOverride?: () => void
}

const severityStyleMap = {
  critical: {
    wrapper: "border-destructive/50 bg-destructive/10",
    icon: "text-destructive",
    chip: "bg-destructive/20 text-destructive border-destructive/40",
    label: "Critical",
    Icon: CircleAlert,
  },
  warning: {
    wrapper: "border-warning/50 bg-warning/10",
    icon: "text-warning",
    chip: "bg-warning/20 text-warning border-warning/40",
    label: "Warning",
    Icon: AlertTriangle,
  },
  info: {
    wrapper: "border-neon-aqua/40 bg-neon-aqua/10",
    icon: "text-neon-aqua",
    chip: "bg-neon-aqua/20 text-neon-aqua border-neon-aqua/40",
    label: "Info",
    Icon: Info,
  },
} as const

export function RecommendationCard({ recommendation, actionStatus, onManualOverride }: RecommendationCardProps) {
  const style = severityStyleMap[recommendation.severity]
  const statusStyleMap = {
    "in-progress": "bg-warning/20 text-warning border-warning/40",
    resolved: "bg-success/20 text-success border-success/40",
    "manual-overridden": "bg-destructive/20 text-destructive border-destructive/40",
  }

  return (
    <article className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 animate-in fade-in slide-in-from-right-2 ${style.wrapper} bg-gradient-to-br from-background/90 via-secondary/10 to-background/70 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_18px_40px_rgba(0,0,0,0.18)]`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.10),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_28%)] opacity-90" />
      <div className={`absolute left-0 top-0 h-full w-1 ${style.icon.replace("text-", "bg-")}`} />

      <div className="relative mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-full border p-1.5 ${style.chip}`}>
            <style.Icon className={`h-3.5 w-3.5 ${style.icon}`} />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">{recommendation.plantName}</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Predictive AI advisory</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actionStatus ? (
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${statusStyleMap[actionStatus]}`}>
              {actionStatus === "in-progress" ? "In Progress" : actionStatus === "manual-overridden" ? "Manual" : "Resolved"}
            </span>
          ) : (
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${style.chip}`}>
              {style.label}
            </span>
          )}
        </div>
      </div>
      <p className="relative text-sm leading-snug text-foreground mb-2">{recommendation.message}</p>

      <div className="flex items-center justify-between gap-3"> 
        <div className="text-xs text-muted-foreground">
          <div className="mb-1">AI action: <span className="font-medium text-foreground">{recommendation.action ?? 'Review conditions'}</span></div>
          <div className="mb-1">Confidence: <span className="font-semibold text-foreground">{recommendation.confidence ?? 60}%</span></div>
          <div>Expected gain: <span className="font-medium text-foreground">{recommendation.estimatedImpact ?? '—'}</span></div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {onManualOverride && actionStatus === "in-progress" && (
            <Button size="sm" variant="ghost" className="border border-border/40 bg-background/40 text-xs text-foreground shadow-sm transition-colors hover:bg-secondary/30" onClick={onManualOverride}>
              Manual Override
            </Button>
          )}
          {recommendation.automatable && (
            <span className="text-[11px] rounded-full border border-neon-aqua/30 bg-neon-aqua/8 px-2 py-1 text-neon-aqua">Automatable</span>
          )}
        </div>
      </div>
    </article>
  )
}
