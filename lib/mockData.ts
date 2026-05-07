import { AlertCircle, AlertTriangle, CheckCircle2, Calendar, Leaf, TrendingDown, Sparkles, Wrench, Eye, X, Droplets, Recycle, Zap } from "lucide-react"

export const farmLayers = [
  { id: 1, name: "Layer 5", plants: "Lettuce A", health: 95, light: 85, moisture: 72 },
  { id: 2, name: "Layer 4", plants: "Basil B", health: 88, light: 90, moisture: 68 },
  { id: 3, name: "Layer 3", plants: "Spinach C", health: 72, light: 78, moisture: 80 },
  { id: 4, name: "Layer 2", plants: "Kale D", health: 91, light: 88, moisture: 75 },
  { id: 5, name: "Layer 1", plants: "Herbs E", health: 85, light: 82, moisture: 70 },
]

export const aiInsights = [
  {
    id: 1,
    type: "warning",
    icon: TrendingDown,
    title: "Growth Rate Alert",
    message: "Leaf growth is 12% slower than optimal trend",
    action: "Adjust lighting schedule",
    timestamp: "2 min ago",
  },
  {
    id: 2,
    type: "suggestion",
    icon: Leaf,
    title: "Nutrient Optimization",
    message: "Increase nitrogen levels by 8% for better yield",
    action: "Apply recommendation",
    timestamp: "15 min ago",
  },
  {
    id: 3,
    type: "alert",
    icon: AlertTriangle,
    title: "Algae Risk Detected",
    message: "Algae risk detected in Tank B – UV cycle recommended",
    action: "Start UV cycle",
    timestamp: "32 min ago",
  },
  {
    id: 4,
    type: "info",
    icon: Calendar,
    title: "Harvest Prediction",
    message: "Harvest expected in 4 days for Lettuce Batch A",
    action: "View schedule",
    timestamp: "1 hr ago",
  },
]

export const alerts = [
  {
    id: 1,
    type: "critical",
    title: "Water Level Critical",
    message: "Water level low in Hydroponic Rack 2",
    timestamp: "Just now",
    actions: ["Fix Automatically", "View Details", "Ignore"],
  },
  {
    id: 2,
    type: "warning",
    title: "pH Imbalance",
    message: "pH imbalance detected in Aquaponic loop (6.8 → 7.2)",
    timestamp: "5 min ago",
    actions: ["Adjust pH", "View Details", "Ignore"],
  },
  {
    id: 3,
    type: "warning",
    title: "Temperature Rising",
    message: "Layer 3 temperature exceeding optimal range",
    timestamp: "12 min ago",
    actions: ["Activate Cooling", "View Details", "Ignore"],
  },
  {
    id: 4,
    type: "success",
    title: "UV Cycle Complete",
    message: "UV sterilization cycle completed successfully",
    timestamp: "18 min ago",
    actions: ["View Report", "Dismiss"],
  },
  {
    id: 5,
    type: "success",
    title: "Nutrient Refill",
    message: "Automatic nutrient refill completed for all racks",
    timestamp: "45 min ago",
    actions: ["View Report", "Dismiss"],
  },
]

export const growthData = [
  { day: "Mon", growth: 12, optimal: 15 },
  { day: "Tue", growth: 18, optimal: 15 },
  { day: "Wed", growth: 15, optimal: 15 },
  { day: "Thu", growth: 22, optimal: 15 },
  { day: "Fri", growth: 19, optimal: 15 },
  { day: "Sat", growth: 25, optimal: 15 },
  { day: "Sun", growth: 28, optimal: 15 },
]

export const waterUsageData = [
  { name: "Rack 1", usage: 45, saved: 15 },
  { name: "Rack 2", usage: 52, saved: 18 },
  { name: "Rack 3", usage: 38, saved: 12 },
  { name: "Rack 4", usage: 48, saved: 16 },
  { name: "Rack 5", usage: 42, saved: 14 },
]

export const nutrientData = [
  { name: "Nitrogen", value: 85, fill: "oklch(0.8 0.25 140)" },
  { name: "Phosphorus", value: 72, fill: "oklch(0.75 0.2 195)" },
  { name: "Potassium", value: 90, fill: "oklch(0.65 0.2 250)" },
  { name: "Calcium", value: 68, fill: "oklch(0.8 0.15 85)" },
]

export const energyData = [
  { month: "Jan", energy: 120, yield: 85 },
  { month: "Feb", energy: 115, yield: 88 },
  { month: "Mar", energy: 108, yield: 92 },
  { month: "Apr", energy: 95, yield: 95 },
  { month: "May", energy: 88, yield: 98 },
  { month: "Jun", energy: 82, yield: 102 },
]

export const sustainabilityMetrics = [
  {
    icon: Droplets,
    label: "Water Recycled",
    value: 94,
    unit: "%",
    trend: "+3%",
    color: "neon-aqua",
  },
  {
    icon: Recycle,
    label: "Waste-to-Fertilizer",
    value: 87,
    unit: "%",
    trend: "+5%",
    color: "neon-green",
  },
  {
    icon: Leaf,
    label: "Carbon Reduction",
    value: 72,
    unit: "kg",
    trend: "+12%",
    color: "success",
  },
  {
    icon: Zap,
    label: "Energy Efficiency",
    value: 89,
    unit: "%",
    trend: "+8%",
    color: "warning",
  },
]

export const yieldForecastData = [
  { week: "Week 1", actual: 24, forecast: 25, confidence: 92 },
  { week: "Week 2", actual: 32, forecast: 34, confidence: 89 },
  { week: "Week 3", actual: 38, forecast: 40, confidence: 87 },
  { week: "Week 4", actual: null, forecast: 42, confidence: 82 },
  { week: "Week 5", actual: null, forecast: 43, confidence: 78 },
  { week: "Week 6", actual: null, forecast: 44, confidence: 72 },
]

export const badges = [
  { name: "Water Champion", tier: "gold", icon: Droplets },
  { name: "Zero Waste", tier: "silver", icon: Recycle },
  { name: "Carbon Neutral", tier: "bronze", icon: Leaf },
]
