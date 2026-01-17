import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://mfpeugxaztqnfljbtuwc.supabase.co';
const supabaseAnonKey = 'sb_publishable_ouhRk5GGKdEOO4mFpGBDXQ_In4x_8XM';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

