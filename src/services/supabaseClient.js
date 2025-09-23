import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are set in .env (REACT_APP_* for CRA)
const URL = process.env.REACT_APP_SUPABASE_URL;
const KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!URL || !KEY) {
  console.warn('Missing Supabase env vars REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY');
}

// This pattern prevents creating a new client on every hot reload in development
let supabaseClient = globalThis.__supabase;
if (!supabaseClient) {
  supabaseClient = createClient(URL || '', KEY || '');
  globalThis.__supabase = supabaseClient;
}

// FIX: Corrected the export syntax from ':' to 'as'
export { supabaseClient as supabase };