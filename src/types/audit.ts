export type UseCase = "coding" | "writing" | "research" | "mixed";

export type ToolCategory = "core" | "api" | "advanced";

export interface ToolPlan {
  id: string;
  name: string;
  monthlyPricePerSeat: number;
  annualPricePerSeat?: number;
  supportsApiUsage?: boolean;
  notes?: string;
}

export interface ToolPricing {
  id: string;
  name: string;
  category: ToolCategory;
  vendor: string;
  plans: ToolPlan[];
}

export interface ToolInput {
  toolId: string;
  planId: string;
  monthlySpend: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolRecommendation {
  toolId: string;
  toolName: string;
  currentPlan: string;
  recommendedPlan: string;
  currentMonthlySpend: number;
  expectedMonthlyCost: number;
  monthlySavings: number;
  yearlySavings: number;
  overspendPercentage: number;
  explanation: string;
  recommendationType: "plan" | "vendor" | "optimized";
}

export interface AuditResult {
  id: string;
  input: AuditInput;
  recommendations: ToolRecommendation[];
  totalMonthlySpend: number;
  optimizedMonthlySpend: number;
  totalMonthlySavings: number;
  totalYearlySavings: number;
  overspendPercentage: number;
  isOptimized: boolean;
  createdAt: string;
}

export interface LeadCapture {
  email: string;
  companyName?: string;
  role?: string;
}
