-- ─────────────────────────────────────────────────────────────────────────────
-- WeLiftTogether — Partner Session Migration
-- Adds a `session_id` column to every table so all data is scoped to
-- a shared code. Run AFTER the base schema.sql.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── ADD session_id TO ALL TABLES ─────────────────────────────────────────────

alter table public.routines
  add column if not exists session_id text not null default 'default';

alter table public.workout_sessions
  add column if not exists session_id text not null default 'default';

alter table public.workout_photos
  add column if not exists session_id text not null default 'default';

-- ── INDEXES for fast per-session queries ─────────────────────────────────────

create index if not exists routines_session_id_idx
  on public.routines (session_id);

create index if not exists workout_sessions_session_id_idx
  on public.workout_sessions (session_id);

create index if not exists workout_photos_session_id_idx
  on public.workout_photos (session_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- NOTE: The app uses the Supabase anon key with public RLS policies
-- ("for all using (true)"). session_id is NOT a security boundary — it's
-- just a shared namespace, exactly like Listed's household codes.
-- Any device that knows the code can read/write that session's data.
-- This is intentional for a no-login couples app.
-- ─────────────────────────────────────────────────────────────────────────────
