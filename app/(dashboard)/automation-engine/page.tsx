"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Droplets, Fan, Lightbulb, Zap, Activity, Cpu,
  Sparkles, Database, ArrowRight, Eye, Power, RotateCcw,
  UserCheck, ShieldAlert, Pause, Play, CheckCircle2,
  ShieldCheck, RefreshCw, Key, Shield, Thermometer,
  Waves, Sun, Lock, AlertTriangle, X, Clock, Gauge
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type ControlMode = 'autonomous' | 'assisted' | 'manual'
type PipelineStatus = 'idle' | 'processing' | 'completed' | 'failed'

interface PipelineStep {
  id: number
  label: string
  icon: React.ComponentType<{ className?: string }>;
  val: string
  time: string
  conf: number
  status: PipelineStatus
}

interface AutomationSystem {
  active: boolean
  state: string
  priority: 'High' | 'Medium' | 'Low'
  lastAction: string
}

interface Rule {
  id: string
  name: string
  ifCondition: string
  thenAction: string
  priority: 'High' | 'Medium' | 'Low'
  enabled: boolean
  triggered: boolean
  lastTriggered: string | null
}

interface PendingAction {
  id: string
  ruleId: string
  description: string
  systemKey: string
  action: 'activate' | 'deactivate'
}

interface Operator {
  name: string
  role: string
  authenticated: boolean
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SYSTEM_ICONS: Record<string, React.ElementType> = {
  climate: Thermometer,
  nutrient: Droplets,
  irrigation: Waves,
  airflow: Fan,
  uv: Sun,
}

const SYSTEM_LABELS: Record<string, string> = {
  climate: 'Climate Regulation',
  nutrient: 'Nutrient Distribution',
  irrigation: 'Irrigation Scheduler',
  airflow: 'Airflow Control',
  uv: 'UV Sterilization',
}

const INITIAL_SYSTEMS: Record<string, AutomationSystem> = {
  climate: { active: true, state: "Active Balancing", priority: "High", lastAction: "10:31 AM" },
  nutrient: { active: true, state: "Optimized Cycling", priority: "High", lastAction: "10:30 AM" },
  irrigation: { active: true, state: "Flow Timing Active", priority: "Medium", lastAction: "10:30 AM" },
  airflow: { active: false, state: "Standby", priority: "High", lastAction: "10:29 AM" },
  uv: { active: false, state: "Scheduled Standby", priority: "Low", lastAction: "10:28 AM" },
}

const INITIAL_RULES: Rule[] = [
  {
    id: 'R-27',
    name: 'Humidity Control',
    ifCondition: 'Ambient humidity exceeds 75% for sustained period',
    thenAction: 'Increase airflow by 15% to disrupt fungal spore settlement',
    priority: 'High',
    enabled: true,
    triggered: false,
    lastTriggered: null,
  },
  {
    id: 'R-12',
    name: 'EC Drift Correction',
    ifCondition: 'EC level drifts outside 1.0-2.5 mS/cm range for >5 min',
    thenAction: 'Trigger nutrient balancing cycle to restore EC equilibrium',
    priority: 'Medium',
    enabled: true,
    triggered: false,
    lastTriggered: null,
  },
  {
    id: 'R-08',
    name: 'Temperature Safeguard',
    ifCondition: 'Water temperature exceeds 28°C threshold',
    thenAction: 'Activate cooling system and increase circulation rate',
    priority: 'High',
    enabled: true,
    triggered: false,
    lastTriggered: null,
  },
  {
    id: 'R-19',
    name: 'Contamination Defense',
    ifCondition: 'Pathogen contamination risk detected by AI analysis',
    thenAction: 'Activate UV sterilization sequence for 30-min cycle',
    priority: 'Medium',
    enabled: true,
    triggered: false,
    lastTriggered: null,
  },
]

const MODE_DESCRIPTIONS = {
  autonomous: {
    title: 'Autonomous Mode',
    capabilities: [
      'AI automatically adjusts all environmental parameters',
      'Rules trigger and execute without human confirmation',
      'Systems activate/deactivate based on real-time sensor data',
      'Self-correcting feedback loops maintain optimal conditions',
    ],
  },
  assisted: {
    title: 'Assisted Mode',
    capabilities: [
      'AI detects conditions and suggests corrective actions',
      'Human must approve each action before execution',
      'Suggestions include confidence score and affected systems',
      'Auto-execution is disabled - AI waits for approval',
    ],
  },
  manual: {
    title: 'Manual Override',
    capabilities: [
      'All automatic actions are suspended',
      'Human has direct control over every system',
      'AI monitoring continues but cannot execute',
      'System toggles are unlocked for manual switching',
    ],
  },
}

export default function AutomationEnginePage() {
  // ─── Core State ──────────────────────────────────────────────────────────

  const [mode, setControlMode] = useState<ControlMode>('autonomous')
  const [isEmergencyHalted, setIsEmergencyHalted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Environmental simulation
  const [stats, setStats] = useState({ ph: 7.14, humidity: 78, ec: 1.8, temp: 25.2 })

  // Systems & Rules
  const [systems, setSystems] = useState(INITIAL_SYSTEMS)
  const [rules, setRules] = useState(INITIAL_RULES)

  // Pipeline
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([])
  const [pipelineRun, setPipelineRun] = useState(0)

  // Assisted mode pending actions
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([])


  // Failsafe
  const [fallbackActive, setFallbackActive] = useState(false)
  const [operator, setOperator] = useState<Operator>({ name: 'Alex Morgan', role: 'Senior Operator', authenticated: true })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authInput, setAuthInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [safetyLimits, setSafetyLimits] = useState({
    maxPh: 8.0,
    maxTemp: 35,
    maxEc: 3.5,
    minPh: 4.0,
    minTemp: 10,
    minEc: 0.5,
  })

  // Decision log
  const [decisionLog, setDecisionLog] = useState<{ time: string; event: string }[]>([])

  const addLog = useCallback((event: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setDecisionLog(prev => [{ time, event }, ...prev].slice(0, 50))
  }, [])

  // ─── Pipeline Simulation ─────────────────────────────────────────────────

  const runPipeline = useCallback((triggerRule: Rule, systemKey: string, actionVal: string) => {
    const steps: PipelineStep[] = [
      { id: 1, label: "Sensor Signal", icon: Database, val: `Humidity ${stats.humidity}%`, time: "0.0s", conf: 0, status: 'idle' },
      { id: 2, label: "AI Analysis", icon: Cpu, val: "Analyzing sensor patterns", time: "0.0s", conf: 0, status: 'idle' },
      { id: 3, label: "Pattern Detection", icon: Eye, val: "Scanning for anomalies", time: "0.0s", conf: 0, status: 'idle' },
      { id: 4, label: "Rule Matching", icon: CheckCircle2, val: `Evaluating Rule ${triggerRule.id}`, time: "0.0s", conf: 0, status: 'idle' },
      { id: 5, label: "Decision", icon: Sparkles, val: actionVal, time: "0.0s", conf: 0, status: 'idle' },
      { id: 6, label: "Action", icon: Zap, val: "Awaiting execution", time: "0.0s", conf: 0, status: 'idle' },
      { id: 7, label: "Outcome", icon: ShieldCheck, val: "Pending", time: "0.0s", conf: 0, status: 'idle' },
    ]
    setPipelineSteps(steps)

    // Animate through each step with realistic timing and confidence
    const delays = [0, 800, 1300, 1100, 600, 700, 1400]
    let cumulative = 0

    steps.forEach((step, i) => {
      cumulative += delays[i]
      setTimeout(() => {
        setPipelineSteps(prev => {
          const updated = [...prev]
          if (updated[i]) {
            updated[i] = { ...updated[i], status: 'processing', time: `${(delays[i] / 1000).toFixed(1)}s` }
          }
          return updated
        })

        // Complete after a short processing time
        setTimeout(() => {
          const confValues = [100, 97, 92, 95, 94, 100, 96]
          const statusValues: PipelineStatus[] = ['completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'completed']
          const valUpdates = [
            `Humidity ${stats.humidity}%`,
            triggerRule.id === 'R-27' ? 'Fungal risk identified' : triggerRule.id === 'R-12' ? 'EC drift detected' : triggerRule.id === 'R-08' ? 'Temperature anomaly' : 'Pathogen alert',
            'High confidence match',
            `Rule ${triggerRule.id} triggered`,
            actionVal,
            `${SYSTEM_LABELS[systemKey]} adjusted`,
            'Conditions stabilizing',
          ]
          setPipelineSteps(prev => {
            const updated = [...prev]
            if (updated[i]) {
              updated[i] = { ...updated[i], status: statusValues[i], conf: confValues[i], val: valUpdates[i] }
            }
            return updated
          })
        }, delays[i] * 0.7)
      }, cumulative)
    })
  }, [stats.humidity])

  // Refs to avoid recreating effect when these arrays/funcs change
  const rulesRef = useRef(rules)
  useEffect(() => { rulesRef.current = rules }, [rules])
  const pendingActionsRef = useRef(pendingActions)
  useEffect(() => { pendingActionsRef.current = pendingActions }, [pendingActions])
  const runPipelineRef = useRef(runPipeline)
  useEffect(() => { runPipelineRef.current = runPipeline }, [runPipeline])
  const addLogRef = useRef(addLog)
  useEffect(() => { addLogRef.current = addLog }, [addLog])

  // ─── Rule Evaluation & Auto-Correction ───────────────────────────────────

  useEffect(() => {
    if (isPaused || isEmergencyHalted) return

    const interval = setInterval(() => {
      // Simulate environmental drift
      setStats(prev => {
        let ph = prev.ph
        let humidity = prev.humidity
        let ec = prev.ec
        let temp = prev.temp

        // Natural drift
        humidity += Math.random() > 0.7 ? 1 : -0.3
        if (humidity > 85) humidity = 85
        if (humidity < 40) humidity = 40

        ph += Math.random() > 0.8 ? 0.05 : -0.01
        if (ph > 8.5) ph = 8.5
        if (ph < 4.0) ph = 4.0

        ec += Math.random() > 0.7 ? 0.03 : -0.01
        if (ec > 3.0) ec = 3.0
        if (ec < 0.8) ec = 0.8

        temp += Math.random() > 0.8 ? 0.3 : -0.1
        if (temp > 32) temp = 32
        if (temp < 15) temp = 15

        return {
          ph: parseFloat(ph.toFixed(2)),
          humidity: Math.round(humidity),
          ec: parseFloat(ec.toFixed(2)),
          temp: parseFloat(temp.toFixed(1)),
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isPaused, isEmergencyHalted])

  // Autonomous correction loop
  useEffect(() => {
    if (mode !== 'autonomous' || isPaused || isEmergencyHalted) return

    const correctionInterval = setInterval(() => {
      setStats(prev => {
        let ph = prev.ph
        let humidity = prev.humidity
        let ec = prev.ec
        let temp = prev.temp

        // Auto-correct towards optimal ranges
        if (ph > 6.5) ph = parseFloat((ph - 0.03).toFixed(2))
        if (humidity > 70) humidity -= 2
        if (ec < 2.0) ec = parseFloat((ec + 0.02).toFixed(2))
        if (temp > 26) temp = parseFloat((temp - 0.2).toFixed(1))

        return { ph, humidity: Math.round(humidity), ec, temp }
      })
    }, 3000)

    return () => clearInterval(correctionInterval)
  }, [mode, isPaused, isEmergencyHalted])

  // Rule trigger evaluation
  useEffect(() => {
    if (isPaused || isEmergencyHalted) return

    // R-27: Humidity > 75%
    if (stats.humidity > 75 && !rulesRef.current.find(r => r.id === 'R-27')?.triggered) {
      if (mode === 'autonomous') {
        setRules(prev => prev.map(r => r.id === 'R-27' ? {
          ...r, triggered: true,
          lastTriggered: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        } : r))
        setSystems(prev => ({ ...prev, airflow: { ...prev.airflow, active: true, state: "Active - 15% Boost", lastAction: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) } }))
        runPipelineRef.current(rulesRef.current.find(r => r.id === 'R-27')!, 'airflow', 'Increase airflow 15%')
        addLogRef.current('R-27 AUTO-EXECUTED: Airflow increased 15%')
      } else if (mode === 'assisted') {
        const existing = pendingActionsRef.current.find(a => a.ruleId === 'R-27')
        if (!existing) {
          setPendingActions(prev => [...prev, {
            id: `pa-R27-${Date.now()}`,
            ruleId: 'R-27',
            description: 'Increase Airflow by 15% (Humidity > 75%)',
            systemKey: 'airflow',
            action: 'activate',
          }])
          addLogRef.current('R-27 SUGGESTED: Airflow increase awaiting approval')
        }
      }
    }

    // R-12: EC drift
    if ((stats.ec < 1.0 || stats.ec > 2.5) && !rulesRef.current.find(r => r.id === 'R-12')?.triggered) {
      if (mode === 'autonomous') {
        setRules(prev => prev.map(r => r.id === 'R-12' ? {
          ...r, triggered: true,
          lastTriggered: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        } : r))
        setSystems(prev => ({ ...prev, nutrient: { ...prev.nutrient, active: true, state: "Balancing Cycle", lastAction: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) } }))
        addLog('R-12 AUTO-EXECUTED: Nutrient balancing triggered')
      } else if (mode === 'assisted') {
        const existing = pendingActionsRef.current.find(a => a.ruleId === 'R-12')
        if (!existing) {
          setPendingActions(prev => [...prev, {
            id: `pa-R12-${Date.now()}`,
            ruleId: 'R-12',
            description: `Trigger nutrient balancing (EC: ${stats.ec} mS/cm)`,
            systemKey: 'nutrient',
            action: 'activate',
          }])
        }
      }
    }

    // R-08: Temperature
    if (stats.temp > 28 && !rulesRef.current.find(r => r.id === 'R-08')?.triggered) {
      if (mode === 'autonomous') {
        setRules(prev => prev.map(r => r.id === 'R-08' ? {
          ...r, triggered: true,
          lastTriggered: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        } : r))
        setSystems(prev => ({ ...prev, climate: { ...prev.climate, active: true, state: "Emergency Cooling", lastAction: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) } }))
        addLogRef.current('R-08 AUTO-EXECUTED: Cooling system activated')
      } else if (mode === 'assisted') {
        const existing = pendingActionsRef.current.find(a => a.ruleId === 'R-08')
        if (!existing) {
          setPendingActions(prev => [...prev, {
            id: `pa-R08-${Date.now()}`,
            ruleId: 'R-08',
            description: `Activate cooling system (Temp: ${stats.temp}°C)`,
            systemKey: 'climate',
            action: 'activate',
          }])
        }
      }
    }

    // R-19: Contamination (simulated - triggers when humidity is very high AND temp is high)
    if (stats.humidity > 80 && stats.temp > 27 && !rulesRef.current.find(r => r.id === 'R-19')?.triggered) {
      if (mode === 'autonomous') {
        setRules(prev => prev.map(r => r.id === 'R-19' ? {
          ...r, triggered: true,
          lastTriggered: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        } : r))
        setSystems(prev => ({ ...prev, uv: { ...prev.uv, active: true, state: "Sterilization Cycle", lastAction: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) } }))
        addLogRef.current('R-19 AUTO-EXECUTED: UV sterilization activated')
      } else if (mode === 'assisted') {
        const existing = pendingActionsRef.current.find(a => a.ruleId === 'R-19')
        if (!existing) {
          setPendingActions(prev => [...prev, {
            id: `pa-R19-${Date.now()}`,
            ruleId: 'R-19',
            description: 'Activate UV sterilization (Contamination risk)',
            systemKey: 'uv',
            action: 'activate',
          }])
        }
      }
    }

    // Reset triggered states when conditions normalize
    if (stats.humidity <= 70) {
      setRules(prev => prev.map(r => r.id === 'R-27' && r.triggered ? { ...r, triggered: false } : r))
      setSystems(prev => ({ ...prev, airflow: { ...prev.airflow, active: false, state: "Standby" } }))
    }
    if (stats.ec >= 1.0 && stats.ec <= 2.5) {
      setRules(prev => prev.map(r => r.id === 'R-12' && r.triggered ? { ...r, triggered: false } : r))
    }
    if (stats.temp <= 26) {
      setRules(prev => prev.map(r => r.id === 'R-08' && r.triggered ? { ...r, triggered: false } : r))
      setSystems(prev => ({ ...prev, climate: prev.climate.state === "Emergency Cooling" ? { ...prev.climate, state: "Active Balancing" } : prev.climate }))
    }
    if (stats.humidity <= 75 || stats.temp <= 25) {
      setRules(prev => prev.map(r => r.id === 'R-19' && r.triggered ? { ...r, triggered: false } : r))
      setSystems(prev => {
        const shouldDeactivateUv = rulesRef.current.find(r => r.id === 'R-19')?.triggered === false && prev.uv.state === "Sterilization Cycle"
        return { ...prev, uv: shouldDeactivateUv ? { ...prev.uv, active: false, state: "Scheduled Standby" } : prev.uv }
      })
    }
  }, [stats, mode, isPaused, isEmergencyHalted])

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleModeChange = (newMode: ControlMode) => {
    setControlMode(newMode)
    setPendingActions([])
    addLog(`Mode changed to ${newMode.toUpperCase()}`)
  }

  const handleApproveAction = (action: PendingAction) => {
    setSystems(prev => ({
      ...prev,
      [action.systemKey]: {
        ...prev[action.systemKey as keyof typeof prev],
        active: action.action === 'activate',
        state: action.action === 'activate' ? 'Activated by Operator' : 'Deactivated by Operator',
        lastAction: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
    }))
    setRules(prev => prev.map(r => r.id === action.ruleId ? {
      ...r, triggered: action.action === 'activate',
      lastTriggered: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } : r))
    setPendingActions(prev => prev.filter(a => a.id !== action.id))
    addLog(`APPROVED: ${action.description}`)
    runPipeline(rules.find(r => r.id === action.ruleId)!, action.systemKey, action.description)
  }

  const handleDismissAction = (action: PendingAction) => {
    setPendingActions(prev => prev.filter(a => a.id !== action.id))
    addLog(`DISMISSED: ${action.description}`)
  }

  const handleEmergencyShutdown = () => {
    setIsEmergencyHalted(true)
    setControlMode('manual')
    setIsPaused(false)
    setSystems(prev => {
      const updated = { ...prev }
      for (const key in updated) {
        updated[key] = { ...updated[key], active: false, state: "SHUTDOWN" }
      }
      return updated
    })
    setPendingActions([])
    addLog('EMERGENCY SHUTDOWN ACTIVATED')
  }

  const handleResetSystem = () => {
    setIsEmergencyHalted(false)
    setSystems(INITIAL_SYSTEMS)
    setRules(INITIAL_RULES)
    setStats({ ph: 7.14, humidity: 78, ec: 1.8, temp: 25.2 })
    addLog('System reset from emergency shutdown')
  }

  const handleFallback = () => {
    setFallbackActive(true)
    setSystems(prev => ({
      ...prev,
      irrigation: { ...prev.irrigation, active: true, state: "Fallback Circulation Active" },
      climate: { ...prev.climate, active: true, state: "Basic Monitoring" },
    }))
    addLog('Fallback circulation system engaged')
    setTimeout(() => setFallbackActive(false), 10000)
  }

  const handleAuth = () => {
    if (authInput.toLowerCase() === 'admin' || authInput === '1234') {
      setOperator({ ...operator, authenticated: true })
      setShowAuthModal(false)
      setAuthInput('')
      setAuthError('')
      addLog('Operator authenticated successfully')
    } else {
      setAuthError('Invalid credentials. Use "admin" / "1234"')
    }
  }

  const handleDeauth = () => {
    setOperator({ ...operator, authenticated: false })
    addLog('Operator deauthenticated')
  }

  const handleManualToggle = (key: string) => {
    if (mode !== 'manual') return
    setSystems(prev => ({
      ...prev,
      [key]: {
        ...prev[key as keyof typeof prev],
        active: !prev[key as keyof typeof prev].active,
        state: !prev[key as keyof typeof prev].active ? 'Manually Activated' : 'Manually Deactivated',
        lastAction: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
    }))
    addLog(`Manual ${systems[key as keyof typeof systems].active ? 'DEACTIVATED' : 'ACTIVATED'}: ${SYSTEM_LABELS[key]}`)
  }

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    addLog(`Rule ${ruleId} ${rules.find(r => r.id === ruleId)?.enabled ? 'DISABLED' : 'ENABLED'}`)
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className={`space-y-6 pb-10 min-h-screen p-6 text-slate-950 transition-colors duration-500 ${isEmergencyHalted ? "bg-rose-50" : "bg-[#F9FBF9]"}`}>

      {/* ─── SECTION 1: SYSTEM CONTROL MODE ──────────────────────────────── */}
      <div className="glass-card rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <span className="bg-blue-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-[10px]">1</span>
              System Control Mode
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Select who controls the system execution</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <UserCheck className="h-3 w-3 text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-700 uppercase">{operator.authenticated ? `${operator.name} Authenticated` : 'Not Authenticated'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['autonomous', 'assisted', 'manual'] as ControlMode[]).map((m) => {
            const info = MODE_DESCRIPTIONS[m]
            const colors = { autonomous: 'emerald', assisted: 'amber', manual: 'rose' } as const
            const icons = { autonomous: Cpu, assisted: UserCheck, manual: ShieldAlert }
            const Icon = icons[m]
            const color = colors[m]
            const isActive = mode === m

            return (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                disabled={isEmergencyHalted}
                className={`relative p-5 rounded-2xl border-2 transition-all text-left ${
                  isActive
                    ? `border-${color}-500 bg-${color}-50/30`
                    : "border-slate-100 bg-white hover:border-slate-200"
                } ${isEmergencyHalted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <Icon className={`h-8 w-8 ${isActive ? `text-${color}-600` : "text-slate-400"}`} />
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${isActive ? `bg-${color}-500 border-${color}-500` : "border-slate-200"}`}>
                    {isActive && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                </div>
                <p className={`font-black text-sm ${isActive ? `text-${color}-700` : "text-slate-600"}`}>{info.title}</p>

                {/* Capabilities list - shows what each mode does */}
                <div className="mt-3 space-y-1.5">
                  {info.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full mt-1 flex-shrink-0 ${isActive ? `bg-${color}-400` : 'bg-slate-300'}`} />
                      <p className={`text-[9px] leading-relaxed font-medium ${isActive ? `text-${color}-600` : 'text-slate-400'}`}>{cap}</p>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Current mode status bar */}
        <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-blue-600" />
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
              {mode === 'manual' ? "Full Manual Control Enabled - All AI actions suspended" :
               mode === 'assisted' ? "Assisted Mode - AI suggests, you approve" :
               "Autonomous Mode - AI controls all systems automatically"}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {isEmergencyHalted && (
              <span className="text-[8px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full animate-pulse uppercase">Emergency Halt</span>
            )}
            {isPaused && !isEmergencyHalted && (
              <span className="text-[8px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse uppercase">Paused</span>
            )}
            <div className="flex gap-3 opacity-60">
              <Fan className="h-4 w-4" /> <Droplets className="h-4 w-4" /> <Zap className="h-4 w-4" /> <Lightbulb className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── ASSISTED MODE PENDING ACTIONS ───────────────────────────────── */}
      {mode === 'assisted' && pendingActions.length > 0 && (
        <div className="space-y-3">
          {pendingActions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 p-2 rounded-full text-white"><Sparkles className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs font-black text-amber-900 uppercase">AI Suggestion</p>
                  <p className="text-sm font-bold text-amber-700">Apply {action.ruleId}: {action.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDismissAction(action)} className="px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl">Dismiss</button>
                <button onClick={() => handleApproveAction(action)} className="px-6 py-2 bg-amber-500 text-white text-xs font-black rounded-xl shadow-lg hover:bg-amber-600">Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── SECTION 2: LIVE DECISION PIPELINE ───────────────────────────── */}
      <div className={`glass-card rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-all ${isPaused || isEmergencyHalted ? "opacity-40 grayscale" : ""}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
            <span className="bg-blue-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-[10px]">2</span>
            Live Decision Pipeline
          </h2>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[8px] font-black animate-pulse uppercase">Live</div>
            <button
              onClick={() => {
                // Manually trigger a pipeline run with the most relevant rule
                const triggeredRule = rules.find(r => r.triggered) || rules[0]
                const systemKey = triggeredRule.id === 'R-27' ? 'airflow' : triggeredRule.id === 'R-12' ? 'nutrient' : triggeredRule.id === 'R-08' ? 'climate' : 'uv'
                const actionVal = triggeredRule.thenAction.split(' ').slice(0, 3).join(' ')
                setPipelineRun(prev => prev + 1)
                runPipeline(triggeredRule, systemKey, actionVal)
              }}
              disabled={isPaused || isEmergencyHalted}
              className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black rounded-lg uppercase hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Run Pipeline
            </button>
          </div>
        </div>

        <div className="relative flex flex-col lg:flex-row justify-between gap-4 overflow-x-auto pb-4">
          <div className="absolute top-8 left-0 w-full h-[2px] bg-slate-100 hidden lg:block" />

          {pipelineSteps.length > 0 ? pipelineSteps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center min-w-[130px]">
              <div className={`h-16 w-16 rounded-2xl bg-white border-2 flex items-center justify-center transition-all ${
                step.status === 'processing' ? "border-amber-500 shadow-md animate-pulse" :
                step.status === 'completed' ? "border-emerald-500 shadow-md" :
                step.status === 'failed' ? "border-rose-500 shadow-md" :
                "border-slate-100"
              }`}>
                <step.icon className={`h-7 w-7 ${
                  step.status === 'processing' ? "text-amber-600" :
                  step.status === 'completed' ? "text-emerald-600" :
                  step.status === 'failed' ? "text-rose-600" :
                  "text-slate-300"
                }`} />
              </div>
              <p className="mt-4 text-[9px] uppercase font-black text-slate-400 tracking-tighter">{step.label}</p>
              <p className="text-[10px] font-black text-slate-900 mt-1 max-w-[120px]">{step.val}</p>
              <div className="mt-3 flex flex-col gap-1">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                  step.status === 'processing' ? "bg-amber-100 text-amber-700" :
                  step.status === 'completed' ? "bg-emerald-100 text-emerald-700" :
                  step.status === 'failed' ? "bg-rose-100 text-rose-700" :
                  "bg-slate-100 text-slate-500"
                }`}>{step.status}</span>
                {step.conf > 0 && (
                  <span className="text-[8px] font-bold text-slate-400">Conf: {step.conf}%</span>
                )}
                <span className="text-[8px] font-bold text-slate-300">{step.time}</span>
              </div>
            </div>
          )) : (
            <div className="flex items-center justify-center w-full py-8 text-slate-400">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-[10px] font-black uppercase">Pipeline idle - waiting for trigger</p>
              </div>
            </div>
          )}
        </div>

        {/* Decision Log */}
        {decisionLog.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Recent Decisions</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {decisionLog.slice(0, 10).map((log, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px]">
                  <Clock className="h-3 w-3 text-slate-300" />
                  <span className="text-slate-400 font-bold">{log.time}</span>
                  <span className="text-slate-700 font-bold">{log.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── SECTIONS 3 & 4 SIDE BY SIDE ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SECTION 3: ACTIVE AUTOMATION SYSTEMS */}
        <div className="glass-card rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
          <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="bg-blue-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-[10px]">3</span>
            Active Automation Systems
          </h2>

          {mode === 'autonomous' && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-[9px] font-black text-emerald-700 uppercase flex items-center gap-1.5">
                <Cpu className="h-3 w-3" /> AI controls system toggles - manual switching disabled
              </p>
            </div>
          )}
          {mode === 'assisted' && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-[9px] font-black text-amber-700 uppercase flex items-center gap-1.5">
                <UserCheck className="h-3 w-3" /> AI suggests changes - approve from suggestion bar
              </p>
            </div>
          )}
          {mode === 'manual' && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <p className="text-[9px] font-black text-rose-700 uppercase flex items-center gap-1.5">
                <ShieldAlert className="h-3 w-3" /> Manual control active - toggle systems directly
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(systems).map(([key, sys]) => {
              const SysIcon = SYSTEM_ICONS[key] || Activity
              return (
                <div key={key} className={`p-4 rounded-2xl border transition-all ${
                  sys.active ? "bg-emerald-50/30 border-emerald-100" : "bg-slate-50 border-slate-100"
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const iconClass = `h-4 w-4 ${sys.active ? "text-emerald-600" : "text-slate-400"}`
                        // cast to satisfy mixed icon component prop types
                        // (some icon components may have differing prop typings)
                        const IconComponent = SysIcon as React.ComponentType<{ className?: string }>
                        return <IconComponent className={iconClass} />
                      })()}
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{SYSTEM_LABELS[key]}</p>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${sys.active ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                  </div>
                  <div className={`text-[9px] font-black px-2 py-1 rounded-lg inline-block uppercase ${
                    sys.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                  }`}>
                    {sys.state}
                  </div>
                  <div className="mt-3 flex justify-between text-[8px] font-black text-slate-400 uppercase">
                    <span>Priority: <span className={sys.priority === 'High' ? "text-rose-500" : sys.priority === 'Medium' ? "text-amber-500" : "text-slate-400"}>{sys.priority}</span></span>
                    <span>{sys.lastAction}</span>
                  </div>

                  {/* Mode-dependent controls */}
                  {mode === 'manual' && !isEmergencyHalted && (
                    <button
                      onClick={() => handleManualToggle(key)}
                      className={`mt-3 w-full py-1.5 rounded-lg text-[9px] font-black uppercase shadow-sm transition-all ${
                        sys.active
                          ? "bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100"
                          : "bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {sys.active ? "Force Off" : "Force On"}
                    </button>
                  )}
                  {mode === 'autonomous' && (
                    <div className="mt-3 text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> AI Controlled
                    </div>
                  )}
                  {mode === 'assisted' && (
                    <div className="mt-3 text-[8px] font-black text-amber-500 uppercase flex items-center gap-1">
                      <UserCheck className="h-3 w-3" /> Await Approval
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* SECTION 4: RULE ENGINE */}
        <div className="glass-card rounded-3xl border border-slate-200 bg-white p-6 shadow-md text-slate-950">
          <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="bg-blue-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-[10px]">4</span>
            Rule Engine (Logic Foundation)
          </h2>

          <div className="space-y-3">
            {rules.map(rule => (
              <div key={rule.id} className={`p-4 rounded-xl border transition-all ${
                rule.triggered ? "border-amber-200 bg-amber-50/30 shadow-sm" :
                !rule.enabled ? "border-slate-100 bg-slate-50/50 opacity-50" :
                "border-slate-100 bg-slate-50 shadow-sm"
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-900 uppercase">Rule {rule.id}</span>
                    <span className="text-[8px] font-bold text-slate-500">{rule.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {rule.triggered && (
                      <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 animate-pulse">TRIGGERED</span>
                    )}
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${rule.priority === 'High' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"}`}>{rule.priority}</span>
                  </div>
                </div>

                {/* IF-THEN logic display */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="text-blue-500 italic uppercase font-black">If</span>
                    <span className="text-slate-700">{rule.ifCondition}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <ArrowRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600 italic uppercase font-black">Then</span>
                    <span className="text-slate-700">{rule.thenAction}</span>
                  </div>
                </div>

                {/* Rule metadata & controls */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-2">
                    {rule.lastTriggered && (
                      <span className="text-[8px] font-bold text-slate-400">Last: {rule.lastTriggered}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className={`text-[8px] font-black px-3 py-1 rounded-lg uppercase transition-all ${
                      rule.enabled
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                    }`}
                  >
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECTION 5: FAILSAFE & HUMAN CONTROL ─────────────────────────── */}
      <div className="glass-card rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="bg-blue-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-[10px]">5</span>
          Failsafe & Human Control
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Emergency Shutdown */}
          <div className={`p-5 rounded-3xl border-2 flex flex-col justify-between group transition-all ${
            isEmergencyHalted
              ? "bg-rose-600 border-rose-700 ring-4 ring-rose-200"
              : "border-rose-100 bg-rose-50/20 hover:bg-rose-600"
          }`}>
            <div>
              <Power className={`h-6 w-6 mb-3 ${isEmergencyHalted ? "text-white" : "text-rose-600 group-hover:text-white"}`} />
              <p className={`text-xs font-black uppercase ${isEmergencyHalted ? "text-white" : "text-slate-900 group-hover:text-white"}`}>
                Emergency Shutdown
              </p>
              <p className={`text-[9px] font-medium mt-1 ${isEmergencyHalted ? "text-rose-100" : "text-slate-400 group-hover:text-rose-100"}`}>
                Immediately halts all systems and switches to manual
              </p>
            </div>
            {isEmergencyHalted ? (
              <button
                onClick={handleResetSystem}
                className="mt-4 w-full py-3 bg-white text-rose-600 text-[10px] font-black rounded-xl uppercase shadow-lg hover:bg-rose-50 transition-all"
              >
                Reset System
              </button>
            ) : (
              <button
                onClick={() => {
                  if (confirm('[SECURITY AUTHENTICATION]\n\nAction: Emergency Shutdown\nREQUIRES 2FA APPROVAL\n\nProceed?')) {
                    handleEmergencyShutdown()
                  }
                }}
                className="mt-4 w-full py-3 bg-rose-600 text-white text-[10px] font-black rounded-xl uppercase group-hover:bg-white group-hover:text-rose-600 transition-all shadow-lg shadow-rose-200"
              >
                Activate
              </button>
            )}
          </div>

          {/* Fallback System */}
          <div className={`p-5 rounded-3xl border-2 border-amber-100 bg-amber-50/20 flex flex-col justify-between group hover:bg-amber-600 transition-all ${
            fallbackActive ? "ring-4 ring-amber-200" : ""
          }`}>
            <div>
              <RotateCcw className={`h-6 w-6 mb-3 ${fallbackActive ? "text-amber-900 animate-spin" : "text-amber-600 group-hover:text-white"}`} />
              <p className={`text-xs font-black uppercase ${fallbackActive ? "text-amber-900" : "text-slate-900 group-hover:text-white"}`}>Fallback System</p>
              <p className={`text-[9px] font-medium mt-1 ${fallbackActive ? "text-amber-700" : "text-slate-400 group-hover:text-amber-100"}`}>
                Engages backup circulation and basic monitoring
              </p>
            </div>
            <button
              onClick={handleFallback}
              disabled={isEmergencyHalted}
              className={`mt-4 w-full py-3 text-[10px] font-black rounded-xl uppercase transition-all shadow-lg ${
                fallbackActive
                  ? "bg-amber-900 text-amber-100 shadow-amber-300"
                  : "bg-amber-500 text-white shadow-amber-200 group-hover:bg-white group-hover:text-amber-600"
              } ${isEmergencyHalted ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {fallbackActive ? 'Active' : 'Activate'}
            </button>
          </div>

          {/* Operator Authentication */}
          <div className="p-5 rounded-3xl border-2 border-blue-100 bg-blue-50/20 flex flex-col justify-between group hover:bg-blue-600 transition-all">
            <div>
              <Key className="h-6 w-6 text-blue-600 mb-3 group-hover:text-white" />
              <p className="text-xs font-black uppercase text-slate-900 group-hover:text-white">Operator Auth</p>
              <p className="text-[9px] font-medium mt-1 text-slate-400 group-hover:text-blue-100">
                {operator.authenticated ? `Signed in: ${operator.name}` : 'Not authenticated'}
              </p>
            </div>
            {operator.authenticated ? (
              <button
                onClick={handleDeauth}
                className="mt-4 w-full py-3 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase group-hover:bg-white group-hover:text-blue-600 transition-all shadow-lg shadow-blue-200"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="mt-4 w-full py-3 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase group-hover:bg-white group-hover:text-blue-600 transition-all shadow-lg shadow-blue-200"
              >
                Authenticate
              </button>
            )}
          </div>

          {/* AI Safety Limits */}
          <div className="p-5 rounded-3xl border-2 border-emerald-100 bg-emerald-50/20 flex flex-col justify-between group hover:bg-emerald-600 transition-all">
            <div>
              <Gauge className="h-6 w-6 text-emerald-600 mb-3 group-hover:text-white" />
              <p className="text-xs font-black uppercase text-slate-900 group-hover:text-white">AI Safety Limits</p>
              <p className="text-[9px] font-medium mt-1 text-slate-400 group-hover:text-emerald-100">
                Enforced boundaries for AI decisions
              </p>
            </div>
            <div className="mt-4 space-y-1.5">
              {[
                { label: 'pH Range', val: `${safetyLimits.minPh} - ${safetyLimits.maxPh}` },
                { label: 'Temp Range', val: `${safetyLimits.minTemp} - ${safetyLimits.maxTemp}°C` },
                { label: 'EC Range', val: `${safetyLimits.minEc} - ${safetyLimits.maxEc} mS/cm` },
              ].map((limit, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className={`text-[8px] font-black uppercase ${i === 0 ? (stats.ph < safetyLimits.minPh || stats.ph > safetyLimits.maxPh ? "text-rose-500" : "text-emerald-600") : i === 1 ? (stats.temp < safetyLimits.minTemp || stats.temp > safetyLimits.maxTemp ? "text-rose-500" : "text-emerald-600") : (stats.ec < safetyLimits.minEc || stats.ec > safetyLimits.maxEc ? "text-rose-500" : "text-emerald-600")} group-hover:text-white`}>{limit.label}</span>
                  <span className="text-[8px] font-bold text-slate-400 group-hover:text-emerald-100">{limit.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Automation Pause Mode */}
        <div className={`mt-6 flex items-center justify-between p-4 rounded-2xl text-white shadow-2xl transition-all ${
          isPaused ? "bg-amber-600 shadow-amber-300" : "bg-slate-900 shadow-slate-300"
        }`}>
          <div className="flex items-center gap-3">
            {isPaused ? <Play className="h-5 w-5 text-white animate-pulse" /> : <Pause className="h-5 w-5 text-blue-400" />}
            <div>
              <p className="text-xs font-black uppercase tracking-widest italic">Automation Pause Mode</p>
              <p className="text-[9px] text-slate-300 font-medium">
                {isPaused ? "All AI actions and decision execution suspended" : "Temporarily suspend all AI actions and decision execution"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPaused(!isPaused)
              addLog(isPaused ? 'Automation resumed' : 'Automation paused')
            }}
            disabled={isEmergencyHalted}
            className={`px-10 py-2.5 rounded-full text-[10px] font-black transition-all shadow-lg ${
              isPaused
                ? "bg-white text-amber-600 shadow-white/20"
                : "bg-slate-700 text-slate-100 hover:bg-slate-600"
            } ${isEmergencyHalted ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {isPaused ? "Resume System" : "Pause AI Actions"}
          </button>
        </div>

        {/* Safety limit breach alerts */}
        {(stats.ph > safetyLimits.maxPh || stats.ph < safetyLimits.minPh ||
          stats.temp > safetyLimits.maxTemp || stats.temp < safetyLimits.minTemp ||
          stats.ec > safetyLimits.maxEc || stats.ec < safetyLimits.minEc) && (
          <div className="mt-4 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <p className="text-[10px] font-black text-rose-700 uppercase">Safety Limit Breach Detected</p>
            </div>
            <div className="space-y-1">
              {stats.ph > safetyLimits.maxPh && <p className="text-[9px] font-bold text-rose-600">pH {stats.ph} exceeds maximum {safetyLimits.maxPh}</p>}
              {stats.ph < safetyLimits.minPh && <p className="text-[9px] font-bold text-rose-600">pH {stats.ph} below minimum {safetyLimits.minPh}</p>}
              {stats.temp > safetyLimits.maxTemp && <p className="text-[9px] font-bold text-rose-600">Temp {stats.temp}°C exceeds maximum {safetyLimits.maxTemp}°C</p>}
              {stats.temp < safetyLimits.minTemp && <p className="text-[9px] font-bold text-rose-600">Temp {stats.temp}°C below minimum {safetyLimits.minTemp}°C</p>}
              {stats.ec > safetyLimits.maxEc && <p className="text-[9px] font-bold text-rose-600">EC {stats.ec} exceeds maximum {safetyLimits.maxEc}</p>}
              {stats.ec < safetyLimits.minEc && <p className="text-[9px] font-bold text-rose-600">EC {stats.ec} below minimum {safetyLimits.minEc}</p>}
            </div>
          </div>
        )}
      </div>

      {/* ─── AUTH MODAL ──────────────────────────────────────────────────── */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase">Operator Authentication</h3>
              </div>
              <button onClick={() => { setShowAuthModal(false); setAuthError('') }} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Operator ID or Passcode</label>
                <input
                  type="password"
                  value={authInput}
                  onChange={e => setAuthInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAuth()}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter credentials"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-[9px] font-black text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">{authError}</p>
              )}

              <button
                onClick={handleAuth}
                className="w-full py-3 bg-blue-600 text-white text-xs font-black rounded-xl uppercase shadow-lg hover:bg-blue-700 transition-all"
              >
                Authenticate
              </button>

              <p className="text-[8px] text-slate-400 text-center font-bold">Demo: Use &quot;admin&quot; or &quot;1234&quot;</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

