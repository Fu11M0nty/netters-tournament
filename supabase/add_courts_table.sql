-- =============================================================================
-- Per-court configuration table
--
-- Replaces the tournament-level `courts text[]` array with a real `courts`
-- table that can carry display order and per-court start / end times. The
-- legacy `tournaments.courts` column is kept untouched so any older code paths
-- continue to read from it; new code (scheduler, courts manager) read this
-- table.
--
-- A backfill copies every existing tournament.courts entry into the table at
-- the default 08:00–17:00 window. Re-running the script does not duplicate
-- rows (unique constraint on (tournament_id, name)).
--
-- Safe to re-run.
-- =============================================================================

create table if not exists courts (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  name          text not null,
  display_order int  not null default 0,
  start_time    text not null default '08:00',
  end_time      text not null default '17:00',
  created_at    timestamptz not null default now(),
  unique (tournament_id, name),
  check (start_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  check (end_time   ~ '^[0-2][0-9]:[0-5][0-9]$'),
  check (end_time > start_time)
);

create index if not exists courts_tournament_id_idx on courts(tournament_id);

-- ---------------------------------------------------------------------------
-- Backfill from legacy tournament.courts text[] array
-- ---------------------------------------------------------------------------

do $$
declare
  t record;
  court_name text;
  ord int;
begin
  for t in select id, courts from tournaments
           where coalesce(array_length(courts, 1), 0) > 0 loop
    ord := 1;
    foreach court_name in array t.courts loop
      if length(trim(court_name)) > 0 then
        insert into courts (tournament_id, name, display_order, start_time, end_time)
        values (t.id, court_name, ord, '08:00', '17:00')
        on conflict (tournament_id, name) do nothing;
      end if;
      ord := ord + 1;
    end loop;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table courts enable row level security;

drop policy if exists "courts_public_select" on courts;
drop policy if exists "courts_auth_insert"   on courts;
drop policy if exists "courts_auth_update"   on courts;
drop policy if exists "courts_auth_delete"   on courts;

create policy "courts_public_select" on courts for select to public        using (true);
create policy "courts_auth_insert"   on courts for insert to authenticated with check (true);
create policy "courts_auth_update"   on courts for update to authenticated using (true) with check (true);
create policy "courts_auth_delete"   on courts for delete to authenticated using (true);
