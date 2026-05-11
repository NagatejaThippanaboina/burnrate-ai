export type UseCase = "coding" | "writing" | "research" | "mixed" | "api";
export type ToolCategory = "chat" | "coding" | "research" | "api" | "builder";
export type RecommendationType = "downgrade" | "consolidate" | "alternative" | "rightsize" | "optimized";
export type RecommendationConfidence = "High confidence" | "Moderate confidence";
export type RecommendationCategory = "Plan Optimization" | "Vendor Consolidation" | "Usage Fit" | "API Efficiency";

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  seatBased: boolean;
  minTeamSize?: number;
  includedMonthlyUsageUsd?: number;
  notes?: string;
}

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  category: ToolCategory;
  bestUseCase: UseCase;
  plans: Plan[];
}

export interface UserSelection {
  toolId: string;
  planId: string;
  monthlySpend: number;
}

export interface AuditRecommendation {
  key: string;
  toolId: string;
  toolName: string;
  currentPlan: string;
  recommendedPlan: string;
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  recommendationType: RecommendationType;
  category: RecommendationCategory;
  confidence: RecommendationConfidence;
  reasoning: string;
  badge: string;
}

export interface AuditResult {
  id: string;
  /** Row id from Supabase `audits` after POST /api/audits (used to persist `ai_summary`). */
  supabaseAuditId?: string;
  /** Cached AI narrative; mirrored in localStorage for stable reloads. */
  aiSummary?: string;
  selections: UserSelection[];
  teamSize: number;
  useCase: UseCase;
  recommendations: AuditRecommendation[];
  totalCurrentMonthlySpend: number;
  totalOptimizedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsRate: number;
  isOptimized: boolean;
  createdAt: string;
}

export interface AuditInput {
  tools: UserSelection[];
  teamSize: number;
  useCase: UseCase;
}

export interface LeadCapture {
  email: string;
  companyName?: string;
  role?: string;
}
