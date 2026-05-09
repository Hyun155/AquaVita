import type { PlantTelemetry } from "@/components/plant-ai/types"

type OptimalRange = {
  min: number
  max: number
}

let automationActionSequence = 0

export interface AutomationAction {
  id: string
  plantId: string
  plantName: string
  metric: "pH" | "temperature"
  message: string
  timestamp: string
}

const DEFAULT_OPTIMAL_RANGE = {
  ph: { min: 6.0, max: 7.0 },
  temperature: { min: 20, max: 25 },
} satisfies { ph: OptimalRange; temperature: OptimalRange }

export class AutomationController {
  constructor(
    private readonly optimalRange = DEFAULT_OPTIMAL_RANGE,
  ) {}

  evaluate(plants: PlantTelemetry[], timestamp = new Date()): AutomationAction[] {
    const actions: AutomationAction[] = []

    plants.forEach((plant) => {
      if (plant.ph < this.optimalRange.ph.min) {
        actions.push({
          id: `${plant.id}-ph-low-${automationActionSequence++}`,
          plantId: plant.id,
          plantName: plant.name,
          metric: "pH",
          message: `AI prevented nutrient imbalance for ${plant.name} by buffering low pH ${plant.ph.toFixed(2)}.`,
          timestamp: timestamp.toLocaleTimeString(),
        })
      } else if (plant.ph > this.optimalRange.ph.max) {
        actions.push({
          id: `${plant.id}-ph-high-${automationActionSequence++}`,
          plantId: plant.id,
          plantName: plant.name,
          metric: "pH",
          message: `Automated pH stabilization successful for ${plant.name}; high pH ${plant.ph.toFixed(2)} was corrected.`,
          timestamp: timestamp.toLocaleTimeString(),
        })
      }

      if (plant.temperature < this.optimalRange.temperature.min) {
        actions.push({
          id: `${plant.id}-temp-low-${automationActionSequence++}`,
          plantId: plant.id,
          plantName: plant.name,
          metric: "temperature",
          message: `Predicted cold stress in ${plant.name}; automated heating restored canopy stability.`,
          timestamp: timestamp.toLocaleTimeString(),
        })
      } else if (plant.temperature > this.optimalRange.temperature.max) {
        actions.push({
          id: `${plant.id}-temp-high-${automationActionSequence++}`,
          plantId: plant.id,
          plantName: plant.name,
          metric: "temperature",
          message: `Predicted heat stress in ${plant.name}; automated airflow reduced canopy temperature.`,
          timestamp: timestamp.toLocaleTimeString(),
        })
      }
    })

    return actions
  }
}

export const automationController = new AutomationController()