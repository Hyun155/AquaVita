import { Sprout, Droplets, Zap, Recycle } from "lucide-react"
import { KPICard } from "@/components/dashboard/KPICard"

export function KPICards() {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Plant Health Score"
          value={87}
          icon={<Sprout className="w-5 h-5" />}
          trend={4.2}
          color="green"
          delay={0}
        />
        <KPICard
          title="Water Quality Score"
          value={92}
          icon={<Droplets className="w-5 h-5" />}
          trend={2.1}
          color="aqua"
          unit=""
          delay={100}
        />
        <KPICard
          title="Energy Efficiency"
          value={78}
          icon={<Zap className="w-5 h-5" />}
          trend={-1.5}
          color="yellow"
          unit="%"
          delay={200}
        />
        <KPICard
          title="Sustainability Index"
          value={85}
          icon={<Recycle className="w-5 h-5" />}
          trend={6.8}
          color="blue"
          delay={300}
        />
      </div>
    </section>
  )
}