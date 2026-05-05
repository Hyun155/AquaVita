import type { PlantRecommendation } from "@/components/plant-ai/types"
import { AlertTriangle, CircleAlert, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecommendationCardProps {
  recommendation: PlantRecommendation
  actionStatus?: "in-progress" | "resolved"
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
  }

  return (
    <article
      className={`rounded-xl border p-3.5 transition-all duration-300 animate-in fade-in slide-in-from-right-2 ${style.wrapper}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <style.Icon className={`h-4 w-4 ${style.icon}`} />
          <p className="text-sm font-medium text-foreground">{recommendation.plantName}</p>
        </div>
        <div className="flex items-center gap-2">
          {actionStatus ? (
            <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${statusStyleMap[actionStatus]}`}>
              {actionStatus === "in-progress" ? "In Progress" : "Resolved"}
            </span>
          ) : (
            <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${style.chip}`}>
              {style.label}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{recommendation.message}</p>
      <div className="mt-3 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-2">
          {onManualOverride && actionStatus && (
            <Button size="sm" variant="ghost" onClick={onManualOverride}>
              Manual Override
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
