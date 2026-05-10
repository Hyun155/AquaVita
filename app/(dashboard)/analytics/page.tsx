"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { energyData, farmLayers, growthData, waterUsageData, yieldForecastData } from "@/lib/mockData"
import { Activity, Bot, Droplets, Leaf, Sparkles, TrendingUp, Zap } from "lucide-react"

const totalActualYield = yieldForecastData.reduce((sum, item) => sum + (item.actual ?? 0), 0)
const totalForecastYield = yieldForecastData.reduce((sum, item) => sum + (item.forecast ?? 0), 0)
const totalWaterSaved = waterUsageData.reduce((sum, item) => sum + item.saved, 0)
const totalWaterUsage = waterUsageData.reduce((sum, item) => sum + item.usage, 0)
const waterEfficiencyRate = Math.round((totalWaterSaved / (totalWaterSaved + totalWaterUsage)) * 100)
const averageFarmHealth = Math.round(farmLayers.reduce((sum, layer) => sum + layer.health, 0) / farmLayers.length)
const averageYieldPrediction = Math.round(farmLayers.reduce((sum, layer) => sum + layer.yieldPrediction, 0) / farmLayers.length)

const baselineEnergy = energyData[0]?.energy ?? 1
const latestEnergy = energyData[energyData.length - 1]?.energy ?? 1
const energyOptimization = Math.round(((baselineEnergy - latestEnergy) / baselineEnergy) * 100)

const sustainabilityScore = 89
const aiOptimizationImpact = 18

const nutrientTrendData = energyData.map((point, index) => ({
  month: point.month,
  nutrientStability: 74 + index * 3,
  target: 86,
}))

const executiveCards = [
  {
    label: "Overall Farm Performance",
    value: `${averageFarmHealth}%`,
    detail: "System health and productivity alignment",
    accent: "from-violet-200/60 via-white to-emerald-100/70",
    icon: Activity,
  },
  {
    label: "Yield Forecast",
    value: `${totalForecastYield} kg`,
    detail: `${totalActualYield} kg harvested, sustained upward trajectory`,
    accent: "from-emerald-200/60 via-white to-cyan-100/70",
    icon: TrendingUp,
  },
  {
    label: "Water Efficiency",
    value: `${waterEfficiencyRate}%`,
    detail: `${totalWaterSaved}L reclaimed through recirculation intelligence`,
    accent: "from-cyan-200/60 via-white to-violet-100/70",
    icon: Droplets,
  },
  {
    label: "Energy Optimization",
    value: `${energyOptimization}%`,
    detail: "Reduction in energy demand vs baseline month",
    accent: "from-violet-200/60 via-white to-amber-100/70",
    icon: Zap,
  },
  {
    label: "Sustainability Score",
    value: `${sustainabilityScore}/100`,
    detail: "Composite eco-efficiency index for operations",
    accent: "from-emerald-200/60 via-white to-violet-100/70",
    icon: Leaf,
  },
  {
    label: "AI Optimization Impact",
    value: `${aiOptimizationImpact}%`,
    detail: "Measured operational gains from HydroAI+ decisions",
    accent: "from-violet-200/60 via-white to-cyan-100/70",
    icon: Bot,
  },
]

const sustainabilityMetrics = [
  { label: "Total Water Saved", value: `${totalWaterSaved}L`, sub: "Monthly conservation volume", progress: 82 },
  { label: "Carbon Reduction", value: "12.6 tCO2e", sub: "Estimated avoided emissions", progress: 76 },
  { label: "Energy Efficiency", value: `${energyOptimization}%`, sub: "Smart load optimization gain", progress: 79 },
  { label: "Waste Recycling", value: "88%", sub: "Circular biomass utilization", progress: 88 },
  { label: "Nutrient Reuse", value: "91%", sub: "Aquaponics nutrient loop recovery", progress: 91 },
]

const chartContainerClass =
  "rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_50px_rgba(94,106,140,0.12)] backdrop-blur-xl"

const metricTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl border border-slate-200/70 bg-white/95 p-3 shadow-lg backdrop-blur">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-7 pb-6">
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-gradient-to-br from-violet-50 via-white to-emerald-50 px-6 py-7 shadow-[0_26px_60px_rgba(100,110,150,0.16)] md:px-8 md:py-8">
        <div className="pointer-events-none absolute -left-24 top-[-68px] h-52 w-52 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-[-88px] h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="relative">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">
                <Sparkles className="h-3.5 w-3.5" />
                AgriNexus HydroAI+ Intelligence
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[2.15rem]">Analytics & Sustainability Executive Center</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
                A strategic operations report for system performance, AI-driven optimization, and long-term sustainability outcomes.
              </p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Operational pulse</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">Stable autonomous mode</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {executiveCards.map((card) => (
              <div key={card.label} className={`rounded-2xl border border-white/70 bg-gradient-to-br ${card.accent} p-4 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{card.label}</span>
                  <div className="rounded-lg bg-white/75 p-1.5 shadow-sm">
                    <card.icon className="h-4 w-4 text-violet-700" />
                  </div>
                </div>
                <p className="mt-4 text-[1.75rem] font-semibold tracking-tight text-slate-900">{card.value}</p>
                <p className="mt-1 text-xs text-slate-600">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-[30px] border border-slate-200/80 bg-white/75 p-5 shadow-[0_18px_44px_rgba(98,109,145,0.12)] backdrop-blur md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700">Farm Performance Trends</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Long-term operational trajectory</h2>
            <p className="mt-1 text-sm text-slate-600">Focused trend storytelling across growth, yield, water, energy, and nutrient optimization.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className={`${chartContainerClass} xl:col-span-2`}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Crop Growth & Yield Progression</h3>
                <p className="text-xs text-slate-500">Growth rate and yield forecast trend over planning horizon</p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Upward trend</span>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldForecastData}>
                  <defs>
                    <linearGradient id="yieldActualFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="yieldForecastFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={metricTooltip} />
                  <Area type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={2.2} fill="url(#yieldActualFill)" name="Actual Yield" />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    stroke="#7c3aed"
                    strokeWidth={2.2}
                    strokeDasharray="6 4"
                    fill="url(#yieldForecastFill)"
                    name="Forecast"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={chartContainerClass}>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900">Water Consumption Trend</h3>
              <p className="text-xs text-slate-500">Usage vs conserved water across active racks</p>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterUsageData} barGap={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={metricTooltip} />
                  <Bar dataKey="usage" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Usage" />
                  <Bar dataKey="saved" fill="#10b981" radius={[6, 6, 0, 0]} name="Saved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={chartContainerClass}>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900">Energy & Nutrient Optimization Trend</h3>
              <p className="text-xs text-slate-500">Energy demand reduction aligned with nutrient stability gains</p>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={nutrientTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={metricTooltip} />
                  <Line type="monotone" dataKey="nutrientStability" stroke="#10b981" strokeWidth={2.5} dot={{ r: 2.8 }} name="Nutrient Stability" />
                  <Line type="monotone" dataKey="target" stroke="#7c3aed" strokeDasharray="4 4" strokeWidth={2} dot={false} name="Target" />
                  <Line type="monotone" dataKey="energy" data={energyData} stroke="#0ea5e9" strokeWidth={2.2} dot={false} name="Energy" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_16px_38px_rgba(100,110,150,0.1)] backdrop-blur md:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Sustainability & Resource Impact</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Eco-tech infrastructure impact model</h2>
            <p className="mt-1 text-sm text-slate-600">Simplified reporting on conservation, circularity, and resource optimization.</p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
            City-scale sustainability benchmark: ahead of target
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {sustainabilityMetrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-600">{metric.sub}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500" style={{ width: `${metric.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}