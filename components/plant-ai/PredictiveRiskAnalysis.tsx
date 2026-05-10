"use client"

import { predictiveRisks } from "@/lib/verticalFarmData"
import { AlertCircle, AlertTriangle, Clock, Zap, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function PredictiveRiskAnalysis() {
  return (
    <div className="glass-card rounded-2xl border border-border/50 p-6 bg-gradient-to-br from-background/60 via-secondary/20 to-background/50">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-aqua" />
          Predictive Risk Analysis
        </h3>
        <p className="text-sm text-muted-foreground mt-1">AI-powered early warning system for vertical farm optimization</p>
      </div>

      {/* Risk Items */}
      <div className="space-y-3">
        {predictiveRisks.map((risk) => {
          const severityConfig = {
            critical: {
              icon: "🔴",
              badge: "bg-destructive/20 text-destructive border-destructive/30",
              border: "border-destructive/40",
              indicator: "bg-destructive",
            },
            high: {
              icon: "🟠",
              badge: "bg-warning/20 text-warning border-warning/30",
              border: "border-warning/40",
              indicator: "bg-warning",
            },
            moderate: {
              icon: "🟡",
              badge: "bg-neon-aqua/20 text-neon-aqua border-neon-aqua/30",
              border: "border-neon-aqua/40",
              indicator: "bg-neon-aqua",
            },
            low: {
              icon: "🟢",
              badge: "bg-success/20 text-success border-success/30",
              border: "border-success/40",
              indicator: "bg-success",
            },
          }

          const config = severityConfig[risk.severity]

          return (
            <div key={risk.riskType} className={`relative overflow-hidden rounded-xl border ${config.border} bg-white p-4 transition-all hover:shadow-md`}>
              {/* Severity Stripe */}
              <div className={`absolute left-0 top-0 h-full w-1 ${config.indicator}`} />

              <div className="relative pl-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{config.icon}</span>
                      <span className="font-semibold text-foreground capitalize">
                        {risk.riskType.replace("-", " ")}
                      </span>
                      <Badge className={`${config.badge} border text-xs`}>{risk.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{risk.estimatedHoursToImpact} hours until impact</p>
                  </div>

                  {/* Probability Badge */}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Probability</p>
                    <p className="text-2xl font-bold gradient-text">{risk.probability}%</p>
                  </div>
                </div>

                {/* Affected Area */}
                <div className="mb-3 space-y-2">
                  {risk.affectedLayer && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Affected Layer:</span> Layer {risk.affectedLayer}
                    </p>
                  )}
                  {risk.affectedPlants.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">At-Risk Plants:</span> {risk.affectedPlants.join(", ")}
                    </p>
                  )}
                </div>

                {/* Recommended Response */}
                <div className="mb-3 rounded-lg bg-white border border-border/40 p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">Recommended Response:</p>
                  <p className="text-sm text-muted-foreground">{risk.recommendedResponse}</p>
                </div>

                {/* Automated Response */}
                {risk.automatedResponse && (
                  <div className="flex items-start gap-2 rounded-lg bg-success/10 border border-success/30 p-3 mb-3">
                    <Zap className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-success mb-1">Auto-Response Queued:</p>
                      <p className="text-sm text-muted-foreground">{risk.automatedResponse}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/30">
                  <Clock className="w-3 h-3" />
                  <span>
                    <span className="font-medium text-warning">Action needed in {risk.estimatedHoursToImpact} hours</span> —
                    {risk.severity === "critical"
                      ? " IMMEDIATE INTERVENTION REQUIRED"
                      : risk.severity === "high"
                        ? " Urgent attention recommended"
                        : " Monitor closely"}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Risk Summary Footer */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/30">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">System Status</p>
          <p className="text-sm text-foreground">
            {predictiveRisks.filter((r) => r.severity === "critical").length} critical risks detected
          </p>
        </div>
        <Button variant="outline" size="sm" className="border-neon-aqua/40 text-neon-aqua hover:bg-neon-aqua/10">
          View Full Report
        </Button>
      </div>
    </div>
  )
}
