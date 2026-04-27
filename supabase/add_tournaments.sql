-- =============================================================================
-- Multi-tournament foundation
--
-- Introduces a `tournaments` table and threads `tournament_id` through
-- `age_groups`. Existing 2026 data is preserved by backfilling one tournament
-- row that owns all current age groups (and through them, all teams and
-- matches via cascading FKs).
--
-- Future tournaments can run concurrently — the unique constraints on
-- age_groups become tournament-scoped so two tournaments can both have an
-- "under-13s" group without colliding.
--
-- Safe to re-run: idempotent guards on every step.
-- =============================================================================

-- 1. Tournaments table -----------------------------------------------------

create table if not exists tournaments (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  start_date    date,
  end_date      date,
  status        text not null default 'live',
  display_order int not null default 0,
  created_at    timestamptz not null default now(),
  check (status in ('upcoming', 'live', 'complete'))
);

-- 2. Backfill row representing the existing 2026 weekend -------------------
-- Single tournament for safety; split into Club Day / Performance Day later
-- if you want via a follow-up migration.

insert into tournaments (slug, name, start_date, end_date, status, display_order)
select '2026', '2026 Tournament', date '2026-04-25', date '2026-04-26',
       'complete', 1
where not exists (select 1 from tournaments where slug = '2026');

-- 3. Add tournament_id to age_groups (nullable first, then NOT NULL) -------

alter table age_groups
  add column if not exists tournament_id uuid references tournaments(id)
  on delete cascade;

update age_groups
  set tournament_id = (select id from tournaments where slug = '2026')
  where tournament_id is null;

alter table age_groups
  alter column tournament_id set not null;

-- 4. Swap unique constraints to tournament-scoped --------------------------
-- Old constraints used the implicit names age_groups_slug_day_key /
-- age_groups_name_day_key. Drop if present, then add the new ones.

alter table age_groups drop constraint if exists age_groups_slug_day_key;
alter table age_groups drop constraint if exists age_groups_name_day_key;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'age_groups_tournament_slug_day_key'
  ) then
    alter table age_groups
      add constraint age_groups_tournament_slug_day_key
      unique (tournament_id, slug, day);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'age_groups_tournament_name_day_key'
  ) then
    alter table age_groups
      add constraint age_groups_tournament_name_day_key
      unique (tournament_id, name, day);
  end if;
end $$;

-- 5. Helpful index ---------------------------------------------------------

create index if not exists age_groups_tournament_id_idx
  on age_groups (tournament_id);

-- 6. RLS policies for the new table ----------------------------------------

alter table tournaments enable row level security;

drop policy if exists "tournaments_public_select" on tournaments;
drop policy if exists "tournaments_auth_insert"   on tournaments;
drop policy if exists "tournaments_auth_update"   on tournaments;
drop policy if exists "tournaments_auth_delete"   on tournaments;

create policy "tournaments_public_select" on tournaments for select to public using (true);
create policy "tournaments_auth_insert"   on tournaments for insert to authenticated with check (true);
create policy "tournaments_auth_update"   on tournaments for update to authenticated using (true) with check (true);
create policy "tournaments_auth_delete"   on tournaments for delete to authenticated using (true);
