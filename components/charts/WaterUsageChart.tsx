"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { waterUsageData } from "@/lib/mockData"

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

export function WaterUsageChart() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Water Usage Efficiency</h3>
        <p className="text-xs text-muted-foreground">Usage vs water saved per rack</p>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={waterUsageData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.02 220)" />
            <XAxis dataKey="name" tick={{ fill: "oklch(0.6 0.01 180)", fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fill: "oklch(0.6 0.01 180)", fontSize: 11 }} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="usage" fill="oklch(0.75 0.2 195)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="saved" fill="oklch(0.8 0.25 140)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}