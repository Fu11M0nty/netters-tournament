-- =============================================================================
-- Add team no-show (full forfeit) tracking to matches
--
-- A "no show" is different from being late to court: the team never arrives.
-- Match is recorded 10-0 to the opposition (same score shape as a 4+ min late
-- forfeit), but the forfeit reason is distinct so the public results card can
-- label it correctly.
-- Safe to re-run (IF NOT EXISTS).
-- =============================================================================

alter table matches
  add column if not exists home_no_show boolean not null default false;

alter table matches
  add column if not exists away_no_show boolean not null default false;
