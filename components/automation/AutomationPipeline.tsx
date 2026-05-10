"use client"

import { ArrowRight, Activity, Brain, Zap, Wind, Shield } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Sensor Input",
    description: "Real-time data collection",
    icon: Activity,
    status: "Humidity 78%"
  },
  {
    id: 2,
    title: "Condition Analysis",
    description: "Pattern recognition",
    icon: Brain,
    status: "Optimal range"
  },
  {
    id: 3,
    title: "Decision Logic",
    description: "AI evaluation",
    icon: Brain,
    status: "Action required"
  },
  {
    id: 4,
    title: "Automation Trigger",
    description: "System activation",
    icon: Zap,
    status: "Airflow +18%"
  },
  {
    id: 5,
    title: "Environmental Response",
    description: "Physical adjustment",
    icon: Wind,
    status: "Cooling active"
  },
  {
    id: 6,
    title: "Stability Outcome",
    description: "Feedback loop",
    icon: Shield,
    status: "Balanced"
  }
]

export function AutomationPipeline() {
  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-[#E2E8F0]">Automation Pipeline</h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#6366F1] flex items-center justify-center mb-4 shadow-lg">
              <step.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[#E2E8F0] mb-1">{step.title}</h3>
            <p className="text-xs text-[#E2E8F0]/70 mb-2">{step.description}</p>
            <div className="px-3 py-1 bg-white/10 rounded-full text-xs text-[#06B6D4] font-medium">
              {step.status}
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-6 h-6 text-[#6366F1] mt-4 lg:hidden" />
            )}
          </div>
        ))}
      </div>

      {/* Connection lines for desktop */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#06B6D4] to-[#6366F1] transform -translate-y-1/2 opacity-50" />
    </div>
  )
}