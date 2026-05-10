import { NextResponse } from "next/server"

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const fakeDiagnoses = [
  "Leaf Spot Detected",
  "Nitrogen Deficiency Likely",
  "Healthy Plant",
]

function computeHealthScore(diagnosis: string, confidence: number) {
  const label = diagnosis.toLowerCase()
  if (label.includes("healthy")) return Math.min(99, 80 + Math.round((confidence / 100) * 20))
  // disease-like labels -> lower health when confidence is high
  return Math.max(20, 100 - confidence)
}

async function callHuggingFace(file: Blob) {
  const model = process.env.HF_MODEL || "google/vit-base-patch16-224"
  const apiKey = process.env.HF_API_KEY
  if (!apiKey) throw new Error("HF_API_KEY not configured")

  const url = `https://api-inference.huggingface.co/models/${model}`

  const arrayBuffer = await file.arrayBuffer()
  const body = Buffer.from(arrayBuffer)

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": (file as any).type || "application/octet-stream",
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`HF inference failed: ${res.status} ${text}`)
  }

  const json = await res.json()
  return json
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("image") as Blob | null

    if (!file) return NextResponse.json({ error: "no image provided" }, { status: 400 })

    // Try HF inference first
    try {
      const preds = await callHuggingFace(file)

      // Expecting array of { label, score }
      if (Array.isArray(preds) && preds.length > 0) {
        const top = preds[0]
        const diagnosis = String(top.label || top["label"] || "Unknown")
        const score = Number(top.score ?? top["score"] ?? 0)
        const confidence = Math.round(score * 100)
        const healthScore = computeHealthScore(diagnosis, confidence)

        return NextResponse.json({ diagnosis, confidence, healthScore, detectionMethod: "hf" })
      }

      // Unexpected format -> fall through to mock
    } catch (hfErr) {
      // Log server-side and continue to mocked fallback
      console.error("Hugging Face inference error:", hfErr)
    }

    // Fallback mock analysis if HF is not available or fails
    await new Promise((r) => setTimeout(r, randomInt(700, 1200)))
    const diagnosis = fakeDiagnoses[randomInt(0, fakeDiagnoses.length - 1)]
    const confidence = randomInt(78, 98)
    const healthScore =
      diagnosis === "Healthy Plant" ? randomInt(82, 99) : diagnosis === "Leaf Spot Detected" ? randomInt(45, 72) : randomInt(50, 78)

    return NextResponse.json({ diagnosis, confidence, healthScore, detectionMethod: "mock-fallback" })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "analysis failed" }, { status: 500 })
  }
}
