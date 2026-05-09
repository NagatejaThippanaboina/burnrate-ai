export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      audits: {
        Row: {
          id: string;
          selected_tools: Json;
          plans: Json;
          monthly_spend: number;
          annual_savings: number;
          recommendations: Json;
          team_size: number;
          use_case: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          selected_tools: Json;
          plans: Json;
          monthly_spend: number;
          annual_savings: number;
          recommendations: Json;
          team_size: number;
          use_case: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          selected_tools?: Json;
          plans?: Json;
          monthly_spend?: number;
          annual_savings?: number;
          recommendations?: Json;
          team_size?: number;
          use_case?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          email: string;
          company_name: string | null;
          role: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          company_name?: string | null;
          role?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          company_name?: string | null;
          role?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
