-- =============================================================================
-- Fictional demo scores — standalone update script
--
-- Runs independently of seed_real.sql. Updates existing matches in place,
-- setting home_score / away_score and flipping status to 'completed' for the
-- demo result set. Safe to re-run (idempotent).
--
-- Saturday Under 15's and Sunday Under 12's are fully completed
-- (trophy shows in standings); every other group has ~50% of matches
-- completed, earliest kickoffs first.
-- =============================================================================

do $$
declare
  ag uuid; home_id uuid; away_id uuid;
begin

  select id into ag from age_groups where slug = 'under-10s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Sarum Hall School' and age_group_id = ag;
  update matches
    set home_score = 2, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-10s' and day = 'saturday';
  select id into home_id from teams where name = 'Little Sutton Green' and age_group_id = ag;
  select id into away_id from teams where name = 'Hatfield' and age_group_id = ag;
  update matches
    set home_score = 19, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:15:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-10s' and day = 'saturday';
  select id into home_id from teams where name = 'Turnford' and age_group_id = ag;
  select id into away_id from teams where name = 'Hertford Hornets' and age_group_id = ag;
  update matches
    set home_score = 4, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-10s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Sarum Hall School' and age_group_id = ag;
  update matches
    set home_score = 6, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:45:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-10s' and day = 'saturday';
  select id into home_id from teams where name = 'Hertford Hornets' and age_group_id = ag;
  select id into away_id from teams where name = 'AP Saints' and age_group_id = ag;
  update matches
    set home_score = 0, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-10s' and day = 'saturday';
  select id into home_id from teams where name = 'Little Sutton Green' and age_group_id = ag;
  select id into away_id from teams where name = 'Turnford' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:15:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-10s' and day = 'saturday';
  select id into home_id from teams where name = 'Hatfield' and age_group_id = ag;
  select id into away_id from teams where name = 'MK Netters' and age_group_id = ag;
  update matches
    set home_score = 18, away_score = 20, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-10s' and day = 'saturday';
  select id into home_id from teams where name = 'Sarum Hall School' and age_group_id = ag;
  select id into away_id from teams where name = 'Hertford Hornets' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:45:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-10s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton Green' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-10s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Hertford Hornets' and age_group_id = ag;
  update matches
    set home_score = 6, away_score = 4, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:15:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Sparks' and age_group_id = ag;
  update matches
    set home_score = 4, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Hatfield' and age_group_id = ag;
  update matches
    set home_score = 18, away_score = 13, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Market Harborough Wildcats U11' and age_group_id = ag;
  select id into away_id from teams where name = 'Norfolk United' and age_group_id = ag;
  update matches
    set home_score = 9, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Little Sutton Green' and age_group_id = ag;
  select id into away_id from teams where name = 'Hertford Hornets' and age_group_id = ag;
  update matches
    set home_score = 0, away_score = 11, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Lyndon Centre Sapphires U11' and age_group_id = ag;
  select id into away_id from teams where name = 'Turnford' and age_group_id = ag;
  update matches
    set home_score = 3, away_score = 8, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Hatfield' and age_group_id = ag;
  select id into away_id from teams where name = 'MK Netters' and age_group_id = ag;
  update matches
    set home_score = 3, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Hertford Hornets' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 13, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Turnford' and age_group_id = ag;
  select id into away_id from teams where name = 'Market Harborough Wildcats U11' and age_group_id = ag;
  update matches
    set home_score = 17, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Little Sutton Green' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Sapphires U11' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Sparks' and age_group_id = ag;
  select id into away_id from teams where name = 'Norfolk United' and age_group_id = ag;
  update matches
    set home_score = 10, away_score = 11, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Norfolk United' and age_group_id = ag;
  select id into away_id from teams where name = 'MK Netters' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Hatfield' and age_group_id = ag;
  select id into away_id from teams where name = 'Hertford Hornets' and age_group_id = ag;
  update matches
    set home_score = 0, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Turnford' and age_group_id = ag;
  select id into away_id from teams where name = 'Sparks' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Lyndon Centre Sapphires U11' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Market Harborough Wildcats U11' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton Green' and age_group_id = ag;
  update matches
    set home_score = 16, away_score = 19, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Hertford Hornets' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 20, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Norfolk United' and age_group_id = ag;
  select id into away_id from teams where name = 'Turnford' and age_group_id = ag;
  update matches
    set home_score = 19, away_score = 4, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Hatfield' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Sapphires U11' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 17, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Sparks' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton Green' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Market Harborough Wildcats U11' and age_group_id = ag;
  update matches
    set home_score = 9, away_score = 12, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Turnford' and age_group_id = ag;
  select id into away_id from teams where name = 'MK Netters' and age_group_id = ag;
  update matches
    set home_score = 10, away_score = 20, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-11s' and day = 'saturday';
  select id into home_id from teams where name = 'Hertford Hornets' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Sapphires U11' and age_group_id = ag;
  update matches
    set home_score = 16, away_score = 4, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Sparks' and age_group_id = ag;
  update matches
    set home_score = 6, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Swan' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 15, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Woodley' and age_group_id = ag;
  select id into away_id from teams where name = 'Marlow Kites' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'BB U12 Stars' and age_group_id = ag;
  update matches
    set home_score = 3, away_score = 11, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Little Sutton Ice' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Corals U12' and age_group_id = ag;
  update matches
    set home_score = 4, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Swan' and age_group_id = ag;
  update matches
    set home_score = 0, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'BB U12 Stars' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Lyndon Centre Corals U12' and age_group_id = ag;
  select id into away_id from teams where name = 'Woodley' and age_group_id = ag;
  update matches
    set home_score = 2, away_score = 17, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton Ice' and age_group_id = ag;
  update matches
    set home_score = 19, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Sparks' and age_group_id = ag;
  select id into away_id from teams where name = 'Marlow Kites' and age_group_id = ag;
  update matches
    set home_score = 19, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Marlow Kites' and age_group_id = ag;
  select id into away_id from teams where name = 'MK Netters' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 13, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Swan' and age_group_id = ag;
  select id into away_id from teams where name = 'BB U12 Stars' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 11, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Sparks' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Corals U12' and age_group_id = ag;
  update matches
    set home_score = 14, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton Ice' and age_group_id = ag;
  update matches
    set home_score = 4, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Woodley' and age_group_id = ag;
  select id into away_id from teams where name = 'AP Saints' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 4, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'BB U12 Stars' and age_group_id = ag;
  update matches
    set home_score = 5, away_score = 4, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Marlow Kites' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Corals U12' and age_group_id = ag;
  update matches
    set home_score = 19, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Little Sutton Ice' and age_group_id = ag;
  select id into away_id from teams where name = 'Swan' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Sparks' and age_group_id = ag;
  update matches
    set home_score = 5, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Woodley' and age_group_id = ag;
  update matches
    set home_score = 10, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Corals U12' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 1, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'saturday';
  select id into home_id from teams where name = 'BB U12 Stars' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton Ice' and age_group_id = ag;
  update matches
    set home_score = 19, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Marlow Kites' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Olney Galaxy' and age_group_id = ag;
  update matches
    set home_score = 16, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Norfolk United' and age_group_id = ag;
  update matches
    set home_score = 4, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'BB U13 Sparklers' and age_group_id = ag;
  select id into away_id from teams where name = 'Sparks' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Rv Leapers' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Emeralds U13' and age_group_id = ag;
  update matches
    set home_score = 14, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Olney Galaxy' and age_group_id = ag;
  update matches
    set home_score = 10, away_score = 6, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Sparks' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 15, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Emeralds U13' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'BB U13 Sparklers' and age_group_id = ag;
  select id into away_id from teams where name = 'Rv Leapers' and age_group_id = ag;
  update matches
    set home_score = 19, away_score = 8, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Marlow Kites' and age_group_id = ag;
  select id into away_id from teams where name = 'Norfolk United' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 20, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Norfolk United' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 20, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Olney Galaxy' and age_group_id = ag;
  select id into away_id from teams where name = 'Sparks' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Marlow Kites' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Emeralds U13' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Rv Leapers' and age_group_id = ag;
  update matches
    set home_score = 2, away_score = 6, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'BB U13 Sparklers' and age_group_id = ag;
  update matches
    set home_score = 9, away_score = 4, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Sparks' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Norfolk United' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Emeralds U13' and age_group_id = ag;
  update matches
    set home_score = 4, away_score = 1, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Olney Galaxy' and age_group_id = ag;
  select id into away_id from teams where name = 'Rv Leapers' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Marlow Kites' and age_group_id = ag;
  select id into away_id from teams where name = 'BB U13 Sparklers' and age_group_id = ag;
  update matches
    set home_score = 17, away_score = 6, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'AP Saints' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Emeralds U13' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'saturday';
  select id into home_id from teams where name = 'Sparks' and age_group_id = ag;
  select id into away_id from teams where name = 'Rv Leapers' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Swan' and age_group_id = ag;
  update matches
    set home_score = 10, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'JM''s White' and age_group_id = ag;
  select id into away_id from teams where name = 'Norfolk United' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Gems U14' and age_group_id = ag;
  update matches
    set home_score = 17, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'Barr Beacon' and age_group_id = ag;
  select id into away_id from teams where name = 'MH Rockets' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Swan' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 8, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Gems U14' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 13, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'JM''s White' and age_group_id = ag;
  select id into away_id from teams where name = 'MH Rockets' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 20, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Barr Beacon' and age_group_id = ag;
  update matches
    set home_score = 14, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Norfolk United' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'Swan' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Gems U14' and age_group_id = ag;
  update matches
    set home_score = 9, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Barr Beacon' and age_group_id = ag;
  update matches
    set home_score = 10, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'JM''s White' and age_group_id = ag;
  select id into away_id from teams where name = 'AP Saints' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 8, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 10:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'Norfolk United' and age_group_id = ag;
  select id into away_id from teams where name = 'MH Rockets' and age_group_id = ag;
  update matches
    set home_score = 9, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Gems U14' and age_group_id = ag;
  update matches
    set home_score = 9, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'Swan' and age_group_id = ag;
  select id into away_id from teams where name = 'Barr Beacon' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 12, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'JM''s White' and age_group_id = ag;
  update matches
    set home_score = 16, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Norfolk United' and age_group_id = ag;
  update matches
    set home_score = 14, away_score = 6, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'MH Rockets' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 6, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Hatfield' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Barr Beacon Blaze' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Market Harborough Lunars U15' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Crystals U15' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 09:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Barr Beacon Blaze' and age_group_id = ag;
  select id into away_id from teams where name = 'MK Netters' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 17, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Hatfield' and age_group_id = ag;
  select id into away_id from teams where name = 'Lyndon Centre Crystals U15' and age_group_id = ag;
  update matches
    set home_score = 16, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Market Harborough Lunars U15' and age_group_id = ag;
  update matches
    set home_score = 9, away_score = 13, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 11:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Lyndon Centre Crystals U15' and age_group_id = ag;
  select id into away_id from teams where name = 'MK Netters' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Barr Beacon Blaze' and age_group_id = ag;
  select id into away_id from teams where name = 'Market Harborough Lunars U15' and age_group_id = ag;
  update matches
    set home_score = 16, away_score = 4, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Hatfield' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 16, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 12:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Market Harborough Lunars U15' and age_group_id = ag;
  select id into away_id from teams where name = 'MK Netters' and age_group_id = ag;
  update matches
    set home_score = 3, away_score = 8, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Lyndon Centre Crystals U15' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 20, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Barr Beacon Blaze' and age_group_id = ag;
  select id into away_id from teams where name = 'Hatfield' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 11, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 13:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'MK Netters' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 14, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 14:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Market Harborough Lunars U15' and age_group_id = ag;
  select id into away_id from teams where name = 'Hatfield' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 14:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'saturday';
  select id into home_id from teams where name = 'Lyndon Centre Crystals U15' and age_group_id = ag;
  select id into away_id from teams where name = 'Barr Beacon Blaze' and age_group_id = ag;
  update matches
    set home_score = 5, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-25 14:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Turnford Yellow' and age_group_id = ag;
  update matches
    set home_score = 9, away_score = 19, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton' and age_group_id = ag;
  update matches
    set home_score = 19, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Clan' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 12, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Turnford Yellow' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 16, away_score = 6, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Clan' and age_group_id = ag;
  update matches
    set home_score = 4, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Little Sutton' and age_group_id = ag;
  select id into away_id from teams where name = 'MK Dons' and age_group_id = ag;
  update matches
    set home_score = 19, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Turnford Yellow' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 14, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'AP Saints' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 4, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 12:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Clan' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton' and age_group_id = ag;
  update matches
    set home_score = 17, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 12:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Turnford Yellow' and age_group_id = ag;
  select id into away_id from teams where name = 'AP Saints' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 12:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Clan' and age_group_id = ag;
  update matches
    set home_score = 2, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 13:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Little Sutton' and age_group_id = ag;
  select id into away_id from teams where name = 'Magic' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 15, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 13:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'AP Saints' and age_group_id = ag;
  update matches
    set home_score = 4, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 13:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Clan' and age_group_id = ag;
  select id into away_id from teams where name = 'Magic' and age_group_id = ag;
  update matches
    set home_score = 2, away_score = 11, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 14:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Turnford Yellow' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 1, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 14:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'AP Saints' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 15, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 14:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Magic' and age_group_id = ag;
  update matches
    set home_score = 6, away_score = 11, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 15:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 15:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-12s' and day = 'sunday';
  select id into home_id from teams where name = 'Clan' and age_group_id = ag;
  select id into away_id from teams where name = 'Turnford Yellow' and age_group_id = ag;
  update matches
    set home_score = 0, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 15:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Hatfield' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 11, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Blaze Elite' and age_group_id = ag;
  select id into away_id from teams where name = 'Barr Beacon' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Eagles' and age_group_id = ag;
  select id into away_id from teams where name = 'Swan' and age_group_id = ag;
  update matches
    set home_score = 3, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Real Beds' and age_group_id = ag;
  select id into away_id from teams where name = 'Poole' and age_group_id = ag;
  update matches
    set home_score = 14, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Hatfield' and age_group_id = ag;
  update matches
    set home_score = 10, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Swan' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Blaze Elite' and age_group_id = ag;
  select id into away_id from teams where name = 'Poole' and age_group_id = ag;
  update matches
    set home_score = 6, away_score = 17, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Eagles' and age_group_id = ag;
  select id into away_id from teams where name = 'Real Beds' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Barr Beacon' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Hatfield' and age_group_id = ag;
  select id into away_id from teams where name = 'Swan' and age_group_id = ag;
  update matches
    set home_score = 14, away_score = 20, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Real Beds' and age_group_id = ag;
  update matches
    set home_score = 7, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Blaze Elite' and age_group_id = ag;
  select id into away_id from teams where name = 'Eagles' and age_group_id = ag;
  update matches
    set home_score = 4, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Barr Beacon' and age_group_id = ag;
  select id into away_id from teams where name = 'Poole' and age_group_id = ag;
  update matches
    set home_score = 17, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Swan' and age_group_id = ag;
  update matches
    set home_score = 10, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Hatfield' and age_group_id = ag;
  select id into away_id from teams where name = 'Real Beds' and age_group_id = ag;
  update matches
    set home_score = 2, away_score = 15, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Blaze Elite' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 15, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'Eagles' and age_group_id = ag;
  select id into away_id from teams where name = 'Barr Beacon' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-13s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Poole' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 19, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 12, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Hatfield' and age_group_id = ag;
  update matches
    set home_score = 7, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Turnford NC Black' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 2, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Real Beds' and age_group_id = ag;
  select id into away_id from teams where name = 'Wodson Park' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Little Sutton' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 13, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 3, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Wodson Park' and age_group_id = ag;
  update matches
    set home_score = 0, away_score = 15, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Turnford NC Black' and age_group_id = ag;
  select id into away_id from teams where name = 'Real Beds' and age_group_id = ag;
  update matches
    set home_score = 3, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Hatfield' and age_group_id = ag;
  update matches
    set home_score = 17, away_score = 8, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Little Sutton' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 12, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Real Beds' and age_group_id = ag;
  update matches
    set home_score = 20, away_score = 13, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Turnford NC Black' and age_group_id = ag;
  update matches
    set home_score = 18, away_score = 1, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Hatfield' and age_group_id = ag;
  select id into away_id from teams where name = 'Wodson Park' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Little Sutton' and age_group_id = ag;
  select id into away_id from teams where name = 'Real Beds' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'AP Saints' and age_group_id = ag;
  update matches
    set home_score = 17, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'Turnford NC Black' and age_group_id = ag;
  select id into away_id from teams where name = 'Hatfield' and age_group_id = ag;
  update matches
    set home_score = 14, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-14s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Wodson Park' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Swan' and age_group_id = ag;
  update matches
    set home_score = 17, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Marlow Kites Wildcats' and age_group_id = ag;
  update matches
    set home_score = 5, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 19, away_score = 8, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Blaze Elite' and age_group_id = ag;
  select id into away_id from teams where name = 'Wodson Park' and age_group_id = ag;
  update matches
    set home_score = 5, away_score = 12, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Clan' and age_group_id = ag;
  select id into away_id from teams where name = 'Real Beds' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 9, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Marlow Kites Wildcats' and age_group_id = ag;
  update matches
    set home_score = 3, away_score = 0, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 09:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Swan' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 3, away_score = 14, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Wodson Park' and age_group_id = ag;
  update matches
    set home_score = 8, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Real Beds' and age_group_id = ag;
  update matches
    set home_score = 16, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Blaze Elite' and age_group_id = ag;
  select id into away_id from teams where name = 'Clan' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Magic' and age_group_id = ag;
  update matches
    set home_score = 5, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Clan' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 15, away_score = 1, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 10:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Real Beds' and age_group_id = ag;
  select id into away_id from teams where name = 'Marlow Kites Wildcats' and age_group_id = ag;
  update matches
    set home_score = 0, away_score = 16, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Blaze Elite' and age_group_id = ag;
  select id into away_id from teams where name = 'Magic' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 5, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Durham' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 7, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Marlow Kites Wildcats' and age_group_id = ag;
  select id into away_id from teams where name = 'Wodson Park' and age_group_id = ag;
  update matches
    set home_score = 5, away_score = 2, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:30:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Swan' and age_group_id = ag;
  select id into away_id from teams where name = 'Real Beds' and age_group_id = ag;
  update matches
    set home_score = 1, away_score = 15, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:40:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Magic' and age_group_id = ag;
  select id into away_id from teams where name = 'Clan' and age_group_id = ag;
  update matches
    set home_score = 11, away_score = 10, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 11:50:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'AP Saints' and age_group_id = ag;
  select id into away_id from teams where name = 'Blaze Elite' and age_group_id = ag;
  update matches
    set home_score = 6, away_score = 18, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 12:00:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'MK Dons' and age_group_id = ag;
  select id into away_id from teams where name = 'Wodson Park' and age_group_id = ag;
  update matches
    set home_score = 5, away_score = 3, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 12:10:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Durham' and age_group_id = ag;
  select id into away_id from teams where name = 'Real Beds' and age_group_id = ag;
  update matches
    set home_score = 12, away_score = 17, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 12:20:00 Europe/London'::timestamptz;

  select id into ag from age_groups where slug = 'under-15s' and day = 'sunday';
  select id into home_id from teams where name = 'Marlow Kites Wildcats' and age_group_id = ag;
  select id into away_id from teams where name = 'Clan' and age_group_id = ag;
  update matches
    set home_score = 13, away_score = 15, status = 'completed'
    where age_group_id = ag
      and home_team_id = home_id
      and away_team_id = away_id
      and kickoff_time = '2026-04-26 12:30:00 Europe/London'::timestamptz;

end $$;
