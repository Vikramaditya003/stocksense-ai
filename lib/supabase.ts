import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase (uses anon key, respects RLS)
// Create your Supabase project in ap-south-1 (Mumbai) for ~20ms latency from India
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// Server-side singleton — avoids creating a new client on every hot-reload / request
const globalForSupabase = globalThis as unknown as {
  _supabaseAdmin: ReturnType<typeof createClient> | undefined;
};

export const supabaseAdmin =
  globalForSupabase._supabaseAdmin ??
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForSupabase._supabaseAdmin = supabaseAdmin;
}
