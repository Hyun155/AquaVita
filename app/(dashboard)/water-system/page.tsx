import { DigitalTwin } from "@/components/environment/DigitalTwin"

/**
 * Water System Page - Digital Twin Visualization
 * Focused on the physical flow and system-wide simulation.
 */
export default function WaterSystemPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] flex flex-col">
      {/* Header Section */}
      <div className="p-8 pb-0">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          System <span className="text-cyan-400">Digital Twin</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time physical simulation and hydroponic flow monitoring.
        </p>
      </div>

      {/* Main Simulation Component (Member 1 Focus) */}
      <section className="p-6">
        <DigitalTwin />
      </section>

      {/* Footer Info */}
      <div className="px-8 pb-12">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
          <p className="text-xs text-slate-500 uppercase font-black tracking-widest">
            Simulation Status
          </p>
          <p className="text-slate-300 text-sm mt-2 italic">
            "Visualizing the closed-loop nutrient cycle between the aquaponic tank and vertical farm layers."
          </p>
        </div>
      </div>
    </main>
  );
}