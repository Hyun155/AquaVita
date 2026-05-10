"use client"

import { useEffect, useMemo, useState } from "react"
import { PlantCard } from "@/components/plant-ai/PlantCard"
import { RecommendationCard } from "@/components/plant-ai/RecommendationCard"
import { DiseaseDetectionPanel } from "@/components/plant-ai/DiseaseDetectionPanel"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { GrowthStage, PlantProfile, PlantRecommendation, PlantTelemetry } from "@/components/plant-ai/types"
import { automationController, type AutomationAction } from "@/lib/automationController"
import Image from "next/image"
import { ShieldAlert, Activity, Cpu, Clock3, Droplets, Zap, Bot, Leaf, Thermometer, SunMedium, Gauge, MapPinned, Sparkles, AlertCircle } from "lucide-react"

const HEALTH_HISTORY_LIMIT = 24

function createInitialHealthHistory(health: number) {
  return Array.from({ length: HEALTH_HISTORY_LIMIT }, (_, index) => {
    const progression = index / Math.max(HEALTH_HISTORY_LIMIT - 1, 1)
    const wave = Math.sin(index / 3.2) * 0.8
    return Number(clamp(health - (1 - progression) * 1.8 + wave, 0, 100).toFixed(0))
  })
}

function appendHealthHistory(history: number[], value: number) {
  const nextHistory = [...history, Number(value.toFixed(0))]
  return nextHistory.length > HEALTH_HISTORY_LIMIT ? nextHistory.slice(nextHistory.length - HEALTH_HISTORY_LIMIT) : nextHistory
}

const initialPlants: PlantTelemetry[] = [
  {
    id: "lettuce-a",
    name: "Lettuce A",
    layerId: 1,
    stage: "Seedling",
    health: 93,
    healthHistory: createInitialHealthHistory(93),
    healthIndicators: {
      overall: 93,
      leafColor: "vibrant",
      leafCondition: "pristine",
      nitrogenStatus: 92,
      nutrientBalance: 88,
      hydrationLevel: 95,
      stressSignals: [],
    },
    ph: 6.3,
    temperature: 24.5,
    humidity: 65,
    lightIntensity: 380,
    ec: 1.6,
    diseaseRiskScore: 5,
  },
  {
    id: "basil-b",
    name: "Basil B",
    layerId: 2,
    stage: "Early Vegetative",
    health: 88,
    healthHistory: createInitialHealthHistory(88),
    healthIndicators: {
      overall: 88,
      leafColor: "pale",
      leafCondition: "stressed",
      nitrogenStatus: 74,
      nutrientBalance: 82,
      hydrationLevel: 81,
      stressSignals: ["Slow growth rate", "Nutrient deficiency possible"],
    },
    ph: 6.7,
    temperature: 25.1,
    humidity: 72,
    lightIntensity: 340,
    ec: 1.5,
    diseaseRiskScore: 12,
  },
  {
    id: "spinach-c",
    name: "Spinach C",
    layerId: 3,
    stage: "Mature Vegetative",
    health: 79,
    healthHistory: createInitialHealthHistory(79),
    healthIndicators: {
      overall: 79,
      leafColor: "vibrant",
      leafCondition: "good",
      nitrogenStatus: 88,
      nutrientBalance: 91,
      hydrationLevel: 92,
      stressSignals: [],
    },
    ph: 6.0,
    temperature: 27.3,
    humidity: 68,
    lightIntensity: 420,
    ec: 1.7,
    diseaseRiskScore: 8,
  },
  {
    id: "mint-d",
    name: "Mint D",
    layerId: 4,
    stage: "Early Vegetative",
    health: 74,
    healthHistory: createInitialHealthHistory(74),
    healthIndicators: {
      overall: 74,
      leafColor: "yellowing",
      leafCondition: "stressed",
      nitrogenStatus: 62,
      nutrientBalance: 71,
      hydrationLevel: 68,
      stressSignals: ["Heat stress visible", "Leaves drooping", "Wilting risk high"],
    },
    ph: 7.1,
    temperature: 26.6,
    humidity: 58,
    lightIntensity: 450,
    ec: 1.4,
    diseaseRiskScore: 22,
  },
  {
    id: "kale-e",
    name: "Kale E",
    layerId: 5,
    stage: "Harvest Ready",
    health: 86,
    healthHistory: createInitialHealthHistory(86),
    healthIndicators: {
      overall: 86,
      leafColor: "vibrant",
      leafCondition: "good",
      nitrogenStatus: 85,
      nutrientBalance: 85,
      hydrationLevel: 88,
      stressSignals: [],
    },
    ph: 6.5,
    temperature: 23.9,
    humidity: 52,
    lightIntensity: 480,
    ec: 1.6,
    diseaseRiskScore: 6,
  },
]

const plantProfiles: Record<string, PlantProfile> = {
  "spinach-c": {
    displayName: "Spinach",
    scientificName: "Spinacia oleracea",
    growthSpeed: "Fast to moderate",
    idealFor: "Cool environments",
    leafTypeOrStructure: "Thin and soft leaves",
    optimalPh: "6.0 to 6.8",
    optimalTemperature: "18 to 24C",
    optimalHumidity: "60 to 70%",
    ledSpectrumNeeds: {
      seedling: "Balanced 400-700nm (300-400µmol)",
      vegetative: "More blue spectrum 400-500nm (400-500µmol)",
      mature: "Blue-red mix for density (500-600µmol)",
    },
    harvestReadyDays: 28,
    sensitivities: [
      "Very sensitive to pH imbalance",
      "Sensitive to heat and bolts easily",
      "Moderate nutrient sensitivity",
    ],
    commonIssues: [
      "Yellowing leaves from nitrogen deficiency",
      "Burnt edges from high EC or nutrient stress",
      "Rapid decline when pH is below 6.0",
    ],
    simulationBehavior: [
      "Health drops fast when pH is below 6.0 or above 7.0",
      "Health drops moderately when temperature is above 26C",
    ],
  },
  "lettuce-a": {
    displayName: "Lettuce",
    scientificName: "Lactuca sativa",
    growthSpeed: "Fast",
    idealFor: "Most common hydroponic crop with predictable behavior",
    optimalPh: "5.8 to 6.5",
    optimalTemperature: "18 to 26C",
    optimalHumidity: "50 to 70%",
    ledSpectrumNeeds: {
      seedling: "Red-blue mix (250-350µmol)",
      vegetative: "More red spectrum 600-700nm (350-450µmol)",
      mature: "Balanced full spectrum (450-550µmol)",
    },
    harvestReadyDays: 35,
    sensitivities: [
      "Sensitive to high temperature",
      "Mild pH sensitivity",
      "Nutrient tolerant",
    ],
    commonIssues: [
      "Tip burn from calcium imbalance",
      "Bitter taste from heat stress",
    ],
    simulationBehavior: [
      "Health drops strongly when temperature is above 28C",
      "Mild health effect from pH fluctuation",
    ],
  },
  "basil-b": {
    displayName: "Basil",
    scientificName: "Ocimum basilicum",
    growthSpeed: "Fast",
    idealFor: "Controlled systems",
    leafTypeOrStructure: "Resilient structure",
    optimalPh: "5.5 to 6.5",
    optimalTemperature: "22 to 30C",
    optimalHumidity: "50 to 70%",
    ledSpectrumNeeds: {
      seedling: "Warm spectrum (350-400µmol)",
      vegetative: "Full spectrum for leaf density (450-550µmol)",
      mature: "Increased red for oil production (500-650µmol)",
    },
    harvestReadyDays: 42,
    sensitivities: [
      "Very tolerant overall",
      "Slight sensitivity to nutrient deficiency",
    ],
    commonIssues: [
      "Pale leaves from nitrogen deficiency",
      "Slow growth from nutrient imbalance",
    ],
    simulationBehavior: [
      "Health drops slowly",
      "Recovers quickly after corrective actions",
    ],
  },
  "kale-e": {
    displayName: "Kale",
    scientificName: "Brassica oleracea",
    growthSpeed: "Moderate",
    idealFor: "Hardy hydroponic crop",
    leafTypeOrStructure: "Thick leaves with better resistance",
    optimalPh: "5.5 to 6.5",
    optimalTemperature: "18 to 25C",
    sensitivities: [
      "Generally resistant",
      "Slight sensitivity to nutrient imbalance",
    ],
    commonIssues: [
      "Yellow leaves from nitrogen deficiency",
      "Stunted growth from poor nutrient delivery",
    ],
    simulationBehavior: [
      "Health declines slowly",
      "Maintains stable behavior under stress",
    ],
  },
  "mint-d": {
    displayName: "Mint",
    scientificName: "Mentha spp.",
    growthSpeed: "Very fast",
    idealFor: "Aggressive spread and quick biomass",
    leafTypeOrStructure: "Appears strong but can collapse quickly under stress",
    optimalPh: "6.0 to 7.0",
    optimalTemperature: "20 to 28C",
    sensitivities: [
      "Highly sensitive to disease and pest attacks",
      "Moderate pH sensitivity",
      "Possible heat stress",
    ],
    commonIssues: [
      "Spider mites are common",
      "Leaf spot outbreaks",
      "Rapid decline under combined stress",
    ],
    simulationBehavior: [
      "Health can drop suddenly",
      "Suitable as a critical demo plant",
    ],
  },
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function stageRange(stage: GrowthStage): [number, number] {
  switch (stage) {
    case "Seedling":
      return [20, 30]
    case "Early Vegetative":
      return [12, 18]
    case "Mature Vegetative":
      return [5, 12]
    case "Harvest Ready":
      return [1, 3]
    default:
      return [10, 20]
  }
}

function calculateDaysToHarvest(plant: PlantTelemetry) {
  const [minDays, maxDays] = stageRange(plant.stage)
  // Lower health pushes the estimate toward the slower end of each stage range.
  const healthFactor = (100 - plant.health) / 100
  let estimate = Math.round(minDays + (maxDays - minDays) * healthFactor)

  // High-health plants mature slightly faster.
  if (plant.health > 85) {
    estimate -= 2
  }

  return clamp(estimate, 1, 30)
}

function getHealthTrend(plant: PlantTelemetry) {
  const history = plant.healthHistory

  if (history.length < 2) {
    return { delta: 0, label: "Stable" as const }
  }

  const delta = history[history.length - 1] - history[0]

  if (delta > 1) {
    return { delta, label: "Improving" as const }
  }

  if (delta < -1) {
    return { delta, label: "Declining" as const }
  }

  return { delta, label: "Stable" as const }
}

function getHarvestPriority(plant: PlantTelemetry) {
  const trend = getHealthTrend(plant)
  const daysToHarvest = calculateDaysToHarvest(plant)
  return plant.health + trend.delta * 2 - daysToHarvest * 1.5
}

function getPlantStatusSummary(plant: PlantTelemetry) {
  const healthPenalty = 100 - plant.health
  const pHDeviation = Math.abs(plant.ph - 6.5)
  const pHPenalty = Math.round(pHDeviation * 18)
  const riskScore = Math.round(healthPenalty + pHPenalty)

  let statusLabel: "Healthy" | "Watch" | "Critical" = "Healthy"
  if (plant.health < 50 || riskScore >= 80) {
    statusLabel = "Critical"
  } else if (plant.health < 75 || riskScore >= 40) {
    statusLabel = "Watch"
  }

  let riskLabel: "Low" | "Moderate" | "High" | "Critical" = "Low"
  if (riskScore >= 80) riskLabel = "Critical"
  else if (riskScore >= 50) riskLabel = "High"
  else if (riskScore >= 30) riskLabel = "Moderate"

  return {
    statusLabel,
    riskLabel,
    riskScore,
    trend: getHealthTrend(plant),
    daysToHarvest: calculateDaysToHarvest(plant),
  }
}

const plantMarkerPositions: Record<string, { left: string; top: string }> = {
  "lettuce-a": { left: "16%", top: "28%" },
  "basil-b": { left: "83%", top: "28%" },
  "spinach-c": { left: "50%", top: "36%" },
  "kale-e": { left: "22%", top: "72%" },
  "mint-d": { left: "78%", top: "72%" },
}

function calculateResourceEfficiency(plants: PlantTelemetry[], actionLog: AutomationAction[]) {
  // Baseline consumption: typical hydroponic system without AI optimization
  const BASELINE_WATER_L_PER_WEEK = 100
  const BASELINE_ENERGY_KWH_PER_WEEK = 150
  const BASELINE_COST_USD_PER_WEEK = 35

  // Measure optimization via intervention frequency
  // Fewer interventions = better predictions = less corrective resource waste
  // More successful interventions = better system tuning = lower baseline corrections needed
  
  // Count actionLog frequency to estimate efficiency gains
  // Each preventive intervention saves ~8-12% resource waste from reactive corrections
  const interventionCount = Math.max(1, actionLog.length)
  const preventiveEfficiencyBonus = Math.min(18, interventionCount * 1.2) // Cap at 18% from preventive actions
  
  // Calculate success rate proxy: stable plants use less corrective energy
  const avgHealth = plants.reduce((sum, p) => sum + p.health, 0) / plants.length
  const stabilityBonus = Math.max(0, (avgHealth - 70) / 30) * 10 // 0-10% from health stability
  
  // Count plants in optimal ranges for additional efficiency
  const optimalPlantCount = plants.filter(p => {
    const phOptimal = p.ph >= 6.0 && p.ph <= 7.0
    const tempOptimal = p.temperature >= 22 && p.temperature <= 26
    const healthOptimal = p.health >= 75
    return phOptimal && tempOptimal && healthOptimal
  }).length
  const rangeBonus = (optimalPlantCount / plants.length) * 8 // 0-8% from range adherence
  
  const totalEfficiencySavings = Math.round(preventiveEfficiencyBonus + stabilityBonus + rangeBonus)
  
  return {
    waterSavingsPercent: Math.min(30, totalEfficiencySavings),
    energySavingsPercent: Math.min(30, totalEfficiencySavings),
    waterSavingsL: Math.round((BASELINE_WATER_L_PER_WEEK * totalEfficiencySavings) / 100),
    energySavingsKwh: Math.round((BASELINE_ENERGY_KWH_PER_WEEK * totalEfficiencySavings) / 100),
    costSavingsUSD: Math.round((BASELINE_COST_USD_PER_WEEK * totalEfficiencySavings) / 100),
    preventiveEfficiencyBonus,
    stabilityBonus,
    rangeBonus,
  }
}

function buildAdaptiveInsight(plants: PlantTelemetry[], interventions: PlantAIDashboardIntervention[], actionLog: AutomationAction[]) {
  const resolvedInterventions = interventions.filter((item) => item.status === "resolved")
  const successfulInterventions = resolvedInterventions.filter((item) => item.success)
  const successRate = resolvedInterventions.length > 0 ? Math.round((successfulInterventions.length / resolvedInterventions.length) * 100) : 100

  const metricCounts = actionLog.reduce(
    (counts, action) => ({
      ...counts,
      [action.metric]: (counts[action.metric as string] ?? 0) + 1,
    }),
    {} as Record<string, number>,
  )

  const dominantMetric = metricCounts.pH >= metricCounts.temperature ? "pH" : "temperature"
  const repeatedFailures = resolvedInterventions.length - successfulInterventions.length
  const openInterventions = interventions.filter((item) => item.status === "in-progress").length
  const trendingPlant = [...plants].sort((a, b) => getHarvestPriority(b) - getHarvestPriority(a))[0]

  const failureSummary =
    successRate === 0
      ? dominantMetric === "pH"
        ? "Repeated pH corrections are not holding. The buffer dose is likely too small or the correction interval is too slow."
        : "Repeated temperature corrections are not lowering the canopy temperature fast enough. The airflow or cooling protocol needs a stronger response."
      : successRate < 50
        ? dominantMetric === "pH"
          ? "pH is the dominant failure mode. Corrections should be slightly stronger and applied in smaller, more frequent steps."
          : "Temperature is the dominant failure mode. Increase airflow duty cycle and shorten the cooling recovery interval."
        : "Interventions are converging. Keep the correction strength, but keep an eye on the most volatile metric."

  const nutrientProtocol =
    dominantMetric === "pH"
      ? successRate === 0
        ? "Increase alkaline buffer concentration by 10-15% and reduce oscillation with smaller follow-up doses."
        : "Tune buffer dosing upward slightly and keep nutrient mixture changes incremental to avoid rebound drift."
      : "Maintain a balanced nutrient mix, but verify EC after every recovery step to avoid nutrient stress masking the real issue."

  const climateProtocol =
    dominantMetric === "temperature"
      ? successRate === 0
        ? "Raise airflow duty cycle, pre-cool the chamber earlier, and use gentler cooling steps to prevent overshoot."
        : "Add earlier ventilation triggers and shorten the response window before canopy heat spikes."
      : "Keep airflow stable while pH is corrected, then recheck temperature so the nutrient fix is not fighting heat stress."

  const harvestStrategy = trendingPlant
    ? (() => {
        const trend = getHealthTrend(trendingPlant)
        const daysToHarvest = calculateDaysToHarvest(trendingPlant)

        if (trend.label === "Improving" && trendingPlant.health >= 85) {
          return `${trendingPlant.name} is trending upward. Prepare for harvest in about ${Math.max(1, daysToHarvest - 1)} days while momentum stays positive.`
        }

        if (trend.label === "Declining") {
          return `${trendingPlant.name} is slipping. Delay harvest by ${Math.min(3, Math.max(1, daysToHarvest + 1))} days and stabilize the canopy first.`
        }

        return `${trendingPlant.name} is stable. Target harvest in ${daysToHarvest} days once the trend holds for another cycle.`
      })()
    : "No harvest guidance available yet."

  const harvestCandidates = [...plants]
    .map((plant) => {
      const trend = getHealthTrend(plant)
      const daysToHarvest = calculateDaysToHarvest(plant)

      return {
        plant,
        trend,
        daysToHarvest,
        score: getHarvestPriority(plant),
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const efficiency = calculateResourceEfficiency(plants, actionLog)

  return {
    successRate,
    repeatedFailures,
    openInterventions,
    dominantMetric,
    failureSummary,
    nutrientProtocol,
    climateProtocol,
    harvestStrategy,
    harvestCandidates,
    efficiency,
  }
}

type PlantAIDashboardIntervention = {
  id: string
  plantId: string
  message: string
  timestamp: string
  status: "in-progress" | "resolved"
  success?: boolean
}

function buildRecommendations(plants: PlantTelemetry[]) {
  const recommendations: PlantRecommendation[] = []

  // Rule-based recommendation engine that mimics AI guidance from sensor thresholds.
  plants.forEach((plant) => {
    if (plant.ph < 6.0) {
      recommendations.push({
        id: `${plant.id}-ph-low`,
        plantId: plant.id,
        plantName: plant.name,
        severity: "warning",
        message: `pH is ${plant.ph.toFixed(2)}. Add alkaline buffer to stabilize nutrient uptake.`,
        action: "Add alkaline buffer",
        estimatedImpact: "2-6 hrs",
        confidence: 72,
        automatable: true,
        layerId: plant.layerId,
        type: "nutrient",
      })
    }

    if (plant.ph > 7.2) {
      recommendations.push({
        id: `${plant.id}-ph-high`,
        plantId: plant.id,
        plantName: plant.name,
        severity: "warning",
        message: `pH is ${plant.ph.toFixed(2)}. Add acidic solution to restore target pH range.`,
        action: "Add acidic solution",
        estimatedImpact: "2-6 hrs",
        confidence: 70,
        automatable: true,
        layerId: plant.layerId,
        type: "nutrient",
      })
    }

    if (plant.health < 70) {
      recommendations.push({
        id: `${plant.id}-health-low`,
        plantId: plant.id,
        plantName: plant.name,
        severity: "critical",
        message: `Health dropped to ${Math.round(plant.health)}%. Increase nitrogen nutrients immediately.`,
        action: "Increase nitrogen dosing",
        estimatedImpact: "6-24 hrs",
        confidence: 86,
        automatable: false,
        layerId: plant.layerId,
        type: "nutrient",
      })
    }

    if (plant.temperature > 28) {
      recommendations.push({
        id: `${plant.id}-temp-high`,
        plantId: plant.id,
        plantName: plant.name,
        severity: "critical",
        message: `Temperature is ${plant.temperature.toFixed(1)}°C. Cool system and increase airflow.`,
        action: "Increase airflow / cooling",
        estimatedImpact: "1-4 hrs",
        confidence: 88,
        automatable: true,
        layerId: plant.layerId,
        type: "environmental",
      })
    }
  })

  if (recommendations.length === 0) {
    recommendations.push({
      id: "stable-system",
      plantId: "all",
      plantName: "All Plants",
      severity: "info",
      message: "All monitored plants are within healthy AI thresholds.",
      action: "No action required",
      estimatedImpact: "—",
      confidence: 55,
      automatable: false,
      layerId: 0,
      type: "nutrient",
    })
  }

  const severityRank = { critical: 0, warning: 1, info: 2, optimization: 3 }
  return recommendations.sort((a, b) => (severityRank[a.severity] ?? 4) - (severityRank[b.severity] ?? 4))
}

export function PlantAIDashboard() {
  const [plants, setPlants] = useState<PlantTelemetry[]>(initialPlants)
  const [selectedPlantId, setSelectedPlantId] = useState<string>(initialPlants[0]?.id ?? "lettuce-a")
  const [stressMode, setStressMode] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [actionLog, setActionLog] = useState<AutomationAction[]>([
    {
      id: "action-1",
      plantId: "lettuce-a",
      plantName: "Lettuce A",
      metric: "pH",
      message: "Automated pH stabilization successful for Basil B; high pH 7.40 was corrected.",
      timestamp: "2:13:39 AM",
    },
    {
      id: "action-2",
      plantId: "basil-b",
      plantName: "Basil B",
      metric: "TEMPERATURE",
      message: "Predicted heat stress in Basil B; automated airflow reduced canopy temperature.",
      timestamp: "2:13:39 AM",
    },
    {
      id: "action-3",
      plantId: "spinach-c",
      plantName: "Spinach C",
      metric: "NUTRIENTS",
      message: "Nitrogen dosing adjusted for Kale E based on growth rate anomaly.",
      timestamp: "2:12:41 AM",
    },
    {
      id: "action-4",
      plantId: "mint-d",
      plantName: "Layer 4",
      metric: "CLIMATE",
      message: "Ventilation increased by 18% due to rising humidity in Layer 4.",
      timestamp: "2:12:41 AM",
    },
    {
      id: "action-5",
      plantId: "kale-e",
      plantName: "Mint D",
      metric: "LIGHT",
      message: "LED intensity optimized for Mint D based on PAR levels.",
      timestamp: "2:12:40 AM",
    },
    {
      id: "action-6",
      plantId: "lettuce-a",
      plantName: "System",
      metric: "SYSTEM",
      message: "System self-check completed. All parameters within optimal range.",
      timestamp: "2:13:39 AM",
    },
  ])
  const [recoveryState, setRecoveryState] = useState<Record<string, { progress: number; active: boolean }>>({})
  const [interventions, setInterventions] = useState<
    PlantAIDashboardIntervention[]
  >([])
  const [actionLogFilter, setActionLogFilter] = useState<"all" | "environment" | "nutrients" | "climate" | "system">("all")

  const getActionIcon = (metric: string) => {
    const metricLower = metric.toLowerCase()
    if (metricLower.includes("ph") || metricLower.includes("nutrient")) return "nutrients"
    if (metricLower.includes("temp") || metricLower.includes("humidity") || metricLower.includes("climate") || metricLower.includes("ventilation")) return "environment"
    if (metricLower.includes("light") || metricLower.includes("led")) return "light"
    if (metricLower.includes("health") || metricLower.includes("system")) return "system"
    return "all"
  }

  const getActionBgColor = (metric: string) => {
    const type = getActionIcon(metric)
    switch(type) {
      case "nutrients": return "bg-emerald-100"
      case "environment": return "bg-red-100"
      case "light": return "bg-purple-100"
      case "system": return "bg-cyan-100"
      default: return "bg-slate-100"
    }
  }

  const getActionIconColor = (metric: string) => {
    const type = getActionIcon(metric)
    switch(type) {
      case "nutrients": return "text-emerald-600"
      case "environment": return "text-red-600"
      case "light": return "text-purple-600"
      case "system": return "text-cyan-600"
      default: return "text-slate-600"
    }
  }

  const getMetricCategory = (metric: string) => {
    const metricLower = metric.toLowerCase()
    if (metricLower.includes("ph") || metricLower.includes("nutrient")) return "nutrients"
    if (metricLower.includes("temp") || metricLower.includes("humidity") || metricLower.includes("climate") || metricLower.includes("ventilation")) return "environment"
    if (metricLower.includes("light") || metricLower.includes("led")) return "climate"
    if (metricLower.includes("health") || metricLower.includes("system")) return "system"
    return "all"
  }

  const getMetricBadgeColor = (category: string) => {
    switch(category) {
      case "nutrients": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "environment": return "bg-red-100 text-red-700 border-red-200"
      case "climate": return "bg-purple-100 text-purple-700 border-purple-200"
      case "system": return "bg-cyan-100 text-cyan-700 border-cyan-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const filteredActionLog = actionLogFilter === "all" ? actionLog : actionLog.filter(action => getMetricCategory(action.metric) === actionLogFilter)

  useEffect(() => {
    const interval = window.setInterval(() => {
      // Simulate live telemetry drift while keeping values inside realistic hydroponic ranges.
      setPlants((prevPlants) => {
        const nextPlants = prevPlants.map((plant) => {
          const recovering = recoveryState[plant.id]?.active

          if (recovering) {
            // Recovery mode: actively heal plant and nudge pH toward optimal (6.5)
            const phDelta = (6.5 - plant.ph) * 0.35
            const nextPh = clamp(plant.ph + phDelta, 5.5, 7.5)
            const nextTemperature = clamp(plant.temperature + randomBetween(-0.4, 0.2), 20, 30)
            const nextHealth = clamp(plant.health + randomBetween(6, 12), 0, 100)
            const roundedHealth = Number(nextHealth.toFixed(0))

            return {
              ...plant,
              ph: Number(nextPh.toFixed(2)),
              temperature: Number(nextTemperature.toFixed(1)),
              health: roundedHealth,
              healthHistory: appendHealthHistory(plant.healthHistory, roundedHealth),
            }
          }

          // Normal simulation drift; stress mode amplifies degradation
          const nextPh = clamp(plant.ph + randomBetween(-0.2, 0.2), 5.5, 7.5)
          const nextTemperature = clamp(plant.temperature + randomBetween(-0.8, 0.8), 20, 30)
          const healthDelta = randomBetween(-2, 2) - (stressMode ? randomBetween(0.8, 2.2) : 0)
          const nextHealth = clamp(plant.health + healthDelta, 0, 100)
          const roundedHealth = Number(nextHealth.toFixed(0))

          return {
            ...plant,
            ph: Number(nextPh.toFixed(2)),
            temperature: Number(nextTemperature.toFixed(1)),
            health: roundedHealth,
            healthHistory: appendHealthHistory(plant.healthHistory, roundedHealth),
          }
        })

        // If stress mode is enabled, compute risk and kick off recovery for critical plants
        if (stressMode) {
          const newRecovery = { ...recoveryState }
          nextPlants.forEach((p) => {
            const healthPenalty = 100 - p.health
            const pHdev = Math.abs(p.ph - 6.5)
            const pHPenalty = pHdev * 18
            const riskScore = Math.round(healthPenalty + pHPenalty)

            const isCritical = riskScore >= 80
            if (isCritical && (!newRecovery[p.id] || !newRecovery[p.id].active)) {
              newRecovery[p.id] = { progress: 0, active: true }
            }
          })

          setRecoveryState(newRecovery)
        }

        const adjustmentEvents = automationController.evaluate(nextPlants, new Date())

        if (adjustmentEvents.length > 0) {
          setActionLog((prevLog) => [...adjustmentEvents, ...prevLog].slice(0, 8))

          // Create intervention records
          const newInterventions = adjustmentEvents.map((a) => ({
            id: a.id,
            plantId: a.plantId,
            message: a.message,
            timestamp: a.timestamp,
            status: "in-progress" as const,
          }))

          setInterventions((prev) => [...newInterventions, ...prev].slice(0, 20))
        }

        return nextPlants
      })
      setLastUpdate(new Date())
    }, 4000)

    return () => window.clearInterval(interval)
  }, [stressMode, recoveryState])

  // Recovery progress updater runs on a faster cadence to show progress between simulation ticks
  useEffect(() => {
    const timer = window.setInterval(() => {
      setRecoveryState((prev) => {
        const next = { ...prev }
        let changed = false

        Object.keys(next).forEach((id) => {
          if (!next[id].active) return
          next[id].progress = Math.min(100, next[id].progress + 16)
          changed = true
          if (next[id].progress >= 100) {
            next[id].active = false
            // mark interventions for this plant as resolved (success)
            setInterventions((prevInterventions) =>
              prevInterventions.map((iv) =>
                iv.plantId === id && iv.status === "in-progress" ? { ...iv, status: "resolved", success: true } : iv,
              ),
            )
          }
        })

        return changed ? next : prev
      })
    }, 800)

    return () => window.clearInterval(timer)
  }, [])

  const recommendations = useMemo(() => buildRecommendations(plants), [plants])
  const adaptiveInsight = useMemo(() => buildAdaptiveInsight(plants, interventions, actionLog), [plants, interventions, actionLog])
  const criticalCount = recommendations.filter((item) => item.severity === "critical").length
  const resolvedInterventionCount = interventions.filter((item) => item.status === "resolved").length
  const selectedPlant = useMemo(() => plants.find((plant) => plant.id === selectedPlantId) ?? plants[0], [plants, selectedPlantId])
  const selectedProfile = selectedPlant ? plantProfiles[selectedPlant.id] : undefined
  const selectedSummary = selectedPlant ? getPlantStatusSummary(selectedPlant) : undefined
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleManualOverride = (plantId: string) => {
    // Cancel recovery and mark interventions as resolved (user resolved)
    setRecoveryState((prev) => ({ ...prev, [plantId]: { progress: 100, active: false } }))
    setInterventions((prev) => prev.map((iv) => (iv.plantId === plantId && iv.status === "in-progress" ? { ...iv, status: "resolved", success: false } : iv)))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <section className="glass-card relative overflow-hidden rounded-2xl border border-border/50 p-6">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="h-full w-full bg-cover bg-center opacity-35 blur-[2px]"
            style={{ backgroundImage: "url('/images/aerial-greenhouse-blur.jpg')" }}
          />
        </div>
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-neon-aqua/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-14 -bottom-16 h-44 w-44 rounded-full bg-neon-green/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/6 to-neon-aqua/6 pointer-events-none" />

        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon-aqua/30 bg-neon-aqua/10 px-3 py-1 text-xs font-medium text-neon-aqua">
                <Cpu className="h-3.5 w-3.5" />
                AI-Powered Crop Monitoring
              </p>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">Plant AI</h1>
              <p className="mt-2 text-sm text-muted-foreground">Simulated intelligence for growth tracking, disease detection, and harvest optimization.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-xl border border-border/50 bg-white px-3 py-2 text-xs text-muted-foreground">
                <p className="mb-0.5">Last telemetry sync</p>
                <p className="font-semibold text-neon-green">{mounted ? lastUpdate.toLocaleTimeString() : "—"}</p>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-border/50 bg-white px-3 py-2">
                <ShieldAlert className={`h-4 w-4 ${stressMode ? "text-destructive" : "text-neon-aqua"}`} />
                <div>
                  <p className="text-xs font-medium text-foreground">Stress Mode</p>
                  <p className="text-[11px] text-muted-foreground">Simulate adverse growth conditions</p>
                </div>
                <Switch checked={stressMode} onCheckedChange={setStressMode} />
              </label>
            </div>
          </div>

          {/* KPI row: compact high-impact metrics for judges */}
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
            {(() => {
              const avgHealth = Math.round(plants.reduce((s, p) => s + p.health, 0) / plants.length)
              const efficiencyNow = calculateResourceEfficiency(plants, actionLog)
              const activeAlerts = recommendations.filter(r => r.severity === 'critical' || r.severity === 'warning').length
              const nextHarvest = Math.min(...plants.map(p => calculateDaysToHarvest(p)))

              return (
                <>
                  <div className="rounded-xl border border-border/40 bg-white p-3 text-center">
                    <p className="text-xs text-muted-foreground">Overall Crop Health</p>
                    <p className="text-2xl font-bold text-foreground">{avgHealth}%</p>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-white p-3 text-center">
                    <p className="text-xs text-muted-foreground">Water Saved Today</p>
                    <p className="text-2xl font-bold text-neon-green">{efficiencyNow.waterSavingsL}L</p>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-white p-3 text-center">
                    <p className="text-xs text-muted-foreground">Energy Saved Today</p>
                    <p className="text-2xl font-bold text-neon-aqua">{efficiencyNow.energySavingsKwh} kWh</p>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-white p-3 text-center">
                    <p className="text-xs text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold text-warning">{activeAlerts}</p>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-white p-3 text-center">
                    <p className="text-xs text-muted-foreground">Next Harvest ETA</p>
                    <p className="text-2xl font-bold text-neon-green">{nextHarvest}d</p>
                  </div>
                </>
              )
            })()}
          </div>

          {/* Hero row: Growth Rate, Live Camera mock, System Status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2 flex gap-4">
              <div className="rounded-2xl border border-border/50 bg-white p-4 flex-1">
                <p className="text-xs text-muted-foreground">Growth Rate (weekly)</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">1.25</p>
                    <p className="text-xs text-muted-foreground">Avg. biomass growth</p>
                  </div>
                  <div className="text-sm text-neon-green font-semibold">+4.8% vs last week</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white p-4 w-56">
                <p className="text-xs text-muted-foreground">Live Camera</p>
                <div className="mt-3 h-28 w-full overflow-hidden rounded-md border border-border/40 bg-black/10">
                  <video
                    src="/videos/live-camera.mp4"
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">Live feed — auto-scan captures visible abnormalities</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-white p-4">
              <p className="text-xs text-muted-foreground">System Status</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-foreground">All systems nominal</p>
                  <p className="text-xs text-muted-foreground">Auto interventions: {actionLog.length}</p>
                </div>
                <div className="text-sm text-neon-aqua font-semibold">Live</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Plant Growth Performance</h2>
              <p className="text-xs text-muted-foreground">Live pH, temperature, and health streams</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-neon-green/40 bg-neon-green/10 px-3 py-1 text-xs text-neon-green">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              Live
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
            <div className="rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,250,252,0.88)_42%,rgba(236,253,245,0.76))] p-4 shadow-[0_22px_50px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-neon-green/25 bg-neon-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neon-green shadow-[0_0_0_1px_rgba(34,197,94,0.04)]">
                    <MapPinned className="h-3.5 w-3.5" />
                    Vertical farm map
                  </p>
                  <p className="mt-2 text-xs text-slate-600">Click a marker to inspect the plant profile and live status.</p>
                </div>
                <div className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                  {plants.length} plants tracked
                </div>
              </div>

              <div className="relative aspect-[3/2] overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-[#f7faf7] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                <Image
                  src="/images/vertical-stack.png"
                  alt="Layered vertical farming system"
                  fill
                  priority
                  sizes="(min-width: 1280px) 65vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/18 via-transparent to-white/8" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35 mix-blend-screen" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.25),transparent_26%)]" />

                {plants.map((plant) => {
                  const markerPosition = plantMarkerPositions[plant.id]
                  const summary = getPlantStatusSummary(plant)
                  const recovery = recoveryState[plant.id]
                  const selected = selectedPlant?.id === plant.id
                  const toneClass = summary.statusLabel === "Critical"
                    ? "border-red-300 bg-red-400/90"
                    : summary.statusLabel === "Watch"
                      ? "border-amber-300 bg-amber-300/90"
                      : "border-emerald-300 bg-neon-green/85"

                  return (
                    <button
                      key={plant.id}
                      type="button"
                      aria-label={`Inspect ${plant.name}`}
                      onClick={() => setSelectedPlantId(plant.id)}
                      className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: markerPosition?.left ?? "50%", top: markerPosition?.top ?? "50%" }}
                    >
                      <span
                        className={`absolute inset-0 -z-10 rounded-full opacity-40 blur-md transition-transform duration-300 group-hover:scale-150 ${toneClass}`}
                        style={{ width: selected ? 34 : 24, height: selected ? 34 : 24 }}
                      />
                      <span
                        className={`relative flex h-4 w-4 items-center justify-center rounded-full border bg-white/95 shadow-[0_0_0_5px_rgba(255,255,255,0.55),0_0_18px_rgba(34,197,94,0.12)] transition-transform duration-300 group-hover:scale-110 ${toneClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${summary.statusLabel === "Critical" ? "bg-red-600" : summary.statusLabel === "Watch" ? "bg-amber-500" : "bg-emerald-500"}`} />
                      </span>

                      {selected && (
                        <span className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-white/60 bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-slate-800 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
                          {plant.name}
                          {recovery?.active ? " · Recovering" : ""}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <p className="text-slate-500">Selected</p>
                  <p className="mt-1 font-semibold text-slate-900">{selectedPlant?.name}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <p className="text-slate-500">Status</p>
                  <p className={`mt-1 font-semibold ${selectedSummary?.statusLabel === "Critical" ? "text-red-500" : selectedSummary?.statusLabel === "Watch" ? "text-amber-500" : "text-emerald-600"}`}>{selectedSummary?.statusLabel}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <p className="text-slate-500">Layer</p>
                  <p className="mt-1 font-semibold text-slate-900">{selectedPlant?.layerId}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <p className="text-slate-500">Harvest ETA</p>
                  <p className="mt-1 font-semibold text-emerald-600">{selectedSummary?.daysToHarvest}d</p>
                </div>
              </div>
            </div>

            {selectedPlant && selectedProfile && selectedSummary && (
              <div className="rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.9)_44%,rgba(236,253,245,0.8))] p-6 shadow-[0_22px_50px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl flex flex-col max-h-[650px]">
                {/* Header with Badge - Fixed */}
                <div className="mb-4 flex items-start justify-between gap-3 flex-shrink-0">
                  <div>
                    <p className="inline-flex items-center gap-2 rounded-full border border-neon-green/20 bg-neon-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 shadow-[0_0_0_1px_rgba(34,197,94,0.04)]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Live plant profile
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-900">{selectedPlant.name}</h3>
                    <p className="text-sm text-slate-600">{selectedProfile.scientificName}</p>
                  </div>
                  <div className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide shadow-[0_0_0_1px_rgba(255,255,255,0.6)] ${selectedSummary.statusLabel === "Critical" ? "border-red-200 bg-red-50 text-red-600" : selectedSummary.statusLabel === "Watch" ? "border-amber-200 bg-amber-50 text-amber-600" : "border-emerald-200 bg-emerald-50 text-emerald-600"}`}>
                    {selectedSummary.statusLabel}
                  </div>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 overflow-hidden">
                  <div className="space-y-4 pr-4">

                    {/* PRIMARY: Overall Health Status */}
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-green-50/50 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-slate-900">Plant Health Status</p>
                        <p className="text-3xl font-bold text-emerald-600">{Math.round(selectedPlant.health)}%</p>
                      </div>
                      <div className="h-3 w-full rounded-full bg-emerald-100 overflow-hidden mb-4">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500" 
                          style={{ width: `${selectedPlant.health}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mb-3">Trend: <span className="font-semibold text-slate-900">{selectedSummary.trend.label}</span></p>
                      
                      {/* Supporting indicators as compact badges */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-slate-200 bg-white/75 p-2.5 text-xs">
                          <p className="text-slate-500 mb-1">Leaf Color</p>
                          <p className="font-medium text-slate-900 capitalize">{selectedPlant.healthIndicators.leafColor}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/75 p-2.5 text-xs">
                          <p className="text-slate-500 mb-1">Leaf Condition</p>
                          <p className="font-medium text-slate-900 capitalize">{selectedPlant.healthIndicators.leafCondition}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/75 p-2.5 text-xs">
                          <p className="text-slate-500 mb-1">Hydration</p>
                          <p className="font-semibold text-cyan-600">{selectedPlant.healthIndicators.hydrationLevel}%</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/75 p-2.5 text-xs">
                          <p className="text-slate-500 mb-1">Nutrient Balance</p>
                          <p className="font-semibold text-blue-600">{selectedPlant.healthIndicators.nutrientBalance}%</p>
                        </div>
                      </div>
                    </div>

                    {/* SECONDARY: Current Live Telemetry */}
                    <div className="rounded-2xl border border-slate-200 bg-white/65 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <p className="mb-3 text-sm font-semibold text-slate-900">Current Telemetry</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-xl border border-slate-200 bg-white/75 p-2.5">
                          <p className="text-slate-500">pH</p>
                          <p className="mt-1 font-semibold text-slate-900">{selectedPlant.ph.toFixed(2)}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/75 p-2.5">
                          <p className="text-slate-500">Temperature</p>
                          <p className="mt-1 font-semibold text-slate-900">{selectedPlant.temperature.toFixed(1)}°C</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/75 p-2.5">
                          <p className="text-slate-500">Light</p>
                          <p className="mt-1 font-semibold text-slate-900">{selectedPlant.lightIntensity} µmol</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/75 p-2.5">
                          <p className="text-slate-500">EC</p>
                          <p className="mt-1 font-semibold text-slate-900">{selectedPlant.ec.toFixed(1)}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/75 p-2.5">
                          <p className="text-slate-500">Risk Score</p>
                          <p className="mt-1 font-semibold text-slate-900">{selectedSummary.riskScore}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/75 p-2.5">
                          <p className="text-slate-500">Harvest ETA</p>
                          <p className="mt-1 font-semibold text-emerald-600">{selectedSummary.daysToHarvest}d</p>
                        </div>
                      </div>

                      {selectedPlant.healthIndicators.stressSignals.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs font-semibold text-slate-900 mb-2">Active Stress Signals</p>
                          <div className="space-y-1.5">
                            {selectedPlant.healthIndicators.stressSignals.map((signal) => (
                              <div key={signal} className="flex gap-2 items-start">
                                <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-slate-600">{signal}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* TERTIARY: Plant Profile (Expandable via Accordion) */}
                    <Accordion type="single" collapsible className="w-full space-y-2">
                      {/* Growth Profile */}
                      <AccordionItem value="growth" className="border border-slate-200 bg-white/65 rounded-xl px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        <AccordionTrigger className="text-sm font-semibold text-slate-900 py-3 hover:no-underline">
                          Growth Profile
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-3">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="rounded-lg border border-slate-200 bg-white/75 p-2.5">
                              <p className="text-slate-500 mb-1">Growth Speed</p>
                              <p className="font-medium text-slate-900">{selectedProfile.growthSpeed}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-white/75 p-2.5">
                              <p className="text-slate-500 mb-1">Ideal For</p>
                              <p className="font-medium text-slate-900 text-xs">{selectedProfile.idealFor ?? "General"}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-white/75 p-2.5 col-span-2">
                              <p className="text-slate-500 mb-1">Leaf Structure</p>
                              <p className="font-medium text-slate-900">{selectedProfile.leafTypeOrStructure ?? "Standard"}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-white/75 p-2.5">
                              <p className="text-slate-500 mb-1">Harvest Ready</p>
                              <p className="font-medium text-slate-900">{selectedProfile.harvestReadyDays ?? "—"} days</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Environmental Requirements */}
                      <AccordionItem value="environment" className="border border-slate-200 bg-white/65 rounded-xl px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        <AccordionTrigger className="text-sm font-semibold text-slate-900 py-3 hover:no-underline">
                          Environmental Requirements
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-3">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="rounded-lg border border-slate-200 bg-white/75 p-2.5">
                              <p className="text-slate-500 mb-1">Optimal pH</p>
                              <p className="font-medium text-slate-900">{selectedProfile.optimalPh}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-white/75 p-2.5">
                              <p className="text-slate-500 mb-1">Optimal Temp</p>
                              <p className="font-medium text-slate-900">{selectedProfile.optimalTemperature}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-white/75 p-2.5 col-span-2">
                              <p className="text-slate-500 mb-1">Optimal Humidity</p>
                              <p className="font-medium text-slate-900">{selectedProfile.optimalHumidity ?? "Not specified"}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Plant Sensitivities */}
                      <AccordionItem value="sensitivities" className="border border-slate-200 bg-white/65 rounded-xl px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        <AccordionTrigger className="text-sm font-semibold text-slate-900 py-3 hover:no-underline">
                          Sensitivities & Risk Factors
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pb-3">
                          <div className="flex flex-wrap gap-2">
                            {selectedProfile.sensitivities.map((item) => (
                              <span key={item} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 shadow-[0_0_12px_rgba(217,119,6,0.08)]">
                                {item}
                              </span>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Common Issues */}
                      <AccordionItem value="issues" className="border border-slate-200 bg-white/65 rounded-xl px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        <AccordionTrigger className="text-sm font-semibold text-slate-900 py-3 hover:no-underline">
                          Common Issues & Solutions
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pb-3">
                          {selectedProfile.commonIssues.map((item) => (
                            <div key={item} className="flex gap-2 text-xs text-slate-600">
                              <Leaf className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>

                      {/* LED Spectrum Optimization */}
                      {selectedProfile.ledSpectrumNeeds && (
                        <AccordionItem value="light" className="border border-slate-200 bg-white/65 rounded-xl px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                          <AccordionTrigger className="text-sm font-semibold text-slate-900 py-3 hover:no-underline">
                            Light Optimization
                          </AccordionTrigger>
                          <AccordionContent className="space-y-2 pb-3">
                            {Object.entries(selectedProfile.ledSpectrumNeeds).map(([stage, value]) => (
                              <div key={stage} className="flex items-start gap-2 text-xs">
                                <SunMedium className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span>
                                  <span className="font-semibold text-slate-900 capitalize">{stage}:</span>{" "}
                                  <span className="text-slate-600">{value}</span>
                                </span>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {/* Simulation Behavior */}
                      <AccordionItem value="simulation" className="border border-slate-200 bg-white/65 rounded-xl px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        <AccordionTrigger className="text-sm font-semibold text-slate-900 py-3 hover:no-underline">
                          Growth Behavior & Predictors
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pb-3">
                          {selectedProfile.simulationBehavior.map((item) => (
                            <div key={item} className="flex gap-2 text-xs text-slate-600">
                              <Gauge className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        {/* Three Panels Side by Side Below Plant Performance */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Disease Detection Panel */}
          <div>
            <DiseaseDetectionPanel />
          </div>

          {/* AI Recommendations Panel */}
          <section className="relative overflow-hidden rounded-2xl border border-neon-aqua/30 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 p-5 shadow-[0_8px_24px_rgba(45,212,191,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.06),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.04),transparent_40%)]" />
            <div className="relative mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon-aqua/30 bg-neon-aqua/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-aqua">Live Triage</p>
                <h3 className="text-base font-semibold tracking-tight text-foreground">AI Recommendations</h3>
                <p className="text-xs text-muted-foreground">High-priority interventions</p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${
                  criticalCount > 0
                    ? "border-destructive/50 bg-destructive/15 text-destructive"
                    : "border-neon-aqua/40 bg-neon-aqua/15 text-neon-aqua"
                }`}
              >
                {criticalCount > 0 ? `${criticalCount} critical` : "Stable"}
              </span>
            </div>

            <div className="relative rounded-2xl border border-neon-aqua/20 bg-white/60 backdrop-blur-sm p-3">
              <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {/* Group recommendations by status: in-progress, auto-resolved, manual-overridden */}
              {(() => {
                const inProgress = recommendations.filter((rec) => interventions.some((iv) => iv.plantId === rec.plantId && iv.status === "in-progress"))
                const resolvedAuto = recommendations.filter((rec) => interventions.some((iv) => iv.plantId === rec.plantId && iv.status === "resolved" && iv.success === true))
                const resolvedManual = recommendations.filter((rec) => interventions.some((iv) => iv.plantId === rec.plantId && iv.status === "resolved" && iv.success === false))
                const others = recommendations.filter((rec) => !inProgress.includes(rec) && !resolvedAuto.includes(rec) && !resolvedManual.includes(rec))

                return (
                  <div className="space-y-3">
                    {inProgress.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neon-aqua">In progress</p>
                          <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">{inProgress.length}</span>
                        </div>
                        <div className="space-y-2">
                          {inProgress.map((recommendation) => (
                            <RecommendationCard
                              key={recommendation.id}
                              recommendation={recommendation}
                              actionStatus="in-progress"
                              onManualOverride={() => handleManualOverride(recommendation.plantId)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {resolvedAuto.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neon-green">Auto-resolved</p>
                          <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">{resolvedAuto.length}</span>
                        </div>
                        <div className="space-y-2">
                          {resolvedAuto.map((recommendation) => (
                            <RecommendationCard
                              key={recommendation.id}
                              recommendation={recommendation}
                              actionStatus="resolved"
                              onManualOverride={() => handleManualOverride(recommendation.plantId)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {resolvedManual.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-destructive">Manual overridden</p>
                          <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">{resolvedManual.length}</span>
                        </div>
                        <div className="space-y-2">
                          {resolvedManual.map((recommendation) => (
                            <RecommendationCard
                              key={recommendation.id}
                              recommendation={recommendation}
                              actionStatus="manual-overridden"
                              onManualOverride={() => handleManualOverride(recommendation.plantId)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {others.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Other</p>
                        <div className="space-y-2">
                          {others.map((recommendation) => (
                            <RecommendationCard
                              key={recommendation.id}
                              recommendation={recommendation}
                              actionStatus={undefined}
                              onManualOverride={() => handleManualOverride(recommendation.plantId)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
              </div>
            </div>
          </section>

          {/* Automated Action Log Panel */}
          <section className="relative flex flex-col overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-blue-50 via-white to-cyan-50/40 p-5 shadow-[0_8px_24px_rgba(34,211,238,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] h-[600px]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:22px_22px] opacity-20" />
            <div className="pointer-events-none absolute inset-0 opacity-35" style={{ backgroundImage: "url('/images/plant-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center bottom', backgroundRepeat: 'no-repeat' }} />
            <div className="relative mb-4 flex flex-shrink-0 items-start justify-between gap-3">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon-aqua/30 bg-neon-aqua/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-aqua">Telemetry Console</p>
                <h3 className="text-base font-semibold tracking-tight text-foreground">Automated Action Log</h3>
                <p className="text-xs text-muted-foreground">Recent responses</p>
              </div>
              <span className="rounded-full border border-neon-aqua/40 bg-neon-aqua/15 px-3 py-1 text-xs font-semibold tracking-wide text-neon-aqua">
                {filteredActionLog.length} recent
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="relative mb-4 flex flex-shrink-0 gap-2 overflow-x-auto pb-2">
              {["all", "environment", "nutrients", "climate", "system"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActionLogFilter(filter as typeof actionLogFilter)}
                  className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
                    actionLogFilter === filter
                      ? "border-neon-aqua/60 bg-neon-aqua/20 text-neon-aqua"
                      : "border-slate-200/60 bg-white/50 text-slate-600 hover:border-slate-300/60 hover:bg-white/70"
                  }`}
                >
                  {filter === "all" && " All"}
                  {filter === "environment" && " Environment"}
                  {filter === "nutrients" && " Nutrients"}
                  {filter === "climate" && " Climate"}
                  {filter === "system" && " System"}
                </button>
              ))}
            </div>

            <div className="relative flex-1 space-y-2.5 overflow-hidden flex flex-col">
              {/* Constrain log box height and add scroll to avoid filling the whole page */}
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {filteredActionLog.length > 0 ? (
                  // show only the most recent 6 by default
                  filteredActionLog.slice(0, 6).map((action, index) => {
                    const category = getMetricCategory(action.metric)
                    const badgeColor = getMetricBadgeColor(category)
                    const iconBg = getActionBgColor(action.metric)
                    const iconColor = getActionIconColor(action.metric)
                    return (
                      <div key={action.id} className="relative flex gap-3">
                        {/* Timeline line */}
                        {index < (filteredActionLog.length > 6 ? 5 : filteredActionLog.length - 1) && (
                          <div className="absolute left-[1.15rem] top-10 h-6 w-0.5 bg-gradient-to-b from-cyan-300 to-cyan-100" />
                        )}
                        
                        {/* Icon Circle */}
                        <div className={`mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border ${iconBg} border-opacity-40`}>
                          {category === "nutrients" && <Leaf className={`h-4.5 w-4.5 ${iconColor}`} />}
                          {category === "environment" && <Droplets className={`h-4.5 w-4.5 ${iconColor}`} />}
                          {category === "climate" && <Thermometer className={`h-4.5 w-4.5 ${iconColor}`} />}
                          {category === "system" && <Activity className={`h-4.5 w-4.5 ${iconColor}`} />}
                          {category === "all" && <Sparkles className={`h-4.5 w-4.5 ${iconColor}`} />}
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 gap-3">
                          <div className="flex-1 rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                            <p className="text-sm font-medium leading-snug text-foreground">{action.message}</p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-[10px] font-semibold text-slate-600">{action.plantName}</span>
                              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${badgeColor}`}>
                                {action.metric}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-shrink-0 items-center justify-end">
                            <span className="rounded-lg border border-slate-200/50 bg-white/70 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                              {action.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-cyan-300/40 bg-cyan-50/40 px-3 py-4 text-sm text-muted-foreground">
                    No automated adjustments yet.
                  </div>
                )}
              </div>

              {/* show more button if there are more than displayed */}
              {filteredActionLog.length > 6 && (
                <div className="flex flex-shrink-0 items-center justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      // expand to show all recent entries
                      setActionLog((prev) => prev.slice(0, 20))
                    }}
                    className="rounded-full border border-neon-aqua/30 bg-neon-aqua/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-neon-aqua transition-colors hover:bg-neon-aqua/20"
                  >
                    Show all recent
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>


      {/* SIMPLIFIED SECTION 3: HARVEST & EFFICIENCY */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Harvest & Efficiency</h2>
          <p className="text-xs text-muted-foreground">Predicted yields and system performance</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border/40 bg-white p-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-neon-green/15 p-2 text-neon-green">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <p className="text-xl font-semibold leading-none text-foreground">Ready Soon</p>
            </div>

            <div className="mt-4 space-y-3">
              {adaptiveInsight.harvestCandidates.slice(0, 3).map(({ plant, daysToHarvest }) => {
                const readinessPercent = Math.max(12, Math.min(100, 100 - daysToHarvest * 7))

                return (
                  <div key={plant.id}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <p className="font-semibold text-foreground">{plant.name}</p>
                      <span className="inline-flex items-center gap-1.5 text-neon-green font-semibold">
                        <Clock3 className="h-3 w-3" />
                        {daysToHarvest}d
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neon-green/15">
                      <div className="h-full rounded-full bg-neon-green" style={{ width: `${readinessPercent}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border/40 bg-white p-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-neon-aqua/15 p-2 text-neon-aqua">
                <Activity className="h-3.5 w-3.5" />
              </div>
              <p className="text-xl font-semibold leading-none text-foreground">Resource Savings</p>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-3 w-3 text-neon-aqua" />
                    Water Saved
                  </span>
                  <span className="font-semibold text-neon-aqua">16%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neon-aqua/15">
                  <div
                    className="h-full rounded-full bg-neon-aqua"
                    style={{ width: `16%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Zap className="h-3 w-3 text-amber-300" />
                    Energy Saved
                  </span>
                  <span className="font-semibold text-amber-300">12%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-amber-300/15">
                  <div
                    className="h-full rounded-full bg-amber-300"
                    style={{ width: `12%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/40 bg-white p-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-300">
                <Cpu className="h-3.5 w-3.5" />
              </div>
              <p className="text-xl font-semibold leading-none text-foreground">AI Confidence</p>
            </div>

            <div className="mt-4">
              <p className="text-4xl font-bold leading-none text-cyan-300">{adaptiveInsight.successRate}%</p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-cyan-500/15">
                <div className="h-full rounded-full bg-cyan-300" style={{ width: `${adaptiveInsight.successRate}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Based on resolved interventions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
