import type { VerticalLayerMetrics, PredictiveRisk, HarvestPrediction, ResourceEfficiency } from "@/components/plant-ai/types"

/**
 * VERTICAL FARM LAYER METRICS
 * Comprehensive layer-by-layer monitoring for stacked hydroponic/aquaponic systems
 */
export const verticalLayerMetrics: VerticalLayerMetrics[] = [
  {
    layerId: 1,
    layerName: "Foundation Layer",
    plantCount: 12,
    avgHealth: 94,
    avgTemperature: 24.2,
    avgHumidity: 65,
    avgLightIntensity: 380,
    airflowStatus: "optimal",
    riskLevel: "low",
    riskFactors: [],
    estimatedYield: 4.8,
    cropDensity: 0.95,
  },
  {
    layerId: 2,
    layerName: "Mid-Lower Layer",
    plantCount: 12,
    avgHealth: 87,
    avgTemperature: 25.1,
    avgHumidity: 72,
    avgLightIntensity: 340,
    airflowStatus: "optimal",
    riskLevel: "moderate",
    riskFactors: ["Elevated humidity - fungal risk", "LED intensity suboptimal"],
    estimatedYield: 4.2,
    cropDensity: 0.92,
  },
  {
    layerId: 3,
    layerName: "Middle Layer",
    plantCount: 14,
    avgHealth: 91,
    avgTemperature: 23.8,
    avgHumidity: 68,
    avgLightIntensity: 420,
    airflowStatus: "optimal",
    riskLevel: "low",
    riskFactors: [],
    estimatedYield: 5.2,
    cropDensity: 0.96,
  },
  {
    layerId: 4,
    layerName: "Mid-Upper Layer",
    plantCount: 12,
    avgHealth: 79,
    avgTemperature: 26.7,
    avgHumidity: 58,
    avgLightIntensity: 450,
    airflowStatus: "high",
    riskLevel: "high",
    riskFactors: ["High temperature stress", "Low humidity - dehydration risk", "Excessive airflow"],
    estimatedYield: 3.1,
    cropDensity: 0.88,
  },
  {
    layerId: 5,
    layerName: "Top Layer",
    plantCount: 11,
    avgHealth: 85,
    avgTemperature: 27.2,
    avgHumidity: 52,
    avgLightIntensity: 480,
    airflowStatus: "high",
    riskLevel: "moderate",
    riskFactors: ["High temperature - bolting risk", "Direct LED exposure causing stress"],
    estimatedYield: 3.7,
    cropDensity: 0.90,
  },
]

/**
 * PREDICTIVE RISK ANALYSIS
 * Early warning system for potential issues in vertical farm layers
 */
export const predictiveRisks: PredictiveRisk[] = [
  {
    riskType: "fungal-outbreak",
    severity: "high",
    probability: 78,
    affectedPlants: ["Lettuce A", "Spinach C", "Basil B"],
    affectedLayer: 2,
    estimatedHoursToImpact: 36,
    recommendedResponse: "Increase airflow circulation by 25% and activate UV sterilization cycle in Layer 2",
    automatedResponse: "Airflow increased to 2500 CFM. UV cycle scheduled for 2 AM.",
  },
  {
    riskType: "overheating",
    severity: "critical",
    probability: 92,
    affectedPlants: ["Mint D", "Kale E"],
    affectedLayer: 4,
    estimatedHoursToImpact: 4,
    recommendedResponse: "Activate emergency cooling system. Reduce LED intensity to 70%. Increase nutrient circulation.",
    automatedResponse: "Cooling activated. LED reduced to 350µmol. Nutrient pump increased to 8 L/min.",
  },
  {
    riskType: "nutrient-imbalance",
    severity: "moderate",
    probability: 65,
    affectedPlants: ["Basil B"],
    affectedLayer: 2,
    estimatedHoursToImpact: 18,
    recommendedResponse: "Reduce EC by 0.2 and adjust nitrogen ratio. Perform partial water change (20%).",
    automatedResponse: "EC adjusted to 1.4. N-ratio set to 18%. Partial water change initiated.",
  },
  {
    riskType: "ph-drift",
    severity: "high",
    probability: 71,
    affectedPlants: ["Spinach C", "Lettuce A"],
    affectedLayer: 3,
    estimatedHoursToImpact: 12,
    recommendedResponse: "Calibrate pH sensors. Add pH buffer (potassium hydroxide) gradually.",
    automatedResponse: "pH buffers queued. Automated calibration in progress.",
  },
  {
    riskType: "water-stress",
    severity: "moderate",
    probability: 58,
    affectedPlants: ["Mint D"],
    affectedLayer: 4,
    estimatedHoursToImpact: 24,
    recommendedResponse: "Reduce water temperature by 2°C. Increase humidity misters by 40%.",
    automatedResponse: "Chiller engaged. Humidity misters set to 8-minute intervals.",
  },
]

/**
 * HARVEST OPTIMIZATION PREDICTIONS
 * AI-driven harvest readiness and yield forecasting
 */
export const harvestPredictions: HarvestPrediction[] = [
  {
    plantId: "lettuce-a",
    plantName: "Lettuce A",
    currentGrowthRate: 2.4,
    environmentalStability: 92,
    nutrientConsistency: 88,
    estimatedDaysToHarvest: 5,
    expectedYield: 1.8,
    confidenceLevel: 94,
    yieldVariance: 8,
    growthTrend: "stable",
  },
  {
    plantId: "basil-b",
    plantName: "Basil B",
    currentGrowthRate: 1.9,
    environmentalStability: 78,
    nutrientConsistency: 82,
    estimatedDaysToHarvest: 8,
    expectedYield: 2.1,
    confidenceLevel: 87,
    yieldVariance: 12,
    growthTrend: "slowing",
  },
  {
    plantId: "spinach-c",
    plantName: "Spinach C",
    currentGrowthRate: 2.8,
    environmentalStability: 95,
    nutrientConsistency: 91,
    estimatedDaysToHarvest: 3,
    expectedYield: 2.4,
    confidenceLevel: 96,
    yieldVariance: 5,
    growthTrend: "accelerating",
  },
  {
    plantId: "mint-d",
    plantName: "Mint D",
    currentGrowthRate: 1.4,
    environmentalStability: 64,
    nutrientConsistency: 71,
    estimatedDaysToHarvest: 12,
    expectedYield: 1.6,
    confidenceLevel: 78,
    yieldVariance: 18,
    growthTrend: "slowing",
  },
  {
    plantId: "kale-e",
    plantName: "Kale E",
    currentGrowthRate: 2.2,
    environmentalStability: 88,
    nutrientConsistency: 85,
    estimatedDaysToHarvest: 6,
    expectedYield: 2.7,
    confidenceLevel: 91,
    yieldVariance: 9,
    growthTrend: "stable",
  },
]

/**
 * RESOURCE EFFICIENCY INSIGHTS
 * Track sustainability improvements from AI optimization
 */
export const resourceEfficiencyMetrics: ResourceEfficiency = {
  waterSavings: 2840, // liters saved this cycle
  energyReduction: 18.5, // kWh saved
  cropLossReduction: 34, // percentage improved
  nutrientEfficiency: 92, // 0-100 score
  yieldPrediction: 18.5, // kg expected yield
}

/**
 * LAYER-SPECIFIC HEALTH INDICATORS
 * Detailed breakdown of what's happening in each layer
 */
export const layerHealthBreakdown = [
  {
    layer: 1,
    name: "Foundation Layer",
    status: "Excellent",
    healthTrend: "↑ +2%",
    topIssue: "None",
    recommendation: "Maintain current settings",
    actionableItem: null,
  },
  {
    layer: 2,
    name: "Mid-Lower Layer",
    status: "Caution",
    healthTrend: "↓ -3%",
    topIssue: "Fungal outbreak risk (78% probability)",
    recommendation: "Increase airflow + UV cycle",
    actionableItem: "Layer 2: Activate preventive UV sterilization",
  },
  {
    layer: 3,
    name: "Middle Layer",
    status: "Optimal",
    healthTrend: "↑ +1%",
    topIssue: "pH drift detected",
    recommendation: "Adjust pH buffers incrementally",
    actionableItem: "Layer 3: Fine-tune pH to 6.2 range",
  },
  {
    layer: 4,
    name: "Mid-Upper Layer",
    status: "Alert",
    healthTrend: "↓ -5%",
    topIssue: "Heat stress + dehydration",
    recommendation: "Emergency cooling + humidity boost",
    actionableItem: "Layer 4: URGENT - Activate cooling system NOW",
  },
  {
    layer: 5,
    name: "Top Layer",
    status: "Caution",
    healthTrend: "↓ -2%",
    topIssue: "Excessive light + heat stress",
    recommendation: "Reduce LED intensity to 400µmol",
    actionableItem: "Layer 5: Dim LEDs by 15%",
  },
]

/**
 * AUTOMATED RECOMMENDATIONS ENGINE
 * Realistic, actionable recommendations for vertical farm optimization
 */
export const verticalFarmRecommendations = [
  {
    id: "rec-001",
    layer: 2,
    type: "disease-prevention",
    severity: "critical",
    title: "Fungal Outbreak Prevention",
    description: "Layer 2 humidity at 72% - optimal for fungal growth",
    action: "Increase airflow by 25% + activate UV cycle",
    estimatedImpact: "Reduce fungal risk from 78% to 12%",
    automatable: true,
  },
  {
    id: "rec-002",
    layer: 4,
    type: "environmental",
    severity: "critical",
    title: "Emergency Temperature Control",
    description: "Layer 4 temperature 26.7°C exceeds optimal 24°C by 2.7°C",
    action: "Engage chiller unit + reduce LED intensity to 70%",
    estimatedImpact: "Lower temperature to 23.5°C in 45 minutes",
    automatable: true,
  },
  {
    id: "rec-003",
    layer: 1,
    type: "growth-optimization",
    severity: "info",
    title: "Harvest Window Approaching",
    description: "Lettuce A reaching optimal harvest readiness",
    action: "Schedule harvest in 5 days when full maturity reached",
    estimatedImpact: "Maximize yield at 1.8 kg with 94% confidence",
    automatable: false,
  },
  {
    id: "rec-004",
    layer: 3,
    type: "nutrient",
    severity: "warning",
    title: "pH Buffer Adjustment",
    description: "pH drift from 6.2 to 6.45 detected over 6 hours",
    action: "Add 0.15L potassium hydroxide buffer solution",
    estimatedImpact: "Stabilize pH to 6.3 in 2 hours",
    automatable: true,
  },
  {
    id: "rec-005",
    layer: 4,
    type: "environmental",
    severity: "warning",
    title: "Humidity Deficit Management",
    description: "Layer 4 humidity dropped to 58% (below 65% optimal)",
    action: "Activate humidification misters - 8 minute intervals",
    estimatedImpact: "Raise humidity to 68% in 30 minutes",
    automatable: true,
  },
]

/**
 * DISEASE & STRESS INDICATORS BY PLANT
 * Visual indicators for quick diagnostics
 */
export const plantHealthIndicators = {
  "lettuce-a": {
    leafColor: "vibrant" as const,
    leafCondition: "pristine" as const,
    nitrogenStatus: 92,
    hydrationLevel: 95,
    stressSignals: [] as string[],
  },
  "basil-b": {
    leafColor: "pale" as const,
    leafCondition: "stressed" as const,
    nitrogenStatus: 74,
    hydrationLevel: 81,
    stressSignals: ["Slow growth rate", "Nutrient deficiency possible"],
  },
  "spinach-c": {
    leafColor: "vibrant" as const,
    leafCondition: "good" as const,
    nitrogenStatus: 88,
    hydrationLevel: 92,
    stressSignals: [] as string[],
  },
  "mint-d": {
    leafColor: "yellowing" as const,
    leafCondition: "stressed" as const,
    nitrogenStatus: 62,
    hydrationLevel: 68,
    stressSignals: ["Heat stress visible", "Leaves drooping", "Wilting risk high"],
  },
  "kale-e": {
    leafColor: "vibrant" as const,
    leafCondition: "good" as const,
    nitrogenStatus: 85,
    hydrationLevel: 88,
    stressSignals: [] as string[],
  },
}
