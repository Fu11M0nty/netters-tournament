-- =============================================================================
-- Make courts per-day (Saturday / Sunday)
--
-- Adds a `day` column to `courts` so each tournament can configure a
-- different set of courts (and time windows) for each day. Existing rows are
-- defaulted to 'saturday' and then duplicated for 'sunday' so any tournament
-- already in the table keeps the same set on both days until the organiser
-- customises them.
--
-- The unique constraint becomes (tournament_id, day, name). Re-runnable.
-- =============================================================================

-- 1. Drop the old (tournament_id, name) unique constraint if present.
alter table courts
  drop constraint if exists courts_tournament_id_name_key;

-- 2. Add the day column (default 'saturday' so existing rows pick a value).
alter table courts
  add column if not exists day text;
update courts set day = 'saturday' where day is null;
alter table courts alter column day set not null;
alter table courts alter column day set default 'saturday';

-- 3. Day enum check.
alter table courts drop constraint if exists courts_day_check;
alter table courts add constraint courts_day_check
  check (day in ('saturday', 'sunday'));

-- 4. Duplicate every existing Saturday row to Sunday so backwards-compat
--    tournaments still see courts on both days. ON CONFLICT keeps it idempotent.
insert into courts (tournament_id, name, display_order, start_time, end_time, day)
select tournament_id, name, display_order, start_time, end_time, 'sunday'
from courts c
where c.day = 'saturday'
  and not exists (
    select 1 from courts c2
    where c2.tournament_id = c.tournament_id
      and c2.name = c.name
      and c2.day = 'sunday'
  );

-- 5. New composite uniqueness (tournament, day, name).
alter table courts drop constraint if exists courts_tournament_day_name_key;
alter table courts
  add constraint courts_tournament_day_name_key
  unique (tournament_id, day, name);

-- 6. Helpful index for per-(tournament, day) lookups.
create index if not exists courts_tournament_day_idx
  on courts(tournament_id, day);
