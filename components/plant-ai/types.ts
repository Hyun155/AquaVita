export type GrowthStage = "Seedling" | "Early Vegetative" | "Mature Vegetative" | "Harvest Ready"

// VERTICAL FARM LAYER MONITORING
export interface VerticalLayerMetrics {
  layerId: number
  layerName: string
  plantCount: number
  avgHealth: number
  avgTemperature: number
  avgHumidity: number
  avgLightIntensity: number
  airflowStatus: "optimal" | "low" | "high"
  riskLevel: "low" | "moderate" | "high" | "critical"
  riskFactors: string[]
  estimatedYield: number
  cropDensity: number
}

// ENHANCED PLANT HEALTH ANALYSIS
export interface HealthIndicators {
  overall: number
  leafColor: "vibrant" | "pale" | "yellowing" | "brown-spots"
  leafCondition: "pristine" | "good" | "stressed" | "severe"
  nitrogenStatus: number // 0-100
  nutrientBalance: number // 0-100
  hydrationLevel: number // 0-100
  stressSignals: string[]
}

export interface PlantTelemetry {
  id: string
  name: string
  layerId: number
  stage: GrowthStage
  health: number
  healthHistory: number[]
  healthIndicators: HealthIndicators
  ph: number
  temperature: number
  humidity: number
  lightIntensity: number
  ec: number // Electrical Conductivity (nutrient concentration)
  diseaseRiskScore: number // 0-100
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
  ledSpectrumNeeds?: Record<string, string>
  harvestReadyDays?: number
}

export type RecommendationSeverity = "critical" | "warning" | "info" | "optimization"
export type RecommendationType = "environmental" | "nutrient" | "disease-prevention" | "growth-optimization" | "harvest-preparation"

export interface PlantRecommendation {
  id: string
  plantId: string
  plantName: string
  layerId: number
  severity: RecommendationSeverity
  type: RecommendationType
  message: string
  action?: string
  estimatedImpact?: string
  confidence?: number
  automatable: boolean
}

// PREDICTIVE RISK ANALYSIS
export interface PredictiveRisk {
  riskType: "fungal-outbreak" | "overheating" | "nutrient-imbalance" | "water-stress" | "light-deficit" | "ph-drift"
  severity: "low" | "moderate" | "high" | "critical"
  probability: number // 0-100
  affectedPlants: string[]
  affectedLayer?: number
  estimatedHoursToImpact: number
  recommendedResponse: string
  automatedResponse?: string
}

// HARVEST OPTIMIZATION
export interface HarvestPrediction {
  plantId: string
  plantName: string
  currentGrowthRate: number // mm/day
  environmentalStability: number // 0-100
  nutrientConsistency: number // 0-100
  estimatedDaysToHarvest: number
  expectedYield: number
  confidenceLevel: number // 0-100
  yieldVariance: number // expected +/- percentage
  growthTrend: "accelerating" | "stable" | "slowing"
}

// DISEASE & HEALTH DETECTION
export interface DiseaseDetectionResult {
  diagnosis: "Leaf Spot Detected" | "Nitrogen Deficiency Likely" | "Healthy Plant" | "Fungal Infection Risk" | "Pest Infestation" | "Dehydration Stress"
  confidence: number
  healthScore: number
  detectionMethod: "ai-analysis" | "spectral-scan" | "manual"
}

export interface DiseaseAutoScanResult extends DiseaseDetectionResult {
  plantName: string
  layerId: number
  issue: "Downy Mildew" | "Nitrogen Deficiency" | "Spider Mites" | "Powdery Mildew" | "Wilting" | "Nutrient Lockout"
  automatedResponse: string
  source: "manual-upload" | "auto-scan"
  suggestedLayerAdjustments?: Record<string, string>
}

// RESOURCE EFFICIENCY
export interface ResourceEfficiency {
  waterSavings: number // liters
  energyReduction: number // kWh
  cropLossReduction: number // percentage
  nutrientEfficiency: number // 0-100
  yieldPrediction: number // kg or units
}
