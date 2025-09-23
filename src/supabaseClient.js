import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and anonymous key from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if the environment variables are missing and log a warning if so
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Missing Supabase environment variables. Please add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to your .env file.');
}

// Create the Supabase client a single time and export it for use in other files
export const supabase = createClient(supabaseUrl, supabaseAnonKey);