"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, ScanLine, Image as ImageIcon, Radar } from "lucide-react"
import type { DiseaseAutoScanResult, DiseaseDetectionResult } from "@/components/plant-ai/types"

const fakeDiagnoses: DiseaseDetectionResult["diagnosis"][] = [
  "Leaf Spot Detected",
  "Nitrogen Deficiency Likely",
  "Healthy Plant",
]

const autoScanFrames: DiseaseAutoScanResult[] = [
  {
    plantName: "Lettuce A",
    layerId: 1,
    issue: "Downy Mildew",
    automatedResponse: "Isolation protocol triggered.",
    diagnosis: "Leaf Spot Detected",
    diagnosisDetail: "Vein-bounded Leaf Spot Detected",
    confidence: 96,
    healthScore: 54,
    source: "auto-scan",
    detectionMethod: "spectral-scan",
  },
  {
    plantName: "Basil B",
    layerId: 2,
    issue: "Nitrogen Deficiency",
    automatedResponse: "Increased nutrient dosing.",
    diagnosis: "Nitrogen Deficiency Likely",
    confidence: 94,
    healthScore: 63,
    source: "auto-scan",
    detectionMethod: "ai-analysis",
  },
  {
    plantName: "Mint D",
    layerId: 3,
    issue: "Spider Mites",
    automatedResponse: "Applied organic neem oil spray.",
    diagnosis: "Pest Infestation",
    confidence: 92,
    healthScore: 58,
    source: "auto-scan",
    detectionMethod: "ai-analysis",
  },
]

const autoScanPhotoByIssue: Record<DiseaseAutoScanResult["issue"], string> = {
  "Downy Mildew": "/images/sick-plants/lettuce-downy-mildew.jpg",
  "Nitrogen Deficiency": "/images/sick-plants/basil-nitrogen-deficiency.jpg",
  "Spider Mites": "/images/sick-plants/mint-spider-mites.jpg",
  "Powdery Mildew": "/images/sick-plants/powdery-mildew.jpg",
  "Wilting": "/images/sick-plants/wilting-plant.jpg",
  "Nutrient Lockout": "/images/sick-plants/nutrient-lockout.jpg",
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function buildSickPlantSVG(result: DiseaseAutoScanResult) {
  // Three stylized SVG leaf images representing common issues.
  if (result.issue === "Downy Mildew") {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 360' width='600' height='360'>
        <rect width='100%' height='100%' fill='#072018'/>
        <g transform='translate(80,40)'>
          <path d='M20 220 C120 40, 420 40, 520 220 C420 180, 200 260, 20 220 Z' fill='#0b5f3f' stroke='#073' stroke-width='4'/>
          <!-- white fuzzy spots for downy mildew -->
          ${Array.from({ length: 12 }).map((_, i) => {
            const cx = 60 + i * 36
            const cy = 120 + ((i % 3) * 12)
            return `<circle cx='${cx}' cy='${cy}' r='10' fill='#ffffff' fill-opacity='0.9' />`
          }).join("\n")}
          <text x='10' y='300' fill='#bff3db' font-size='20'>Downy Mildew — white fuzzy growth</text>
        </g>
      </svg>`

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }

  if (result.issue === "Nitrogen Deficiency") {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 360' width='600' height='360'>
        <rect width='100%' height='100%' fill='#091a11'/>
        <g transform='translate(60,30)'>
          <path d='M40 240 C140 50, 420 60, 520 240 C410 200, 220 280, 40 240 Z' fill='url(#g)' stroke='#2b6' stroke-width='3'/>
          <defs>
            <linearGradient id='g' x1='0' x2='1'>
              <stop offset='0%' stop-color='#cfe87c'/>
              <stop offset='60%' stop-color='#b3d066'/>
              <stop offset='100%' stop-color='#2f7b4a'/>
            </linearGradient>
          </defs>
          <text x='14' y='300' fill='#dff7d9' font-size='20'>Nitrogen Deficiency — yellowing leaf</text>
        </g>
      </svg>`

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }

  // Spider Mites
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 360' width='600' height='360'>
      <rect width='100%' height='100%' fill='#081712'/>
      <g transform='translate(70,40)'>
        <path d='M30 230 C140 30, 410 30, 520 230 C410 190, 220 260, 30 230 Z' fill='#0d6f45' stroke='#0b5' stroke-width='3'/>
        <!-- small red mites -->
        ${Array.from({ length: 18 }).map((_, i) => {
          const cx = 60 + (i * 24) % 420
          const cy = 110 + ((i * 37) % 80)
          return `<circle cx='${cx}' cy='${cy}' r='4' fill='#ff6b6b' />`
        }).join("\n")}
        <text x='12' y='300' fill='#dff7d9' font-size='20'>Spider Mites — small red spots and webbing</text>
      </g>
    </svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function resolveAutoScanPreview(frame: DiseaseAutoScanResult): Promise<string> {
  const preferredPhoto = autoScanPhotoByIssue[frame.issue]

  return new Promise((resolve) => {
    const probe = new window.Image()
    probe.onload = () => resolve(preferredPhoto)
    probe.onerror = () => resolve(buildSickPlantSVG(frame))
    probe.src = preferredPhoto
  })
}

function autoDetector(): Promise<{ previewUrl: string; result: DiseaseAutoScanResult }> {
  return new Promise((resolve) => {
    const selected = autoScanFrames[randomInt(0, autoScanFrames.length - 1)]
    window.setTimeout(async () => {
      const previewUrl = await resolveAutoScanPreview(selected)
      resolve({
        previewUrl,
        result: selected,
      })
    }, randomInt(600, 1400))
  })
}

export function DiseaseDetectionPanel() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAutoScanEnabled, setIsAutoScanEnabled] = useState(false)
  const [manualResult, setManualResult] = useState<DiseaseDetectionResult | null>(null)
  const [autoResult, setAutoResult] = useState<DiseaseAutoScanResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    if (!isAutoScanEnabled) return undefined

    let cancelled = false
    const interval = window.setInterval(() => {
      setIsProcessing(true)
      autoDetector().then(({ previewUrl: nextPreviewUrl, result: nextResult }) => {
        if (cancelled) {
          URL.revokeObjectURL(nextPreviewUrl)
          return
        }

        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl)
        }

        setPreviewUrl(nextPreviewUrl)
        setAutoResult(nextResult)
        setIsProcessing(false)
      })
    }, 4000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [isAutoScanEnabled, previewUrl])

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsAutoScanEnabled(false)
    setAutoResult(null)

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const nextPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(nextPreviewUrl)
    setManualResult(null)
    setIsProcessing(true)

    // Fake model latency + randomized diagnosis to simulate an AI inference pipeline.
    const processingDelay = randomInt(1000, 2000)
    window.setTimeout(() => {
      const diagnosis = fakeDiagnoses[randomInt(0, fakeDiagnoses.length - 1)]
      const confidence = randomInt(78, 98)
      const healthScore =
        diagnosis === "Healthy Plant"
          ? randomInt(82, 99)
          : diagnosis === "Leaf Spot Detected"
            ? randomInt(45, 72)
            : randomInt(50, 78)

      setManualResult({ diagnosis, confidence, healthScore, detectionMethod: "manual" })
      setIsProcessing(false)
    }, processingDelay)
  }

  const startAutoScan = () => {
    setIsAutoScanEnabled(true)
    setManualResult(null)
    setAutoResult(null)
    setIsProcessing(true)

    autoDetector().then(({ previewUrl: nextPreviewUrl, result: nextResult }) => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }

      setPreviewUrl(nextPreviewUrl)
      setAutoResult(nextResult)
      setIsProcessing(false)
    })
  }

  const stopAutoScan = () => {
    setIsAutoScanEnabled(false)
    setAutoResult(null)
    setPreviewUrl(null)
    setIsProcessing(false)
  }

  return (
    <section className="glass-card rounded-2xl border border-border/50 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-green/90 to-neon-aqua/80">
          <ScanLine className="h-5 w-5 text-background" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Disease Detection</h3>
          <p className="text-xs text-muted-foreground">Upload a leaf image for simulated AI diagnosis</p>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-gradient-to-r from-neon-green/80 to-neon-aqua/70 text-background hover:brightness-110"
        >
          <Upload className="mr-1 h-4 w-4" />
          Upload Plant Image
        </Button>

        <Button
          type="button"
          onClick={isAutoScanEnabled ? stopAutoScan : startAutoScan}
          variant="outline"
          className={`w-full ${
            isAutoScanEnabled
              ? "border-amber-400/35 bg-amber-400/10 text-amber-500 hover:bg-amber-400/15"
              : "border-neon-aqua/35 bg-neon-aqua/10 text-neon-aqua hover:bg-neon-aqua/15"
          }`}
        >
          <Radar className={`mr-1 h-4 w-4 ${isAutoScanEnabled ? "animate-spin" : ""}`} />
          {isAutoScanEnabled ? "Stop Auto-Scan Mode" : "Auto-Scan Mode"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onFileChange}
        />

        <div className="overflow-hidden rounded-xl border border-border/50 bg-secondary/30">
          {previewUrl ? (
            <img src={previewUrl} alt="Plant upload preview" className="h-44 w-full object-cover" />
          ) : (
            <div className="flex h-44 items-center justify-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              No image uploaded yet. Auto-scan can capture a simulated frame.
            </div>
          )}
        </div>

        {manualResult && !isProcessing && !isAutoScanEnabled && (
          <div className="space-y-2 rounded-xl border border-border/50 bg-secondary/25 p-3 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-sm font-medium text-foreground">{manualResult.diagnosis}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border/40 bg-secondary/40 p-2 text-muted-foreground">
                Confidence
                <p className="mt-0.5 text-sm font-semibold text-neon-green">{manualResult.confidence}%</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-secondary/40 p-2 text-muted-foreground">
                Health score
                <p className="mt-0.5 text-sm font-semibold text-neon-aqua">{manualResult.healthScore}%</p>
              </div>
            </div>
          </div>
        )}

        {autoResult && !isProcessing && isAutoScanEnabled && (
          <div className="space-y-3 rounded-xl border border-neon-aqua/30 bg-neon-aqua/10 p-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{autoResult.plantName}</p>
                <p className="text-xs text-muted-foreground">Detected abnormality: {autoResult.issue}</p>
              </div>
              <span className="rounded-full border border-neon-aqua/30 bg-neon-aqua/15 px-2 py-1 text-[11px] font-semibold text-neon-aqua">
                Auto-Scan
              </span>
            </div>

            <p className="text-sm font-medium text-foreground">{autoResult.diagnosisDetail || autoResult.diagnosis}</p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border/40 bg-secondary/40 p-2 text-muted-foreground">
                Confidence
                <p className="mt-0.5 text-sm font-semibold text-neon-green">{autoResult.confidence}%</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-secondary/40 p-2 text-muted-foreground">
                Health score
                <p className="mt-0.5 text-sm font-semibold text-neon-aqua">{autoResult.healthScore}%</p>
              </div>
            </div>

            <div className="rounded-lg border border-border/40 bg-secondary/35 p-2 text-xs text-muted-foreground">
              Automated response: <span className="font-medium text-foreground">{autoResult.automatedResponse}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
