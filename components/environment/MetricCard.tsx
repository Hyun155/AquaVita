"use client";

import { LucideIcon } from 'lucide-react';

interface MetricProps {
  title: string; value: number; unit: string;
  icon: LucideIcon; min: number; max: number; color: string;
}

export const MetricCard = ({ title, value, unit, icon: Icon, min, max, color }: MetricProps) => {
  const isAlert = value < min || value > max;

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-500 ${
      isAlert ? 'bg-red-500/10 border-red-500 animate-pulse shadow-lg shadow-red-500/20' : 'bg-white/70 border-border/50'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className={isAlert ? 'text-red-500' : color} />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-bold ${isAlert ? 'text-red-500' : 'text-foreground'}`}>{value}</span>
        <span className="text-muted-foreground text-xs font-medium">{unit}</span>
      </div>
      <div className="mt-3 text-[10px] text-muted-foreground font-mono flex justify-between">
        <span>TARGET RANGE:</span>
        <span>{min} - {max} {unit}</span>
      </div>
    </div>
  );
};