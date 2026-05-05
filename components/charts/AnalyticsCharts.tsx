"use client"

import {
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import { energyData, nutrientData } from "@/lib/mockData"
import { GrowthChart } from "@/components/charts/GrowthChart"
import { WaterUsageChart } from "@/components/charts/WaterUsageChart"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 border border-border/50">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GrowthChart />
      <WaterUsageChart />

      <div className="glass-card rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Nutrient Balance</h3>
          <p className="text-xs text-muted-foreground">Current nutrient levels</p>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={nutrientData}>
              <RadialBar background={{ fill: "oklch(0.15 0.015 220)" }} dataKey="value" cornerRadius={4} />
              <Legend
                iconSize={8}
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: "10px", color: "oklch(0.6 0.01 180)" }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Energy vs Yield</h3>
          <p className="text-xs text-muted-foreground">Efficiency optimization over time</p>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.02 220)" />
              <XAxis dataKey="month" tick={{ fill: "oklch(0.6 0.01 180)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "oklch(0.6 0.01 180)", fontSize: 11 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="oklch(0.65 0.2 250)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.65 0.2 250)", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="yield"
                stroke="oklch(0.8 0.25 140)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.8 0.25 140)", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}