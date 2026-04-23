-- Netball tournament results — database schema
-- Run once in the Supabase SQL editor for a fresh project.
-- WARNING: the drop statements at the top are destructive. Remove them
-- before running against any database that contains real data.

drop table if exists matches cascade;
drop table if exists teams cascade;
drop table if exists age_groups cascade;

-- ---------------------------------------------------------------------------
-- age_groups
-- ---------------------------------------------------------------------------
create table age_groups (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null,
  day           text not null,
  display_order int  not null,
  created_at    timestamptz not null default now(),
  unique (slug, day),
  unique (name, day),
  check (day in ('saturday', 'sunday'))
);

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
  created_at   timestamptz not null default now()
);

create index teams_age_group_id_idx on teams(age_group_id);

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
  created_at    timestamptz not null default now(),
  check (home_team_id <> away_team_id),
  check (status in ('scheduled', 'completed')),
  check (home_late_minutes >= 0),
  check (away_late_minutes >= 0)
);

create index matches_age_group_id_idx on matches(age_group_id);
create index matches_kickoff_time_idx on matches(kickoff_time);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table age_groups enable row level security;
alter table teams      enable row level security;
alter table matches    enable row level security;

-- Public (anon) read access
create policy "age_groups_anon_select" on age_groups for select to anon          using (true);
create policy "teams_anon_select"      on teams      for select to anon          using (true);
create policy "matches_anon_select"    on matches    for select to anon          using (true);

-- Authenticated read (so the admin console also gets rows back)
create policy "age_groups_auth_select" on age_groups for select to authenticated using (true);
create policy "teams_auth_select"      on teams      for select to authenticated using (true);
create policy "matches_auth_select"    on matches    for select to authenticated using (true);

-- Authenticated write (insert / update / delete) — used by the admin console
create policy "age_groups_auth_insert" on age_groups for insert to authenticated with check (true);
create policy "age_groups_auth_update" on age_groups for update to authenticated using (true) with check (true);
create policy "age_groups_auth_delete" on age_groups for delete to authenticated using (true);

create policy "teams_auth_insert"      on teams      for insert to authenticated with check (true);
create policy "teams_auth_update"      on teams      for update to authenticated using (true) with check (true);
create policy "teams_auth_delete"      on teams      for delete to authenticated using (true);

create policy "matches_auth_insert"    on matches    for insert to authenticated with check (true);
create policy "matches_auth_update"    on matches    for update to authenticated using (true) with check (true);
create policy "matches_auth_delete"    on matches    for delete to authenticated using (true);

