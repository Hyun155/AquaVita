"use client"

import { Droplets, Lightbulb, Wind, Sun, Snowflake, FlaskConical } from "lucide-react"

const systems = [
  {
    name: "Irrigation",
    icon: Droplets,
    status: "ACTIVE",
    priority: "High",
    latency: "45ms",
    dependencies: "EC drift, schedule"
  },
  {
    name: "Lighting",
    icon: Lightbulb,
    status: "ACTIVE",
    priority: "High",
    latency: "32ms",
    dependencies: "Time, growth stage"
  },
  {
    name: "Airflow",
    icon: Wind,
    status: "ACTIVE",
    priority: "Med",
    latency: "67ms",
    dependencies: "Humidity, temp"
  },
  {
    name: "UV Sterilization",
    icon: Sun,
    status: "ACTIVE",
    priority: "Med",
    latency: "89ms",
    dependencies: "Algae risk, timer"
  },
  {
    name: "Cooling",
    icon: Snowflake,
    status: "STANDBY",
    priority: "Low",
    latency: "120ms",
    dependencies: "Temp threshold"
  },
  {
    name: "Nutrient Injection",
    icon: FlaskConical,
    status: "ACTIVE",
    priority: "High",
    latency: "52ms",
    dependencies: "pH balance, EC"
  }
]

export function ActiveAutomationSystems() {
  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-[#E2E8F0]">Active Automation Systems</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system) => (
          <div key={system.name} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#6366F1] flex items-center justify-center">
                <system.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#E2E8F0]">{system.name}</h3>
                <p className="text-sm text-[#06B6D4]">STATUS: {system.status}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#E2E8F0]/70">PRIORITY:</span>
                <span className={`font-medium ${
                  system.priority === 'High' ? 'text-red-400' :
                  system.priority === 'Med' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {system.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E2E8F0]/70">LATENCY:</span>
                <span className="font-medium text-[#E2E8F0]">{system.latency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E2E8F0]/70">DEPENDENCIES:</span>
                <span className="font-medium text-[#E2E8F0] text-right">{system.dependencies}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}