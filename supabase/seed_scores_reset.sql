-- =============================================================================
-- Reset all match results — standalone
--
-- Sets every row in `matches` back to status = 'scheduled' with null scores
-- and clears any umpire no-show flags and late-arrival minutes that were
-- recorded during testing. Leaves age_groups, teams, kickoff_time, and court
-- fields untouched. Safe to re-run (idempotent).
-- =============================================================================

update matches
  set home_score = null,
      away_score = null,
      status = 'scheduled',
      home_umpire_no_show = false,
      away_umpire_no_show = false,
      home_late_minutes = 0,
      away_late_minutes = 0,
      home_no_show = false,
      away_no_show = false,
      scoresheet_url = null;
