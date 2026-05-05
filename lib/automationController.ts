import type { PlantTelemetry } from "@/components/plant-ai/types"

type OptimalRange = {
  min: number
  max: number
}

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
          id: `${plant.id}-ph-low-${timestamp.getTime()}-${actions.length}`,
          plantId: plant.id,
          plantName: plant.name,
          metric: "pH",
          message: `Adding alkaline buffer for ${plant.name} because pH ${plant.ph.toFixed(2)} is below ${this.optimalRange.ph.min.toFixed(1)}.`,
          timestamp: timestamp.toLocaleTimeString(),
        })
      } else if (plant.ph > this.optimalRange.ph.max) {
        actions.push({
          id: `${plant.id}-ph-high-${timestamp.getTime()}-${actions.length}`,
          plantId: plant.id,
          plantName: plant.name,
          metric: "pH",
          message: `Adding acidic solution for ${plant.name} because pH ${plant.ph.toFixed(2)} is above ${this.optimalRange.ph.max.toFixed(1)}.`,
          timestamp: timestamp.toLocaleTimeString(),
        })
      }

      if (plant.temperature < this.optimalRange.temperature.min) {
        actions.push({
          id: `${plant.id}-temp-low-${timestamp.getTime()}-${actions.length}`,
          plantId: plant.id,
          plantName: plant.name,
          metric: "temperature",
          message: `Increasing heater output for ${plant.name} because temperature ${plant.temperature.toFixed(1)}°C is below ${this.optimalRange.temperature.min.toFixed(1)}°C.`,
          timestamp: timestamp.toLocaleTimeString(),
        })
      } else if (plant.temperature > this.optimalRange.temperature.max) {
        actions.push({
          id: `${plant.id}-temp-high-${timestamp.getTime()}-${actions.length}`,
          plantId: plant.id,
          plantName: plant.name,
          metric: "temperature",
          message: `Increasing airflow for ${plant.name} because temperature ${plant.temperature.toFixed(1)}°C is above ${this.optimalRange.temperature.max.toFixed(1)}°C.`,
          timestamp: timestamp.toLocaleTimeString(),
        })
      }
    })

    return actions
  }
}

export const automationController = new AutomationController()