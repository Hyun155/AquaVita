"use client"

import { useState } from "react"

type NodeId = "reservoir" | "pump" | "filter" | "mixer" | "uv" | "return"

const NODE_INFO: Record<NodeId, { title: string; rows: { label: string; value: string }[] }> = {
  reservoir: {
    title: "Nutrient Reservoir Tank",
    rows: [
      { label: "Capacity", value: "847 / 1000 L" },
      { label: "Nutrient Mix", value: "Lettuce-Optimal v3" },
      { label: "Oxygenation (DO)", value: "8.2 mg/L" },
      { label: "Water Temp", value: "20.4 °C" },
    ],
  },
  pump: {
    title: "Main Circulation Pump",
    rows: [
      { label: "Status", value: "Active · Stable" },
      { label: "Flow Stability", value: "99.4 %" },
      { label: "Pressure Output", value: "2.18 bar" },
      { label: "Runtime", value: "12,408 hrs" },
    ],
  },
  filter: {
    title: "Filtration Chamber",
    rows: [
      { label: "Stage", value: "Sediment + Carbon" },
      { label: "Throughput", value: "412 L/h" },
      { label: "Saturation", value: "27 %" },
      { label: "Service In", value: "18 days" },
    ],
  },
  uv: {
    title: "UV Sterilization Path",
    rows: [
      { label: "Lamp Output", value: "94 % efficiency" },
      { label: "Dose", value: "42 mJ/cm²" },
      { label: "Pathogen Reduction", value: "99.99 %" },
      { label: "Cycle Runtime", value: "6,120 hrs" },
    ],
  },
  mixer: {
    title: "Nutrient Mixing Chamber",
    rows: [
      { label: "Mode", value: "Auto-dose" },
      { label: "EC Target", value: "1.82 mS/cm" },
      { label: "Last Injection", value: "00:04:12 ago" },
      { label: "Homogeneity", value: "98.6 %" },
    ],
  },
  return: {
    title: "Return Loop",
    rows: [
      { label: "Direction", value: "Closed-loop" },
      { label: "Recovery", value: "97.3 %" },
      { label: "Reuse Ratio", value: "94 %" },
      { label: "Drift", value: "Nominal" },
    ],
  },
}

interface NodeProps {
  x: number
  y: number
  label: string
  id: NodeId
  active: NodeId
  onClick: (id: NodeId) => void
  children: React.ReactNode
}

function Node({ x, y, label, id, active, onClick, children }: NodeProps) {
  const isActive = active === id
  const color = isActive ? "oklch(0.85 0.20 205)" : "oklch(0.55 0.10 215 / 80%)"
  return (
    <g transform={`translate(${x} ${y})`} onClick={() => onClick(id)} style={{ cursor: "pointer", color } as any}>
      {isActive && <circle cx="0" cy="0" r="40" fill="url(#glow)" />}
      {children}
      <text
        y="48"
        textAnchor="middle"
        className="mono"
        fontSize="9"
        fill={isActive ? "oklch(0.85 0.20 205)" : "oklch(0.78 0.04 220)"}
        letterSpacing="1.5"
      >
        {label}
      </text>
    </g>
  )
}

export function ReservoirVisualization() {
  const [active, setActive] = useState<NodeId>("reservoir")
  const info = NODE_INFO[active]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-white">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes water-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        @keyframes flow-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .flow-line {
          animation: flow-pulse 2s ease-in-out infinite;
        }
        .water-bob {
          animation: water-bob 3s ease-in-out infinite;
        }
      `}</style>

      <div className="relative p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-neon-aqua">Hydroponic Loop · LIVE</div>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">Closed-Loop Reservoir System</h2>
            <p className="mt-2 text-sm text-muted-foreground">Click any node to inspect operational telemetry.</p>
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <div className="rounded-lg border border-border/40 bg-background/50 px-3 py-2">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-neon-green animate-pulse" />
                CIRCULATION ACTIVE
              </span>
            </div>
            <div className="rounded-lg border border-border/40 bg-background/50 px-3 py-2">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-neon-aqua" />
                412 L/H
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* SVG Diagram */}
          <div
            className="relative overflow-hidden rounded-xl border border-border/40"
            style={{
              background: "radial-gradient(ellipse at center, oklch(0.20 0.04 230) 0%, oklch(0.14 0.03 232) 100%)",
            }}
          >
            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(0.78 0.16 210 / 12%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.16 210 / 12%) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Scan line effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute inset-x-0 h-24 animate-pulse"
                style={{
                  background: "linear-gradient(180deg, transparent, oklch(0.85 0.20 205 / 18%), transparent)",
                  animation: "scan-line 8s linear infinite",
                }}
              />
            </div>

            <svg viewBox="0 0 800 480" className="relative w-full h-auto">
              <defs>
                <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.70 0.18 215)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="oklch(0.45 0.18 230)" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="tank" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.18 215)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="oklch(0.40 0.18 230)" stopOpacity="0.55" />
                </linearGradient>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="oklch(0.85 0.20 205)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="oklch(0.85 0.20 205)" stopOpacity="0" />
                </radialGradient>
                <filter id="soft-glow">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Pipes */}
              <g stroke="oklch(0.40 0.05 230)" strokeWidth="14" fill="none" strokeLinecap="round">
                <path d="M 400 320 L 400 380 L 180 380 L 180 340" />
                <path d="M 180 280 L 180 200 L 280 200" />
                <path d="M 380 200 L 480 200" />
                <path d="M 580 200 L 660 200 L 660 300" />
                <path d="M 660 360 L 660 420 L 400 420 L 400 380" />
              </g>

              {/* Water flow */}
              <g stroke="url(#water)" strokeWidth="6" fill="none" strokeLinecap="round" className="flow-line">
                <path d="M 400 320 L 400 380 L 180 380 L 180 340" />
                <path d="M 180 280 L 180 200 L 280 200" />
                <path d="M 380 200 L 480 200" />
                <path d="M 580 200 L 660 200 L 660 300" />
                <path d="M 660 360 L 660 420 L 400 420 L 400 380" />
              </g>

              {/* RESERVOIR TANK (centerpiece) */}
              <g onClick={() => setActive("reservoir")} style={{ cursor: "pointer" }}>
                <ellipse cx="400" cy="370" rx="130" ry="14" fill="oklch(0.30 0.06 220 / 60%)" />
                <rect
                  x="270"
                  y="120"
                  width="260"
                  height="220"
                  rx="14"
                  fill="url(#tank)"
                  stroke={active === "reservoir" ? "oklch(0.85 0.20 205)" : "oklch(0.55 0.10 215 / 70%)"}
                  strokeWidth={active === "reservoir" ? 2.5 : 1.5}
                />

                {/* Water inside */}
                <clipPath id="tank-clip">
                  <rect x="272" y="122" width="256" height="216" rx="12" />
                </clipPath>
                <g clipPath="url(#tank-clip)">
                  <rect x="270" y="180" width="260" height="160" fill="url(#water)" opacity="0.85" />
                  <path
                    d="M 270 180 Q 335 168 400 180 T 530 180 L 530 200 L 270 200 Z"
                    fill="oklch(0.78 0.18 210 / 85%)"
                    className="water-bob"
                  />

                  {/* Bubbles */}
                  <circle cx="320" cy="280" r="3" fill="oklch(0.95 0.05 210 / 70%)">
                    <animate attributeName="cy" values="320;180" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="380" cy="300" r="2" fill="oklch(0.95 0.05 210 / 70%)">
                    <animate attributeName="cy" values="320;180" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="450" cy="290" r="2.5" fill="oklch(0.95 0.05 210 / 70%)">
                    <animate attributeName="cy" values="320;180" dur="2.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;0" dur="2.8s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Tank ribs */}
                {[160, 220, 280].map((y) => (
                  <line key={y} x1="270" y1={y} x2="530" y2={y} stroke="oklch(0.85 0.20 205 / 15%)" strokeWidth="1" />
                ))}

                <text x="400" y="105" textAnchor="middle" className="mono" fontSize="11" fill="oklch(0.85 0.20 205)" letterSpacing="2">
                  RESERVOIR · 847L
                </text>
                <text x="400" y="240" textAnchor="middle" fontSize="28" fontWeight="600" fill="oklch(0.96 0.02 220)">
                  84.7%
                </text>
                <text x="400" y="260" textAnchor="middle" className="mono" fontSize="10" fill="oklch(0.78 0.04 220)">
                  CAPACITY
                </text>
              </g>

              {/* PUMP */}
              <Node x={180} y={310} label="PUMP" id="pump" active={active} onClick={setActive}>
                <circle cx="0" cy="0" r="26" fill="oklch(0.24 0.04 232)" stroke="currentColor" strokeWidth="1.5" />
                <g style={{ transformOrigin: "0 0", animation: "spin-slow 4s linear infinite" }}>
                  <path d="M 0 -16 L 5 0 L 0 16 L -5 0 Z" fill="oklch(0.78 0.16 210)" />
                  <path d="M -16 0 L 0 -5 L 16 0 L 0 5 Z" fill="oklch(0.78 0.16 210)" />
                </g>
                <circle cx="0" cy="0" r="3" fill="oklch(0.96 0.02 220)" />
              </Node>

              {/* FILTER */}
              <Node x={330} y={200} label="FILTER" id="filter" active={active} onClick={setActive}>
                <rect x="-50" y="-26" width="100" height="52" rx="6" fill="oklch(0.24 0.04 232)" stroke="currentColor" strokeWidth="1.5" />
                {[-32, -16, 0, 16, 32].map((xPos) => (
                  <line key={xPos} x1={xPos} y1="-18" x2={xPos} y2="18" stroke="oklch(0.78 0.16 210 / 50%)" strokeWidth="1.5" />
                ))}
                <circle cx="0" cy="0" r="6" fill="oklch(0.78 0.18 155)" opacity="0.8" />
              </Node>

              {/* MIXER */}
              <Node x={530} y={200} label="MIXER" id="mixer" active={active} onClick={setActive}>
                <rect x="-50" y="-26" width="100" height="52" rx="6" fill="oklch(0.24 0.04 232)" stroke="currentColor" strokeWidth="1.5" />
                <g style={{ transformOrigin: "0 0", animation: "spin-slow 6s linear infinite" }}>
                  <line x1="-18" y1="0" x2="18" y2="0" stroke="oklch(0.82 0.18 75)" strokeWidth="2" />
                  <line x1="0" y1="-12" x2="0" y2="12" stroke="oklch(0.82 0.18 75)" strokeWidth="2" />
                </g>
                <circle cx="0" cy="0" r="3" fill="oklch(0.96 0.02 220)" />
                <text x="-30" y="-32" className="mono" fontSize="8" fill="oklch(0.78 0.04 220)">
                  N·P·K
                </text>
              </Node>

              {/* UV */}
              <Node x={660} y={330} label="UV STERILIZER" id="uv" active={active} onClick={setActive}>
                <rect x="-22" y="-30" width="44" height="60" rx="6" fill="oklch(0.24 0.04 232)" stroke="currentColor" strokeWidth="1.5" />
                <rect x="-6" y="-22" width="12" height="44" rx="3" fill="oklch(0.85 0.20 290 / 70%)">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite" />
                </rect>
                <circle cx="0" cy="0" r="22" fill="url(#glow)" />
              </Node>

              {/* RETURN node */}
              <g onClick={() => setActive("return")} style={{ cursor: "pointer" }}>
                <circle
                  cx="500"
                  cy="420"
                  r="6"
                  fill="oklch(0.78 0.18 155)"
                  filter="url(#soft-glow)"
                  style={{ cursor: "pointer" }}
                />
                <text
                  x="500"
                  y="445"
                  textAnchor="middle"
                  className="mono"
                  fontSize="9"
                  fill={active === "return" ? "oklch(0.85 0.20 205)" : "oklch(0.78 0.04 220)"}
                >
                  RETURN LOOP
                </text>
              </g>

              {/* Sensor ticks */}
              <g className="mono" fontSize="8" fill="oklch(0.78 0.04 220 / 70%)">
                <text x="20" y="20">SENSOR ARRAY · 24CH</text>
                <text x="20" y="460">PRESSURE 2.18 bar</text>
                <text x="780" y="460" textAnchor="end">
                  FLOW 412 L/h
                </text>
                <text x="780" y="20" textAnchor="end">
                  UV 42 mJ/cm²
                </text>
              </g>
            </svg>
          </div>

          {/* Detail Panel */}
          <div className="rounded-xl border border-border/40 bg-white p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-neon-aqua font-semibold">SELECTED · {active}</div>
            <h3 className="mt-3 text-xl font-semibold text-foreground">{info.title}</h3>

            <div className="mt-6 space-y-4">
              {info.rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between border-b border-border/30 pb-3">
                  <span className="text-sm text-muted-foreground">{r.label}</span>
                  <span className="font-mono text-sm font-semibold text-foreground">{r.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-lg bg-neon-green/10 border border-neon-green/30 p-3">
              <span className="inline-block h-2 w-2 rounded-full bg-neon-green" />
              <span className="text-xs text-foreground font-medium">Operating within nominal envelope</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
