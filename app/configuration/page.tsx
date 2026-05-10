import { OperationalModes } from "@/components/configuration/OperationalModes"
import { CropProfileConfiguration } from "@/components/configuration/CropProfileConfiguration"
import { FailurePredictionCenter } from "@/components/configuration/FailurePredictionCenter"

export default function ConfigurationPage() {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Farm Configuration</h1>
        <p className="text-muted-foreground text-lg">
          Optimize operational parameters and crop profiles
        </p>
      </div>

      <OperationalModes />

      <CropProfileConfiguration />

      <FailurePredictionCenter />
    </div>
  )
}