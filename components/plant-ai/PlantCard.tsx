"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { PlantProfile, PlantTelemetry } from "@/components/plant-ai/types"
import { Leaf, Thermometer, TestTubeDiagonal, CalendarClock, Sparkles, Radar, Zap, ArrowRight, ChevronRight } from "lucide-react"

interface PlantCardProps {
  plant: PlantTelemetry
  profile: PlantProfile
  daysToHarvest: number
  riskLabel?: "Low" | "Moderate" | "High" | "Critical"
  timeToFailureHours?: number
  recoveryProgress?: number
}

function useCountUp(target: number, durationMs: number, fractionDigits = 0) {
  const [value, setValue] = useState(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const startValue = value
    const startTime = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextValue = startValue + (target - startValue) * eased
      setValue(Number(nextValue.toFixed(fractionDigits)))

      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(tick)
      }
    }

    rafRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [target])

  return value
}

function getHealthClasses(health: number) {
  if (health < 50) {
    return {
      badge: "bg-destructive/20 text-destructive border-destructive/40",
      bar: "from-destructive to-destructive/70",
      label: "Critical",
    }
  }

  if (health < 75) {
    return {
      badge: "bg-warning/20 text-warning border-warning/40",
      bar: "from-warning to-warning/70",
      label: "Warning",
    }
  }

  return {
    badge: "bg-success/20 text-success border-success/40",
    bar: "from-success to-neon-green",
    label: "Healthy",
  }
}

export function PlantCard(props: PlantCardProps) {
  const { plant, daysToHarvest, profile } = props
  const healthStyle = getHealthClasses(plant.health)
  const isCritical = plant.health < 50
  const displayedHealth = useCountUp(plant.health, 850)
  const displayedPh = useCountUp(plant.ph, 900, 2)
  const displayedTemperature = useCountUp(plant.temperature, 900, 1)
  const displayedDaysToHarvest = useCountUp(daysToHarvest, 950)
  const displayedRecoveryProgress = useCountUp(props.recoveryProgress ?? 0, 700)
  const profileToneClass = isCritical ? "from-destructive/25 via-slate-950/90 to-slate-950" : "from-neon-aqua/22 via-slate-950/90 to-slate-950"

  return (
    <article className={`group glass-card relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 ${isCritical ? "border-destructive/45 shadow-[0_0_28px_oklch(0.62_0.24_23/0.2)]" : "border-border/50 hover:border-neon-aqua/40 hover:shadow-[0_0_34px_oklch(0.75_0.2_195/0.25)]"}`}>
      <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-[radial-gradient(circle_at_20%_10%,oklch(0.76_0.17_190/0.28),transparent_60%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      {isCritical && <div className="pointer-events-none absolute inset-0 animate-pulse bg-destructive/5" />}

      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{plant.name}</h3>
          <p className="text-xs text-muted-foreground">AI growth tracking active</p>
          {props?.riskLabel && (
            <p className="text-xs mt-1 text-muted-foreground">Risk: <span className="font-medium text-foreground">{props.riskLabel}</span>{props.timeToFailureHours ? ` · TTF ${props.timeToFailureHours}h` : ''}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isCritical && <span className="h-2 w-2 rounded-full bg-destructive animate-ping" />}
          <Badge className={healthStyle.badge}>{healthStyle.label}</Badge>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-border/40 bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Growth Stage</p>
          <p className="mt-1 font-medium text-neon-aqua">{plant.stage}</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Days to Harvest</p>
          <p className="mt-1 flex items-center gap-1.5 font-medium text-neon-green">
            <CalendarClock className="h-4 w-4" />
            {Math.round(displayedDaysToHarvest)} days
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Health</span>
            <span className="font-semibold text-foreground">{Math.round(displayedHealth)}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/70">
            <div
              className={`h-full origin-left rounded-full bg-gradient-to-r ${healthStyle.bar} transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
              style={{ transform: `scaleX(${Math.max(0, Math.min(1, displayedHealth / 100))})` }}
            />
          </div>
        </div>

        {props?.recoveryProgress !== undefined && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Recovery Progress</span>
              <span className="font-semibold text-foreground">{Math.round(displayedRecoveryProgress)}%</span>
            </div>
            <Progress value={displayedRecoveryProgress} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 p-2 text-muted-foreground">
            <TestTubeDiagonal className="h-3.5 w-3.5 text-neon-aqua" />
            pH {displayedPh.toFixed(2)}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 p-2 text-muted-foreground">
            <Thermometer className="h-3.5 w-3.5 text-warning" />
            {displayedTemperature.toFixed(1)}°C
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Leaf className="h-3.5 w-3.5 text-neon-green" />
        Live simulation updates every 4 seconds
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="mt-4 flex w-full items-center justify-between overflow-hidden rounded-2xl border border-border/50 bg-secondary/20 px-3 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-neon-aqua/40 hover:bg-secondary/35 hover:shadow-[0_0_24px_oklch(0.75_0.2_195/0.12)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/40 text-neon-green">
                <Radar className="h-4 w-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Plant Profile</span>
                  <span className="rounded-full border border-border/50 bg-background/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Live Data
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">{profile.displayName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-neon-aqua">
              <span className="hidden rounded-full border border-border/50 bg-background/40 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:inline-flex">
                Tap to inspect
              </span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full border-border/40 bg-gradient-to-b from-slate-950 via-slate-950 to-background p-0 text-foreground sm:max-w-[34rem]"
        >
          <div className={`relative h-full overflow-hidden ${isCritical ? "bg-[radial-gradient(circle_at_top_right,oklch(0.66_0.23_24/0.18),transparent_36%)]" : "bg-[radial-gradient(circle_at_top_right,oklch(0.76_0.17_190/0.18),transparent_36%)]"}`}>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%,transparent_80%,rgba(255,255,255,0.03))]" />
            <div className={`pointer-events-none absolute -right-20 top-14 h-44 w-44 rounded-full blur-3xl ${isCritical ? "bg-destructive/20" : "bg-neon-aqua/20"}`} />
            <div className="relative flex h-full flex-col">
              <SheetHeader className="border-b border-white/10 px-6 py-6 text-left">
                <SheetTitle className="flex items-center gap-3 text-2xl">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isCritical ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-neon-aqua/40 bg-neon-aqua/10 text-neon-aqua"}`}>
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <span>
                    {profile.displayName}
                    <span className="mt-1 block text-sm font-normal text-muted-foreground">{profile.scientificName}</span>
                  </span>
                </SheetTitle>
                <SheetDescription className="mt-2 max-w-xl text-sm leading-relaxed">
                  Interactive plant intelligence profile with optimal conditions, sensitivities, and simulation behavior.
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${profileToneClass} p-[1px] shadow-[0_0_30px_oklch(0.75_0.2_195/0.14)]`}>
                  <div className="space-y-5 rounded-[1.4rem] border border-white/5 bg-slate-950/60 p-5 backdrop-blur-xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-neon-aqua/30 bg-neon-aqua/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-neon-aqua">
                        Plant Intelligence Profile
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Active Monitoring
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {isCritical ? "Critical Sensitivity" : "Stable Sensitivity"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-4">
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                        <p className="text-muted-foreground">Growth</p>
                        <p className="mt-1 font-medium text-foreground">{profile.growthSpeed}</p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                        <p className="text-muted-foreground">pH</p>
                        <p className="mt-1 font-medium text-foreground">{profile.optimalPh}</p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                        <p className="text-muted-foreground">Temp</p>
                        <p className="mt-1 font-medium text-foreground">{profile.optimalTemperature}</p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                        <p className="text-muted-foreground">Humidity</p>
                        <p className="mt-1 font-medium text-foreground">{profile.optimalHumidity ?? "—"}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-neon-aqua/20 bg-black/20 p-4">
                        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-aqua">
                          <Radar className="h-3.5 w-3.5" />
                          Sensitivity Matrix
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {profile.sensitivities.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neon-aqua shadow-[0_0_10px_oklch(0.75_0.2_195/0.55)]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-neon-green/20 bg-black/20 p-4">
                        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-green">
                          <ArrowRight className="h-3.5 w-3.5" />
                          Behavior Model
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {profile.simulationBehavior.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neon-green shadow-[0_0_10px_oklch(0.79_0.22_150/0.45)]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80">Ideal For</p>
                        <p className="mt-2 text-sm text-muted-foreground">{profile.idealFor ?? "General hydroponic use"}</p>
                        {profile.leafTypeOrStructure && <p className="mt-2 text-sm text-muted-foreground">{profile.leafTypeOrStructure}</p>}
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80">Common Issues</p>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                          {profile.commonIssues.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning shadow-[0_0_10px_oklch(0.78_0.17_85/0.45)]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/40 bg-secondary/20 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-aqua">Live Telemetry</p>
                          <p className="text-sm text-muted-foreground">Current health, pH, temperature, and recovery status</p>
                        </div>
                        <div className="rounded-full border border-neon-aqua/30 bg-neon-aqua/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-neon-aqua">
                          Synced
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                        <div className="rounded-xl border border-border/40 bg-background/40 p-3">
                          <p className="text-muted-foreground">Health</p>
                          <p className="mt-1 text-base font-semibold text-foreground">{Math.round(displayedHealth)}%</p>
                        </div>
                        <div className="rounded-xl border border-border/40 bg-background/40 p-3">
                          <p className="text-muted-foreground">pH</p>
                          <p className="mt-1 text-base font-semibold text-foreground">{displayedPh.toFixed(2)}</p>
                        </div>
                        <div className="rounded-xl border border-border/40 bg-background/40 p-3">
                          <p className="text-muted-foreground">Temp</p>
                          <p className="mt-1 text-base font-semibold text-foreground">{displayedTemperature.toFixed(1)}°C</p>
                        </div>
                        <div className="rounded-xl border border-border/40 bg-background/40 p-3">
                          <p className="text-muted-foreground">TTF</p>
                          <p className="mt-1 text-base font-semibold text-foreground">{props.timeToFailureHours ?? "—"}h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 px-6 py-4">
                <SheetClose asChild>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-neon-aqua/30 bg-neon-aqua/10 px-4 py-3 text-sm font-medium text-neon-aqua transition-all duration-300 hover:border-neon-aqua/50 hover:bg-neon-aqua/15 hover:shadow-[0_0_24px_oklch(0.75_0.2_195/0.18)]"
                  >
                    Close profile
                  </button>
                </SheetClose>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </article>
  )
}
