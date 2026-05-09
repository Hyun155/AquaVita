import { PlantAIDashboard } from "@/components/plant-ai/PlantAIDashboard"

export default function PlantAiPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl border border-border/50 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Plant Intelligence</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">Disease, growth, and yield analysis</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Deep diagnostics for plant health, yield prediction, and layer-level performance.
        </p>
      </div>
      <PlantAIDashboard />
    </div>
  )
}