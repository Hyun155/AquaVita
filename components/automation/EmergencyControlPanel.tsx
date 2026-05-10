"use client"

import { AlertTriangle, Power, Battery } from "lucide-react"

export function EmergencyControlPanel() {
  return (
    <div className="backdrop-blur-md bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6 text-[#E2E8F0] flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        Emergency Control Panel
      </h2>

      <div className="space-y-4">
        <button className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          Manual Override
        </button>

        <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3">
          <Power className="w-5 h-5" />
          Emergency Shutdown
        </button>

        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3">
          <Battery className="w-5 h-5" />
          Backup Power
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <span className="inline-block bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/30">
          REQUIRES 2FA
        </span>
      </div>
    </div>
  )
}