-- WeLiftTogether — esquema de base de datos Supabase
-- Ejecutar completo en el SQL Editor de tu proyecto antes de correr la app
-- contra una base nueva. Idempotente (usa IF NOT EXISTS / ON CONFLICT).

create extension if not exists "uuid-ossp";

create table if not exists public.routines (
  id integer primary key, name text not null, sub text not null default '',
  emoji text not null default '', color text not null default '#FFA552',
  dark text not null default '#E8893A', duration integer not null default 45,
  difficulty integer not null default 3, exercises jsonb not null default '[]',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.workout_sessions (
  id uuid primary key default uuid_generate_v4(),
  routine_id integer references public.routines(id) on delete set null,
  routine_name text not null, routine_color text not null default '#FFA552',
  duration_min integer not null default 0, exercises jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.workout_photos (
  id uuid primary key default uuid_generate_v4(),
  storage_path text not null, public_url text, label text not null default '',
  who text not null default 'Tu', routine_emoji text not null default '',
  grad_a text, grad_b text, created_at timestamptz not null default now()
);

alter table public.routines enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_photos enable row level security;

-- NOTA DE SEGURIDAD: estas políticas permiten lectura/escritura/borrado a
-- CUALQUIER usuario con la anon key (todos los usuarios de la app comparten
-- los mismos datos). Es razonable para un MVP de una sola pareja, pero si
-- vas a soportar múltiples parejas/usuarios separados, cambia esto a
-- políticas con `auth.uid()` y una columna `user_id` por fila.
create policy "anon_all_routines" on public.routines for all to anon using (true) with check (true);
create policy "anon_all_sessions" on public.workout_sessions for all to anon using (true) with check (true);
create policy "anon_all_photos" on public.workout_photos for all to anon using (true) with check (true);

insert into storage.buckets (id, name, public) values ('gym-photos', 'gym-photos', true) on conflict (id) do nothing;
create policy "anon upload gym-photos" on storage.objects for insert to anon with check (bucket_id = 'gym-photos');
create policy "anon read gym-photos" on storage.objects for select to anon using (bucket_id = 'gym-photos');
create policy "anon delete gym-photos" on storage.objects for delete to anon using (bucket_id = 'gym-photos');
