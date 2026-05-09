"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, Bot, Cpu, Leaf, ShieldAlert, Sparkles, ThermometerSun, Zap } from "lucide-react"
import VerticalFarmView from "@/components/environment/VerticalFarmView"
import { aiActionTimeline, automationEvents, criticalAlerts, farmLayers, operationalModes } from "@/lib/mockData"

export function DigitalTwin() {
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null)
  const [hoveredLayerId, setHoveredLayerId] = useState<number | null>(null)
  const [activeMode, setActiveMode] = useState("balanced")

  const layerData = {
    1: {
      name: "Layer 1",
      crop: "Lettuce A",
      health: 91,
      temperature: "23.1°C",
      humidity: "65%",
      ph: "6.2",
      ec: "1.8",
      growthRate: "+6%",
      diseaseRisk: "12%",
      yieldPrediction: "88%",
      automation: "Auto",
      narrative: [
        "Layer 1 is performing optimally.",
        "Nutrient levels are well balanced.",
        "Harvest predicted in 8 days.",
      ],
    },
    2: {
      name: "Layer 2",
      crop: "Basil B",
      health: 84,
      temperature: "24.5°C",
      humidity: "71%",
      ph: "6.5",
      ec: "2.0",
      growthRate: "+3%",
      diseaseRisk: "19%",
      yieldPrediction: "81%",
      automation: "Assisted",
      narrative: [
        "Slight humidity elevation detected.",
        "Airflow adjusted to compensate.",
        "Monitor disease risk closely.",
      ],
    },
    3: {
      name: "Layer 3",
      crop: "Spinach C",
      health: 72,
      temperature: "25.9°C",
      humidity: "78%",
      ph: "6.9",
      ec: "2.3",
      growthRate: "+4%",
      diseaseRisk: "28%",
      yieldPrediction: "76%",
      automation: "Assisted",
      narrative: [
        "Humidity levels may increase fungal risk.",
        "UV sterilization activated automatically.",
        "AI optimized nutrient circulation.",
      ],
    },
    4: {
      name: "Layer 4",
      crop: "Kale D",
      health: 88,
      temperature: "22.8°C",
      humidity: "63%",
      ph: "6.1",
      ec: "1.9",
      growthRate: "+5%",
      diseaseRisk: "9%",
      yieldPrediction: "85%",
      automation: "Auto",
      narrative: [
        "Layer 4 conditions are stable.",
        "Low disease risk detected.",
        "Growth rate above average.",
      ],
    },
  }

  const activeLayer = useMemo(() => {
    const targetId = hoveredLayerId ?? selectedLayer
    if (targetId == null) return null
    return farmLayers.find((layer) => layer.id === targetId) ?? null
  }, [hoveredLayerId, selectedLayer])

  const layer = layerData[selectedLayer as keyof typeof layerData]

  const narrativeLines = useMemo(() => {
    return layer?.narrative ?? []
  }, [layer])

  return (
    <div className="relative">
      <div className="relative h-[78vh] min-h-[760px] overflow-hidden rounded-[32px] border border-border/40 bg-gradient-to-br from-[#f5f7fb] via-[#eef4ff] to-[#e6eef9] shadow-[0_40px_80px_rgba(60,80,120,0.2)]">
        <div className="pointer-events-none absolute inset-0 twin-atmosphere" />
        <div className="pointer-events-none absolute inset-0 twin-grid" />
        <div className="pointer-events-none absolute inset-0 twin-sheen" />

        <div className="relative h-full">
          <VerticalFarmView
            layers={farmLayers}
            hoveredLayerId={hoveredLayerId}
            selectedLayerId={selectedLayer}
            onHoverLayer={setHoveredLayerId}
            onSelectLayer={setSelectedLayer}
            onLayerClick={setSelectedLayer}
          />

          <div className="absolute left-6 top-6 w-[280px] space-y-3">
            <div className="holo-panel">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neon-blue">
                  <AlertTriangle className="h-4 w-4" />
                  Critical alerts
                </div>
                <span className="text-[10px] text-neon-blue/70">Live</span>
              </div>
              <div className="mt-3 space-y-2">
                {criticalAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-xl border border-neon-blue/20 bg-white/70 px-3 py-2">
                    <p className="text-xs font-semibold text-foreground">{alert.title}</p>
                    <p className="text-[11px] text-muted-foreground">{alert.message}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-neon-blue/70">{alert.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="holo-panel">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neon-green">
                <Sparkles className="h-4 w-4" />
                AI actions
              </div>
              <div className="mt-3 space-y-3">
                {aiActionTimeline.map((item) => (
                  <div key={item.id} className="rounded-xl border border-neon-green/20 bg-white/70 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">{item.time}</p>
                    <p className="text-xs text-foreground">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="absolute right-6 top-6 w-[260px] space-y-3"
            style={{ display: selectedLayer ? "none" : "block" }}
          >
            <div className="holo-panel">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neon-blue">
                <Cpu className="h-4 w-4" />
                System health
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Energy load</span>
                  <span className="text-neon-green">Stable</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Sensor mesh</span>
                  <span className="text-neon-aqua">Synced</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Water loop</span>
                  <span className="text-warning">Adaptive</span>
                </div>
              </div>
            </div>

            <div className="holo-panel">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neon-green">
                <Bot className="h-4 w-4" />
                Automation events
              </div>
              <div className="mt-3 space-y-2">
                {automationEvents.map((event) => (
                  <div key={event.id} className="rounded-xl border border-border/40 bg-white/70 px-3 py-2">
                    <p className="text-xs text-foreground">{event.system}</p>
                    <p className="text-[11px] text-muted-foreground">{event.detail}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-neon-aqua/70">{event.status}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="holo-panel">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neon-aqua">
                <ShieldAlert className="h-4 w-4" />
                Operating mode
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {operationalModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`hud-pill ${activeMode === mode.id ? "hud-pill-active" : ""}`}
                  >
                    <span className="text-xs font-semibold">{mode.label}</span>
                    <span className="text-[11px] text-foreground/80 leading-snug">{mode.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {activeLayer && hoveredLayerId && !selectedLayer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-6 left-1/2 w-[320px] -translate-x-1/2 rounded-2xl border border-neon-blue/30 bg-white/80 px-4 py-3 text-xs text-neon-blue shadow-[0_0_30px_rgba(59,130,246,0.15)]"
              >
                <div className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4" />
                  <span className="uppercase tracking-[0.2em]">Environmental overlay</span>
                </div>
                <p className="mt-2 text-muted-foreground">
                  {activeLayer.name} temperature {activeLayer.temperature.toFixed(1)}°C • humidity {activeLayer.humidity}% • pH {activeLayer.ph}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedLayer ? (
              <motion.aside
                key={selectedLayer}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute right-6 top-6 w-[260px]"
                style={{
                  position: "absolute",
                  zIndex: 20,
                  maxHeight: "calc(100% - 48px)",
                  overflowY: "auto",
                  paddingBottom: "16px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(100, 150, 255, 0.15)",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "16px",
                    boxShadow: "0 4px 24px rgba(60, 80, 120, 0.12)",
                  }}
                >
                  <button
                    onClick={() => setSelectedLayer(null)}
                    className="mb-3 text-[10px] uppercase tracking-widest text-white/40 hover:text-white/80"
                  >
                    ← Back
                  </button>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-neon-blue">AI intelligence</p>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">{layer.name}</h3>
                    <p className="text-xs text-muted-foreground">{layer.crop}</p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <TelemetryRow label="Plant health" value={`${layer.health}%`} accent="text-success" />
                    <TelemetryRow label="Temperature" value={layer.temperature} accent="text-warning" />
                    <TelemetryRow label="Humidity" value={layer.humidity} accent="text-neon-aqua" />
                    <TelemetryRow label="pH" value={layer.ph} accent="text-neon-blue" />
                    <TelemetryRow label="EC level" value={layer.ec} accent="text-neon-aqua" />
                    <TelemetryRow label="Growth rate" value={layer.growthRate} accent="text-neon-green" />
                    <TelemetryRow label="Disease risk" value={layer.diseaseRisk} accent="text-warning" />
                    <TelemetryRow label="Yield prediction" value={layer.yieldPrediction} accent="text-success" />
                    <TelemetryRow label="Automation" value={layer.automation} accent="text-foreground" />
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(100, 150, 255, 0.15)",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "16px",
                    boxShadow: "0 4px 24px rgba(60, 80, 120, 0.12)",
                  }}
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neon-aqua">
                    <Zap className="h-4 w-4" />
                    AI narrative
                  </div>
                  <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                    {narrativeLines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(100, 150, 255, 0.15)",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "16px",
                    boxShadow: "0 4px 24px rgba(60, 80, 120, 0.12)",
                  }}
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neon-green">
                    <Leaf className="h-4 w-4" />
                    Automation controls
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <button className="rounded-xl border border-neon-green/30 bg-neon-green/10 px-3 py-2 text-neon-green">Nutrients</button>
                    <button className="rounded-xl border border-neon-aqua/30 bg-neon-aqua/10 px-3 py-2 text-neon-aqua">Mist cycle</button>
                    <button className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-warning">Cooling boost</button>
                    <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white/70">Manual mode</button>
                  </div>
                </div>
              </motion.aside>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function TelemetryRow({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/40 bg-white/70 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-semibold ${accent}`}>{value}</span>
    </div>
  )
}