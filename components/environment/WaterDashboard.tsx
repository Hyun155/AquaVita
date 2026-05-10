"use client";

import React from 'react';
import { MetricCard } from './MetricCard';
import { BiologicalRiskPredictor } from './BiologicalRiskPredictor';
import { Droplets, Thermometer, Zap } from 'lucide-react';

export default function WaterDashboard() {
  // --- Sensor Data ---
  const data = {
    ph: 7.20, // Current pH
    temp: 24.5, // Water temperature
    ec: 1.8 // EC level
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Monitoring Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="pH Level" value={data.ph} unit="pH" min={5.5} max={6.5} icon={Droplets} color="text-blue-400" />
        <MetricCard title="Water Temp" value={data.temp} unit="°C" min={18} max={26} icon={Thermometer} color="text-orange-400" />
        <MetricCard title="EC Level" value={data.ec} unit="mS/cm" min={1.0} max={2.5} icon={Zap} color="text-yellow-400" />
      </div>

      {/* Biological Risk Predictor */}
      <BiologicalRiskPredictor temperature={data.temp} ec={data.ec} />
    </div>
  );
}