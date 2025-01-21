import { createClient } from '@supabase/supabase-js';
import config from "./supabaseConfig";

const { SUPABASE_URL, SUPABASE_ANON_KEY } = config;

console.log("Supabase URL:", SUPABASE_URL);
console.log("Supabase Key:", SUPABASE_ANON_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);