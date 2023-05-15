import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

export const supabase = createClient<Database>(
  process.env['NX_REACT_APP_SUPABASE_URL'] as string,
  process.env['NX_REACT_APP_SUPABASE_ANON_KEY'] as string
);
