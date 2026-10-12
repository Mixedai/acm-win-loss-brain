export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

// Reads the public Supabase config and throws with an actionable message if missing.
export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Add it to web/.env.local (see .env.example) and to the Vercel project environment variables.",
    );
  }
  if (!anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it to web/.env.local (see .env.example) and to the Vercel project environment variables.",
    );
  }

  return { url, anonKey };
}
