-- =============================================================================
-- Reset all match results — standalone
--
-- Sets every row in `matches` back to status = 'scheduled' with null scores.
-- Leaves age_groups, teams, kickoff_time, and court fields untouched.
-- Safe to re-run (idempotent).
-- =============================================================================

update matches
  set home_score = null,
      away_score = null,
      status = 'scheduled';
