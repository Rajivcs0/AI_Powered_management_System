// Supabase client wrapper for the frontend (React create-react-app)
// Read keys from environment variables prefixed with REACT_APP_

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  // It's okay in development to warn if not configured; do not log keys.
  // Developer should add a .env file at the frontend root with REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.
  // Example in frontend/.env.example
  // eslint-disable-next-line no-console
  console.warn('Supabase not configured — set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in your .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
