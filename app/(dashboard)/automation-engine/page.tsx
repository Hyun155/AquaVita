"use client"

import { useState } from "react"
import { Droplets, Fan, Lightbulb, ShieldAlert, Zap } from "lucide-react"
import { SystemToggle } from "@/components/environment/SystemToggle"

export default function AutomationEnginePage() {
  const [isAutoMode, setIsAutoMode] = useState(true)
  const [irrigationActive, setIrrigationActive] = useState(true)
  const [lightingActive, setLightingActive] = useState(true)
  const [uvActive, setUvActive] = useState(false)
  const [airflowActive, setAirflowActive] = useState(true)
  const [emergencyActive, setEmergencyActive] = useState(false)

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl border border-border/50 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Automation Engine</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">Decision-driven control logic</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Translate AI decisions into automated actions across irrigation, lighting, airflow, and sterilization.
        </p>
      </div>

      <div className="glass-card rounded-3xl border border-border/50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Automation state</p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {isAutoMode ? "AI control engaged" : "Manual override"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isAutoMode
                ? "Actions follow the Sensors → AI Analysis → Decision → Automation flow."
                : "Manual overrides pause AI control and automation rules."}
            </p>
          </div>
          <button
            onClick={() => setIsAutoMode((prev) => !prev)}
            className="rounded-2xl border border-neon-aqua/40 bg-neon-aqua/10 px-4 py-2 text-sm font-semibold text-neon-aqua"
          >
            {isAutoMode ? "Switch to Manual" : "Return to AI Auto"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card rounded-3xl border border-border/50 p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            <Zap className="h-4 w-4 text-neon-blue" />
            Active automation rules
          </div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>AI detects humidity spikes and pre-emptively boosts airflow.</li>
            <li>UV sterilization triggers if algae risk exceeds 18%.</li>
            <li>Lighting cycles adapt to growth stage and energy optimization.</li>
          </ul>
        </div>

        <div className="glass-card rounded-3xl border border-border/50 p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            <ShieldAlert className="h-4 w-4 text-warning" />
            Decision reasoning
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Layer 4 humidity trends indicate fungal risk within 3 hours. AI recommends early airflow
            adjustment and UV sterilization to preserve yield targets.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SystemToggle
          label="Irrigation Rules"
          isActive={irrigationActive}
          isAutoMode={isAutoMode}
          icon={Droplets}
          onClick={() => setIrrigationActive((prev) => !prev)}
        />
        <SystemToggle
          label="Lighting Automation"
          isActive={lightingActive}
          isAutoMode={isAutoMode}
          icon={Lightbulb}
          onClick={() => setLightingActive((prev) => !prev)}
        />
        <SystemToggle
          label="UV Sterilization"
          isActive={uvActive}
          isAutoMode={isAutoMode}
          icon={ShieldAlert}
          onClick={() => setUvActive((prev) => !prev)}
        />
        <SystemToggle
          label="Airflow Control"
          isActive={airflowActive}
          isAutoMode={isAutoMode}
          icon={Fan}
          onClick={() => setAirflowActive((prev) => !prev)}
        />
        <SystemToggle
          label="Emergency Override"
          isActive={emergencyActive}
          isAutoMode={isAutoMode}
          icon={Zap}
          onClick={() => setEmergencyActive((prev) => !prev)}
        />
      </div>
    </div>
  )
}
