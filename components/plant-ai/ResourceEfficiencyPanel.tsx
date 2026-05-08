"use client"

import { resourceEfficiencyMetrics, verticalLayerMetrics } from "@/lib/verticalFarmData"
import { TrendingUp, Droplets, Zap, Leaf, BarChart3, Leaf as LeafIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function ResourceEfficiencyPanel() {
  const totalWaterCapacity = 500 // liters
  const totalEnergyBudget = 120 // kWh
  const totalPotentialYield = 25 // kg

  const waterEfficiency = ((totalWaterCapacity - (resourceEfficiencyMetrics.waterSavings * 0.7)) / totalWaterCapacity) * 100
  const energyEfficiency = ((totalEnergyBudget - (resourceEfficiencyMetrics.energyReduction * 0.6)) / totalEnergyBudget) * 100

  return (
    <div className="glass-card rounded-2xl border border-border/50 p-6 bg-gradient-to-br from-background/60 via-secondary/20 to-background/50">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-neon-green" />
          Resource Efficiency Insights
        </h3>
        <p className="text-sm text-muted-foreground mt-1">AI optimization impact on sustainability metrics</p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Water Efficiency */}
        <div className="rounded-xl border border-border/40 bg-gradient-to-br from-neon-aqua/20 via-secondary/10 to-background/30 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Water Recycled</p>
              <p className="text-2xl font-bold text-neon-aqua">{waterEfficiency.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground mt-1">{resourceEfficiencyMetrics.waterSavings}L saved this cycle</p>
            </div>
            <Droplets className="w-8 h-8 text-neon-aqua/60" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Usage</span>
              <span className="font-medium text-foreground">{(totalWaterCapacity - resourceEfficiencyMetrics.waterSavings).toFixed(0)}L</span>
            </div>
            <Progress value={waterEfficiency} className="h-2 bg-secondary/50" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-success font-medium">+18% vs baseline</span>
          </p>
        </div>

        {/* Energy Efficiency */}
        <div className="rounded-xl border border-border/40 bg-gradient-to-br from-warning/20 via-secondary/10 to-background/30 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Energy Efficient</p>
              <p className="text-2xl font-bold text-warning">{energyEfficiency.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground mt-1">{resourceEfficiencyMetrics.energyReduction}kWh saved this cycle</p>
            </div>
            <Zap className="w-8 h-8 text-warning/60" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Usage</span>
              <span className="font-medium text-foreground">{(totalEnergyBudget - resourceEfficiencyMetrics.energyReduction).toFixed(1)}kWh</span>
            </div>
            <Progress value={energyEfficiency} className="h-2 bg-secondary/50" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-success font-medium">+24% vs baseline</span>
          </p>
        </div>

        {/* Crop Loss Reduction */}
        <div className="rounded-xl border border-border/40 bg-gradient-to-br from-neon-green/20 via-secondary/10 to-background/30 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Crop Loss Reduction</p>
              <p className="text-2xl font-bold text-neon-green">{resourceEfficiencyMetrics.cropLossReduction}%</p>
              <p className="text-xs text-muted-foreground mt-1">Improved health monitoring</p>
            </div>
            <LeafIcon className="w-8 h-8 text-neon-green/60" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Prevention</span>
              <span className="font-medium text-foreground">{resourceEfficiencyMetrics.cropLossReduction}%</span>
            </div>
            <Progress value={resourceEfficiencyMetrics.cropLossReduction} className="h-2 bg-secondary/50" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-success font-medium">AI disease detection active</span>
          </p>
        </div>

        {/* Nutrient Efficiency */}
        <div className="rounded-xl border border-border/40 bg-gradient-to-br from-neon-aqua/20 via-secondary/10 to-background/30 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Nutrient Efficiency</p>
              <p className="text-2xl font-bold text-neon-aqua">{resourceEfficiencyMetrics.nutrientEfficiency}%</p>
              <p className="text-xs text-muted-foreground mt-1">Optimized uptake ratio</p>
            </div>
            <Leaf className="w-8 h-8 text-neon-aqua/60" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Utilization</span>
              <span className="font-medium text-foreground">{resourceEfficiencyMetrics.nutrientEfficiency}%</span>
            </div>
            <Progress value={resourceEfficiencyMetrics.nutrientEfficiency} className="h-2 bg-secondary/50" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-success font-medium">AI-balanced formulation</span>
          </p>
        </div>
      </div>

      {/* Yield Impact */}
      <div className="rounded-xl border border-border/40 bg-gradient-to-r from-success/20 via-secondary/10 to-background/30 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-foreground">Predicted Yield this Cycle</p>
          <p className="text-3xl font-bold gradient-text">{resourceEfficiencyMetrics.yieldPrediction} kg</p>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>vs. baseline: {totalPotentialYield} kg</span>
          <span className="text-success font-semibold">+{((resourceEfficiencyMetrics.yieldPrediction / totalPotentialYield - 1) * 100).toFixed(0)}% improvement</span>
        </div>
        <Progress value={(resourceEfficiencyMetrics.yieldPrediction / (totalPotentialYield * 1.2)) * 100} className="h-2 mt-2 bg-secondary/50" />
      </div>

      {/* Sustainability Insights */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sustainability Impact</p>

        <div className="rounded-lg bg-secondary/30 border border-border/40 p-3">
          <p className="text-sm font-semibold text-foreground mb-2">🌍 Carbon Footprint Reduction</p>
          <p className="text-xs text-muted-foreground mb-2">
            AI optimization reduces energy consumption by {resourceEfficiencyMetrics.energyReduction}kWh, equivalent to ~{(resourceEfficiencyMetrics.energyReduction * 0.4).toFixed(1)}kg CO₂
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <p className="text-muted-foreground">Energy</p>
              <p className="font-semibold text-neon-aqua">{((resourceEfficiencyMetrics.energyReduction / totalEnergyBudget) * 100).toFixed(0)}%</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Water</p>
              <p className="font-semibold text-neon-green">{((resourceEfficiencyMetrics.waterSavings / totalWaterCapacity) * 100).toFixed(0)}%</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Waste</p>
              <p className="font-semibold text-success">{resourceEfficiencyMetrics.cropLossReduction}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-secondary/30 border border-border/40 p-3">
          <p className="text-sm font-semibold text-foreground mb-2">📊 System Efficiency</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>✓ Layer {verticalLayerMetrics.reduce((max, l) => l.avgHealth > max.avgHealth ? l : max).layerId} operating at peak efficiency ({verticalLayerMetrics.find((l) => l.layerId === verticalLayerMetrics.reduce((max, curr) => curr.avgHealth > max.avgHealth ? curr : max).layerId)?.avgHealth}%)</li>
            <li>✓ All layers within optimal temperature ranges</li>
            <li>✓ Predictive maintenance preventing 78% of potential failures</li>
            <li>✓ Automated responses reducing manual intervention by 62%</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
