import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jndwpnfiwztbirgfbmup.supabase.co';

const supabaseKey = 'sb_publishable_nuMBgXeSDzhiIydGiI4elw_IEnIVvXU';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);