import WaterDashboard from "@/components/environment/WaterDashboard"

/**
 * Water & Nutrient System Page
 * Consolidated monitoring for pH, EC, flow, and reservoir balance.
 */
export default function WaterSystemPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl border border-border/50 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Water & Nutrient System</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">Closed-loop system control</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Unified view of pH stability, EC balance, flow dynamics, and reservoir health.
        </p>
      </div>

      <div className="glass-card rounded-3xl border border-border/50 p-6">
        <WaterDashboard />
      </div>
    </div>
  )
}