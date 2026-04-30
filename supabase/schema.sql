-- Netball tournament results — database schema
-- Run once in the Supabase SQL editor for a fresh project.
-- WARNING: the drop statements at the top are destructive. Remove them
-- before running against any database that contains real data.

drop table if exists schedule_events cascade;
drop table if exists players cascade;
drop table if exists matches cascade;
drop table if exists teams cascade;
drop table if exists courts cascade;
drop table if exists age_groups cascade;
drop table if exists tournaments cascade;

-- ---------------------------------------------------------------------------
-- tournaments
-- ---------------------------------------------------------------------------
create table tournaments (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  start_date    date,
  end_date      date,
  status        text not null default 'live',
  display_order int not null default 0,
  courts        text[] not null default '{}',
  schedule_locked boolean not null default false,
  created_at    timestamptz not null default now(),
  check (status in ('upcoming', 'live', 'complete'))
);

-- ---------------------------------------------------------------------------
-- age_groups
-- ---------------------------------------------------------------------------
create table age_groups (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  name          text not null,
  slug          text not null,
  day           text not null,
  display_order int  not null,
  gender        text,
  skill_level   text,
  match_format  text not null default 'continuous',
  period_minutes int not null default 12,
  break_q1_q2_minutes int not null default 0,
  break_half_time_minutes int not null default 0,
  break_q3_q4_minutes int not null default 0,
  created_at    timestamptz not null default now(),
  unique (tournament_id, slug, day),
  unique (tournament_id, name, day),
  check (day in ('saturday', 'sunday')),
  check (match_format in ('continuous', 'halves', 'quarters')),
  check (period_minutes > 0),
  check (break_q1_q2_minutes >= 0),
  check (break_half_time_minutes >= 0),
  check (break_q3_q4_minutes >= 0)
);

create index age_groups_tournament_id_idx on age_groups(tournament_id);

-- ---------------------------------------------------------------------------
-- courts (per-tournament court configuration with start/end times)
-- ---------------------------------------------------------------------------
create table courts (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  name          text not null,
  day           text not null default 'saturday',
  display_order int  not null default 0,
  start_time    text not null default '08:00',
  end_time      text not null default '17:00',
  created_at    timestamptz not null default now(),
  unique (tournament_id, day, name),
  check (day in ('saturday', 'sunday')),
  check (start_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  check (end_time   ~ '^[0-2][0-9]:[0-5][0-9]$'),
  check (end_time > start_time)
);

create index courts_tournament_id_idx on courts(tournament_id);
create index courts_tournament_day_idx on courts(tournament_id, day);

-- ---------------------------------------------------------------------------
-- teams
-- ---------------------------------------------------------------------------
create table teams (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  short_name   text,
  color        text,
  logo_url     text,
  age_group_id uuid not null references age_groups(id) on delete cascade,
  deleted_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index teams_age_group_id_idx on teams(age_group_id);
create index teams_active_idx on teams(age_group_id) where deleted_at is null;

-- ---------------------------------------------------------------------------
-- matches
-- ---------------------------------------------------------------------------
create table matches (
  id            uuid primary key default gen_random_uuid(),
  age_group_id  uuid not null references age_groups(id) on delete cascade,
  home_team_id  uuid not null references teams(id),
  away_team_id  uuid not null references teams(id),
  home_score    int,
  away_score    int,
  court         text,
  kickoff_time  timestamptz not null,
  status        text not null default 'scheduled',
  home_umpire_no_show boolean not null default false,
  away_umpire_no_show boolean not null default false,
  home_late_minutes int not null default 0,
  away_late_minutes int not null default 0,
  home_no_show boolean not null default false,
  away_no_show boolean not null default false,
  scoresheet_url text,
  duration_minutes int not null default 12,
  is_planned    boolean not null default true,
  round_number  int,
  deleted_at    timestamptz,
  created_at    timestamptz not null default now(),
  check (home_team_id <> away_team_id),
  check (status in ('scheduled', 'completed')),
  check (home_late_minutes >= 0),
  check (away_late_minutes >= 0),
  check (duration_minutes > 0)
);

create index matches_age_group_id_idx on matches(age_group_id);
create index matches_kickoff_time_idx on matches(kickoff_time);
create index matches_active_idx on matches(age_group_id) where deleted_at is null;

-- ---------------------------------------------------------------------------
-- players
-- ---------------------------------------------------------------------------
create table players (
  id              uuid primary key default gen_random_uuid(),
  team_id         uuid not null references teams(id) on delete cascade,
  name            text not null,
  dob             date,
  registration_no text,
  notes           text,
  display_order   int not null default 0,
  created_at      timestamptz not null default now()
);

create index players_team_id_idx on players(team_id);

-- ---------------------------------------------------------------------------
-- schedule_events  (lunch / ceremony / award blocks)
-- ---------------------------------------------------------------------------
create table schedule_events (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  name          text not null,
  start_time    timestamptz not null,
  end_time      timestamptz not null,
  court         text,
  color         text,
  notes         text,
  created_at    timestamptz not null default now(),
  check (end_time > start_time)
);

create index schedule_events_tournament_id_idx on schedule_events(tournament_id);
create index schedule_events_start_time_idx    on schedule_events(start_time);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table tournaments     enable row level security;
alter table age_groups      enable row level security;
alter table courts          enable row level security;
alter table teams           enable row level security;
alter table matches         enable row level security;
alter table players         enable row level security;
alter table schedule_events enable row level security;

-- Public (anon) read access
create policy "tournaments_anon_select"     on tournaments     for select to anon          using (true);
create policy "age_groups_anon_select"      on age_groups      for select to anon          using (true);
create policy "teams_anon_select"           on teams           for select to anon          using (true);
create policy "matches_anon_select"         on matches         for select to anon          using (true);
create policy "players_anon_select"         on players         for select to anon          using (true);
create policy "schedule_events_anon_select" on schedule_events for select to anon          using (true);
create policy "courts_anon_select"          on courts          for select to anon          using (true);

-- Authenticated read (so the admin console also gets rows back)
create policy "tournaments_auth_select"     on tournaments     for select to authenticated using (true);
create policy "age_groups_auth_select"      on age_groups      for select to authenticated using (true);
create policy "teams_auth_select"           on teams           for select to authenticated using (true);
create policy "matches_auth_select"         on matches         for select to authenticated using (true);
create policy "players_auth_select"         on players         for select to authenticated using (true);
create policy "schedule_events_auth_select" on schedule_events for select to authenticated using (true);
create policy "courts_auth_select"          on courts          for select to authenticated using (true);
create policy "courts_auth_insert"          on courts          for insert to authenticated with check (true);
create policy "courts_auth_update"          on courts          for update to authenticated using (true) with check (true);
create policy "courts_auth_delete"          on courts          for delete to authenticated using (true);

-- Authenticated write (insert / update / delete) — used by the admin console
create policy "tournaments_auth_insert"     on tournaments     for insert to authenticated with check (true);
create policy "tournaments_auth_update"     on tournaments     for update to authenticated using (true) with check (true);
create policy "tournaments_auth_delete"     on tournaments     for delete to authenticated using (true);

create policy "age_groups_auth_insert"      on age_groups      for insert to authenticated with check (true);
create policy "age_groups_auth_update"      on age_groups      for update to authenticated using (true) with check (true);
create policy "age_groups_auth_delete"      on age_groups      for delete to authenticated using (true);

create policy "teams_auth_insert"           on teams           for insert to authenticated with check (true);
create policy "teams_auth_update"           on teams           for update to authenticated using (true) with check (true);
create policy "teams_auth_delete"           on teams           for delete to authenticated using (true);

create policy "matches_auth_insert"         on matches         for insert to authenticated with check (true);
create policy "matches_auth_update"         on matches         for update to authenticated using (true) with check (true);
create policy "matches_auth_delete"         on matches         for delete to authenticated using (true);

create policy "players_auth_insert"         on players         for insert to authenticated with check (true);
create policy "players_auth_update"         on players         for update to authenticated using (true) with check (true);
create policy "players_auth_delete"         on players         for delete to authenticated using (true);

create policy "schedule_events_auth_insert" on schedule_events for insert to authenticated with check (true);
create policy "schedule_events_auth_update" on schedule_events for update to authenticated using (true) with check (true);
create policy "schedule_events_auth_delete" on schedule_events for delete to authenticated using (true);
