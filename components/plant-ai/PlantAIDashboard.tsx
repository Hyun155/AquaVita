"use client"

import { useEffect, useMemo, useState } from "react"
import { PlantCard } from "@/components/plant-ai/PlantCard"
import { RecommendationCard } from "@/components/plant-ai/RecommendationCard"
import { DiseaseDetectionPanel } from "@/components/plant-ai/DiseaseDetectionPanel"
import { Switch } from "@/components/ui/switch"
import type { GrowthStage, PlantRecommendation, PlantTelemetry } from "@/components/plant-ai/types"
import { automationController, type AutomationAction } from "@/lib/automationController"
import { Sparkles, ShieldAlert, Activity, Cpu } from "lucide-react"

const initialPlants: PlantTelemetry[] = [
  { id: "lettuce-a", name: "Lettuce A", stage: "Seedling", health: 93, ph: 6.3, temperature: 24.5 },
  { id: "basil-b", name: "Basil B", stage: "Vegetative", health: 88, ph: 6.7, temperature: 25.1 },
  { id: "spinach-c", name: "Spinach C", stage: "Mature", health: 79, ph: 6.0, temperature: 27.3 },
  { id: "mint-d", name: "Mint D", stage: "Vegetative", health: 74, ph: 7.1, temperature: 26.6 },
  { id: "kale-e", name: "Kale E", stage: "Harvest Ready", health: 86, ph: 6.5, temperature: 23.9 },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function stageRange(stage: GrowthStage): [number, number] {
  switch (stage) {
    case "Seedling":
      return [20, 30]
    case "Vegetative":
      return [10, 20]
    case "Mature":
      return [3, 10]
    case "Harvest Ready":
      return [1, 3]
    default:
      return [10, 20]
  }
}

function calculateDaysToHarvest(plant: PlantTelemetry) {
  const [minDays, maxDays] = stageRange(plant.stage)
  // Lower health pushes the estimate toward the slower end of each stage range.
  const healthFactor = (100 - plant.health) / 100
  let estimate = Math.round(minDays + (maxDays - minDays) * healthFactor)

  // High-health plants mature slightly faster.
  if (plant.health > 85) {
    estimate -= 2
  }

  return clamp(estimate, 1, 30)
}

function buildRecommendations(plants: PlantTelemetry[]) {
  const recommendations: PlantRecommendation[] = []

  // Rule-based recommendation engine that mimics AI guidance from sensor thresholds.
  plants.forEach((plant) => {
    if (plant.ph < 6.0) {
      recommendations.push({
        id: `${plant.id}-ph-low`,
        plantId: plant.id,
        plantName: plant.name,
        severity: "warning",
        message: `pH is ${plant.ph.toFixed(2)}. Add alkaline buffer to stabilize nutrient uptake.`,
      })
    }

    if (plant.ph > 7.2) {
      recommendations.push({
        id: `${plant.id}-ph-high`,
        plantId: plant.id,
        plantName: plant.name,
        severity: "warning",
        message: `pH is ${plant.ph.toFixed(2)}. Add acidic solution to restore target pH range.`,
      })
    }

    if (plant.health < 70) {
      recommendations.push({
        id: `${plant.id}-health-low`,
        plantId: plant.id,
        plantName: plant.name,
        severity: "critical",
        message: `Health dropped to ${Math.round(plant.health)}%. Increase nitrogen nutrients immediately.`,
      })
    }

    if (plant.temperature > 28) {
      recommendations.push({
        id: `${plant.id}-temp-high`,
        plantId: plant.id,
        plantName: plant.name,
        severity: "critical",
        message: `Temperature is ${plant.temperature.toFixed(1)}°C. Cool system and increase airflow.`,
      })
    }
  })

  if (recommendations.length === 0) {
    recommendations.push({
      id: "stable-system",
      plantId: "all",
      plantName: "All Plants",
      severity: "info",
      message: "All monitored plants are within healthy AI thresholds.",
    })
  }

  const severityRank = { critical: 0, warning: 1, info: 2 }
  return recommendations.sort((a, b) => severityRank[a.severity] - severityRank[b.severity])
}

export function PlantAIDashboard() {
  const [plants, setPlants] = useState<PlantTelemetry[]>(initialPlants)
  const [stressMode, setStressMode] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [actionLog, setActionLog] = useState<AutomationAction[]>([])
  const [recoveryState, setRecoveryState] = useState<Record<string, { progress: number; active: boolean }>>({})
  const [interventions, setInterventions] = useState<
    { id: string; plantId: string; message: string; timestamp: string; status: "in-progress" | "resolved"; success?: boolean }[]
  >([])

  useEffect(() => {
    const interval = window.setInterval(() => {
      // Simulate live telemetry drift while keeping values inside realistic hydroponic ranges.
      setPlants((prevPlants) => {
        const nextPlants = prevPlants.map((plant) => {
          const recovering = recoveryState[plant.id]?.active

          if (recovering) {
            // Recovery mode: actively heal plant and nudge pH toward optimal (6.5)
            const phDelta = (6.5 - plant.ph) * 0.35
            const nextPh = clamp(plant.ph + phDelta, 5.5, 7.5)
            const nextTemperature = clamp(plant.temperature + randomBetween(-0.4, 0.2), 20, 30)
            const nextHealth = clamp(plant.health + randomBetween(6, 12), 0, 100)

            return {
              ...plant,
              ph: Number(nextPh.toFixed(2)),
              temperature: Number(nextTemperature.toFixed(1)),
              health: Number(nextHealth.toFixed(0)),
            }
          }

          // Normal simulation drift; stress mode amplifies degradation
          const nextPh = clamp(plant.ph + randomBetween(-0.2, 0.2), 5.5, 7.5)
          const nextTemperature = clamp(plant.temperature + randomBetween(-0.8, 0.8), 20, 30)
          const healthDelta = randomBetween(-2, 2) - (stressMode ? randomBetween(0.8, 2.2) : 0)
          const nextHealth = clamp(plant.health + healthDelta, 0, 100)

          return {
            ...plant,
            ph: Number(nextPh.toFixed(2)),
            temperature: Number(nextTemperature.toFixed(1)),
            health: Number(nextHealth.toFixed(0)),
          }
        })

        // If stress mode is enabled, compute risk and kick off recovery for critical plants
        if (stressMode) {
          const newRecovery = { ...recoveryState }
          nextPlants.forEach((p) => {
            const healthPenalty = 100 - p.health
            const pHdev = Math.abs(p.ph - 6.5)
            const pHPenalty = pHdev * 18
            const riskScore = Math.round(healthPenalty + pHPenalty)

            const isCritical = riskScore >= 80
            if (isCritical && (!newRecovery[p.id] || !newRecovery[p.id].active)) {
              newRecovery[p.id] = { progress: 0, active: true }
            }
          })

          setRecoveryState(newRecovery)
        }

        const adjustmentEvents = automationController.evaluate(nextPlants, new Date())

        if (adjustmentEvents.length > 0) {
          setActionLog((prevLog) => [...adjustmentEvents, ...prevLog].slice(0, 8))

          // Create intervention records
          const newInterventions = adjustmentEvents.map((a) => ({
            id: a.id,
            plantId: a.plantId,
            message: a.message,
            timestamp: a.timestamp,
            status: "in-progress" as const,
          }))

          setInterventions((prev) => [...newInterventions, ...prev].slice(0, 20))
        }

        return nextPlants
      })
      setLastUpdate(new Date())
    }, 4000)

    return () => window.clearInterval(interval)
  }, [stressMode, recoveryState])

  // Recovery progress updater runs on a faster cadence to show progress between simulation ticks
  useEffect(() => {
    const timer = window.setInterval(() => {
      setRecoveryState((prev) => {
        const next = { ...prev }
        let changed = false

        Object.keys(next).forEach((id) => {
          if (!next[id].active) return
          next[id].progress = Math.min(100, next[id].progress + 16)
          changed = true
          if (next[id].progress >= 100) {
            next[id].active = false
            // mark interventions for this plant as resolved (success)
            setInterventions((prevInterventions) =>
              prevInterventions.map((iv) =>
                iv.plantId === id && iv.status === "in-progress" ? { ...iv, status: "resolved", success: true } : iv,
              ),
            )
          }
        })

        return changed ? next : prev
      })
    }, 800)

    return () => window.clearInterval(timer)
  }, [])

  const recommendations = useMemo(() => buildRecommendations(plants), [plants])
  const criticalCount = recommendations.filter((item) => item.severity === "critical").length

  const handleManualOverride = (plantId: string) => {
    // Cancel recovery and mark interventions as resolved (user resolved)
    setRecoveryState((prev) => ({ ...prev, [plantId]: { progress: 100, active: false } }))
    setInterventions((prev) => prev.map((iv) => (iv.plantId === plantId && iv.status === "in-progress" ? { ...iv, status: "resolved", success: false } : iv)))
  }

  const recentInterventions = interventions.slice(0, 5)
  const successCount = recentInterventions.filter((i) => i.success).length
  const successRate = recentInterventions.length > 0 ? Math.round((successCount / recentInterventions.length) * 100) : 100

  return (
    <div className="space-y-6">
      <section className="glass-card relative overflow-hidden rounded-2xl border border-border/50 p-6">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="h-full w-full bg-cover bg-center opacity-35 blur-[2px]"
            style={{ backgroundImage: "url('/images/aerial-greenhouse-blur.jpg')" }}
          />
        </div>
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-neon-aqua/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-14 -bottom-16 h-44 w-44 rounded-full bg-neon-green/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/6 to-neon-aqua/6 pointer-events-none" />

        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon-aqua/30 bg-neon-aqua/10 px-3 py-1 text-xs font-medium text-neon-aqua">
                <Cpu className="h-3.5 w-3.5" />
                AI-Powered Crop Monitoring
              </p>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">Plant AI</h1>
              <p className="mt-2 text-sm text-muted-foreground">Simulated intelligence for growth tracking, disease detection, and harvest optimization.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-xl border border-border/50 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
                <p className="mb-0.5">Last telemetry sync</p>
                <p className="font-semibold text-neon-green">{lastUpdate.toLocaleTimeString()}</p>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 px-3 py-2">
                <ShieldAlert className={`h-4 w-4 ${stressMode ? "text-destructive" : "text-neon-aqua"}`} />
                <div>
                  <p className="text-xs font-medium text-foreground">Stress Mode</p>
                  <p className="text-[11px] text-muted-foreground">Simulate adverse growth conditions</p>
                </div>
                <Switch checked={stressMode} onCheckedChange={setStressMode} />
              </label>
            </div>
          </div>

          {/* Hero row: Growth Rate, Live Camera mock, System Status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2 flex gap-4">
              <div className="rounded-2xl border border-border/50 bg-secondary/25 p-4 flex-1">
                <p className="text-xs text-muted-foreground">Growth Rate (weekly)</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">1.25</p>
                    <p className="text-xs text-muted-foreground">Avg. biomass growth</p>
                  </div>
                  <div className="text-sm text-neon-green font-semibold">+4.8% vs last week</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-secondary/25 p-4 w-56">
                <p className="text-xs text-muted-foreground">Live Camera</p>
                <div className="mt-3 h-28 w-full overflow-hidden rounded-md border border-border/40 bg-black/10">
                  <video
                    src="/livecamera.mp4"
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">Live feed from your uploaded video — auto-scan captures visible abnormalities</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-secondary/25 p-4">
              <p className="text-xs text-muted-foreground">System Status</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-foreground">All systems nominal</p>
                  <p className="text-xs text-muted-foreground">Auto interventions: {actionLog.length}</p>
                </div>
                <div className="text-sm text-neon-aqua font-semibold">Live</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Plant Growth Simulation</h2>
              <p className="text-xs text-muted-foreground">Live pH, temperature, and health streams</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-neon-green/40 bg-neon-green/10 px-3 py-1 text-xs text-neon-green">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              Live
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {plants.map((plant) => {
                // compute simple risk and time-to-failure when stress mode is on
                const healthPenalty = 100 - plant.health
                const pHdev = Math.abs(plant.ph - 6.5)
                const pHPenalty = Math.round(pHdev * 18)
                const riskScore = Math.round(healthPenalty + pHPenalty)

                let riskLabel: "Low" | "Moderate" | "High" | "Critical" = "Low"
                if (riskScore >= 80) riskLabel = "Critical"
                else if (riskScore >= 50) riskLabel = "High"
                else if (riskScore >= 30) riskLabel = "Moderate"

                const timeToFailureHours = Math.max(1, Math.round((plant.health / Math.max(riskScore, 1)) * 24))
                const recovery = recoveryState[plant.id]

                return (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    daysToHarvest={calculateDaysToHarvest(plant)}
                    riskLabel={stressMode ? riskLabel : undefined}
                    timeToFailureHours={stressMode ? timeToFailureHours : undefined}
                    recoveryProgress={recovery?.active ? recovery.progress : undefined}
                  />
                )
              })}
          </div>
        </div>

        <aside className="space-y-4">
          <DiseaseDetectionPanel />

          <section className="glass-card rounded-2xl border border-border/50 p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">AI Recommendations</h3>
                <p className="text-xs text-muted-foreground">Rule-based interventions prioritized by risk</p>
              </div>
              <span
                className={`rounded-lg border px-2 py-1 text-xs font-semibold ${
                  criticalCount > 0
                    ? "border-destructive/50 bg-destructive/15 text-destructive"
                    : "border-neon-aqua/40 bg-neon-aqua/15 text-neon-aqua"
                }`}
              >
                {criticalCount > 0 ? `${criticalCount} critical` : "Stable"}
              </span>
            </div>

            <div className="space-y-2.5">
              {recommendations.map((recommendation) => {
                const latestIntervention = interventions.find((iv) => iv.plantId === recommendation.plantId && iv.status === "in-progress")
                const actionStatus = latestIntervention ? "in-progress" : interventions.find((iv) => iv.plantId === recommendation.plantId && iv.status === "resolved") ? "resolved" : undefined

                return (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    actionStatus={actionStatus}
                    onManualOverride={() => handleManualOverride(recommendation.plantId)}
                  />
                )
              })}
            </div>
          </section>

          <section className="glass-card rounded-2xl border border-border/50 p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Automated Action Log</h3>
                <p className="text-xs text-muted-foreground">Controller responses triggered by the latest simulation tick</p>
              </div>
              <span className="rounded-lg border border-neon-aqua/40 bg-neon-aqua/15 px-2 py-1 text-xs font-semibold text-neon-aqua">
                {actionLog.length} recent
              </span>
            </div>

            <div className="space-y-2.5">
              {actionLog.length > 0 ? (
                actionLog.map((action) => (
                  <div key={action.id} className="rounded-xl border border-border/50 bg-secondary/30 px-3 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{action.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {action.plantName} · {action.metric}
                        </p>
                      </div>
                      <span className="whitespace-nowrap text-[11px] text-muted-foreground">{action.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border/50 bg-secondary/20 px-3 py-4 text-sm text-muted-foreground">
                  No automated adjustments yet. The controller will log actions when a plant leaves the optimal range.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-neon-green/35 bg-gradient-to-br from-neon-green/10 to-neon-aqua/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-neon-green">
              <Sparkles className="h-4 w-4" />
              AI Insight
            </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Health above 85% accelerates harvest readiness. Keep pH between 6.0 and 7.2 for best nutrient absorption.
                </p>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">Automated Success</p>
                  <p className="text-xs text-muted-foreground">Last 5: <span className="font-medium text-neon-green">{successRate}%</span></p>
                </div>
              </div>
          </section>
        </aside>
      </section>
    </div>
  )
}
