"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KPICardProps {
  title: string
  value: number
  icon: React.ReactNode
  trend: number
  color: "green" | "aqua" | "blue" | "yellow"
  unit?: string
  delay?: number
}

export function KPICard({ title, value, icon, trend, color, unit = "", delay = 0 }: KPICardProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const colorClasses = {
    green: {
      ring: "stroke-neon-green",
      glow: "neon-green-glow",
      bg: "from-neon-green/20 to-neon-green/5",
      text: "text-neon-green",
      hover: "group-hover:shadow-[0_0_24px_oklch(0.8_0.25_140/0.3)]",
    },
    aqua: {
      ring: "stroke-neon-aqua",
      glow: "neon-aqua-glow",
      bg: "from-neon-aqua/20 to-neon-aqua/5",
      text: "text-neon-aqua",
      hover: "group-hover:shadow-[0_0_24px_oklch(0.75_0.2_195/0.3)]",
    },
    blue: {
      ring: "stroke-neon-blue",
      glow: "neon-blue-glow",
      bg: "from-neon-blue/20 to-neon-blue/5",
      text: "text-neon-blue",
      hover: "group-hover:shadow-[0_0_24px_oklch(0.75_0.2_240/0.3)]",
    },
    yellow: {
      ring: "stroke-warning",
      glow: "",
      bg: "from-warning/20 to-warning/5",
      text: "text-warning",
      hover: "group-hover:shadow-[0_0_24px_oklch(0.78_0.17_85/0.3)]",
    },
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    const duration = 1500
    const steps = 60
    const stepValue = value / steps
    let current = 0
    const interval = setInterval(() => {
      current += stepValue
      if (current >= value) {
        setAnimatedValue(value)
        clearInterval(interval)
      } else {
        setAnimatedValue(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [isVisible, value])

  const colors = colorClasses[color]

  return (
    <div
      className={`glass-card rounded-2xl p-6 relative overflow-hidden group transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : "opacity-0 -translate-x-4 translate-y-4"
      } ${colors.hover}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50 transition-opacity duration-300 group-hover:opacity-70`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-2 rounded-lg bg-secondary/50 ${colors.text} transition-transform duration-300 group-hover:scale-110`}
          >
            {icon}
          </div>
          <div className="flex items-center gap-1 text-sm">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : trend < 0 ? (
              <TrendingDown className="w-4 h-4 text-destructive" />
            ) : (
              <Minus className="w-4 h-4 text-muted-foreground" />
            )}
            <span className={trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${colors.text}`}>{animatedValue}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>

        <div className="h-8 flex items-end gap-1">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full ${colors.text} transition-all duration-700`}
              style={{
                height: `${Math.random() * 24 + 8}px`,
                opacity: isVisible ? 0.3 + Math.random() * 0.5 : 0.1,
                transitionDelay: isVisible ? `${i * 50}ms` : "0ms",
              }}
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          {trend > 0 ? "Trending up" : trend < 0 ? "Trending down" : "Stable"}
        </p>
      </div>
    </div>
  )
}