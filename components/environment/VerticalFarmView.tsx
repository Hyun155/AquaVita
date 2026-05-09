"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { MeshReflectorMaterial, OrbitControls } from "@react-three/drei"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import React, { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"

type LayerData = {
  id: number
  name: string
  health: number
  light: number
  moisture: number
}

type VerticalFarmViewProps = {
  layers: LayerData[]
  hoveredLayerId: number | null
  selectedLayerId: number | null
  onHoverLayer: (layerId: number | null) => void
  onSelectLayer: (layerId: number | null) => void
  onLayerClick: (layerIndex: number) => void
}

export default function VerticalFarmView({
  layers,
  hoveredLayerId,
  selectedLayerId,
  onHoverLayer,
  onSelectLayer,
  onLayerClick,
}: VerticalFarmViewProps) {
  const plantPositions = useMemo(() => {
    const positions: [number, number, number][] = []
    const cols = 4
    const rows = 3
    const spacingX = 0.46
    const spacingZ = 0.22
    const startX = -((cols - 1) * spacingX) / 2
    const startZ = -((rows - 1) * spacingZ) / 2

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions.push([startX + c * spacingX, 0, startZ + r * spacingZ])
      }
    }

    return positions
  }, [])

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [4, 3, 6], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#808080"]} />
        <fogExp2 attach="fog" args={["#696969", 0.05]} />

        <ambientLight intensity={0.2} color="#302c6c" />
        <spotLight position={[0, 8, 0]} intensity={2} angle={0.4} penumbra={0.6} castShadow />
        <pointLight position={[4, 2.5, 2]} intensity={0.5} color="#1e5a47" />
        <pointLight position={[-4, 2.5, -2]} intensity={0.5} color="#1e5a47" />

        <Suspense fallback={null}>
          <FarmScene
            layers={layers}
            plantPositions={plantPositions}
            hoveredLayerId={hoveredLayerId}
            selectedLayerId={selectedLayerId}
            onHoverLayer={onHoverLayer}
            onSelectLayer={onSelectLayer}
            onLayerClick={onLayerClick}
          />
        </Suspense>

        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>

        <OrbitControls autoRotate autoRotateSpeed={0.8} enableZoom maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  )
}

type FarmSceneProps = {
  layers: LayerData[]
  plantPositions: [number, number, number][]
  hoveredLayerId: number | null
  selectedLayerId: number | null
  onHoverLayer: (layerId: number | null) => void
  onSelectLayer: (layerId: number | null) => void
  onLayerClick: (layerIndex: number) => void
}

function FarmScene({
  layers,
  plantPositions,
  hoveredLayerId,
  selectedLayerId,
  onHoverLayer,
  onSelectLayer,
  onLayerClick,
}: FarmSceneProps) {
  const rackGroup = useRef<THREE.Group>(null)
  const shelfSpacing = 0.95
  const shelfCount = 5
  const rackCenterY = (shelfCount - 1) * shelfSpacing * 0.5

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (rackGroup.current) {
      rackGroup.current.rotation.y = Math.sin(t * 0.15) * 0.04
    }
  })

  return (
    <group ref={rackGroup} position={[0, -rackCenterY, 0]}>
      <RackStructure height={5} />

      {Array.from({ length: shelfCount }).map((_, index) => {
        const y = (shelfCount - 1 - index) * shelfSpacing
        const layerIndex = shelfCount - index
        const isInteractive = layerIndex <= 4
        const layerId = isInteractive ? layerIndex : null
        const isHovered = layerId !== null && hoveredLayerId === layerId
        const isSelected = layerId !== null && selectedLayerId === layerId
        const highlight = isHovered || isSelected

        return (
          <group key={`shelf-${index}`} position={[0, y, 0]}>
            <ShelfTray
              active={highlight}
              isSelected={isSelected}
              onHover={() => onHoverLayer(layerId)}
              onLeave={() => onHoverLayer(null)}
              onSelect={() => {
                if (layerId !== null) {
                  onLayerClick(layerId)
                  onSelectLayer(layerId)
                }
              }}
            />
            <LedStrip />
            <WaterChannel />

            {plantPositions.map((pos, plantIndex) => (
              <Plant
                key={`plant-${index}-${plantIndex}`}
                position={pos}
                plantIndex={plantIndex}
                shelfIndex={index}
              />
            ))}
          </group>
        )
      })}

      <FloorPlane />
    </group>
  )
}

function RackStructure({ height }: { height: number }) {
  const polePositions: [number, number][] = [
    [-1.0, -0.4],
    [-1.0, 0.4],
    [1.0, -0.4],
    [1.0, 0.4],
  ]

  return (
    <group>
      {polePositions.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, height * 0.5 - 0.4, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, height, 20]} />
          <meshStandardMaterial color="#1e293b" metalness={1} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

type ShelfTrayProps = {
  active: boolean
  isSelected: boolean
  onHover: () => void
  onLeave: () => void
  onSelect: () => void
}

function ShelfTray({ active, isSelected, onHover, onLeave, onSelect }: ShelfTrayProps) {
  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        onPointerOver={(event) => {
          event.stopPropagation()
          document.body.style.cursor = "pointer"
          onHover()
        }}
        onPointerOut={(event) => {
          event.stopPropagation()
          document.body.style.cursor = "default"
          onLeave()
        }}
        onClick={(event) => {
          event.stopPropagation()
          onSelect()
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 0.04, 0.8]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.3}
          envMapIntensity={1}
          emissive={isSelected ? "#ffffff" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      {active && (
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[2.02, 0.01, 0.82]} />
          <meshStandardMaterial color="#334155" opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  )
}

function LedStrip() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2, 0.02, 0.8]} />
        <meshStandardMaterial
          color="#e9e7ec"
          emissive="#787a7e"
          emissiveIntensity={1.0}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      <pointLight position={[0, 0.22, 0]} color="#efe8f6" intensity={1.0} distance={1.5} />
    </group>
  )
}

function Plant({
  position,
  plantIndex,
  shelfIndex,
}: {
  position: [number, number, number]
  plantIndex: number
  shelfIndex: number
}) {
  const plantRef = useRef<THREE.Group>(null)
  const colors = ["#16a34a", "#15803d", "#22c55e", "#4ade80"]
  const color = useMemo(() => {
    const seed = seededRandom(shelfIndex * 23.1 + plantIndex * 7.4)
    const idx = Math.floor(seed * colors.length)
    return colors[Math.min(idx, colors.length - 1)]
  }, [plantIndex, shelfIndex])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (plantRef.current) {
      plantRef.current.rotation.z = Math.sin(t * 0.5 + plantIndex * 0.6 + shelfIndex) * 0.02
    }
  })

  return (
    <group ref={plantRef} position={[position[0], 0.07, position[2]]}>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
        <meshStandardMaterial color="#854d0e" roughness={0.8} />
      </mesh>
      <mesh scale={[1, 0.7, 1]}>
        <sphereGeometry args={[0.09, 16, 14]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  )
}

function WaterChannel() {
  return (
    <mesh position={[0, -0.08, 0.35]}>
      <boxGeometry args={[2, 0.01, 0.1]} />
      <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1} />
    </mesh>
  )
}

function FloorPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        color="#050505"
      />
    </mesh>
  )
}

function seededRandom(value: number) {
  const x = Math.sin(value * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
