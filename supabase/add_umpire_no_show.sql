-- =============================================================================
-- Add umpire no-show tracking to matches
--
-- Tournament rule: each team must provide an umpire. If a team fails to do so
-- and a pool umpire has to step in, that team is docked 1 league point.
-- Two new boolean columns on `matches` — one per side, per match.
-- Standings recalculate dynamically, so the -1 takes effect as soon as the
-- flag is ticked in the admin console.
-- Safe to re-run (IF NOT EXISTS).
-- =============================================================================

alter table matches
  add column if not exists home_umpire_no_show boolean not null default false;

alter table matches
  add column if not exists away_umpire_no_show boolean not null default false;
