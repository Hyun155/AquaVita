"use client"

import { useState, useEffect } from "react"
import { 
  Droplets, Fan, Lightbulb, ShieldAlert, Zap, 
  Activity, Cpu, ShieldCheck, Sparkles, Database, ArrowRight, 
  Timer, Waves, AlertTriangle, Power, RotateCcw, ShieldX, Radio
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

const pipelineSteps = [
  { label: "Sensor Input", val: "Humidity 78%", icon: Database },
  { label: "AI Analysis", val: "Fungal Risk", icon: Cpu },
  { 
    label: "Decision", 
    val: "Rule R-27", 
    icon: Sparkles, 
    detail: "Rule R-27: If ambient humidity exceeds target by 10% sustained, AI triggers a 15% airflow boost to disrupt fungal spore settlement." 
  },
  { label: "Action", val: "Airflow +15%", icon: Fan },
  { label: "Outcome", val: "Stable", icon: ShieldCheck },
]

export default function AutomationEnginePage() {
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [isEmergencyHalted, setIsEmergencyHalted] = useState(false)
  
  // 模拟动态数值状态
  const [stats, setStats] = useState({
    ph: 7.2,
    temp: 24.5,
    ec: 1.8
  })

  // AI 接管后的数值修正逻辑
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoMode && !isEmergencyHalted) {
      interval = setInterval(() => {
        setStats(prev => ({
          ph: prev.ph > 6.2 ? Math.max(6.2, parseFloat((prev.ph - 0.02).toFixed(2))) : prev.ph,
          temp: prev.temp > 22.5 ? Math.max(22.5, parseFloat((prev.temp - 0.1).toFixed(1))) : prev.temp,
          ec: prev.ec < 2.1 ? Math.min(2.1, parseFloat((prev.ec + 0.01).toFixed(2))) : prev.ec
        }))
      }, 100)
    } else if (!isAutoMode) {
      setStats({ ph: 7.2, temp: 24.5, ec: 1.8 })
    }
    return () => clearInterval(interval)
  }, [isAutoMode, isEmergencyHalted])

  // 紧急控制逻辑处理
  const handleEmergencyAction = (actionName: string) => {
    const confirmed = window.confirm(`[SECURITY AUTHENTICATION] \n\nAction: ${actionName}\nStatus: REQUIRES 2FA APPROVAL\n\nProceed with emergency override?`);
    
    if (confirmed) {
      if (actionName === "Master Shutdown") {
        setIsEmergencyHalted(true)
        setIsAutoMode(false)
        setStats({ ph: 7.2, temp: 24.5, ec: 1.8 }) // 系统关停，数值恢复异常状态
      } else {
        alert(`${actionName} sequence initiated successfully.`);
      }
    }
  }

  return (
    <div className={`space-y-8 pb-10 min-h-screen p-4 transition-colors duration-500 ${isEmergencyHalted ? "bg-rose-50/30" : "bg-[#F9FBF9]"}`}>
      
      {/* 1. Header & AI State Toggle */}
      <div className="glass-card rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 font-black">Module 02 / Automation</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 italic">Automation Orchestrator</h1>
            <p className="text-slate-600 font-medium italic">Autonomous infrastructure coordination and environmental control logic.</p>
          </div>
          <div className="flex gap-3">
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 border transition-all ${
              isEmergencyHalted ? "bg-rose-100 border-rose-300" : (isAutoMode ? "bg-emerald-50 border-emerald-200" : "bg-slate-100 border-slate-300")
            }`}>
              <div className={`h-2 w-2 rounded-full ${isEmergencyHalted ? "bg-rose-600" : (isAutoMode ? "bg-emerald-500 animate-pulse" : "bg-slate-400")}`} />
              <span className={`text-[10px] font-black tracking-widest uppercase ${isEmergencyHalted ? "text-rose-600" : (isAutoMode ? "text-emerald-600" : "text-slate-500")}`}>
                {isEmergencyHalted ? "System Halted" : (isAutoMode ? "AI Control Active" : "Manual Mode")}
              </span>
            </div>
            <button 
              disabled={isEmergencyHalted}
              onClick={() => setIsAutoMode(!isAutoMode)}
              className={`rounded-full px-8 py-3 text-sm font-black transition-all shadow-lg text-white ${
                isAutoMode ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-950 hover:bg-slate-800"
              } ${isEmergencyHalted && "opacity-20 cursor-not-allowed"}`}
            >
              {isAutoMode ? "Switch to Manual" : "Return to AI Auto"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC CHEMISTRY MONITORING (image_3ad754) */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* PH LEVEL */}
        <div className={`glass-card rounded-[24px] border p-6 transition-all duration-1000 ${stats.ph > 6.5 ? "border-rose-200 bg-rose-50/50" : "border-emerald-200 bg-emerald-50/30"}`}>
          <p className="text-[10px] font-black text-slate-400 tracking-widest flex justify-between uppercase">
            PH LEVEL <span>{stats.ph > 6.5 ? "⚠️ DRIFT" : "✓ OPTIMAL"}</span>
          </p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className={`text-4xl font-black transition-colors ${stats.ph > 6.5 ? "text-rose-600" : "text-emerald-600"}`}>
              {stats.ph.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400">pH</span>
          </div>
          <div className="mt-6 flex justify-between text-[10px] font-bold border-t border-slate-100 pt-4 text-slate-400">
            <span>TARGET: 5.5 - 6.5</span>
          </div>
        </div>

        {/* WATER TEMP */}
        <div className="glass-card rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">WATER TEMP</p>
          <div className="mt-4 flex items-baseline gap-1 text-slate-950 font-black">
            <span className="text-4xl">{stats.temp.toFixed(1)}</span>
            <span className="text-xs text-slate-400">°C</span>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4">
             <p className="text-[10px] font-bold text-slate-400 uppercase">Target: 18 - 26 °C</p>
          </div>
        </div>

        {/* EC LEVEL */}
        <div className="glass-card rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">EC LEVEL</p>
          <div className="mt-4 flex items-baseline gap-1 text-slate-950 font-black">
            <span className="text-4xl">{stats.ec.toFixed(2)}</span>
            <span className="text-xs text-slate-400">mS/cm</span>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4">
             <p className="text-[10px] font-bold text-slate-400 uppercase">Target: 1.0 - 2.5</p>
          </div>
        </div>
      </div>

      {/* 3. Automation Pipeline (Flowchart) */}
      <div className={`glass-card rounded-[32px] border border-slate-200 bg-white p-8 shadow-md transition-all ${
        (isEmergencyHalted || !isAutoMode) && "opacity-50 grayscale-[0.5]"
      }`}>
        <h2 className={`text-xl font-black mb-8 flex items-center gap-2 uppercase tracking-tight ${isEmergencyHalted ? "text-rose-600" : "text-emerald-600"}`}>
          <Activity className="h-6 w-6 stroke-[3px]" /> Automation Pipeline {isEmergencyHalted && "- EMERGENCY STOP"}
        </h2>
        <div className="relative flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="absolute top-7 left-0 w-full h-[3px] bg-slate-100 hidden md:block" />
          {pipelineSteps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center w-full md:w-auto group">
              <div className={`h-14 w-14 rounded-full bg-white border-[3px] flex items-center justify-center transition-all ${
                isAutoMode ? "border-emerald-500 shadow-sm" : "border-slate-300"
              } ${isEmergencyHalted && "border-rose-500 shadow-none"}`}>
                <step.icon className={`h-7 w-7 stroke-[2.5px] ${isEmergencyHalted ? "text-rose-600" : (isAutoMode ? "text-emerald-600" : "text-slate-400")}`} />
              </div>
              <p className="mt-4 text-[11px] uppercase font-black text-slate-400 tracking-wider">{step.label}</p>
              <div className="group relative cursor-help">
                <p className={`text-sm font-bold mt-1 underline underline-offset-4 ${isEmergencyHalted ? "text-rose-700 decoration-rose-500/30" : "text-emerald-700 decoration-emerald-500/30"}`}>
                  {step.val}
                </p>
                {step.detail && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl leading-relaxed text-left font-medium">
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Logic & Efficiency Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-[32px] border border-slate-200 bg-white p-8 shadow-md">
           <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-6 border-l-4 border-emerald-500 pl-3 italic">Rule-Based Logic</h3>
           <div className="space-y-3 font-mono text-[11px]">
              <div className="flex items-center gap-3 text-slate-950 font-bold bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                <span className="text-emerald-600 italic">IF</span> <span>humidity &gt; 75%</span> 
                <ArrowRight className="h-4 w-4 text-emerald-600" /> <span className="text-emerald-700 font-black tracking-tighter">increase_airflow(15%)</span>
                <span className="ml-auto text-[9px] text-emerald-500 font-black">RULE R-27</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-bold bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 italic">IF</span> <span>EC_drift sustained</span> 
                <ArrowRight className="h-4 w-4 text-slate-300" /> <span className="text-slate-500">trigger_nutrient_cycle()</span>
              </div>
           </div>
        </div>
        <div className="glass-card rounded-[32px] border border-slate-200 bg-white p-8 shadow-md text-slate-950">
           <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 border-l-4 border-slate-400 pl-3 italic">Efficiency Impact</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-100 pb-2 font-black">
                <span className="text-xs text-slate-500">WATER CONSUMPTION</span>
                <span className="text-lg text-emerald-600">-31.4%</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-2 font-black">
                <span className="text-xs text-slate-500">PH STABILITY (AVG)</span>
                <span className="text-lg text-emerald-600">99.2%</span>
              </div>
           </div>
        </div>
      </div>

      {/* 5. Prediction & Emergency Panel */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Failure Prediction Center (image_3acf98) */}
        <div className="glass-card rounded-[32px] border border-slate-200 bg-white p-8 shadow-md text-slate-950">
          <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.2em] mb-6 border-l-4 border-amber-500 pl-3 italic">Failure Prediction Center</h3>
          <div className="grid gap-4 md:grid-cols-2 text-slate-950">
            <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <AlertTriangle className="h-4 w-4" /> Pump Vibration
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                Spectral anomaly at 47 Hz. Inspection required within 7 days.
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-2 text-slate-950">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <Radio className="h-4 w-4 text-emerald-950" /> Sync Analysis
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                Recalibration scheduled at 02:00 to correct minor EC drift.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Control Panel (image_3acf98) */}
        <div className={`glass-card rounded-[32px] border p-8 shadow-md transition-all duration-500 ${
          isEmergencyHalted ? "bg-rose-600 border-rose-700 ring-4 ring-rose-200" : "bg-white border-rose-200 bg-rose-50/10"
        }`}>
          <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 border-l-4 pl-3 ${
            isEmergencyHalted ? "text-white border-white" : "text-rose-600 border-rose-500"
          }`}>
            {isEmergencyHalted ? "SYSTEM HALTED" : "Emergency Control Panel"}
          </h3>
          
          <div className="space-y-3">
            {!isEmergencyHalted ? (
              <>
                <button 
                  onClick={() => handleEmergencyAction("Master Shutdown")}
                  className="w-full group flex items-center justify-between p-4 rounded-2xl bg-white border border-rose-200 hover:bg-rose-600 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-100 text-rose-600 group-hover:bg-white/20 group-hover:text-white">
                      <Power className="h-5 w-5" />
                    </div>
                    <div className="text-left text-slate-950">
                      <p className="text-sm font-black group-hover:text-white uppercase tracking-tighter">Master Shutdown</p>
                      <p className="text-[10px] font-bold text-slate-400 group-hover:text-rose-100 uppercase">Requires 2FA Approval</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-rose-300 group-hover:text-white" />
                </button>

                <button 
                  onClick={() => handleEmergencyAction("Fallback Circulation")}
                  className="w-full group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-900 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-white/20 group-hover:text-white">
                      <RotateCcw className="h-5 w-5" />
                    </div>
                    <div className="text-left text-slate-950 font-black">
                      <p className="text-sm group-hover:text-white uppercase tracking-tighter">Fallback Loop</p>
                      <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-300 uppercase">Engage secondary pump</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-white" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEmergencyHalted(false)}
                className="w-full py-6 bg-white text-rose-600 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl uppercase tracking-[0.2em] text-sm"
              >
                Reset Infrastructure
              </button>
            )}
          </div>
          
          {!isEmergencyHalted && (
            <div className="mt-4 flex items-center gap-2 justify-center py-2 bg-rose-600/5 rounded-xl border border-dashed border-rose-200">
               <ShieldX className="h-3 w-3 text-rose-400" />
               <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Authenticated Operators Only</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}