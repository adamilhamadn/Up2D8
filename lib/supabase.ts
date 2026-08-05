import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env['EXPO_PUBLIC_SUPABASE_URL'] || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env['EXPO_PUBLIC_SUPABASE_ANON_KEY'] || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// Sync Strategy
// 
// ADR-0001: Local-first architecture
// - SQLite is the single source of truth for UI
// - Offline CRUD ops log to `sync_queue` table
// - On reconnection, sync_queue is replayed against Supabase in order
// - Conflict resolution: last-write-wins via `updated_at`
