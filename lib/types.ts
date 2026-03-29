export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface ProductForecast {
  productName: string;
  sku: string;
  currentStock: number;
  avgDailySales: number;
  daysOfStockRemaining: number;
  price?: number;               // parsed from CSV price column, used for deterministic RAR
  stockoutDate: string; // e.g. "Apr 3, 2026" or "Safe (90+ days)"
  stockoutRisk: RiskLevel;
  forecast30Days: number;
  forecast60Days: number;
  forecast90Days: number;
  reorderQuantity: number;
  reorderPoint: number;
  reorderByDate: string;         // specific date to place order, e.g. "Order by Mar 28"
  trend: "growing" | "stable" | "declining";
  trendPercent: number;
  seasonalNote: string;
  riskReason: string;            // WHY this product is at risk — the specific signal
  estimatedRevenueLoss: string | null; // e.g. "₹18,000" if stocked out, or null
  rarAmount: number | null;            // raw INR number for sorting/calculations
}

export interface ForecastAnalysis {
  healthScore: number;
  healthLabel: "critical" | "at-risk" | "fair" | "good" | "excellent";
  summary: string;
  keyInsights: string[];
  products: ProductForecast[];
  totalSkuCount: number;
  criticalCount: number;
  atRiskCount: number;
  safeCount: number;
  topRecommendations: string[];
  adSpendInsight: string;
  revenueAtRisk: string;         // formatted total, e.g. "₹45,000"
  totalRarAmount: number;        // raw INR number — sum of rarAmount for critical+high products
  forecastConfidence?: number;   // 0-100, data quality score from AI
}

export type ForecastStep =
  | "idle"
  | "parsing"
  | "analyzing"
  | "generating"
  | "done"
  | "error";

export type InputMode = "csv" | "manual" | "demo";

export interface ForecastRequest {
  salesData: string;
  adSpendData?: string;
  leadTimeDays?: number;
}

export interface ForecastResponse {
  success: boolean;
  analysis?: ForecastAnalysis;
  error?: string;
}

export interface SalesRow {
  product: string;
  sku?: string;
  date: string;
  unitsSold: number | string;
  currentStock?: number | string;
}
