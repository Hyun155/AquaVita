"use client"

import { Leaf, Wifi } from "lucide-react"
import { useSuppressExtensions } from "@/hooks/useSuppressExtensions"

export function TopNavbar() {
  useSuppressExtensions()

  return (
    <header className="glass-card border-b border-border/50 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-neon-aqua flex items-center justify-center">
              <Leaf className="w-6 h-6 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">AquaVita</h1>
              <p className="text-xs text-muted-foreground">Intelligent water-based agriculture</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
            <Wifi className="w-3.5 h-3.5 text-success animate-pulse" />
            <span className="text-xs font-medium text-success">System Online</span>
          </div>
        </div>

      </div>
    </header>
  )
}