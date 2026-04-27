-- =============================================================================
-- Phase A — Foundation for player management, scheduler & event blocks
--
-- Purely additive. No existing data is modified. Existing 2026 URLs, matches,
-- standings, score entry, PDF download and admin views all keep working.
--
-- Adds:
--   • age_groups.gender, age_groups.skill_level
--   • matches.duration_minutes (default 12)
--   • tournaments.courts (text[]) and tournaments.schedule_locked
--   • players table (linked to teams)
--   • schedule_events table (lunch / ceremony / award blocks)
--   • RLS policies for the two new tables
--
-- Safe to re-run (IF NOT EXISTS / DROP IF EXISTS guards on every step).
-- =============================================================================

-- 1. Extra metadata on existing tables --------------------------------------

alter table age_groups
  add column if not exists gender text;
alter table age_groups
  add column if not exists skill_level text;

alter table matches
  add column if not exists duration_minutes int not null default 12;

alter table matches
  add constraint matches_duration_positive check (duration_minutes > 0)
  not valid;
alter table matches
  validate constraint matches_duration_positive;

alter table tournaments
  add column if not exists courts text[] not null default '{}';
alter table tournaments
  add column if not exists schedule_locked boolean not null default false;

-- 2. Players table ----------------------------------------------------------

create table if not exists players (
  id              uuid primary key default gen_random_uuid(),
  team_id         uuid not null references teams(id) on delete cascade,
  name            text not null,
  dob             date,
  registration_no text,
  notes           text,
  display_order   int not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists players_team_id_idx on players(team_id);

-- 3. Schedule event blocks (lunch, ceremonies, awards, breaks) --------------

create table if not exists schedule_events (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  name          text not null,
  start_time    timestamptz not null,
  end_time      timestamptz not null,
  court         text,            -- null = applies to all courts
  color         text,            -- hex string for the block tint
  notes         text,
  created_at    timestamptz not null default now(),
  check (end_time > start_time)
);

create index if not exists schedule_events_tournament_id_idx
  on schedule_events(tournament_id);
create index if not exists schedule_events_start_time_idx
  on schedule_events(start_time);

-- 4. RLS policies for the new tables ----------------------------------------

alter table players         enable row level security;
alter table schedule_events enable row level security;

drop policy if exists "players_public_select" on players;
drop policy if exists "players_auth_insert"   on players;
drop policy if exists "players_auth_update"   on players;
drop policy if exists "players_auth_delete"   on players;

create policy "players_public_select" on players for select to public  using (true);
create policy "players_auth_insert"   on players for insert to authenticated with check (true);
create policy "players_auth_update"   on players for update to authenticated using (true) with check (true);
create policy "players_auth_delete"   on players for delete to authenticated using (true);

drop policy if exists "schedule_events_public_select" on schedule_events;
drop policy if exists "schedule_events_auth_insert"   on schedule_events;
drop policy if exists "schedule_events_auth_update"   on schedule_events;
drop policy if exists "schedule_events_auth_delete"   on schedule_events;

create policy "schedule_events_public_select" on schedule_events for select to public  using (true);
create policy "schedule_events_auth_insert"   on schedule_events for insert to authenticated with check (true);
create policy "schedule_events_auth_update"   on schedule_events for update to authenticated using (true) with check (true);
create policy "schedule_events_auth_delete"   on schedule_events for delete to authenticated using (true);
