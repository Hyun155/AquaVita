"use client"

import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import { yieldForecastData } from "@/lib/mockData"
import { TrendingUp } from "lucide-react"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    const dataPoint = yieldForecastData.find(d => d.week === label)
    return (
      <div className="glass-card rounded-lg p-3 border border-border/50 backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value} kg
          </p>
        ))}
        {dataPoint && (
          <p className="text-xs text-muted-foreground mt-2">
            Confidence: {dataPoint.confidence}%
          </p>
        )}
      </div>
    )
  }
  return null
}

export function YieldForecastChart() {
  const projectedTotal = yieldForecastData
    .filter(d => d.forecast)
    .reduce((sum, d) => sum + (d.forecast || 0), 0)

  const currentTotal = yieldForecastData
    .filter(d => d.actual)
    .reduce((sum, d) => sum + (d.actual || 0), 0)

  const growthRate = currentTotal > 0 ? (((projectedTotal - currentTotal) / currentTotal) * 100).toFixed(1) : 0

  return (
    <div className="glass-card rounded-2xl p-6 overflow-hidden">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Harvest Yield Forecast</h3>
            <p className="text-xs text-muted-foreground mt-1">6-week projection based on current growth trajectory</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/20 border border-success/30">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold text-success">+{growthRate}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-secondary/50 p-3 border border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Current Yield</p>
          <p className="text-2xl font-bold text-neon-green">{currentTotal}</p>
          <p className="text-xs text-muted-foreground mt-1">kg collected</p>
        </div>
        <div className="rounded-xl bg-secondary/50 p-3 border border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Projected Yield</p>
          <p className="text-2xl font-bold text-neon-aqua">{projectedTotal}</p>
          <p className="text-xs text-muted-foreground mt-1">kg by week 6</p>
        </div>
        <div className="rounded-xl bg-secondary/50 p-3 border border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Expected Growth</p>
          <p className="text-2xl font-bold text-warning">{projectedTotal - currentTotal}</p>
          <p className="text-xs text-muted-foreground mt-1">kg additional</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yieldForecastData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.8 0.25 140)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.8 0.25 140)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.75 0.2 195)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(0.75 0.2 195)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.02 220)" />
            <XAxis 
              dataKey="week" 
              tick={{ fill: "oklch(0.6 0.01 180)", fontSize: 11 }} 
              axisLine={false}
            />
            <YAxis 
              tick={{ fill: "oklch(0.6 0.01 180)", fontSize: 11 }} 
              axisLine={false}
              label={{ value: "kg", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: "16px" }}
              formatter={(value) => {
                if (value === "actual") return "Actual Yield"
                if (value === "forecast") return "Forecast"
                return value
              }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="oklch(0.8 0.25 140)"
              strokeWidth={2}
              fill="url(#actualGradient)"
              isAnimationActive={true}
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="oklch(0.75 0.2 195)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#forecastGradient)"
              isAnimationActive={true}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-neon-aqua/10 border border-neon-aqua/30">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-neon-aqua">AI Prediction:</span> Based on growth patterns, expect peak harvest in Week 5-6. Recommend harvest scheduling optimization in 3 days.
        </p>
      </div>
    </div>
  )
}
