import { createClient } from "@supabase/supabase-js";
import { Database } from "../src/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const getRequiredEnv = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const resolvedSupabaseUrl = getRequiredEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL");
const resolvedSupabaseAnonKey = getRequiredEnv(supabaseAnonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const supabase = createClient(
  resolvedSupabaseUrl,
  resolvedSupabaseAnonKey
);

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    browserClient = createClient<Database>(resolvedSupabaseUrl, resolvedSupabaseAnonKey);
  }
  return browserClient;
};

export const getSupabaseServerClient = () =>
  createClient<Database>(resolvedSupabaseUrl, resolvedSupabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });