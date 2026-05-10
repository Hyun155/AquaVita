"use client"

import { harvestPredictions } from "@/lib/verticalFarmData"
import { Calendar, TrendingUp, Target, Leaf, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function HarvestOptimizationEngine() {
  return (
    <div className="glass-card rounded-2xl border border-border/50 p-6 bg-gradient-to-br from-background/60 via-secondary/20 to-background/50">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Leaf className="w-5 h-5 text-neon-green" />
          Harvest Optimization Engine
        </h3>
        <p className="text-sm text-muted-foreground mt-1">AI-predicted harvest readiness with yield forecasting</p>
      </div>

      {/* Harvest Predictions Grid */}
      <div className="space-y-3">
        {harvestPredictions.map((prediction) => {
          const trendConfig = {
            accelerating: { icon: "📈", color: "text-success", label: "Accelerating" },
            stable: { icon: "→", color: "text-neon-aqua", label: "Stable" },
            slowing: { icon: "📉", color: "text-warning", label: "Slowing" },
          }

          const trend = trendConfig[prediction.growthTrend]
          const urgency = prediction.estimatedDaysToHarvest <= 3 ? "urgent" : prediction.estimatedDaysToHarvest <= 7 ? "soon" : "planned"
          const urgencyConfig = {
            urgent: { badge: "bg-destructive/20 text-destructive border-destructive/30", icon: "🚨" },
            soon: { badge: "bg-warning/20 text-warning border-warning/30", icon: "⏰" },
            planned: { badge: "bg-neon-aqua/20 text-neon-aqua border-neon-aqua/30", icon: "📅" },
          }

          const urgencyStyle = urgencyConfig[urgency]

          return (
            <div key={prediction.plantId} className="relative overflow-hidden rounded-xl border border-border/40 bg-white p-4 transition-all hover:shadow-md">
              {/* Left indicator stripe */}
              <div
                className={`absolute left-0 top-0 h-full w-1 ${
                  urgency === "urgent" ? "bg-destructive" : urgency === "soon" ? "bg-warning" : "bg-neon-aqua"
                }`}
              />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{prediction.plantName}</span>
                      <Badge className={`${urgencyStyle.badge} border text-xs`}>
                        {urgencyStyle.icon} {prediction.estimatedDaysToHarvest}d
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Growth: <span className={`font-medium ${trend.color}`}>{trend.icon} {prediction.currentGrowthRate} mm/day — {trend.label}</span>
                    </p>
                  </div>

                  {/* Confidence Indicator */}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-lg font-bold text-neon-aqua">{prediction.confidenceLevel}%</p>
                      <Zap className="w-4 h-4 text-neon-aqua" />
                    </div>
                  </div>
                </div>

                {/* Environmental Factors */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Env. Stability</p>
                    <div className="flex items-center gap-1.5">
                      <Progress value={prediction.environmentalStability} className="h-1.5 flex-1 bg-secondary/50" />
                      <span className="font-semibold text-foreground w-8">{prediction.environmentalStability}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Nutrient Consistency</p>
                    <div className="flex items-center gap-1.5">
                      <Progress value={prediction.nutrientConsistency} className="h-1.5 flex-1 bg-secondary/50" />
                      <span className="font-semibold text-foreground w-8">{prediction.nutrientConsistency}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Growth Rate</p>
                    <div className="flex items-center gap-1.5">
                      <Progress value={Math.min((prediction.currentGrowthRate / 3) * 100, 100)} className="h-1.5 flex-1 bg-secondary/50" />
                      <span className="font-semibold text-foreground w-8">{Math.round((prediction.currentGrowthRate / 3) * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* Yield Prediction */}
                <div className="rounded-lg bg-white border border-border/40 p-3 mb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1">Expected Yield</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-bold text-neon-green">{prediction.expectedYield} kg</span>
                        <span className="text-muted-foreground"> ± {prediction.yieldVariance}%</span>
                      </p>
                    </div>
                    <Target className="w-5 h-5 text-neon-green opacity-50" />
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Ready in <span className="font-semibold text-foreground">{prediction.estimatedDaysToHarvest} days</span>
                    {prediction.growthTrend === "accelerating" && (
                      <span className="text-success ml-1">— ahead of schedule!</span>
                    )}
                    {prediction.growthTrend === "slowing" && (
                      <span className="text-warning ml-1">— may extend timeline</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border/30">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Harvest Window Summary</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-lg bg-white border border-border/40 p-2 text-center">
            <p className="text-xs text-muted-foreground mb-1">Urgent</p>
            <p className="text-lg font-bold text-destructive">{harvestPredictions.filter((p) => p.estimatedDaysToHarvest <= 3).length}</p>
          </div>
          <div className="rounded-lg bg-white border border-border/40 p-2 text-center">
            <p className="text-xs text-muted-foreground mb-1">Soon</p>
            <p className="text-lg font-bold text-warning">{harvestPredictions.filter((p) => p.estimatedDaysToHarvest > 3 && p.estimatedDaysToHarvest <= 7).length}</p>
          </div>
          <div className="rounded-lg bg-white border border-border/40 p-2 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Yield</p>
            <p className="text-lg font-bold text-neon-green">{harvestPredictions.reduce((sum, p) => sum + p.expectedYield, 0).toFixed(1)} kg</p>
          </div>
          <div className="rounded-lg bg-white border border-border/40 p-2 text-center">
            <p className="text-xs text-muted-foreground mb-1">Avg Confidence</p>
            <p className="text-lg font-bold text-neon-aqua">{Math.round(harvestPredictions.reduce((sum, p) => sum + p.confidenceLevel, 0) / harvestPredictions.length)}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
