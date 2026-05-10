"use client"

import { Progress } from "@/components/ui/progress"
import {
  Activity,
  AlertCircle,
  Battery,
  Flame,
  Power,
  ShieldCheck,
  Thermometer,
  Wind
} from "lucide-react"

const kpis = [
  { label: "Active Rules", value: "42" },
  { label: "Autonomous Actions / 24h", value: "1,284" },
  { label: "System Response", value: "184ms" },
  { label: "Infra Reliability", value: "99.6%" },
  { label: "Confidence", value: "97.1%" }
]

const pipelineSteps = [
  { label: "Sensor Input", status: "humidity 78%", number: 1 },
  { label: "Condition Analysis", status: "Fungal risk threshold", number: 2 },
  { label: "Decision Logic", status: "rule R-27 matched", number: 3 },
  { label: "Automation Trigger", status: "airflow +18%", number: 4 },
  { label: "Environmental Response", status: "humidity 71%", number: 5 },
  { label: "Stability Outcome", status: "recovery confirmed", number: 6 }
]

const systems = [
  { name: "Irrigation Control", priority: "High", latency: "92ms", dependencies: "EC drift, schedule" },
  { name: "Lighting", priority: "High", latency: "78ms", dependencies: "Photoperiod, crop stage" },
  { name: "Airflow", priority: "Med", latency: "109ms", dependencies: "Humidity, temp" },
  { name: "UV Sterilization", priority: "Med", latency: "76ms", dependencies: "Algae risk, timer" },
  { name: "Cooling", priority: "Low", latency: "128ms", dependencies: "Temp threshold" },
  { name: "Nutrient Injection", priority: "High", latency: "58ms", dependencies: "pH balance, EC" }
]

const rules = [
  "IF humidity > 75% → increase airflow +15%",
  "IF algae_probability > 0.6 → activate UV cycle"
]

const comparisons = [
  { metric: "Water Consumption", enabled: "-31%", disabled: "+31%" },
  { metric: "Disease Incidence", enabled: "-18%", disabled: "+18%" },
  { metric: "pH Stability", enabled: "99.2%", disabled: "82%" }
]

const reliabilityMetrics = [
  { label: "Pump Efficiency", value: 99.4 },
  { label: "Sensor Stability", value: 98.2 },
  { label: "LED Lifespan", value: 86 },
  { label: "Backup Power", value: 100 }
]

const warnings = [
  {
    title: "Pump 2 Failure Predicted",
    description: "Vibration analysis indicates bearing wear. Failure likely in 3 days. AI recommends preventive maintenance.",
    icon: Activity,
    severity: "critical",
    timeframe: "3 days",
    confidence: "94%"
  },
  {
    title: "Sensor Calibration Drift",
    description: "pH sensor readings showing 2.3% deviation from baseline. Recalibration needed within 7 days.",
    icon: Thermometer,
    severity: "warning",
    timeframe: "7 days",
    confidence: "87%"
  },
  {
    title: "LED Array Degradation",
    description: "PAR output reduced by 12%. Spectrum shift detected. Replacement recommended within 14 days.",
    icon: Flame,
    severity: "warning",
    timeframe: "14 days",
    confidence: "91%"
  }
]

const controls = [
  { label: "Manual Override", icon: Power },
  { label: "Emergency Shutdown", icon: AlertCircle },
  { label: "Backup Power", icon: Battery },
  { label: "Fallback Circulation", icon: Wind },
  { label: "Isolate Infrastructure", icon: ShieldCheck }
]

export default function AutomationPage() {
  return (
    <div className="min-h-screen bg-[#050B10] text-[#E2E8F0] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_25%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 space-y-10">
        <section className="rounded-[32px] border border-slate-800 bg-slate-950/70 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.12)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">MODULE 02 / AUTOMATION</p>
              <h1 className="text-4xl font-semibold tracking-tight">Automation Orchestrator</h1>
              <p className="max-w-2xl text-slate-400">A centralized interface for orchestration logic, system health, and real-time automation status.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-800 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.18)]">
                AI CONTROL ACTIVE
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-700/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
                DECISION ENGINE ONLINE
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-700/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
                INFRASTRUCTURE STABILITY NOMINAL
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_0_24px_rgba(15,23,42,0.15)]">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{kpi.label}</p>
                <p className="mt-3 text-2xl font-semibold text-[#E2E8F0]">{kpi.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800 bg-slate-950/70 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.12)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Automation Pipeline</p>
              <h2 className="mt-2 text-3xl font-semibold">Operational flow</h2>
            </div>
            <p className="text-sm text-slate-400">Track the live automation decision path and event state.</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 20">
              {/* Connecting arrows */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                 refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d3" />
                </marker>
              </defs>
              {/* Arrows between nodes */}
              <line x1="8.3" y1="10" x2="24.7" y2="10" stroke="#06b6d3" strokeWidth="0.2" markerEnd="url(#arrowhead)" className="animate-pulse" />
              <line x1="25.3" y1="10" x2="41.7" y2="10" stroke="#06b6d3" strokeWidth="0.2" markerEnd="url(#arrowhead)" className="animate-pulse" />
              <line x1="42.3" y1="10" x2="58.7" y2="10" stroke="#06b6d3" strokeWidth="0.2" markerEnd="url(#arrowhead)" className="animate-pulse" />
              <line x1="59.3" y1="10" x2="75.7" y2="10" stroke="#06b6d3" strokeWidth="0.2" markerEnd="url(#arrowhead)" className="animate-pulse" />
              <line x1="76.3" y1="10" x2="92.7" y2="10" stroke="#06b6d3" strokeWidth="0.2" markerEnd="url(#arrowhead)" className="animate-pulse" />
            </svg>
            <div className="relative z-10 grid gap-6 md:grid-cols-6">
              {pipelineSteps.map((step, index) => (
                <div key={step.label} className="flex flex-col items-center text-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    index === 0 ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_32px_rgba(6,182,212,0.3)]' :
                    index === pipelineSteps.length - 1 ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_32px_rgba(16,185,129,0.3)]' :
                    'bg-slate-700/50 border-slate-600 ring-1 ring-slate-500/30 shadow-[0_0_20px_rgba(100,116,139,0.2)]'
                  }`}>
                    <span className="text-xl font-bold text-[#E2E8F0]">{step.number}</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[#E2E8F0]">{step.label}</p>
                  <p className="mt-2 text-xs text-slate-400 max-w-[120px] leading-tight">{step.status}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/70 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.12)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Active Automation Systems</p>
                <h2 className="mt-2 text-3xl font-semibold">System control grid</h2>
              </div>
              <p className="text-sm text-slate-400">Live status of automation modules and dependencies.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {systems.map((system) => (
                <div key={system.name} className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-[0_0_24px_rgba(15,23,42,0.25)] transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_0_32px_rgba(6,182,212,0.15)]">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-[#E2E8F0]">{system.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse"></div>
                        <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                      </div>
                      <span className="text-xs uppercase tracking-[0.24em] text-emerald-300 font-medium">ACTIVE</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">PRIORITY</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-[0.15em] ${
                        system.priority === "High" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                        system.priority === "Med" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}>
                        {system.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">LATENCY</span>
                      <span className="text-sm font-mono text-cyan-300">{system.latency}</span>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <span className="text-xs uppercase tracking-[0.2em] text-slate-400 block mb-2">DEPENDENCIES</span>
                      <span className="text-sm text-slate-300 leading-tight">{system.dependencies}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-800 bg-slate-950/70 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.12)]">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Rule-Based Automation Logic</p>
              <h2 className="mt-2 text-3xl font-semibold">Terminal reasoning</h2>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-[#02050A] p-6 font-mono text-sm leading-7 text-cyan-200 shadow-[inset_0_0_20px_rgba(6,182,212,0.12)]">
              {rules.map((rule) => (
                <p key={rule} className="mb-3">{rule}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/70 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.12)]">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">What Happens Without Automation?</p>
              <h2 className="mt-2 text-3xl font-semibold">Comparison</h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-700/50">
                    <th className="px-6 py-5 text-left uppercase tracking-[0.2em] text-slate-400 font-semibold">Performance Metric</th>
                    <th className="px-6 py-5 text-center uppercase tracking-[0.2em] text-emerald-400 font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        Automation Enabled
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center uppercase tracking-[0.2em] text-rose-400 font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-rose-400"></div>
                        Automation Disabled
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, idx) => (
                    <tr key={row.metric} className={idx % 2 === 0 ? "bg-slate-950/40" : "bg-slate-900/40"}>
                      <td className="px-6 py-5 text-[#E2E8F0] font-medium border-l-4 border-cyan-400/30">{row.metric}</td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-emerald-300 font-semibold">{row.enabled}</span>
                          <div className="h-1.5 w-8 bg-emerald-500/30 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full animate-pulse" style={{width: '70%'}}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                          <span className="text-rose-400 font-semibold">{row.disabled}</span>
                          <div className="h-1.5 w-8 bg-rose-500/30 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-400 rounded-full" style={{width: '30%'}}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-800 bg-slate-950/70 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.12)]">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Infrastructure Reliability Monitor</p>
              <h2 className="mt-2 text-3xl font-semibold">Integrity metrics</h2>
            </div>
            <div className="space-y-6">
              {reliabilityMetrics.map((metric) => (
                <div key={metric.label} className="group">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-slate-300 font-medium">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#E2E8F0] font-mono text-lg">{metric.value}%</span>
                      <div className={`h-2 w-2 rounded-full ${
                        metric.value >= 95 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]' :
                        metric.value >= 85 ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
                        'bg-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                      }`}></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${
                          metric.value >= 95 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]' :
                          metric.value >= 85 ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                          'bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                        }`}
                        style={{width: `${metric.value}%`}}
                      ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xs text-slate-500 font-mono tracking-wider">
                        {metric.value >= 95 ? 'OPTIMAL' : metric.value >= 85 ? 'NOMINAL' : 'CRITICAL'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/70 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.12)]">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Failure Prediction Center</p>
              <h2 className="mt-2 text-3xl font-semibold">AI warning signals</h2>
            </div>
            <div className="space-y-4">
              {warnings.map((warning) => (
                <div key={warning.title} className={`rounded-3xl border p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] transition-all duration-300 hover:scale-[1.02] ${
                  warning.severity === 'critical' 
                    ? 'border-rose-500/30 bg-rose-500/5 shadow-[0_0_30px_rgba(239,68,68,0.15)]' 
                    : 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_25px_rgba(245,158,11,0.12)]'
                }`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        warning.severity === 'critical' ? 'bg-rose-500/20' : 'bg-amber-500/20'
                      }`}>
                        <warning.icon className={`h-5 w-5 ${
                          warning.severity === 'critical' ? 'text-rose-300' : 'text-amber-300'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#E2E8F0]">{warning.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-[0.15em] ${
                            warning.severity === 'critical' 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {warning.severity}
                          </span>
                          <span className="text-xs text-slate-400">Due in {warning.timeframe}</span>
                          <span className="text-xs text-cyan-300 font-mono">{warning.confidence} confidence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-slate-300 ml-14">{warning.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-800 bg-slate-950/70 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.12)]">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Emergency Control Panel</p>
              <h2 className="mt-2 text-3xl font-semibold">Critical actions</h2>
            </div>
            <div className="space-y-4">
              {controls.map((control) => (
                <div key={control.label} className="space-y-3">
                  <button className="group w-full rounded-3xl border-2 border-slate-700 bg-slate-900/80 px-6 py-5 text-left text-sm font-semibold text-[#E2E8F0] transition-all duration-300 hover:border-rose-400/50 hover:bg-rose-500/10 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)] focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-slate-800/50 group-hover:bg-rose-500/20 transition-colors">
                          <control.icon className="h-5 w-5 text-slate-300 group-hover:text-rose-300 transition-colors" />
                        </div>
                        <span className="text-base">{control.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-600 group-hover:bg-rose-400 transition-colors"></div>
                        <span className="text-xs text-slate-500 uppercase tracking-[0.2em]">OFFLINE</span>
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                      <ShieldCheck className="h-3 w-3" />
                      REQUIRES 2FA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
