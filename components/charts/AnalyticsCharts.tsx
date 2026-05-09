"use client"

import {
  LineChart,
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { nutrientData } from "@/lib/mockData"
import { GrowthChart } from "@/components/charts/GrowthChart"
import { WaterUsageChart } from "@/components/charts/WaterUsageChart"
import { YieldForecastChart } from "@/components/charts/YieldForecastChart"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <p className="mb-1 text-sm font-medium text-slate-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }

  return null
}

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <GrowthChart />
      <YieldForecastChart />

      <WaterUsageChart />

      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Nutrient Balance</h3>
            <p className="text-xs text-slate-500">Current nutrient levels at a glance</p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Stable
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="18%" outerRadius="88%" data={nutrientData}>
              <RadialBar background={{ fill: "rgba(148,163,184,0.14)" }} dataKey="value" cornerRadius={6} />
              <Legend
                iconSize={8}
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: "11px", color: "#64748b" }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}