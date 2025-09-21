import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://emaeemncxywbgyxzywfx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtYWVlbW5jeHl3Ymd5eHp5d2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0Mzk5NjksImV4cCI6MjA3NDAxNTk2OX0._C0Ji6XpeASq11lRygT4XuidTW3VcDjNVkHI4Si7B7I"; // from Supabase dashboard → API → Project API keys

export const supabase = createClient(supabaseUrl, supabaseKey);
