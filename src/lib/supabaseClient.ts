import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️  Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.",
  );
}

export const supabase = createClient(
  SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY ?? "",
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
);

// Small helper to summarize client configuration at runtime
export function getSupabaseConfigSummary() {
  return {
    url: SUPABASE_URL ?? null,
    anonKeySet: Boolean(SUPABASE_ANON_KEY),
    origin: typeof window !== 'undefined' ? window.location.origin : null,
  };
}

