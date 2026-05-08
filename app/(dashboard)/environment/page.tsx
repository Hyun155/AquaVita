import WaterDashboard from "@/components/environment/WaterDashboard";

/**
 * Environment Page - AI Control Command Center
 * Focused on Member 3 tasks: Monitoring, Automated Correction, and Scheduling.
 */
export default function EnvironmentPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header Section */}
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Environment <span className="text-indigo-400">Command Center</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Smart AI control interface for nutrient, pH, and climate management.
        </p>
      </div>

      {/* AI Branding Separator */}
      <div className="w-full px-8 flex items-center gap-4 py-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/60">
          AI Logic Layer Active
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
      </div>

      {/* Main Dashboard Component */}
      <section className="flex-1 px-8 pb-20 pt-4">
        <div className="max-w-6xl mx-auto">
          <WaterDashboard />
        </div>
      </section>
    </main>
  );
}