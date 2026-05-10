"use client";

import React from 'react';
import { BiologicalRiskPredictor } from './BiologicalRiskPredictor';

export default function WaterDashboard() {
  // --- Sensor Data ---
  const data = {
    temp: 24.5, // Water temperature
    ec: 1.8 // EC level
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Biological Risk Predictor */}
      <BiologicalRiskPredictor temperature={data.temp} ec={data.ec} />
    </div>
  );
}