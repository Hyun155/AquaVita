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
      <div className="rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <p className="mb-1 text-sm font-medium text-slate-900">{label}</p>
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
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
      <div className="mb-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Harvest Yield Forecast</h3>
            <p className="mt-1 text-xs text-slate-500">6-week projection based on current growth trajectory</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold text-success">+{growthRate}%</span>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/90 p-3">
          <p className="mb-1 text-xs text-slate-500">Current Yield</p>
          <p className="text-2xl font-semibold text-emerald-600">{currentTotal}</p>
          <p className="mt-1 text-xs text-slate-500">kg collected</p>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/90 p-3">
          <p className="mb-1 text-xs text-slate-500">Projected Yield</p>
          <p className="text-2xl font-semibold text-cyan-600">{projectedTotal}</p>
          <p className="mt-1 text-xs text-slate-500">kg by week 6</p>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/90 p-3">
          <p className="mb-1 text-xs text-slate-500">Expected Growth</p>
          <p className="text-2xl font-semibold text-amber-600">{projectedTotal - currentTotal}</p>
          <p className="mt-1 text-xs text-slate-500">kg additional</p>
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
            <XAxis 
              dataKey="week" 
              tick={{ fill: "#94a3b8", fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: "#94a3b8", fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
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

      <div className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50/80 p-3">
        <p className="text-xs leading-relaxed text-slate-600">
          <span className="font-semibold text-cyan-700">AI forecast:</span> Peak harvest is expected in Week 5-6, with scheduling optimization recommended within 3 days.
        </p>
      </div>
    </div>
  )
}
