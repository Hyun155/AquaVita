"use client"

import { AlertTriangle, Wrench, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const alerts = [
  {
    id: 1,
    title: "Pump vibration irregularity detected",
    message: "Circulation pump showing unusual vibration patterns. Schedule inspection within 7 days.",
    severity: "warning",
    daysLeft: 7
  },
  {
    id: 2,
    title: "UV sterilizer efficiency declining",
    message: "UV lamp output below optimal levels. Replacement recommended within 14 days.",
    severity: "info",
    daysLeft: 14
  },
  {
    id: 3,
    title: "Sensor calibration drift detected",
    message: "pH sensor readings showing gradual drift. Recalibration needed within 30 days.",
    severity: "info",
    daysLeft: 30
  },
  {
    id: 4,
    title: "Filter pressure increasing",
    message: "Water filter showing elevated pressure. Backwashing or replacement may be required.",
    severity: "warning",
    daysLeft: 21
  }
]

export function FailurePredictionCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Failure Prediction Center</h2>
        <p className="text-muted-foreground">AI-driven maintenance alerts and predictions</p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                alert.severity === 'warning' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
              }`}>
                {alert.severity === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Wrench className="w-5 h-5 text-blue-500" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{alert.title}</h3>
                  <Badge variant={alert.severity === 'warning' ? 'secondary' : 'outline'}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3">{alert.message}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Action required in {alert.daysLeft} days</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}