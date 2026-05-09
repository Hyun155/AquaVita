"use client"

import { useState } from "react"
import { Bell, Leaf, Wifi, Fish, Droplets, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSuppressExtensions } from "@/hooks/useSuppressExtensions"

export function TopNavbar() {
  const [activeView, setActiveView] = useState<"hydro" | "aqua">("hydro")
  const [notifications] = useState(3)
  // Light-only site: no theme toggle or dark mode handling
  const [mounted] = useState(true)
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

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-secondary/50 border border-border/50">
            <button
              onClick={() => setActiveView("hydro")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeView === "hydro"
                  ? "bg-gradient-to-r from-neon-green/20 to-neon-aqua/20 text-neon-green"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Droplets className="w-4 h-4" />
              Hydroponics
            </button>
            <button
              onClick={() => setActiveView("aqua")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeView === "aqua"
                  ? "bg-gradient-to-r from-neon-aqua/20 to-neon-blue/20 text-neon-aqua"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Fish className="w-4 h-4" />
              Aquaponics
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/30 border border-border/50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search systems..."
              className="bg-transparent text-sm outline-none w-40 placeholder:text-muted-foreground"
            />
          </div>

          <button className="relative p-2.5 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-xs font-bold flex items-center justify-center text-destructive-foreground animate-pulse">
                {notifications}
              </span>
            )}
          </button>

          {/* Theme toggle removed for light-only site */}

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-aqua to-neon-blue flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-background" />
          </div>
        </div>
      </div>
    </header>
  )
}