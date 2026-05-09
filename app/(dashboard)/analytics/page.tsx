"use client"

import { AnalyticsCharts } from "@/components/charts/AnalyticsCharts"
import { SustainabilityPanel } from "@/components/dashboard/SustainabilityPanel"
import { sustainabilityMetrics, yieldForecastData, waterUsageData } from "@/lib/mockData"
import { Droplets, Leaf, TrendingUp, Zap } from "lucide-react"

const currentYield = Math.round(yieldForecastData.filter((entry) => entry.actual).reduce((sum, entry) => sum + (entry.actual ?? 0), 0))
const waterSaved = waterUsageData.reduce((sum, entry) => sum + entry.saved, 0)
const energyEfficiency = sustainabilityMetrics.find((metric) => metric.label === "Energy Efficiency")?.value ?? 0
const sustainabilityScore = Math.round(sustainabilityMetrics.reduce((sum, metric) => sum + metric.value, 0) / sustainabilityMetrics.length)

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-4">
      <section className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-6 py-6 shadow-sm md:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
              <Leaf className="h-3.5 w-3.5" />
              Analytics & Sustainability
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Clear operational insight, cleaner sustainability reporting</h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              A concise view of water efficiency, harvest momentum, and sustainability performance for fast executive review.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Current status</p>
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Live reporting active
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-cyan-200/70 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Droplets className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-medium text-emerald-600">+3%</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{waterSaved}L</p>
            <p className="text-sm text-slate-500">Water saved</p>
          </div>

          <div className="rounded-2xl border border-amber-200/70 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-emerald-600">+8%</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{energyEfficiency}%</p>
            <p className="text-sm text-slate-500">Energy efficiency</p>
          </div>

          <div className="rounded-2xl border border-emerald-200/70 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-600">Forecast</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{currentYield}kg</p>
            <p className="text-sm text-slate-500">Yield tracked</p>
          </div>

          <div className="rounded-2xl border border-teal-200/70 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Leaf className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-medium text-emerald-600">Healthy</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{sustainabilityScore}</p>
            <p className="text-sm text-slate-500">Sustainability score</p>
          </div>
        </div>
      </section>

      <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-5 shadow-sm md:p-6">
        <AnalyticsCharts />
      </div>

      <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-5 shadow-sm md:p-6">
        <SustainabilityPanel />
      </div>
    </div>
  )
}