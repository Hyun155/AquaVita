"use client";

import { LucideIcon } from 'lucide-react';

interface ToggleProps {
  label: string; isActive: boolean; isAutoMode: boolean;
  icon: LucideIcon; onClick: () => void;
}

export const SystemToggle = ({ label, isActive, isAutoMode, icon: Icon, onClick }: ToggleProps) => {
  return (
    <div className="relative group">
      <button 
        disabled={isAutoMode}
        onClick={onClick}
        className={`flex items-center justify-between w-full p-4 rounded-xl border transition-all duration-300 ${
          isAutoMode ? 'opacity-40 cursor-not-allowed bg-white/40 border-border/50' :
          isActive ? 'bg-neon-aqua/15 border-neon-aqua text-neon-aqua shadow-inner' : 'bg-white/70 border-border/50 text-muted-foreground hover:border-neon-blue/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={isActive && !isAutoMode ? 'text-indigo-400' : 'text-slate-500'} />
          <span className="font-bold text-[10px] uppercase tracking-wider">{label}</span>
        </div>
        <div className={`w-8 h-4 rounded-full relative transition-colors ${isActive ? 'bg-neon-aqua' : 'bg-muted'}`}>
          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isActive ? 'right-1' : 'left-1'}`} />
        </div>
      </button>
      
      {/* Floating AI Lock Indicator */}
      {isAutoMode && (
        <span className="absolute -top-2 left-3 bg-neon-blue text-[8px] px-2 py-0.5 rounded shadow-lg text-white font-black uppercase tracking-widest border border-neon-blue/40">
          AI Active
        </span>
      )}
    </div>
  );
};