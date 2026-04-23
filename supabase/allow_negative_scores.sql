-- =============================================================================
-- Allow negative match scores
--
-- The late-arrival rule lets a team concede 2 goals per full minute late, so
-- a team's final recorded score can drop below zero (e.g. raw 4 goals with 3
-- minutes late → 4 - 6 = -2). The default schema blocks this with two CHECK
-- constraints — drop them so negative scores persist.
-- Safe to re-run (IF EXISTS).
-- =============================================================================

alter table matches drop constraint if exists matches_home_score_check;
alter table matches drop constraint if exists matches_away_score_check;
