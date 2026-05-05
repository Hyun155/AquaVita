"use client"

import { AnalyticsCharts } from "@/components/charts/AnalyticsCharts"
import { SustainabilityPanel } from "@/components/dashboard/SustainabilityPanel"

export default function AnalyticsPage() {
  return (
    <>
      <AnalyticsCharts />
      <SustainabilityPanel />
    </>
  )
}