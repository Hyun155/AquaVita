export type GrowthStage = "Seedling" | "Vegetative" | "Mature" | "Harvest Ready"

export interface PlantTelemetry {
  id: string
  name: string
  stage: GrowthStage
  health: number
  ph: number
  temperature: number
}

export interface PlantProfile {
  displayName: string
  scientificName: string
  growthSpeed: string
  idealFor?: string
  leafTypeOrStructure?: string
  optimalPh: string
  optimalTemperature: string
  optimalHumidity?: string
  sensitivities: string[]
  commonIssues: string[]
  simulationBehavior: string[]
}

export type RecommendationSeverity = "critical" | "warning" | "info"

export interface PlantRecommendation {
  id: string
  plantId: string
  plantName: string
  severity: RecommendationSeverity
  message: string
}

export interface DiseaseDetectionResult {
  diagnosis: "Leaf Spot Detected" | "Nitrogen Deficiency Likely" | "Healthy Plant"
  confidence: number
  healthScore: number
}

export interface DiseaseAutoScanResult extends DiseaseDetectionResult {
  plantName: string
  issue: "Downy Mildew" | "Nitrogen Deficiency" | "Spider Mites"
  automatedResponse: string
  source: "manual-upload" | "auto-scan"
}
