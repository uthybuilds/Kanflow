import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseUrl !== "your_supabase_url_here" &&
  supabaseAnonKey &&
  supabaseAnonKey !== "your_supabase_anon_key_here";

if (!isConfigured) {
  console.warn("Supabase is not configured. Please connect your project.");
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

