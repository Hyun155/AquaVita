'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Droplets, Leaf, LineChart, Settings, Shield, Cpu } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      label: 'Command Center',
      href: '/overview',
      icon: BarChart3,
    },
    {
      label: 'Plant Intelligence',
      href: '/plant-ai',
      icon: Leaf,
    },
    {
      label: 'Water & Nutrient System',
      href: '/water-system',
      icon: Droplets,
    },
    {
      label: 'Automation Engine',
      href: '/automation-engine',
      icon: Cpu,
    },
    {
      label: 'Analytics & Sustainability',
      href: '/analytics',
      icon: LineChart,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-r border-border/60 flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-neon-aqua/70 to-neon-green/70 rounded-lg flex items-center justify-center">
            <Droplets className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              AquaVita
            </h1>
            <p className="text-xs text-muted-foreground">Smart Farming</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-r from-neon-aqua/20 to-neon-green/20 text-neon-blue border border-neon-aqua/40 shadow-[0_0_20px_rgba(0,_229,_200,_0.25)]'
                  : 'text-foreground/80 hover:bg-slate-200/70 hover:text-neon-blue border border-transparent'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-border/60 bg-white/60">
        <div className="text-xs text-muted-foreground text-center">
          <p>v1.0.0</p>
          <p className="text-muted-foreground/70">Powered by AquaVita</p>
        </div>
      </div>
    </aside>
  )
}
