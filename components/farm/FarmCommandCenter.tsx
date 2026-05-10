"use client"

import { Suspense, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei"
import {
  Activity,
  AlertTriangle,
  Clock3,
  Cpu,
  Droplets,
  Gauge,
  Leaf,
  Sparkles,
  ShieldAlert,
  Thermometer,
  Wifi,
  Wind,
  Wrench,
  X,
  Zap,
} from "lucide-react"
import * as THREE from "three"
import { useSuppressExtensions } from "@/hooks/useSuppressExtensions"

export type RackData = {
  id: string
  position: [number, number, number]
  levels: number
  crop: "Lettuce" | "Basil" | "Kale" | "Arugula"
  health: number
  ph: number
  ec: number
  nutrient: number
  humidity: number
  temperature: number
  growthStage: string
  diseaseRisk: number
  automation: "Auto" | "Manual" | "Alert"
}

export type SystemId = "main-pump" | "backup-pump" | "uv" | "filter" | "oxygen" | "nutrient"

export type WaterSystemData = {
  id: SystemId
  name: string
  status: "Stable" | "Standby" | "Monitoring"
  efficiency: number
  runtime: number
  pressure: number
  energy: number
  flow: number
  failureRisk: number
  insights: string[]
  position: [number, number, number]
}

const CROPS: RackData["crop"][] = ["Lettuce", "Basil", "Kale", "Arugula"]
const STAGES = ["Seedling", "Vegetative", "Mature", "Harvest-ready"]

export const WATER_SYSTEMS: WaterSystemData[] = [
  {
    id: "main-pump",
    name: "Main Circulation Pump",
    status: "Stable",
    efficiency: 99.4,
    runtime: 12408,
    pressure: 3.2,
    energy: 2.4,
    flow: 142,
    failureRisk: 1.2,
    insights: ["Primary loop pressure stable at 3.2 bar.", "Flow rate matches predicted nutrient demand."],
    position: [-12, 0, 12],
  },
  {
    id: "backup-pump",
    name: "Backup Pump",
    status: "Standby",
    efficiency: 100,
    runtime: 1204,
    pressure: 0,
    energy: 0.05,
    flow: 0,
    failureRisk: 0.4,
    insights: ["Backup pump ready for failover activation.", "Last self-test: nominal, 6h ago."],
    position: [-9, 0, 12],
  },
  {
    id: "uv",
    name: "UV Sterilizer",
    status: "Stable",
    efficiency: 94,
    runtime: 6120,
    pressure: 2.8,
    energy: 0.6,
    flow: 138,
    failureRisk: 3.5,
    insights: ["UV sterilization cycle prevented microbial bloom risk.", "Lamp output at 94% - replacement in ~480h."],
    position: [-4, 0, 13],
  },
  {
    id: "filter",
    name: "Multi-stage Filtration",
    status: "Monitoring",
    efficiency: 87.2,
    runtime: 4860,
    pressure: 2.4,
    energy: 0.3,
    flow: 132,
    failureRisk: 8.1,
    insights: ["Filtration efficiency trending downward due to sediment accumulation.", "Backwash cycle scheduled in 14h."],
    position: [1, 0, 13],
  },
  {
    id: "oxygen",
    name: "Oxygenation System",
    status: "Stable",
    efficiency: 96.8,
    runtime: 8340,
    pressure: 1.6,
    energy: 0.4,
    flow: 120,
    failureRisk: 2.1,
    insights: ["Dissolved O2 at 8.4 mg/L - within optimal band.", "Diffuser pressure stable across all reservoirs."],
    position: [6, 0, 13],
  },
  {
    id: "nutrient",
    name: "Nutrient Injector",
    status: "Stable",
    efficiency: 98.1,
    runtime: 5920,
    pressure: 2.2,
    energy: 0.2,
    flow: 4.6,
    failureRisk: 1.8,
    insights: ["Nutrient injector optimized potassium dosing by 8%.", "EC drift compensated automatically over last 24h."],
    position: [11, 0, 12],
  },
]

const COLORS: Record<SystemId, string> = {
  "main-pump": "#3aa2d8",
  "backup-pump": "#9aa6ad",
  uv: "#7aa8ff",
  filter: "#5fb39a",
  oxygen: "#7ed4d0",
  nutrient: "#7bc96f",
}

function makeRacks(): RackData[] {
  const racks: RackData[] = []
  const cols = 2
  const rows = 2
  const spacingX = 5
  const spacingZ = 7

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < cols; column++) {
      const id = `R${row}${column}`
      const seed = (row * cols + column + 1) * 13
      const alert = seed % 7 === 0

      racks.push({
        id,
        position: [-((cols - 1) * spacingX) / 2 + column * spacingX, 0, -((rows - 1) * spacingZ) / 2 + row * spacingZ],
        levels: 3 + ((seed >> 1) % 2),
        crop: CROPS[seed % CROPS.length],
        health: 78 + (seed % 20),
        ph: 5.8 + (seed % 7) / 10,
        ec: 1.4 + (seed % 9) / 10,
        nutrient: 70 + (seed % 25),
        humidity: 58 + (seed % 12),
        temperature: 21 + (seed % 4),
        growthStage: STAGES[seed % STAGES.length],
        diseaseRisk: alert ? 42 + (seed % 20) : seed % 18,
        automation: alert ? "Alert" : seed % 3 === 0 ? "Manual" : "Auto",
      })
    }
  }

  return racks
}

function LeafCluster({ position, stage = 1 }: { position: [number, number, number]; stage?: number }) {
  const geom = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.18 * stage, 1)
    const pos = g.attributes.position

    for (let i = 0; i < pos.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(pos, i)
      vertex.multiplyScalar(1 + (Math.random() - 0.5) * 0.35)
      vertex.y *= 0.6
      pos.setXYZ(i, vertex.x, vertex.y, vertex.z)
    }

    g.computeVertexNormals()
    return g
  }, [stage])

  return (
    <group position={position}>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          geometry={geom}
          position={[0, index * 0.05, 0]}
          rotation={[0, (index * Math.PI) / 3, 0]}
          scale={1 - index * 0.15}
        >
          <meshStandardMaterial color={index === 0 ? "#7bc46b" : index === 1 ? "#9ed87a" : "#c4e89a"} roughness={0.7} metalness={0} />
        </mesh>
      ))}
    </group>
  )
}

function GrowTray({
  width,
  depth,
  y,
  layer,
  selected,
  onSelect,
  stage,
  alert,
}: {
  width: number
  depth: number
  y: number
  layer: number
  selected: boolean
  onSelect: () => void
  stage: number
  alert: boolean
}) {
  const waterRef = useRef<THREE.MeshStandardMaterial>(null)

  // Disabled automatic water animation to reduce lag
  // useFrame((state) => {
  //   if (waterRef.current) {
  //     waterRef.current.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 1.5 + layer) * 0.1
  //   }
  // })

  const plants = useMemo(() => {
    const positions: { x: number; z: number; s: number }[] = []
    const cols = 6
    const rows = 3

    for (let column = 0; column < cols; column++) {
      for (let row = 0; row < rows; row++) {
        positions.push({
          x: -width / 2 + 0.3 + (column * (width - 0.6)) / (cols - 1),
          z: -depth / 2 + 0.3 + (row * (depth - 0.6)) / (rows - 1),
          s: stage * (0.85 + ((column + row) % 3) * 0.06),
        })
      }
    }

    return positions
  }, [depth, stage, width])

  return (
    <group
      position={[0, y, 0]}
      onClick={(event) => {
        event.stopPropagation()
        onSelect()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default"
      }}
    >
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.06, depth]} />
        <meshStandardMaterial color={selected ? "#bde0a8" : "#e8eef0"} roughness={0.4} metalness={0.2} />
      </mesh>

      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[width - 0.1, 0.015, depth - 0.1]} />
        <meshStandardMaterial
          ref={waterRef}
          color="#7ec4e8"
          transparent
          opacity={0.55}
          roughness={0.1}
          metalness={0.3}
          emissive="#3a8fc4"
          emissiveIntensity={0.15}
        />
      </mesh>

      {plants.map((plant, index) => (
        <LeafCluster key={index} position={[plant.x, 0.1, plant.z]} stage={plant.s} />
      ))}

      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[width - 0.2, 0.04, 0.08]} />
        <meshStandardMaterial color="#ffffff" emissive="#fff5d6" emissiveIntensity={1.2} />
      </mesh>

      <pointLight position={[0, 0.5, 0]} intensity={0.4} color="#fff8e0" distance={1.5} />

      <mesh position={[width / 2 - 0.1, 0.12, depth / 2 - 0.1]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color={alert ? "#ff8a3d" : "#5fe39a"} emissive={alert ? "#ff6a1a" : "#3fcf7a"} emissiveIntensity={2} />
      </mesh>

      {selected && (
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[width + 0.05, 0.62, depth + 0.05]} />
          <meshBasicMaterial color="#3fcf7a" wireframe transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}

function HydroponicRack({ rack, selectedLayer, hovered, onHoverRack, onSelectLayer }: {
  rack: RackData
  selectedLayer: number | null
  hovered: boolean
  onHoverRack: (id: string | null) => void
  onSelectLayer: (rackId: string, layer: number) => void
}) {
  const width = 2.4
  const depth = 1.2
  const levelHeight = 0.85
  const totalHeight = rack.levels * levelHeight + 0.3
  const flowRef = useRef<THREE.MeshStandardMaterial>(null)

  // Disabled automatic flow animation to reduce lag
  // useFrame((state) => {
  //   if (flowRef.current) {
  //     flowRef.current.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2
  //   }
  // })

  return (
    <group
      position={rack.position}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHoverRack(rack.id)
      }}
      onPointerOut={() => onHoverRack(null)}
    >
      {[
        [-width / 2, -depth / 2],
        [width / 2, -depth / 2],
        [-width / 2, depth / 2],
        [width / 2, depth / 2],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, totalHeight / 2, z]} castShadow>
          <boxGeometry args={[0.06, totalHeight, 0.06]} />
          <meshStandardMaterial color="#c8d0d6" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {Array.from({ length: rack.levels }).map((_, index) => (
        <GrowTray
          key={index}
          width={width}
          depth={depth}
          y={0.3 + index * levelHeight}
          layer={index}
          selected={selectedLayer === index}
          onSelect={() => onSelectLayer(rack.id, index)}
          stage={0.7 + (index / rack.levels) * 0.5}
          alert={rack.automation === "Alert" && index === rack.levels - 1}
        />
      ))}

      <mesh position={[width / 2 + 0.08, totalHeight / 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, totalHeight, 8]} />
        <meshStandardMaterial ref={flowRef} color="#a8d8f0" emissive="#4a9fd4" emissiveIntensity={0.4} metalness={0.5} roughness={0.3} transparent opacity={0.85} />
      </mesh>

      <mesh position={[-width / 2 - 0.08, totalHeight + 0.15, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.4]} />
        <meshStandardMaterial color="#dce4e8" metalness={0.6} roughness={0.4} />
      </mesh>

      {hovered && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.5, 16]} />
          <meshBasicMaterial color="#3fcf7a" transparent opacity={0.5} />
        </mesh>
      )}

      <pointLight
        position={[0, 0.05, 0]}
        intensity={hovered ? 0.6 : 0.2}
        color={rack.automation === "Alert" ? "#ff8a3d" : "#5fe39a"}
        distance={2}
      />
    </group>
  )
}

function GreenhouseEnvironment() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#e8edee" roughness={0.7} metalness={0} />
      </mesh>
      <gridHelper args={[60, 12, "#a8b8c0", "#cfd8dc"]} position={[0, 0.01, 0]} />

      {[
        { pos: [0, 6, -20] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [60, 12] as [number, number] },
        { pos: [0, 6, 20] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], size: [60, 12] as [number, number] },
        { pos: [-30, 6, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], size: [40, 12] as [number, number] },
        { pos: [30, 6, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number], size: [40, 12] as [number, number] },
      ].map((wall, index) => (
        <mesh key={index} position={wall.pos} rotation={wall.rot}>
          <planeGeometry args={wall.size} />
          <meshStandardMaterial
            color="#dceef0"
            transparent
            opacity={0.1}
            roughness={0.8}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      <mesh position={[0, 12, 0]}>
        <boxGeometry args={[60, 0.3, 40]} />
        <meshStandardMaterial color="#f4f7f8" roughness={0.6} metalness={0} />
      </mesh>

      {Array.from({ length: 3 }).map((_, index) => (
        <mesh key={index} position={[-10 + index * 20, 11.7, 0]}>
          <boxGeometry args={[6, 0.1, 0.4]} />
          <meshStandardMaterial color="#fff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function FogParticles() {
  const ref = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const count = 400
    const positions = new Float32Array(count * 3)

    for (let index = 0; index < count; index++) {
      positions[index * 3] = (Math.random() - 0.5) * 50
      positions[index * 3 + 1] = Math.random() * 8
      positions[index * 3 + 2] = (Math.random() - 0.5) * 30
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: "#cfe8f0",
      size: 0.15,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })

    return { geometry, material }
  }, [])

  // Disabled automatic fog particles animation to reduce lag
  // useFrame((state) => {
  //   if (!ref.current) {
  //     return
  //   }
  //
  //   const positions = ref.current.geometry.attributes.position as THREE.BufferAttribute
  //   for (let index = 0; index < positions.count; index++) {
  //     const y = positions.getY(index) + 0.005
  //     positions.setY(index, y > 8 ? 0 : y)
  //   }
  //   positions.needsUpdate = true
  //   ref.current.rotation.y = state.clock.elapsedTime * 0.01
  // })

  return <points ref={ref} geometry={geometry} material={material} />
}

function FlowingTube({
  curve,
  color = "#4cc2e0",
  radius = 0.12,
  active = true,
  speed = 0.6,
}: {
  curve: THREE.Curve<THREE.Vector3>
  color?: string
  radius?: number
  active?: boolean
  speed?: number
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const dashTex = useMemo(() => {
    if (typeof document === "undefined") {
      return null
    }

    const canvas = document.createElement("canvas")
    canvas.width = 128
    canvas.height = 16
    const context = canvas.getContext("2d")
    if (!context) {
      return null
    }

    const gradient = context.createLinearGradient(0, 0, 128, 0)
    gradient.addColorStop(0, "rgba(255,255,255,0)")
    gradient.addColorStop(0.5, "rgba(255,255,255,0.95)")
    gradient.addColorStop(1, "rgba(255,255,255,0)")
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 16)

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(8, 1)
    return texture
  }, [])

  const outerGeometry = useMemo(() => new THREE.TubeGeometry(curve, 64, radius, 12, false), [curve, radius])
  const innerGeometry = useMemo(() => new THREE.TubeGeometry(curve, 64, radius * 0.7, 12, false), [curve, radius])

  // Disabled automatic tube animation to reduce lag
  // useFrame((_, delta) => {
  //   if (active && dashTex) {
  //     dashTex.offset.x -= delta * speed
  //   }
  //   if (matRef.current) {
  //     matRef.current.emissiveIntensity = active ? 0.6 + Math.sin(performance.now() * 0.003) * 0.15 : 0.05
  //   }
  // })

  return (
    <group>
      <mesh geometry={outerGeometry} castShadow>
        <meshStandardMaterial color="#cfd6db" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh geometry={innerGeometry}>
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.85}
          map={dashTex ?? undefined}
          emissiveMap={dashTex ?? undefined}
        />
      </mesh>
    </group>
  )
}

function StatusLight({ position, color, pulse = true }: { position: [number, number, number]; color: string; pulse?: boolean }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null)

  // Disabled automatic status light pulsing to reduce lag
  // useFrame(() => {
  //   if (ref.current && pulse) {
  //     ref.current.emissiveIntensity = 0.8 + Math.sin(performance.now() * 0.005) * 0.4
  //   }
  // })

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={1.2} />
    </mesh>
  )
}

function Pump({
  data,
  hovered,
  selected,
  onHover,
  onSelect,
  primary = true,
}: {
  data: WaterSystemData
  hovered: boolean
  selected: boolean
  onHover: (id: SystemId | null) => void
  onSelect: (id: SystemId) => void
  primary?: boolean
}) {
  const impellerRef = useRef<THREE.Mesh>(null)
  const active = data.status === "Stable"

  // Disabled automatic impeller rotation to reduce lag
  // useFrame((_, delta) => {
  //   if (impellerRef.current && active) {
  //     impellerRef.current.rotation.z -= delta * (primary ? 6 : 0.4)
  //   }
  // })

  const accent = COLORS[data.id]

  return (
    <group
      position={data.position}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(data.id)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        onHover(null)
        document.body.style.cursor = "default"
      }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(data.id)
      }}
    >
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.2, 1.4]} />
        <meshStandardMaterial color="#c8ced3" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.6, 1, 16]} />
        <meshStandardMaterial color={primary ? "#e8edf0" : "#b8c0c6"} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.5, 12]} />
        <meshStandardMaterial color="#3a4248" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.7, 0.61]}>
        <circleGeometry args={[0.32, 16]} />
        <meshPhysicalMaterial color="#cfeaf2" transmission={0.9} roughness={0.05} thickness={0.1} transparent opacity={0.6} />
      </mesh>
      <mesh ref={impellerRef} position={[0, 0.7, 0.55]}>
        <torusGeometry args={[0.22, 0.04, 6, 16]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={active ? 0.9 : 0.1} />
      </mesh>
      <mesh position={[-0.7, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.3, 16]} />
        <meshStandardMaterial color="#b6bdc2" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.3, 16]} />
        <meshStandardMaterial color="#b6bdc2" metalness={0.9} roughness={0.2} />
      </mesh>
      <StatusLight position={[0.3, 1.55, 0]} color={data.status === "Stable" ? "#4ade80" : data.status === "Standby" ? "#fbbf24" : "#60a5fa"} />
      <mesh position={[0, 0.7, -0.61]}>
        <planeGeometry args={[0.7, 0.18]} />
        <meshStandardMaterial color="#1d2429" />
      </mesh>
      {(hovered || selected) && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1, 1.15, 48]} />
          <meshBasicMaterial color={accent} transparent opacity={selected ? 0.9 : 0.5} />
        </mesh>
      )}
    </group>
  )
}

function CylinderUnit({
  data,
  hovered,
  selected,
  onHover,
  onSelect,
  glowColor,
  height = 1.6,
  radius = 0.45,
  glowInner = true,
}: {
  data: WaterSystemData
  hovered: boolean
  selected: boolean
  onHover: (id: SystemId | null) => void
  onSelect: (id: SystemId) => void
  glowColor: string
  height?: number
  radius?: number
  glowInner?: boolean
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)

  // Disabled automatic glow pulsing to reduce lag
  // useFrame(() => {
  //   if (matRef.current) {
  //     matRef.current.emissiveIntensity = 0.5 + Math.sin(performance.now() * 0.004) * 0.25
  //   }
  // })

  return (
    <group
      position={data.position}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(data.id)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        onHover(null)
        document.body.style.cursor = "default"
      }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(data.id)
      }}
    >
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[radius * 2.6, 0.2, radius * 2.6]} />
        <meshStandardMaterial color="#c8ced3" roughness={0.8} />
      </mesh>
      <mesh position={[0, height / 2 + 0.2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, height, 24]} />
        <meshStandardMaterial color="#dde3e7" metalness={0.9} roughness={0.18} />
      </mesh>
      {glowInner && (
        <mesh position={[0, height / 2 + 0.2, 0]}>
          <cylinderGeometry args={[radius * 0.7, radius * 0.7, height * 0.92, 24]} />
          <meshStandardMaterial ref={matRef} color={glowColor} emissive={glowColor} emissiveIntensity={0.6} transparent opacity={0.55} />
        </mesh>
      )}
      <mesh position={[0, height + 0.25, 0]}>
        <cylinderGeometry args={[radius * 1.05, radius * 1.05, 0.12, 24]} />
        <meshStandardMaterial color="#3a4248" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[-radius - 0.1, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 0.25, 16]} />
        <meshStandardMaterial color="#b6bdc2" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[radius + 0.1, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 0.25, 16]} />
        <meshStandardMaterial color="#b6bdc2" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, height * 0.7 + 0.2, radius + 0.01]}>
        <circleGeometry args={[0.13, 20]} />
        <meshStandardMaterial color="#0d1418" emissive={glowColor} emissiveIntensity={0.4} />
      </mesh>
      <StatusLight position={[radius * 0.5, height + 0.35, 0]} color={data.status === "Stable" ? "#4ade80" : data.status === "Monitoring" ? "#60a5fa" : "#fbbf24"} />
      {(hovered || selected) && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.6, radius * 1.85, 48]} />
          <meshBasicMaterial color={glowColor} transparent opacity={selected ? 0.9 : 0.5} />
        </mesh>
      )}
    </group>
  )
}

function Bubbles({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Points>(null)
  const { geometry, material } = useMemo(() => {
    const count = 60
    const positions = new Float32Array(count * 3)
    for (let index = 0; index < count; index++) {
      positions[index * 3] = (Math.random() - 0.5) * 0.5
      positions[index * 3 + 1] = Math.random() * 1.6
      positions[index * 3 + 2] = (Math.random() - 0.5) * 0.5
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({ color: "#bfeef0", size: 0.08, transparent: true, opacity: 0.85, depthWrite: false })
    return { geometry, material }
  }, [])

  // Disabled automatic particle movement to reduce lag
  // useFrame(() => {
  //   if (!ref.current) {
  //     return
  //   }
  //
  //   const positions = ref.current.geometry.attributes.position as THREE.BufferAttribute
  //   for (let index = 0; index < positions.count; index++) {
  //     const y = positions.getY(index) + 0.015
  //     positions.setY(index, y > 1.6 ? 0 : y)
  //   }
  //   positions.needsUpdate = true
  // })

  return <points ref={ref} position={position} geometry={geometry} material={material} />
}

function Reservoir({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 1.2, 1.6]} />
        <meshPhysicalMaterial color="#b8e4ee" metalness={0.2} roughness={0.15} transmission={0.6} thickness={0.4} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[3.3, 0.7, 1.55]} />
        <meshStandardMaterial color="#5cb8d4" emissive="#3aa2d8" emissiveIntensity={0.15} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.12, 1.8]} />
        <meshStandardMaterial color="#3a4248" metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  )
}

function WaterSystem({ hovered, selected, onHover, onSelect }: {
  hovered: SystemId | null
  selected: SystemId | null
  onHover: (id: SystemId | null) => void
  onSelect: (id: SystemId) => void
}) {
  const tubes = useMemo(() => {
    const y = 0.7
    const path = (a: [number, number, number], b: [number, number, number], bend = 0.4) => {
      const start = new THREE.Vector3(...a)
      const end = new THREE.Vector3(...b)
      const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, bend, 0))
      return new THREE.CatmullRomCurve3([start, mid, end])
    }

    return [
      { curve: path([-15, y, 12], [-12.7, y, 12]), color: COLORS["main-pump"], speed: 1.2 },
      { curve: path([-11.3, y + 0.2, 12], [-9.7, y + 0.2, 12], 0.1), color: "#cfd6db", speed: 0 },
      { curve: path([-8.3, y, 12], [-4.9, y, 13], 0.2), color: COLORS.uv, speed: 1 },
      { curve: path([-3.1, y, 13], [0.1, y, 13]), color: COLORS.filter, speed: 0.9 },
      { curve: path([1.9, y, 13], [5.1, y, 13]), color: COLORS.oxygen, speed: 0.95 },
      { curve: path([6.9, y, 13], [10.1, y, 12]), color: COLORS.nutrient, speed: 1 },
      { curve: path([11.7, y, 12], [12, y + 0.3, 4], 1.2), color: COLORS["main-pump"], speed: 1.1 },
      { curve: path([-12, 0.35, 4], [-15, 0.35, 11], 0.3), color: "#7fb6c8", speed: 0.7 },
    ]
  }, [])

  const headers = useMemo(() => {
    const curves: { curve: THREE.Curve<THREE.Vector3>; color: string }[] = []
    const feed = new THREE.CatmullRomCurve3([
      new THREE.Vector3(12, 1, 4),
      new THREE.Vector3(7, 1, 4),
      new THREE.Vector3(0, 1, 4),
      new THREE.Vector3(-7, 1, 4),
      new THREE.Vector3(-12, 1, 4),
    ])
    curves.push({ curve: feed, color: COLORS["main-pump"] })

    ;[-7.5, -2.5, 2.5, 7.5].forEach((x) => {
      ;[-3, 3].forEach((z) => {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(x, 1, 4),
          new THREE.Vector3(x, 0.6, 4),
          new THREE.Vector3(x, 0.6, z),
        ])
        curves.push({ curve, color: COLORS.nutrient })
      })
    })

    return curves
  }, [])

  return (
    <group>
      <Reservoir position={[-16.5, 0, 12]} />
      <Pump data={WATER_SYSTEMS[0]} hovered={hovered === "main-pump"} selected={selected === "main-pump"} onHover={onHover} onSelect={onSelect} primary />
      <Pump data={WATER_SYSTEMS[1]} hovered={hovered === "backup-pump"} selected={selected === "backup-pump"} onHover={onHover} onSelect={onSelect} primary={false} />
      <CylinderUnit data={WATER_SYSTEMS[2]} hovered={hovered === "uv"} selected={selected === "uv"} onHover={onHover} onSelect={onSelect} glowColor="#7aa8ff" height={1.8} radius={0.42} />
      <CylinderUnit data={WATER_SYSTEMS[3]} hovered={hovered === "filter"} selected={selected === "filter"} onHover={onHover} onSelect={onSelect} glowColor="#5fb39a" height={1.7} radius={0.5} />
      <CylinderUnit data={WATER_SYSTEMS[4]} hovered={hovered === "oxygen"} selected={selected === "oxygen"} onHover={onHover} onSelect={onSelect} glowColor="#7ed4d0" height={1.6} radius={0.45} />
      <Bubbles position={[6, 0.4, 13]} />
      <CylinderUnit data={WATER_SYSTEMS[5]} hovered={hovered === "nutrient"} selected={selected === "nutrient"} onHover={onHover} onSelect={onSelect} glowColor="#7bc96f" height={1.5} radius={0.38} />

      {tubes.map((tube, index) => (
        <FlowingTube key={index} curve={tube.curve} color={tube.color} radius={0.13} active={tube.speed > 0} speed={tube.speed} />
      ))}

      {headers.map((header, index) => (
        <FlowingTube key={`header-${index}`} curve={header.curve} color={header.color} radius={0.08} speed={0.6} />
      ))}

      {WATER_SYSTEMS.map((system) => (
        <pointLight key={system.id} position={[system.position[0], 0.6, system.position[2]]} intensity={0.35} color={COLORS[system.id]} distance={4} />
      ))}
    </group>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  unit,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  unit?: string
  tone?: "default" | "ok" | "warn"
}) {
  const toneClass = tone === "ok" ? "text-[oklch(0.55_0.15_150)]" : tone === "warn" ? "text-[oklch(0.65_0.18_60)]" : "text-foreground"

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-white/70 px-3 py-2 backdrop-blur-sm">
      <Icon className={`h-4 w-4 ${toneClass}`} />
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`text-sm font-semibold ${toneClass}`}>
          {value}
          {unit ? <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span> : null}
        </div>
      </div>
    </div>
  )
}

function TelemetryPanel({ rack, layer, onClose }: { rack: RackData; layer: number; onClose: () => void }) {
  return (
    <div className="pointer-events-auto absolute right-6 top-6 w-[340px] animate-in fade-in slide-in-from-right-2 duration-300 rounded-2xl border border-border/60 bg-white/80 shadow-[0_24px_60px_rgba(60,80,120,0.16)] backdrop-blur-xl">
      <div className="flex items-start justify-between border-b border-border/40 p-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Layer {layer + 1}</div>
          <h3 className="mt-2 text-lg font-semibold tracking-tight">Operational Status</h3>
        </div>
        <button onClick={onClose} className="rounded-md p-1 transition-colors hover:bg-black/5" aria-label="Close panel">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between border-b border-border/30 pb-2">
            <span className="text-muted-foreground">Crop Health Score</span>
            <span className="font-mono font-semibold text-[oklch(0.55_0.15_150)]">{rack.health}%</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Rack Status</span>
            <span className="font-mono font-medium">Stable</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Environmental State</span>
            <span className="font-mono font-medium">Optimal</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Cooling</span>
            <span className="font-mono font-medium">Active</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">LED Profile</span>
            <span className="font-mono font-medium text-sm">{rack.growthStage}</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Irrigation Cycle</span>
            <span className="font-mono font-medium">Running</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Airflow Balance</span>
            <span className="font-mono font-medium">Stable</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Sensor Sync</span>
            <span className="font-mono font-medium text-[oklch(0.55_0.15_150)]">Online</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Automation State</span>
            <span className="font-mono font-medium capitalize">{rack.automation}</span>
          </div>

          <div className="flex items-center justify-between pt-1.5">
            <span className="text-muted-foreground">Alert State</span>
            <span className="font-mono font-medium text-[oklch(0.55_0.15_150)]">None</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrchestrationPanel({ actions }: { actions: string[] }) {
  return (
    <div className="pointer-events-auto absolute left-6 top-24 w-[360px] rounded-2xl border border-border/60 bg-white/80 p-4 shadow-[0_24px_60px_rgba(60,80,120,0.16)] backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2">
        <Cpu className="h-4 w-4 text-[oklch(0.5_0.14_190)]" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">AI Operational Orchestration</span>
      </div>

      <p className="mb-3 text-xs text-muted-foreground">Infrastructure-focused control directives</p>

      <ul className="space-y-2">
        {actions.map((action, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-foreground/90">
            <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.15_150)]" />
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function WaterSystemPanel({ system, onClose }: { system: WaterSystemData; onClose: () => void }) {
  const healthTone = system.failureRisk < 3 ? "text-[oklch(0.55_0.15_150)]" : system.failureRisk < 8 ? "text-[oklch(0.65_0.18_60)]" : "text-[oklch(0.6_0.2_28)]"

  return (
    <div className="pointer-events-auto absolute right-6 top-6 w-[380px] animate-in fade-in slide-in-from-right-2 duration-300 rounded-2xl border border-border/60 bg-white/80 shadow-[0_24px_60px_rgba(60,80,120,0.16)] backdrop-blur-xl">
      <div className="flex items-start justify-between border-b border-border/40 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-[oklch(0.7_0.17_155)] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Infrastructure node</span>
          </div>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{system.name}</h3>
          <p className="text-xs text-muted-foreground">
            {system.status} · {system.flow.toFixed(1)} L/min flow
          </p>
        </div>

        <button onClick={onClose} className="rounded-md p-1 transition-colors hover:bg-black/5" aria-label="Close panel">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium">Equipment Efficiency</span>
            <span className="font-mono text-[oklch(0.55_0.15_150)]">{system.efficiency.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-gradient-to-r from-[oklch(0.7_0.17_155)] to-[oklch(0.5_0.14_190)]" style={{ width: `${system.efficiency}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat icon={Gauge} label="Pressure" value={system.pressure.toFixed(1)} unit="bar" />
          <Stat icon={Zap} label="Energy" value={system.energy.toFixed(2)} unit="kW" />
          <Stat icon={Droplets} label="Flow" value={system.flow.toFixed(1)} unit="L/min" />
          <Stat icon={Clock3} label="Runtime" value={system.runtime.toLocaleString()} unit="h" />
          <Stat icon={ShieldAlert} label="Failure risk" value={system.failureRisk.toFixed(1)} unit="%" />
          <Stat icon={Activity} label="State" value={system.status} />
        </div>

        <div className="rounded-xl border border-border/40 bg-gradient-to-br from-[oklch(0.96_0.03_160)] to-[oklch(0.94_0.04_200)] p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.55_0.15_150)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Control Insights</span>
          </div>
          <ul className="space-y-1">
            {system.insights.map((insight, index) => (
              <li key={index} className="flex gap-1.5 text-xs text-foreground/80">
                <span className="text-[oklch(0.55_0.15_150)]">▸</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border/40 bg-white/70 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Wrench className="h-3.5 w-3.5" />
            Maintenance outlook
          </div>
          <p className={`mt-2 text-sm font-medium ${healthTone}`}>
            {system.failureRisk < 3
              ? "No intervention required. Node is within nominal operating envelope."
              : system.failureRisk < 8
                ? "Schedule routine inspection within the next maintenance window."
                : "Prioritize manual inspection and back-up routing checks."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3" /> LIVE WATER LOOP
          </span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}

export function FarmCommandCenter() {
  useSuppressExtensions()

  const racks = useMemo(makeRacks, [])
  const [hoveredRack, setHoveredRack] = useState<string | null>(null)
  const [selection, setSelection] = useState<{ rackId: string; layer: number } | null>(null)
  const [hoveredSystem, setHoveredSystem] = useState<SystemId | null>(null)
  const [selectedSystem, setSelectedSystem] = useState<SystemId | null>(null)

  const selectedRack = selection ? racks.find((rack) => rack.id === selection.rackId) ?? null : null
  const selectedSystemData = selectedSystem ? WATER_SYSTEMS.find((system) => system.id === selectedSystem) ?? null : null

  const orchestrationActions = useMemo(() => {
    const base = [
      "Airflow rerouted across canopy lanes.",
      "Circulation optimized for hydraulic stability.",
      "LED load balanced across active racks.",
      "UV cycle triggered for sterilization pass.",
    ]

    if (selectedSystemData) {
      if (selectedSystemData.id === "main-pump") {
        base[1] = "Main loop circulation optimized for pressure uniformity."
      }
      if (selectedSystemData.id === "uv") {
        base[3] = "UV cycle triggered with elevated dwell-time protocol."
      }
      if (selectedSystemData.id === "oxygen") {
        base[0] = "Airflow rerouted to support dissolved oxygen targets."
      }
      if (selectedSystemData.id === "nutrient") {
        base[2] = "LED load balanced to match nutrient uptake curves."
      }
    }

    if (selectedRack && selection) {
      base[2] = `LED load balanced for Layer ${selection.layer + 1} (${selectedRack.growthStage}).`
    }

    return base
  }, [selectedRack, selectedSystemData, selection])

  const stats = useMemo(() => {
    const avgHealth = Math.round(racks.reduce((sum, rack) => sum + rack.health, 0) / racks.length)
    const alerts = racks.filter((rack) => rack.automation === "Alert").length
    const totalLayers = racks.reduce((sum, rack) => sum + rack.levels, 0)
    return { avgHealth, alerts, totalLayers }
  }, [racks])

  return (
    <div className="relative w-full h-screen overflow-hidden rounded-[32px] border border-border/40 bg-gradient-to-br from-[#eaf5f4] via-[#eff6ff] to-[#f7fbf1] shadow-[0_40px_80px_rgba(60,80,120,0.18)]">
      <Canvas camera={{ position: [18, 14, 18], fov: 38 }} gl={{ antialias: false, toneMappingExposure: 1, pixelRatio: 1 }} className="absolute inset-0 w-full h-full">
        <Suspense fallback={null}>
          <fog attach="fog" args={["#e8f0f2", 25, 60]} />
          <ambientLight intensity={0.8} color="#ffffff" />
          <directionalLight
            position={[15, 20, 10]}
            intensity={0.9}
            color="#ffffff"
          />

          <GreenhouseEnvironment />
          {/* Disabled FogParticles to reduce lag */}
          {/* <FogParticles /> */}

          {racks.map((rack) => (
            <HydroponicRack
              key={rack.id}
              rack={rack}
              hovered={hoveredRack === rack.id}
              selectedLayer={selection?.rackId === rack.id ? selection.layer : null}
              onHoverRack={setHoveredRack}
              onSelectLayer={(rackId, layer) => {
                setSelection({ rackId, layer })
                setSelectedSystem(null)
              }}
            />
          ))}

          <WaterSystem
            hovered={hoveredSystem}
            selected={selectedSystem}
            onHover={setHoveredSystem}
            onSelect={(systemId) => {
              setSelectedSystem(systemId)
              setSelection(null)
            }}
          />

          <OrbitControls makeDefault enablePan maxPolarAngle={Math.PI / 2.1} minDistance={8} maxDistance={40} target={[0, 2, 0]} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-6 top-6 flex items-center gap-3 rounded-2xl border border-border/60 bg-white/80 px-5 py-3 shadow-[0_24px_60px_rgba(60,80,120,0.16)] backdrop-blur-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.17_155)] to-[oklch(0.55_0.15_150)]">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Verdant OS</div>
            <h1 className="text-sm font-semibold tracking-tight">Hydroponic Digital Twin · Command Center</h1>
          </div>
          <span className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.95_0.06_155)] px-2 py-0.5 text-[10px] font-medium text-[oklch(0.4_0.15_150)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.15_150)] animate-pulse" />
            LIVE
          </span>
        </div>

        {selectedRack && selection && <OrchestrationPanel actions={orchestrationActions} />}

        <div className="pointer-events-auto absolute bottom-6 left-6 flex flex-wrap gap-3">
          {[
            { icon: Leaf, label: "Avg Health", value: `${stats.avgHealth}%`, tone: "ok" },
            { icon: Cpu, label: "Active Layers", value: stats.totalLayers, tone: "default" },
            { icon: Droplets, label: "Flow Rate", value: "2.4 L/m" },
            { icon: Activity, label: "Alerts", value: stats.alerts, tone: stats.alerts ? "warn" : "ok" },
            { icon: Wifi, label: "Sensors", value: `${racks.length * 6}/48` },
          ].map((stat, index) => (
            <div key={index} className="min-w-[120px] rounded-xl border border-border/60 bg-white/80 px-4 py-2.5 shadow-[0_24px_60px_rgba(60,80,120,0.16)] backdrop-blur-xl">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                <stat.icon className="h-3 w-3" />
                {stat.label}
              </div>
              <div
                className={`mt-0.5 text-lg font-semibold ${
                  stat.tone === "warn" ? "text-[oklch(0.65_0.18_60)]" : stat.tone === "ok" ? "text-[oklch(0.55_0.15_150)]" : "text-foreground"
                }`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {!selection && (
          <div className="pointer-events-none absolute bottom-6 right-6 rounded-xl border border-border/40 bg-white/70 px-3 py-2 text-xs text-muted-foreground backdrop-blur-md">
            Click any tray to inspect · Drag to orbit · Scroll to zoom
          </div>
        )}

        {selectedRack && selection && <TelemetryPanel rack={selectedRack} layer={selection.layer} onClose={() => setSelection(null)} />}

        {selectedSystemData && <WaterSystemPanel system={selectedSystemData} onClose={() => setSelectedSystem(null)} />}
      </div>
    </div>
  )
}
