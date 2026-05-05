"use client"

import { Award, TrendingUp, Leaf } from "lucide-react"
import { sustainabilityMetrics, badges } from "@/lib/mockData"

export function SustainabilityPanel() {
  const getTierStyles = (tier: string) => {
    switch (tier) {
      case "gold":
        return "from-amber-400 to-amber-600 text-amber-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
      case "silver":
        return "from-slate-300 to-slate-400 text-slate-800 shadow-[0_0_15px_rgba(148,163,184,0.5)]"
      default:
        return "from-orange-400 to-orange-600 text-orange-900 shadow-[0_0_15px_rgba(234,88,12,0.5)]"
    }
  }

  const overallScore = Math.round(
    sustainabilityMetrics.reduce((acc, m) => acc + m.value, 0) / sustainabilityMetrics.length,
  )

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Sustainability Index</h2>
          <p className="text-sm text-muted-foreground">Environmental impact metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-green/20 to-neon-aqua/10 border border-neon-green/30">
          <Award className="w-5 h-5 text-neon-green" />
          <span className="text-lg font-bold text-neon-green">{overallScore}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {sustainabilityMetrics.map((metric, index) => (
          <div
            key={index}
            className="glass-card rounded-xl p-4 border border-border/50 hover:scale-105 transition-transform"
          >
            <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: `${metric.color}20` }}>
              <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
            </div>
            <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</span>
              <span className="text-sm text-muted-foreground">{metric.unit}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-xs text-success">{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Eco-Efficiency Progress</span>
          <span className="text-sm text-neon-green font-medium">{overallScore}%</span>
        </div>
        <div className="h-3 rounded-full bg-secondary/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-green via-neon-aqua to-neon-blue transition-all duration-1000"
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Achievement Badges</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getTierStyles(badge.tier)} transition-transform hover:scale-105`}
            >
              <badge.icon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wide">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-neon-green/10 to-neon-aqua/5 border border-neon-green/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-neon-green/20">
            <Leaf className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-neon-green mb-1">Environmental Impact</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your farm has saved <span className="text-neon-aqua font-medium">12,450 liters</span> of water this month
              and converted <span className="text-neon-green font-medium">156 kg</span> of organic waste into fertilizer.
              Keep up the great work!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}