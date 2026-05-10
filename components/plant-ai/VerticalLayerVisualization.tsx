"use client"

import { verticalLayerMetrics, layerHealthBreakdown } from "@/lib/verticalFarmData"
import { AlertCircle, TrendingDown, TrendingUp, Zap, Droplets, Wind, Sun } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function VerticalLayerVisualization() {
  return (
    <div className="glass-card rounded-2xl border border-border/50 p-6 bg-gradient-to-br from-background/60 via-secondary/20 to-background/50">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
          Vertical Stack Intelligence
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Real-time layer-by-layer monitoring across 5 cultivation tiers</p>
      </div>

      {/* Layer Stack Visualization */}
      <div className="space-y-3">
        {verticalLayerMetrics.map((layer) => {
          const healthStatus =
            layer.avgHealth >= 90
              ? { label: "Optimal", color: "from-neon-green/40 to-neon-green/10", badge: "bg-success/20 text-success border-success/30" }
              : layer.avgHealth >= 80
                ? { label: "Good", color: "from-cyan-400/30 to-cyan-400/5", badge: "bg-neon-aqua/20 text-neon-aqua border-neon-aqua/30" }
                : layer.avgHealth >= 70
                  ? { label: "Caution", color: "from-warning/30 to-warning/5", badge: "bg-warning/20 text-warning border-warning/30" }
                  : { label: "Alert", color: "from-destructive/40 to-destructive/10", badge: "bg-destructive/20 text-destructive border-destructive/30" }

          return (
            <div key={layer.layerId} className={`group relative overflow-hidden rounded-xl border border-border/40 bg-white p-4 transition-all hover:border-border/60 hover:shadow-md`}>
              {/* Risk Indicator Stripe */}
              {layer.riskLevel !== "low" && (
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${
                    layer.riskLevel === "critical"
                      ? "bg-destructive"
                      : layer.riskLevel === "high"
                        ? "bg-warning"
                        : "bg-neon-aqua"
                  } animate-pulse`}
                />
              )}

              <div className="relative flex items-start justify-between gap-4">
                {/* Layer Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-foreground">Layer {layer.layerId}</span>
                    <span className="text-xs text-muted-foreground font-medium">{layer.layerName}</span>
                    <Badge className={`${healthStatus.badge} border text-xs`}>{healthStatus.label}</Badge>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Avg Health</p>
                      <p className="text-base font-semibold text-foreground">{layer.avgHealth}%</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Droplets className="w-3 h-3" />
                        Humidity
                      </div>
                      <p className="text-base font-semibold text-foreground">{layer.avgHumidity}%</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Zap className="w-3 h-3" />
                        Temp
                      </div>
                      <p className="text-base font-semibold text-foreground">{layer.avgTemperature}°C</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Sun className="w-3 h-3" />
                        Light
                      </div>
                      <p className="text-base font-semibold text-foreground">{layer.avgLightIntensity}µ</p>
                    </div>
                  </div>

                  {/* Health Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Health Index</span>
                      <span className="text-xs font-medium text-foreground">{layer.avgHealth}/100</span>
                    </div>
                    <Progress value={layer.avgHealth} className="h-2 bg-secondary/50" />
                  </div>

                  {/* Risk Factors */}
                  {layer.riskFactors.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {layer.riskFactors.map((factor, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-warning/10 text-warning border border-warning/30 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {factor}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Est. Yield</p>
                    <p className="text-lg font-bold gradient-text">{layer.estimatedYield} kg</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${layer.riskLevel === "low" ? "bg-success" : layer.riskLevel === "moderate" ? "bg-neon-aqua" : layer.riskLevel === "high" ? "bg-warning" : "bg-destructive"} animate-pulse`} />
                </div>
              </div>

              {/* Airflow Status Badge */}
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Wind className="w-3 h-3" />
                Airflow: <span className="font-medium text-foreground capitalize">{layer.airflowStatus}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Layer Health Summary */}
      <div className="mt-6 pt-4 border-t border-border/30 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Layer Status Summary</p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {layerHealthBreakdown.map((item) => (
            <div key={item.layer} className="rounded-lg bg-white border border-border/40 p-2 text-center">
              <p className="text-xs font-medium text-foreground mb-1">Layer {item.layer}</p>
              <p className={`text-xs font-bold ${item.status === "Excellent" ? "text-success" : item.status === "Optimal" ? "text-neon-green" : item.status === "Caution" ? "text-warning" : "text-destructive"}`}>
                {item.status}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{item.healthTrend}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
