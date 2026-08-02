# Local-First Architecture with Supabase Sync

We decided to use a local-first database architecture (Expo SQLite / AsyncStore on device, backed by Supabase remote PostgreSQL sync). This ensures students get zero-latency loading and full app functionality even offline without network connectivity, while background synchronization handles remote cloud persistence.
