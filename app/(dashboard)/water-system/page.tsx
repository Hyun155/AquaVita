import { DigitalTwin } from "@/components/environment/DigitalTwin"

/**
 * Water System Page - Digital Twin Visualization
 * Focused on physical flow, pump simulation, and system-wide fluid dynamics.
 */
export default function WaterSystemPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header Section */}
      <div className="p-8 pb-0">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          System <span className="text-cyan-400">Digital Twin</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time physical simulation and hydroponic flow monitoring.
        </p>
      </div>

      {/* Main Simulation Component */}
      {/* This component handles the visual flow, layers, and fish tank animations */}
      <section className="p-6">
        <DigitalTwin />
      </section>

      {/* Footer Simulation Metadata */}
      <div className="px-8 pb-12">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">
              Simulation Status: Active
            </p>
          </div>
          <p className="text-slate-300 text-sm italic">
            "Visualizing the closed-loop nutrient cycle between the aquaponic tank and vertical farm layers."
          </p>
        </div>
      </div>
    </main>
  );
}