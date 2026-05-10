"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Leaf, Scale, Zap } from "lucide-react"

const modes = [
  {
    id: "eco",
    name: "Eco",
    description: "Focus on energy saving",
    icon: Leaf,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    levels: {
      energy: 30,
      lighting: 60,
      circulation: 40
    }
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "Optimal performance",
    icon: Scale,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    levels: {
      energy: 60,
      lighting: 80,
      circulation: 70
    }
  },
  {
    id: "max-yield",
    name: "Max Yield",
    description: "High intensity growth",
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    levels: {
      energy: 90,
      lighting: 100,
      circulation: 85
    }
  }
]

export function OperationalModes() {
  const [selectedMode, setSelectedMode] = useState("balanced")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Operational Modes</h2>
        <p className="text-muted-foreground">Select the operational profile for your farm</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => (
          <Card
            key={mode.id}
            className={`p-6 cursor-pointer transition-all ${
              selectedMode === mode.id
                ? `${mode.borderColor} shadow-lg shadow-current`
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedMode(mode.id)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${mode.bgColor} flex items-center justify-center`}>
                <mode.icon className={`w-5 h-5 ${mode.color}`} />
              </div>
              <div>
                <h3 className="font-semibold">{mode.name}</h3>
                <p className="text-sm text-muted-foreground">{mode.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Energy</span>
                  <span>{mode.levels.energy}%</span>
                </div>
                <Progress value={mode.levels.energy} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Lighting</span>
                  <span>{mode.levels.lighting}%</span>
                </div>
                <Progress value={mode.levels.lighting} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Circulation</span>
                  <span>{mode.levels.circulation}%</span>
                </div>
                <Progress value={mode.levels.circulation} className="h-2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}