"use client"

import { useEffect, useState } from "react"
import { Award, TrendingUp, Leaf } from "lucide-react"
import { sustainabilityMetrics, badges } from "@/lib/mockData"

export function SustainabilityPanel() {
  const [scores, setScores] = useState<{ [key: string]: number }>({})
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Animate scores from 0 to final value
    sustainabilityMetrics.forEach((metric) => {
      const duration = 2000
      const startValue = 0
      const endValue = metric.value
      const startTime = Date.now()

      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        const currentValue = Math.floor(startValue + (endValue - startValue) * progress)
        setScores((prev) => ({
          ...prev,
          [metric.label]: currentValue,
        }))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    })
  }, [])

  useEffect(() => {
    // Unlock badges one by one with delay
    badges.forEach((badge, index) => {
      const timer = setTimeout(() => {
        setUnlockedBadges((prev) => new Set([...prev, badge.name]))
      }, 1500 + index * 300)
      return () => clearTimeout(timer)
    })
  }, [])

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
    Object.values(scores).reduce((acc, val) => acc + val, 0) / sustainabilityMetrics.length || 0,
  )

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Sustainability Index</h2>
          <p className="text-sm text-slate-500">Environmental impact metrics</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 shadow-sm">
          <Award className="w-5 h-5 text-emerald-600" />
          <span className="text-lg font-semibold text-emerald-700">{overallScore}</span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {sustainabilityMetrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-4 transition-transform duration-300 hover:-translate-y-0.5"
            style={{
              opacity: scores[metric.label] !== undefined ? 1 : 0,
              transform: scores[metric.label] !== undefined ? "translateY(0)" : "translateY(10px)",
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: `${metric.color}20` }}>
              <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
            </div>
            <p className="mb-1 text-xs text-slate-500">{metric.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold" style={{ color: metric.color }}>
                {scores[metric.label] ?? 0}
              </span>
              <span className="text-sm text-slate-500">{metric.unit}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-xs text-emerald-600">{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Eco-Efficiency Progress</span>
          <span className="text-sm font-semibold text-emerald-700">{overallScore}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-300 transition-all duration-1000"
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-4 text-sm font-medium text-slate-700">Achievement Badges</h3>
        <div className="flex flex-wrap gap-2.5">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 bg-gradient-to-r ${getTierStyles(
                badge.tier,
              )} transition-all duration-500 hover:scale-105 ${
                unlockedBadges.has(badge.name)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
              style={{
                transitionDelay: `${1500 + index * 300}ms`,
              }}
            >
              <badge.icon className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}