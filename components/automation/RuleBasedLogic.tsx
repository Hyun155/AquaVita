"use client"

const rules = [
  "IF algae_probability > 0.6 -> activate UV sterilization cycle",
  "IF temperature > 26°C -> enable cooling system",
  "IF humidity < 50% -> increase misting frequency",
  "IF EC_level > 2.2 mS/cm -> pause nutrient injection",
  "IF pH_level < 5.5 -> trigger pH up dosing",
  "IF disease_risk > 70% -> isolate affected layer",
  "IF growth_rate < 2% -> optimize lighting intensity",
  "IF bacterial_risk > 0.8 -> initiate water filtration"
]

export function RuleBasedLogic() {
  return (
    <div className="backdrop-blur-md bg-black/50 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6 text-[#E2E8F0]">Rule-Based Logic</h2>

      <div className="space-y-3 font-mono text-sm">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="text-[#06B6D4] mt-0.5">$</span>
            <span className="text-[#E2E8F0]/90 leading-relaxed">{rule}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-[#E2E8F0]/60">
          Rules evaluated every 30 seconds • Last update: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}