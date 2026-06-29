-- ─────────────────────────────────────────────────────────────────────────────
-- WeLiftTogether — Supabase Schema
-- Run this in the Supabase SQL Editor to create all required tables/storage.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── ROUTINES ──────────────────────────────────────────────────────────────────
create table if not exists public.routines (
  id          bigint primary key,
  name        text        not null,
  sub         text,
  emoji       text        default '',
  color       text,
  dark        text,
  duration    integer,
  difficulty  integer,
  exercises   jsonb       default '[]'::jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.routines enable row level security;

-- Allow all authenticated and anon access (single-user app)
create policy "Public access" on public.routines
  for all using (true) with check (true);

-- ── WORKOUT SESSIONS ──────────────────────────────────────────────────────────
create table if not exists public.workout_sessions (
  id            uuid        primary key default gen_random_uuid(),
  routine_id    bigint,
  routine_name  text,
  routine_color text,
  duration_min  integer,
  exercises     jsonb       default '[]'::jsonb,
  created_at    timestamptz default now()
);

alter table public.workout_sessions enable row level security;

create policy "Public access" on public.workout_sessions
  for all using (true) with check (true);

-- ── WORKOUT PHOTOS ────────────────────────────────────────────────────────────
create table if not exists public.workout_photos (
  id            uuid        primary key default gen_random_uuid(),
  storage_path  text,
  public_url    text,
  label         text,
  who           text        default 'Tú',
  routine_emoji text        default '',
  grad_a        text,
  grad_b        text,
  created_at    timestamptz default now()
);

alter table public.workout_photos enable row level security;

create policy "Public access" on public.workout_photos
  for all using (true) with check (true);

-- ── STORAGE BUCKET ────────────────────────────────────────────────────────────
-- Run in Supabase Dashboard → Storage → New Bucket
-- Name: gym-photos
-- Public: true
-- 
-- Or via SQL (requires Supabase CLI):
-- insert into storage.buckets (id, name, public)
-- values ('gym-photos', 'gym-photos', true)
-- on conflict do nothing;

-- ── UPDATED_AT TRIGGER ────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger routines_updated_at
  before update on public.routines
  for each row execute function public.handle_updated_at();
