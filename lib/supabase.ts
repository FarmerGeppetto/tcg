import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Table structure:
// players
//   - wallet_address (primary key)
//   - username
//   - wins
//   - losses
//   - points
//   - created_at 