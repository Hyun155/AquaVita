"use client"

import dynamic from "next/dynamic"

const FarmCommandCenter = dynamic(
  () => import("@/components/farm/FarmCommandCenter").then((module) => module.FarmCommandCenter),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[calc(100vh-9rem)] rounded-[32px] border border-border/40 bg-white/70 p-6">
        <div className="h-full rounded-[24px] border border-dashed border-border/50 bg-white/80" />
      </div>
    ),
  },
)

export function OverviewClientWrapper() {
  return <FarmCommandCenter />
}
