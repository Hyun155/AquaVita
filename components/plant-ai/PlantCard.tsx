import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { PlantTelemetry } from "@/components/plant-ai/types"
import { Leaf, Thermometer, TestTubeDiagonal, CalendarClock } from "lucide-react"

interface PlantCardProps {
  plant: PlantTelemetry
  daysToHarvest: number
  riskLabel?: "Low" | "Moderate" | "High" | "Critical"
  timeToFailureHours?: number
  recoveryProgress?: number
}

function getHealthClasses(health: number) {
  if (health < 50) {
    return {
      badge: "bg-destructive/20 text-destructive border-destructive/40",
      bar: "from-destructive to-destructive/70",
      label: "Critical",
    }
  }

  if (health < 75) {
    return {
      badge: "bg-warning/20 text-warning border-warning/40",
      bar: "from-warning to-warning/70",
      label: "Warning",
    }
  }

  return {
    badge: "bg-success/20 text-success border-success/40",
    bar: "from-success to-neon-green",
    label: "Healthy",
  }
}

export function PlantCard(props: PlantCardProps) {
  const { plant, daysToHarvest } = props
  const healthStyle = getHealthClasses(plant.health)

  return (
    <article className="glass-card rounded-2xl border border-border/50 p-5 transition-all duration-500 hover:border-neon-aqua/40 hover:shadow-[0_0_28px_oklch(0.75_0.2_195/0.18)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{plant.name}</h3>
          <p className="text-xs text-muted-foreground">AI growth tracking active</p>
          {props?.riskLabel && (
            <p className="text-xs mt-1 text-muted-foreground">Risk: <span className="font-medium text-foreground">{props.riskLabel}</span>{props.timeToFailureHours ? ` · TTF ${props.timeToFailureHours}h` : ''}</p>
          )}
        </div>
        <Badge className={healthStyle.badge}>{healthStyle.label}</Badge>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-border/40 bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Growth Stage</p>
          <p className="mt-1 font-medium text-neon-aqua">{plant.stage}</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Days to Harvest</p>
          <p className="mt-1 flex items-center gap-1.5 font-medium text-neon-green">
            <CalendarClock className="h-4 w-4" />
            {daysToHarvest} days
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Health</span>
            <span className="font-semibold text-foreground">{Math.round(plant.health)}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/70">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${healthStyle.bar} transition-all duration-700 ease-out`}
              style={{ width: `${plant.health}%` }}
            />
          </div>
        </div>

        {props?.recoveryProgress !== undefined && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Recovery Progress</span>
              <span className="font-semibold text-foreground">{props.recoveryProgress}%</span>
            </div>
            <Progress value={props.recoveryProgress} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 p-2 text-muted-foreground">
            <TestTubeDiagonal className="h-3.5 w-3.5 text-neon-aqua" />
            pH {plant.ph.toFixed(2)}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 p-2 text-muted-foreground">
            <Thermometer className="h-3.5 w-3.5 text-warning" />
            {plant.temperature.toFixed(1)}°C
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Leaf className="h-3.5 w-3.5 text-neon-green" />
        Live simulation updates every 4 seconds
      </div>
    </article>
  )
}
