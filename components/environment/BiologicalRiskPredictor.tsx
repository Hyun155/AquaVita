"use client"

import { AlertTriangle, Bug } from "lucide-react"

interface BiologicalRiskPredictorProps {
  temperature: number
  ec: number
}

export function BiologicalRiskPredictor({ temperature, ec }: BiologicalRiskPredictorProps) {
  // Calculate risks based on temperature and EC levels
  const algaeBloomProbability = Math.min(100, Math.max(0,
    (temperature - 20) * 3 + (ec - 1.5) * 20
  ))

  const bacterialRisk = Math.min(100, Math.max(0,
    (temperature - 22) * 2 + (ec - 1.8) * 15
  ))

  const getRiskColor = (value: number) => {
    if (value < 30) return "text-green-500"
    if (value < 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getRiskLevel = (value: number) => {
    if (value < 30) return "Low"
    if (value < 70) return "Medium"
    return "High"
  }

  return (
    <div className="rounded-3xl border border-border/50 p-6 bg-white">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Biological Risk Predictor</p>
        <h2 className="mt-2 text-lg font-semibold text-foreground">Contamination analysis</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`h-5 w-5 ${getRiskColor(algaeBloomProbability)}`} />
            <div>
              <p className="font-medium">Algae Bloom Probability</p>
              <p className="text-sm text-muted-foreground">Based on temperature and EC levels</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${getRiskColor(algaeBloomProbability)}`}>
              {algaeBloomProbability.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">{getRiskLevel(algaeBloomProbability)} Risk</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-3">
            <Bug className={`h-5 w-5 ${getRiskColor(bacterialRisk)}`} />
            <div>
              <p className="font-medium">Bacterial Risk</p>
              <p className="text-sm text-muted-foreground">Pathogen growth potential</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${getRiskColor(bacterialRisk)}`}>
              {bacterialRisk.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">{getRiskLevel(bacterialRisk)} Risk</p>
          </div>
        </div>
      </div>
    </div>
  )
}