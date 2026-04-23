-- =============================================================================
-- Add late-arrival tracking to matches
--
-- Tournament rule: a team concedes 2 goals per full minute late. The on-court
-- score + the minutes-late together tell the full story, so both are stored.
-- The public match card surfaces the deduction ("−N goals, M min late")
-- without having to open the admin console.
--
-- home_score / away_score still hold the FINAL adjusted score. These columns
-- just add the metadata explaining how that score was arrived at.
-- Safe to re-run (IF NOT EXISTS).
-- =============================================================================

alter table matches
  add column if not exists home_late_minutes int not null default 0;

alter table matches
  add column if not exists away_late_minutes int not null default 0;

alter table matches
  add constraint matches_home_late_minutes_nonneg check (home_late_minutes >= 0)
  not valid;

alter table matches
  validate constraint matches_home_late_minutes_nonneg;

alter table matches
  add constraint matches_away_late_minutes_nonneg check (away_late_minutes >= 0)
  not valid;

alter table matches
  validate constraint matches_away_late_minutes_nonneg;
