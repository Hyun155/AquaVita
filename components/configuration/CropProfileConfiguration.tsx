"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Droplets, Zap, Sun, Cloud } from "lucide-react"

const crops = [
  { id: "lettuce", name: "Lettuce", icon: "🥬" },
  { id: "kale", name: "Kale", icon: "🥬" },
  { id: "basil", name: "Basil", icon: "🌿" },
  { id: "spinach", name: "Spinach", icon: "🥬" },
  { id: "mint", name: "Mint", icon: "🌿" }
]

const cropProfiles = {
  lettuce: {
    optimalPh: "5.5 - 6.5",
    ecRange: "1.2 - 1.8 mS/cm",
    lightingIntensity: "150 µmol",
    humidity: "60% - 75%"
  },
  kale: {
    optimalPh: "6.0 - 7.0",
    ecRange: "1.8 - 2.3 mS/cm",
    lightingIntensity: "200 µmol",
    humidity: "50% - 65%"
  },
  basil: {
    optimalPh: "5.5 - 6.5",
    ecRange: "1.0 - 1.6 mS/cm",
    lightingIntensity: "180 µmol",
    humidity: "55% - 70%"
  },
  spinach: {
    optimalPh: "6.0 - 7.0",
    ecRange: "1.8 - 2.3 mS/cm",
    lightingIntensity: "200 µmol",
    humidity: "50% - 65%"
  },
  mint: {
    optimalPh: "6.0 - 7.5",
    ecRange: "1.6 - 2.2 mS/cm",
    lightingIntensity: "170 µmol",
    humidity: "60% - 75%"
  }
}

export function CropProfileConfiguration() {
  const [selectedCrop, setSelectedCrop] = useState("spinach")

  const profile = cropProfiles[selectedCrop as keyof typeof cropProfiles]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Crop Profile Configuration</h2>
        <p className="text-muted-foreground">Select and configure crop-specific parameters</p>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {crops.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-lg border-2 transition-all ${
                selectedCrop === crop.id
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="text-2xl mb-1">{crop.icon}</div>
              <div className="text-sm font-medium">{crop.name}</div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Live Target Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Optimal pH</p>
              <p className="font-medium">{profile.optimalPh}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">EC Range</p>
              <p className="font-medium">{profile.ecRange}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Sun className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Lighting Intensity</p>
              <p className="font-medium">{profile.lightingIntensity}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Cloud className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-medium">{profile.humidity}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}