"use client"

import { useEffect, useState } from "react"
import { Award, Leaf, Droplets, Zap, TrendingUp, BarChart3, Sparkles } from "lucide-react"

export default function PresentationPage() {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const teamMembers = [
    {
      role: "Member 1",
      responsibility: "Plant Health & AI",
      color: "from-neon-green/30 to-neon-green/10",
    },
    {
      role: "Member 2",
      responsibility: "Water Systems",
      color: "from-neon-aqua/30 to-neon-aqua/10",
    },
    {
      role: "Member 3",
      responsibility: "Energy & Nutrients",
      color: "from-neon-blue/30 to-neon-blue/10",
    },
    {
      role: "Member 4",
      responsibility: "Backend & Data",
      color: "from-warning/30 to-warning/10",
    },
    {
      role: "Member 5",
      responsibility: "Analytics, Charts & Polish",
      color: "from-neon-green/30 to-warning/10",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-8">
      {/* Header */}
      <div
        className={`text-center mb-16 transition-all duration-1000 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-neon-green animate-pulse" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-green via-neon-aqua to-neon-blue bg-clip-text text-transparent">
            AquaVita
          </h1>
          <Sparkles className="w-8 h-8 text-neon-aqua animate-pulse" />
        </div>
        <p className="text-xl text-muted-foreground">Smart Hydroponic Farming Platform</p>
        <p className="text-sm text-muted-foreground/70 mt-2">Sustainable. Intelligent. Efficient.</p>
      </div>

      {/* Main Dashboard Preview */}
      <div
        className={`glass-card rounded-2xl p-8 mb-12 border border-border/50 transition-all duration-1000 delay-300 ${
          fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-neon-green" />
          Real-Time Analytics Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Plant Health", value: "87", color: "neon-green" },
            { label: "Water Quality", value: "92", color: "neon-aqua" },
            { label: "Energy Efficiency", value: "78", color: "warning" },
            { label: "Sustainability", value: "85", color: "neon-blue" },
          ].map((metric, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-4 border border-border/30 hover:scale-105 transition-transform duration-300"
              style={{
                borderColor: `oklch(0.3 0.02 ${
                  { "neon-green": "140", "neon-aqua": "195", warning: "85", "neon-blue": "240" }[metric.color]
                })`,
              }}
            >
              <p className="text-xs text-muted-foreground mb-2">{metric.label}</p>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-2xl font-bold"
                  style={{
                    color: `oklch(${
                      { "neon-green": "0.8 0.25 140", "neon-aqua": "0.75 0.2 195", warning: "0.78 0.17 85", "neon-blue": "0.75 0.2 240" }[metric.color]
                    })`,
                  }}
                >
                  {metric.value}
                </span>
                <span className="text-sm">%</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          ✓ Real-time KPI tracking with animated counters | ✓ 6-week yield forecasting with AI confidence scores | ✓ Sustainability metrics with achievements
        </p>
      </div>

      {/* Key Features */}
      <div
        className={`mb-12 transition-all duration-1000 delay-500 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Leaf,
              title: "Plant AI",
              desc: "AI-powered plant health monitoring and growth forecasting",
              color: "neon-green",
            },
            {
              icon: Droplets,
              title: "Water Control",
              desc: "Smart irrigation system with real-time quality tracking",
              color: "neon-aqua",
            },
            {
              icon: Zap,
              title: "Energy Optimization",
              desc: "Efficient power management with yield correlation",
              color: "neon-blue",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-6 border border-border/50 hover:scale-105 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: `oklch(${
                  { "neon-green": "0.8 0.25 140", "neon-aqua": "0.75 0.2 195", "neon-blue": "0.75 0.2 240" }[feature.color]
                }/0.2)` }}>
                <feature.icon className="w-6 h-6" style={{ color: `oklch(${
                  { "neon-green": "0.8 0.25 140", "neon-aqua": "0.75 0.2 195", "neon-blue": "0.75 0.2 240" }[feature.color]
                })` }} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability Impact */}
      <div
        className={`glass-card rounded-2xl p-8 border border-border/50 mb-12 transition-all duration-1000 delay-700 ${
          fadeIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        }`}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-neon-green" />
          Sustainability Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { metric: "94%", label: "Water Recycled" },
            { metric: "87%", label: "Waste-to-Fertilizer" },
            { metric: "72kg", label: "Carbon Reduction" },
            { metric: "89%", label: "Energy Efficiency" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-4 rounded-lg bg-secondary/50 border border-border/30">
              <p className="text-2xl font-bold text-neon-green mb-1">{stat.metric}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Contributions */}
      <div
        className={`transition-all duration-1000 delay-1000 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Team Contributions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className={`glass-card rounded-xl p-6 border border-border/50 hover:scale-105 transition-all duration-300 bg-gradient-to-br ${member.color}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-neon-green" />
                <h3 className="font-semibold text-foreground text-sm">{member.role}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{member.responsibility}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t border-border/30">
        <p className="text-sm text-muted-foreground">
          Building the future of sustainable hydroponics | Next.js • React • TypeScript • Tailwind CSS
        </p>
      </div>
    </div>
  )
}
