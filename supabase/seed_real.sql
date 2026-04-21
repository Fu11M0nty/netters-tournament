-- =============================================================================
-- MK Netters & MK Dons tournament — generated seed data
--
-- Regenerate by editing scripts/generate-seed.mjs (rosters + aliases) and/or
-- data/saturday_schedule.csv / data/sunday_schedule.csv, then running:
--     node scripts/generate-seed.mjs
--
-- All fixtures are generated as 'scheduled' with null scores — the organiser
-- enters scores via /admin as matches complete.
--
-- If the database already has data you want replaced, uncomment the
-- truncate line below (run AFTER schema.sql).
-- =============================================================================

-- truncate matches, teams, age_groups restart identity cascade;

do $$
declare
  ag_sat1 uuid; t_sat1_1 uuid; t_sat1_2 uuid; t_sat1_3 uuid; t_sat1_4 uuid; t_sat1_5 uuid;
  t_sat1_6 uuid; t_sat1_7 uuid; ag_sat2 uuid; t_sat2_1 uuid; t_sat2_2 uuid; t_sat2_3 uuid;
  t_sat2_4 uuid; t_sat2_5 uuid; t_sat2_6 uuid; t_sat2_7 uuid; t_sat2_8 uuid; t_sat2_9 uuid;
  t_sat2_10 uuid; ag_sat3 uuid; t_sat3_1 uuid; t_sat3_2 uuid; t_sat3_3 uuid; t_sat3_4 uuid;
  t_sat3_5 uuid; t_sat3_6 uuid; t_sat3_7 uuid; t_sat3_8 uuid; t_sat3_9 uuid; t_sat3_10 uuid;
  ag_sat4 uuid; t_sat4_1 uuid; t_sat4_2 uuid; t_sat4_3 uuid; t_sat4_4 uuid; t_sat4_5 uuid;
  t_sat4_6 uuid; t_sat4_7 uuid; t_sat4_8 uuid; t_sat4_9 uuid; t_sat4_10 uuid; ag_sat5 uuid;
  t_sat5_1 uuid; t_sat5_2 uuid; t_sat5_3 uuid; t_sat5_4 uuid; t_sat5_5 uuid; t_sat5_6 uuid;
  t_sat5_7 uuid; t_sat5_8 uuid; t_sat5_9 uuid; ag_sat6 uuid; t_sat6_1 uuid; t_sat6_2 uuid;
  t_sat6_3 uuid; t_sat6_4 uuid; t_sat6_5 uuid; t_sat6_6 uuid; ag_sun1 uuid; t_sun1_1 uuid;
  t_sun1_2 uuid; t_sun1_3 uuid; t_sun1_4 uuid; t_sun1_5 uuid; t_sun1_6 uuid; t_sun1_7 uuid;
  ag_sun2 uuid; t_sun2_1 uuid; t_sun2_2 uuid; t_sun2_3 uuid; t_sun2_4 uuid; t_sun2_5 uuid;
  t_sun2_6 uuid; t_sun2_7 uuid; t_sun2_8 uuid; t_sun2_9 uuid; t_sun2_10 uuid; ag_sun3 uuid;
  t_sun3_1 uuid; t_sun3_2 uuid; t_sun3_3 uuid; t_sun3_4 uuid; t_sun3_5 uuid; t_sun3_6 uuid;
  t_sun3_7 uuid; t_sun3_8 uuid; t_sun3_9 uuid; ag_sun4 uuid; t_sun4_1 uuid; t_sun4_2 uuid;
  t_sun4_3 uuid; t_sun4_4 uuid; t_sun4_5 uuid; t_sun4_6 uuid; t_sun4_7 uuid; t_sun4_8 uuid;
  t_sun4_9 uuid; t_sun4_10 uuid;
begin

  -- =========================================================================
  -- Saturday — 2026-04-25
  -- =========================================================================

  insert into age_groups (name, slug, day, display_order) values ('Under 10''s', 'under-10s', 'saturday', 1) returning id into ag_sat1;
  insert into age_groups (name, slug, day, display_order) values ('Under 11''s', 'under-11s', 'saturday', 2) returning id into ag_sat2;
  insert into age_groups (name, slug, day, display_order) values ('Under 12''s', 'under-12s', 'saturday', 3) returning id into ag_sat3;
  insert into age_groups (name, slug, day, display_order) values ('Under 13''s', 'under-13s', 'saturday', 4) returning id into ag_sat4;
  insert into age_groups (name, slug, day, display_order) values ('Under 14''s', 'under-14s', 'saturday', 5) returning id into ag_sat5;
  insert into age_groups (name, slug, day, display_order) values ('Under 15''s', 'under-15s', 'saturday', 6) returning id into ag_sat6;

  -- Saturday / Under 10's — 7 teams, 21 matches
  insert into teams (name, short_name, color, age_group_id) values ('MK Netters', 'MN', '#e11d2d', ag_sat1) returning id into t_sat1_1;
  insert into teams (name, short_name, color, age_group_id) values ('AP Saints', 'AS', '#f59e0b', ag_sat1) returning id into t_sat1_2;
  insert into teams (name, short_name, color, age_group_id) values ('Little Sutton Green', 'LSG', '#dc2626', ag_sat1) returning id into t_sat1_3;
  insert into teams (name, short_name, color, age_group_id) values ('Turnford', 'TUR', '#059669', ag_sat1) returning id into t_sat1_4;
  insert into teams (name, short_name, color, age_group_id) values ('Hertford Hornets', 'HH', '#7c3aed', ag_sat1) returning id into t_sat1_5;
  insert into teams (name, short_name, color, age_group_id) values ('Hatfield', 'HAT', '#0891b2', ag_sat1) returning id into t_sat1_6;
  insert into teams (name, short_name, color, age_group_id) values ('Sarum Hall School', 'SHS', '#be185d', ag_sat1) returning id into t_sat1_7;

  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values
    (ag_sat1, t_sat1_2, t_sat1_7, null, null, 'Court 5', '2026-04-25 09:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_3, t_sat1_6, null, null, 'Court 5', '2026-04-25 09:15:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_4, t_sat1_5, null, null, 'Court 5', '2026-04-25 09:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_1, t_sat1_7, null, null, 'Court 5', '2026-04-25 09:45:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_5, t_sat1_2, null, null, 'Court 5', '2026-04-25 10:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_3, t_sat1_4, null, null, 'Court 5', '2026-04-25 10:15:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_6, t_sat1_1, null, null, 'Court 5', '2026-04-25 10:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_7, t_sat1_4, null, null, 'Court 5', '2026-04-25 10:45:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_2, t_sat1_3, null, null, 'Court 5', '2026-04-25 11:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_1, t_sat1_5, null, null, 'Court 5', '2026-04-25 11:15:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_4, t_sat1_6, null, null, 'Court 5', '2026-04-25 11:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_7, t_sat1_3, null, null, 'Court 5', '2026-04-25 11:45:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_1, t_sat1_4, null, null, 'Court 5', '2026-04-25 12:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_6, t_sat1_2, null, null, 'Court 5', '2026-04-25 12:15:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_5, t_sat1_3, null, null, 'Court 5', '2026-04-25 12:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_4, t_sat1_2, null, null, 'Court 5', '2026-04-25 12:45:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_5, t_sat1_7, null, null, 'Court 5', '2026-04-25 13:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_3, t_sat1_1, null, null, 'Court 5', '2026-04-25 13:15:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_5, t_sat1_6, null, null, 'Court 5', '2026-04-25 13:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_1, t_sat1_2, null, null, 'Court 5', '2026-04-25 13:45:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat1, t_sat1_6, t_sat1_7, null, null, 'Court 5', '2026-04-25 14:00:00 Europe/London'::timestamptz, 'scheduled');

  -- Saturday / Under 11's — 10 teams, 45 matches
  insert into teams (name, short_name, color, age_group_id) values ('MK Netters', 'MN', '#e11d2d', ag_sat2) returning id into t_sat2_1;
  insert into teams (name, short_name, color, age_group_id) values ('Durham', 'DUR', '#f59e0b', ag_sat2) returning id into t_sat2_2;
  insert into teams (name, short_name, color, age_group_id) values ('Market Harborough Wildcats U11', 'MHWU', '#dc2626', ag_sat2) returning id into t_sat2_3;
  insert into teams (name, short_name, color, age_group_id) values ('Little Sutton Green', 'LSG', '#059669', ag_sat2) returning id into t_sat2_4;
  insert into teams (name, short_name, color, age_group_id) values ('Lyndon Centre Sapphires U11', 'LCSU', '#7c3aed', ag_sat2) returning id into t_sat2_5;
  insert into teams (name, short_name, color, age_group_id) values ('Turnford', 'TUR', '#0891b2', ag_sat2) returning id into t_sat2_6;
  insert into teams (name, short_name, color, age_group_id) values ('Hertford Hornets', 'HH', '#be185d', ag_sat2) returning id into t_sat2_7;
  insert into teams (name, short_name, color, age_group_id) values ('Norfolk United', 'NU', '#ea580c', ag_sat2) returning id into t_sat2_8;
  insert into teams (name, short_name, color, age_group_id) values ('Hatfield', 'HAT', '#1e40af', ag_sat2) returning id into t_sat2_9;
  insert into teams (name, short_name, color, age_group_id) values ('Sparks', 'SPA', '#eab308', ag_sat2) returning id into t_sat2_10;

  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values
    (ag_sat2, t_sat2_1, t_sat2_10, null, null, 'Court 1', '2026-04-25 09:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_2, t_sat2_9, null, null, 'Court 1', '2026-04-25 09:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_3, t_sat2_8, null, null, 'Court 1', '2026-04-25 09:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_4, t_sat2_7, null, null, 'Court 1', '2026-04-25 09:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_5, t_sat2_6, null, null, 'Court 1', '2026-04-25 09:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_9, t_sat2_1, null, null, 'Court 1', '2026-04-25 10:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_7, t_sat2_2, null, null, 'Court 1', '2026-04-25 10:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_6, t_sat2_3, null, null, 'Court 1', '2026-04-25 10:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_4, t_sat2_5, null, null, 'Court 1', '2026-04-25 10:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_10, t_sat2_8, null, null, 'Court 1', '2026-04-25 10:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_8, t_sat2_1, null, null, 'Court 1', '2026-04-25 11:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_9, t_sat2_7, null, null, 'Court 1', '2026-04-25 11:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_6, t_sat2_10, null, null, 'Court 1', '2026-04-25 11:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_5, t_sat2_2, null, null, 'Court 1', '2026-04-25 11:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_3, t_sat2_4, null, null, 'Court 1', '2026-04-25 12:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_1, t_sat2_7, null, null, 'Court 1', '2026-04-25 12:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_8, t_sat2_6, null, null, 'Court 1', '2026-04-25 12:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_9, t_sat2_5, null, null, 'Court 1', '2026-04-25 12:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_10, t_sat2_4, null, null, 'Court 1', '2026-04-25 13:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_2, t_sat2_3, null, null, 'Court 1', '2026-04-25 13:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_6, t_sat2_1, null, null, 'Court 1', '2026-04-25 13:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_7, t_sat2_5, null, null, 'Court 1', '2026-04-25 13:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_8, t_sat2_4, null, null, 'Court 1', '2026-04-25 14:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_9, t_sat2_3, null, null, 'Court 1', '2026-04-25 14:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_10, t_sat2_2, null, null, 'Court 1', '2026-04-25 14:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_1, t_sat2_5, null, null, 'Court 1', '2026-04-25 14:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_6, t_sat2_4, null, null, 'Court 2', '2026-04-25 14:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_7, t_sat2_3, null, null, 'Court 3', '2026-04-25 14:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_8, t_sat2_2, null, null, 'Court 4', '2026-04-25 14:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_9, t_sat2_10, null, null, 'Court 5', '2026-04-25 14:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_4, t_sat2_1, null, null, 'Court 1', '2026-04-25 15:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_5, t_sat2_3, null, null, 'Court 2', '2026-04-25 15:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_6, t_sat2_2, null, null, 'Court 3', '2026-04-25 15:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_7, t_sat2_10, null, null, 'Court 4', '2026-04-25 15:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_8, t_sat2_9, null, null, 'Court 5', '2026-04-25 15:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_1, t_sat2_3, null, null, 'Court 1', '2026-04-25 15:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_4, t_sat2_2, null, null, 'Court 2', '2026-04-25 15:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_5, t_sat2_10, null, null, 'Court 3', '2026-04-25 15:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_6, t_sat2_9, null, null, 'Court 4', '2026-04-25 15:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_7, t_sat2_8, null, null, 'Court 5', '2026-04-25 15:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_1, t_sat2_2, null, null, 'Court 1', '2026-04-25 16:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_3, t_sat2_10, null, null, 'Court 2', '2026-04-25 16:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_4, t_sat2_9, null, null, 'Court 3', '2026-04-25 16:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_5, t_sat2_8, null, null, 'Court 4', '2026-04-25 16:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat2, t_sat2_6, t_sat2_7, null, null, 'Court 5', '2026-04-25 16:20:00 Europe/London'::timestamptz, 'scheduled');

  -- Saturday / Under 12's — 10 teams, 45 matches
  insert into teams (name, short_name, color, age_group_id) values ('MK Netters', 'MN', '#e11d2d', ag_sat3) returning id into t_sat3_1;
  insert into teams (name, short_name, color, age_group_id) values ('Durham', 'DUR', '#f59e0b', ag_sat3) returning id into t_sat3_2;
  insert into teams (name, short_name, color, age_group_id) values ('Woodley', 'WOO', '#dc2626', ag_sat3) returning id into t_sat3_3;
  insert into teams (name, short_name, color, age_group_id) values ('AP Saints', 'AS', '#059669', ag_sat3) returning id into t_sat3_4;
  insert into teams (name, short_name, color, age_group_id) values ('Little Sutton Ice', 'LSI', '#7c3aed', ag_sat3) returning id into t_sat3_5;
  insert into teams (name, short_name, color, age_group_id) values ('Lyndon Centre Corals U12', 'LCCU', '#0891b2', ag_sat3) returning id into t_sat3_6;
  insert into teams (name, short_name, color, age_group_id) values ('BB U12 Stars', 'BUS', '#be185d', ag_sat3) returning id into t_sat3_7;
  insert into teams (name, short_name, color, age_group_id) values ('Marlow Kites', 'MK', '#ea580c', ag_sat3) returning id into t_sat3_8;
  insert into teams (name, short_name, color, age_group_id) values ('Swan', 'SWA', '#1e40af', ag_sat3) returning id into t_sat3_9;
  insert into teams (name, short_name, color, age_group_id) values ('Sparks', 'SPA', '#eab308', ag_sat3) returning id into t_sat3_10;

  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values
    (ag_sat3, t_sat3_1, t_sat3_10, null, null, 'Court 2', '2026-04-25 09:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_2, t_sat3_9, null, null, 'Court 2', '2026-04-25 09:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_3, t_sat3_8, null, null, 'Court 2', '2026-04-25 09:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_4, t_sat3_7, null, null, 'Court 2', '2026-04-25 09:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_5, t_sat3_6, null, null, 'Court 2', '2026-04-25 09:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_1, t_sat3_9, null, null, 'Court 2', '2026-04-25 10:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_7, t_sat3_2, null, null, 'Court 2', '2026-04-25 10:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_6, t_sat3_3, null, null, 'Court 2', '2026-04-25 10:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_4, t_sat3_5, null, null, 'Court 2', '2026-04-25 10:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_10, t_sat3_8, null, null, 'Court 2', '2026-04-25 10:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_8, t_sat3_1, null, null, 'Court 2', '2026-04-25 11:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_9, t_sat3_7, null, null, 'Court 2', '2026-04-25 11:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_10, t_sat3_6, null, null, 'Court 2', '2026-04-25 11:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_2, t_sat3_5, null, null, 'Court 2', '2026-04-25 11:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_3, t_sat3_4, null, null, 'Court 2', '2026-04-25 12:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_1, t_sat3_7, null, null, 'Court 2', '2026-04-25 12:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_8, t_sat3_6, null, null, 'Court 2', '2026-04-25 12:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_5, t_sat3_9, null, null, 'Court 2', '2026-04-25 12:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_4, t_sat3_10, null, null, 'Court 2', '2026-04-25 13:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_2, t_sat3_3, null, null, 'Court 2', '2026-04-25 13:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_1, t_sat3_6, null, null, 'Court 2', '2026-04-25 13:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_7, t_sat3_5, null, null, 'Court 2', '2026-04-25 13:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_8, t_sat3_4, null, null, 'Court 2', '2026-04-25 14:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_9, t_sat3_3, null, null, 'Court 2', '2026-04-25 14:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_10, t_sat3_2, null, null, 'Court 2', '2026-04-25 14:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_1, t_sat3_5, null, null, 'Court 1', '2026-04-25 15:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_6, t_sat3_4, null, null, 'Court 2', '2026-04-25 15:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_7, t_sat3_3, null, null, 'Court 3', '2026-04-25 15:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_8, t_sat3_2, null, null, 'Court 4', '2026-04-25 15:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_9, t_sat3_10, null, null, 'Court 5', '2026-04-25 15:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_1, t_sat3_4, null, null, 'Court 1', '2026-04-25 15:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_5, t_sat3_3, null, null, 'Court 2', '2026-04-25 15:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_6, t_sat3_2, null, null, 'Court 3', '2026-04-25 15:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_7, t_sat3_10, null, null, 'Court 4', '2026-04-25 15:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_8, t_sat3_9, null, null, 'Court 5', '2026-04-25 15:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_1, t_sat3_3, null, null, 'Court 1', '2026-04-25 16:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_4, t_sat3_2, null, null, 'Court 2', '2026-04-25 16:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_5, t_sat3_10, null, null, 'Court 3', '2026-04-25 16:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_6, t_sat3_9, null, null, 'Court 4', '2026-04-25 16:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_7, t_sat3_8, null, null, 'Court 5', '2026-04-25 16:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_1, t_sat3_2, null, null, 'Court 1', '2026-04-25 16:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_3, t_sat3_10, null, null, 'Court 2', '2026-04-25 16:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_4, t_sat3_9, null, null, 'Court 3', '2026-04-25 16:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_5, t_sat3_8, null, null, 'Court 4', '2026-04-25 16:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat3, t_sat3_6, t_sat3_7, null, null, 'Court 5', '2026-04-25 16:30:00 Europe/London'::timestamptz, 'scheduled');

  -- Saturday / Under 13's — 10 teams, 45 matches
  insert into teams (name, short_name, color, age_group_id) values ('MK Netters', 'MN', '#e11d2d', ag_sat4) returning id into t_sat4_1;
  insert into teams (name, short_name, color, age_group_id) values ('Durham', 'DUR', '#f59e0b', ag_sat4) returning id into t_sat4_2;
  insert into teams (name, short_name, color, age_group_id) values ('AP Saints', 'AS', '#dc2626', ag_sat4) returning id into t_sat4_3;
  insert into teams (name, short_name, color, age_group_id) values ('BB U13 Sparklers', 'BUS', '#059669', ag_sat4) returning id into t_sat4_4;
  insert into teams (name, short_name, color, age_group_id) values ('Rv Leapers', 'RL', '#7c3aed', ag_sat4) returning id into t_sat4_5;
  insert into teams (name, short_name, color, age_group_id) values ('Lyndon Centre Emeralds U13', 'LCEU', '#0891b2', ag_sat4) returning id into t_sat4_6;
  insert into teams (name, short_name, color, age_group_id) values ('Sparks', 'SPA', '#be185d', ag_sat4) returning id into t_sat4_7;
  insert into teams (name, short_name, color, age_group_id) values ('Norfolk United', 'NU', '#ea580c', ag_sat4) returning id into t_sat4_8;
  insert into teams (name, short_name, color, age_group_id) values ('Olney Galaxy', 'OG', '#1e40af', ag_sat4) returning id into t_sat4_9;
  insert into teams (name, short_name, color, age_group_id) values ('Marlow Kites', 'MK', '#eab308', ag_sat4) returning id into t_sat4_10;

  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values
    (ag_sat4, t_sat4_1, t_sat4_10, null, null, 'Court 3', '2026-04-25 09:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_2, t_sat4_9, null, null, 'Court 3', '2026-04-25 09:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_3, t_sat4_8, null, null, 'Court 3', '2026-04-25 09:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_4, t_sat4_7, null, null, 'Court 3', '2026-04-25 09:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_5, t_sat4_6, null, null, 'Court 3', '2026-04-25 09:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_1, t_sat4_9, null, null, 'Court 3', '2026-04-25 10:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_2, t_sat4_7, null, null, 'Court 3', '2026-04-25 10:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_3, t_sat4_6, null, null, 'Court 3', '2026-04-25 10:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_4, t_sat4_5, null, null, 'Court 3', '2026-04-25 10:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_10, t_sat4_8, null, null, 'Court 3', '2026-04-25 10:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_1, t_sat4_8, null, null, 'Court 3', '2026-04-25 11:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_9, t_sat4_7, null, null, 'Court 3', '2026-04-25 11:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_10, t_sat4_6, null, null, 'Court 3', '2026-04-25 11:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_2, t_sat4_5, null, null, 'Court 3', '2026-04-25 11:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_3, t_sat4_4, null, null, 'Court 3', '2026-04-25 12:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_1, t_sat4_7, null, null, 'Court 3', '2026-04-25 12:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_8, t_sat4_6, null, null, 'Court 3', '2026-04-25 12:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_9, t_sat4_5, null, null, 'Court 3', '2026-04-25 12:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_10, t_sat4_4, null, null, 'Court 3', '2026-04-25 13:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_2, t_sat4_3, null, null, 'Court 3', '2026-04-25 13:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_1, t_sat4_6, null, null, 'Court 3', '2026-04-25 13:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_7, t_sat4_5, null, null, 'Court 3', '2026-04-25 13:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_8, t_sat4_4, null, null, 'Court 3', '2026-04-25 14:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_9, t_sat4_3, null, null, 'Court 3', '2026-04-25 14:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_10, t_sat4_2, null, null, 'Court 3', '2026-04-25 14:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_1, t_sat4_5, null, null, 'Court 1', '2026-04-25 15:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_6, t_sat4_4, null, null, 'Court 2', '2026-04-25 15:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_7, t_sat4_3, null, null, 'Court 3', '2026-04-25 15:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_8, t_sat4_2, null, null, 'Court 4', '2026-04-25 15:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_9, t_sat4_10, null, null, 'Court 5', '2026-04-25 15:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_1, t_sat4_4, null, null, 'Court 1', '2026-04-25 15:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_5, t_sat4_3, null, null, 'Court 2', '2026-04-25 15:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_6, t_sat4_2, null, null, 'Court 3', '2026-04-25 15:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_7, t_sat4_10, null, null, 'Court 4', '2026-04-25 15:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_8, t_sat4_9, null, null, 'Court 5', '2026-04-25 15:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_1, t_sat4_3, null, null, 'Court 1', '2026-04-25 16:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_4, t_sat4_2, null, null, 'Court 2', '2026-04-25 16:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_5, t_sat4_10, null, null, 'Court 3', '2026-04-25 16:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_6, t_sat4_9, null, null, 'Court 4', '2026-04-25 16:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_7, t_sat4_8, null, null, 'Court 5', '2026-04-25 16:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_2, t_sat4_1, null, null, 'Court 1', '2026-04-25 16:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_10, t_sat4_3, null, null, 'Court 2', '2026-04-25 16:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_4, t_sat4_9, null, null, 'Court 3', '2026-04-25 16:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_5, t_sat4_8, null, null, 'Court 4', '2026-04-25 16:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat4, t_sat4_6, t_sat4_7, null, null, 'Court 5', '2026-04-25 16:40:00 Europe/London'::timestamptz, 'scheduled');

  -- Saturday / Under 14's — 9 teams, 36 matches
  insert into teams (name, short_name, color, age_group_id) values ('MK Netters', 'MN', '#e11d2d', ag_sat5) returning id into t_sat5_1;
  insert into teams (name, short_name, color, age_group_id) values ('JM''s White', 'JW', '#f59e0b', ag_sat5) returning id into t_sat5_2;
  insert into teams (name, short_name, color, age_group_id) values ('Durham', 'DUR', '#dc2626', ag_sat5) returning id into t_sat5_3;
  insert into teams (name, short_name, color, age_group_id) values ('AP Saints', 'AS', '#059669', ag_sat5) returning id into t_sat5_4;
  insert into teams (name, short_name, color, age_group_id) values ('Barr Beacon', 'BB', '#7c3aed', ag_sat5) returning id into t_sat5_5;
  insert into teams (name, short_name, color, age_group_id) values ('MH Rockets', 'MR', '#0891b2', ag_sat5) returning id into t_sat5_6;
  insert into teams (name, short_name, color, age_group_id) values ('Lyndon Centre Gems U14', 'LCGU', '#be185d', ag_sat5) returning id into t_sat5_7;
  insert into teams (name, short_name, color, age_group_id) values ('Norfolk United', 'NU', '#ea580c', ag_sat5) returning id into t_sat5_8;
  insert into teams (name, short_name, color, age_group_id) values ('Swan', 'SWA', '#1e40af', ag_sat5) returning id into t_sat5_9;

  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values
    (ag_sat5, t_sat5_3, t_sat5_9, null, null, 'Court 4', '2026-04-25 09:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_2, t_sat5_8, null, null, 'Court 4', '2026-04-25 09:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_4, t_sat5_7, null, null, 'Court 4', '2026-04-25 09:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_5, t_sat5_6, null, null, 'Court 4', '2026-04-25 09:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_1, t_sat5_9, null, null, 'Court 4', '2026-04-25 09:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_3, t_sat5_7, null, null, 'Court 4', '2026-04-25 09:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_2, t_sat5_6, null, null, 'Court 4', '2026-04-25 10:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_4, t_sat5_5, null, null, 'Court 4', '2026-04-25 10:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_1, t_sat5_8, null, null, 'Court 4', '2026-04-25 10:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_9, t_sat5_4, null, null, 'Court 4', '2026-04-25 10:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_3, t_sat5_5, null, null, 'Court 4', '2026-04-25 10:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_2, t_sat5_4, null, null, 'Court 4', '2026-04-25 10:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_8, t_sat5_6, null, null, 'Court 4', '2026-04-25 11:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_1, t_sat5_7, null, null, 'Court 4', '2026-04-25 11:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_8, t_sat5_5, null, null, 'Court 4', '2026-04-25 11:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_3, t_sat5_2, null, null, 'Court 4', '2026-04-25 11:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_9, t_sat5_8, null, null, 'Court 4', '2026-04-25 11:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_1, t_sat5_6, null, null, 'Court 4', '2026-04-25 11:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_7, t_sat5_5, null, null, 'Court 4', '2026-04-25 12:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_9, t_sat5_6, null, null, 'Court 4', '2026-04-25 12:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_3, t_sat5_8, null, null, 'Court 4', '2026-04-25 12:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_1, t_sat5_5, null, null, 'Court 4', '2026-04-25 12:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_4, t_sat5_6, null, null, 'Court 4', '2026-04-25 12:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_7, t_sat5_2, null, null, 'Court 4', '2026-04-25 12:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_9, t_sat5_7, null, null, 'Court 4', '2026-04-25 13:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_1, t_sat5_4, null, null, 'Court 4', '2026-04-25 13:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_5, t_sat5_2, null, null, 'Court 4', '2026-04-25 13:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_6, t_sat5_3, null, null, 'Court 4', '2026-04-25 13:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_1, t_sat5_2, null, null, 'Court 4', '2026-04-25 13:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_9, t_sat5_5, null, null, 'Court 4', '2026-04-25 13:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_8, t_sat5_7, null, null, 'Court 4', '2026-04-25 14:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_4, t_sat5_3, null, null, 'Court 4', '2026-04-25 14:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_6, t_sat5_7, null, null, 'Court 4', '2026-04-25 14:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_1, t_sat5_3, null, null, 'Court 4', '2026-04-25 14:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_2, t_sat5_9, null, null, 'Court 4', '2026-04-25 14:40:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat5, t_sat5_4, t_sat5_8, null, null, 'Court 5', '2026-04-25 14:40:00 Europe/London'::timestamptz, 'scheduled');

  -- Saturday / Under 15's — 6 teams, 15 matches
  insert into teams (name, short_name, color, age_group_id) values ('MK Netters', 'MN', '#e11d2d', ag_sat6) returning id into t_sat6_1;
  insert into teams (name, short_name, color, age_group_id) values ('Durham', 'DUR', '#f59e0b', ag_sat6) returning id into t_sat6_2;
  insert into teams (name, short_name, color, age_group_id) values ('Market Harborough Lunars U15', 'MHLU', '#dc2626', ag_sat6) returning id into t_sat6_3;
  insert into teams (name, short_name, color, age_group_id) values ('Lyndon Centre Crystals U15', 'LCCU', '#059669', ag_sat6) returning id into t_sat6_4;
  insert into teams (name, short_name, color, age_group_id) values ('Barr Beacon Blaze', 'BBB', '#7c3aed', ag_sat6) returning id into t_sat6_5;
  insert into teams (name, short_name, color, age_group_id) values ('Hatfield', 'HAT', '#0891b2', ag_sat6) returning id into t_sat6_6;

  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values
    (ag_sat6, t_sat6_1, t_sat6_6, null, null, 'Court 1', '2026-04-25 09:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_2, t_sat6_5, null, null, 'Court 2', '2026-04-25 09:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_3, t_sat6_4, null, null, 'Court 3', '2026-04-25 09:50:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_5, t_sat6_1, null, null, 'Court 1', '2026-04-25 11:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_6, t_sat6_4, null, null, 'Court 2', '2026-04-25 11:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_2, t_sat6_3, null, null, 'Court 3', '2026-04-25 11:00:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_4, t_sat6_1, null, null, 'Court 1', '2026-04-25 12:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_5, t_sat6_3, null, null, 'Court 2', '2026-04-25 12:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_6, t_sat6_2, null, null, 'Court 3', '2026-04-25 12:10:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_3, t_sat6_1, null, null, 'Court 1', '2026-04-25 13:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_4, t_sat6_2, null, null, 'Court 2', '2026-04-25 13:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_5, t_sat6_6, null, null, 'Court 3', '2026-04-25 13:20:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_1, t_sat6_2, null, null, 'Court 1', '2026-04-25 14:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_3, t_sat6_6, null, null, 'Court 2', '2026-04-25 14:30:00 Europe/London'::timestamptz, 'scheduled'),
    (ag_sat6, t_sat6_4, t_sat6_5, null, null, 'Court 3', '2026-04-25 14:30:00 Europe/London'::timestamptz, 'scheduled');


  -- =========================================================================
  -- Sunday — 2026-04-26
  -- =========================================================================

  insert into age_groups (name, slug, day, display_order) values ('Under 12''s', 'under-12s', 'sunday', 1) returning id into ag_sun1;
  insert into age_groups (name, slug, day, display_order) values ('Under 13''s', 'under-13s', 'sunday', 2) returning id into ag_sun2;
  insert into age_groups (name, slug, day, display_order) values ('Under 14''s', 'under-14s', 'sunday', 3) returning id into ag_sun3;
  insert into age_groups (name, slug, day, display_order) values ('Under 15''s', 'under-15s', 'sunday', 4) returning id into ag_sun4;

  -- Sunday / Under 12's — 7 teams, 0 matches
  insert into teams (name, short_name, color, age_group_id) values ('MK Dons', 'MD', '#0b1221', ag_sun1) returning id into t_sun1_1;
  insert into teams (name, short_name, color, age_group_id) values ('Magic', 'MAG', '#f59e0b', ag_sun1) returning id into t_sun1_2;
  insert into teams (name, short_name, color, age_group_id) values ('Clan', 'CLA', '#dc2626', ag_sun1) returning id into t_sun1_3;
  insert into teams (name, short_name, color, age_group_id) values ('Durham', 'DUR', '#059669', ag_sun1) returning id into t_sun1_4;
  insert into teams (name, short_name, color, age_group_id) values ('AP Saints', 'AS', '#7c3aed', ag_sun1) returning id into t_sun1_5;
  insert into teams (name, short_name, color, age_group_id) values ('Little Sutton', 'LS', '#0891b2', ag_sun1) returning id into t_sun1_6;
  insert into teams (name, short_name, color, age_group_id) values ('Turnford Yellow', 'TY', '#be185d', ag_sun1) returning id into t_sun1_7;

  -- Sunday / Under 13's — 10 teams, 0 matches
  insert into teams (name, short_name, color, age_group_id) values ('MK Dons', 'MD', '#0b1221', ag_sun2) returning id into t_sun2_1;
  insert into teams (name, short_name, color, age_group_id) values ('Magic', 'MAG', '#f59e0b', ag_sun2) returning id into t_sun2_2;
  insert into teams (name, short_name, color, age_group_id) values ('Blaze Elite', 'BE', '#dc2626', ag_sun2) returning id into t_sun2_3;
  insert into teams (name, short_name, color, age_group_id) values ('Eagles', 'EAG', '#059669', ag_sun2) returning id into t_sun2_4;
  insert into teams (name, short_name, color, age_group_id) values ('Real Beds', 'RB', '#7c3aed', ag_sun2) returning id into t_sun2_5;
  insert into teams (name, short_name, color, age_group_id) values ('Poole', 'POO', '#0891b2', ag_sun2) returning id into t_sun2_6;
  insert into teams (name, short_name, color, age_group_id) values ('Swan', 'SWA', '#be185d', ag_sun2) returning id into t_sun2_7;
  insert into teams (name, short_name, color, age_group_id) values ('AP Saints', 'AS', '#ea580c', ag_sun2) returning id into t_sun2_8;
  insert into teams (name, short_name, color, age_group_id) values ('Barr Beacon', 'BB', '#1e40af', ag_sun2) returning id into t_sun2_9;
  insert into teams (name, short_name, color, age_group_id) values ('Hatfield', 'HAT', '#eab308', ag_sun2) returning id into t_sun2_10;

  -- Sunday / Under 14's — 9 teams, 0 matches
  insert into teams (name, short_name, color, age_group_id) values ('MK Dons', 'MD', '#0b1221', ag_sun3) returning id into t_sun3_1;
  insert into teams (name, short_name, color, age_group_id) values ('Magic', 'MAG', '#f59e0b', ag_sun3) returning id into t_sun3_2;
  insert into teams (name, short_name, color, age_group_id) values ('Turnford NC Black', 'TNB', '#dc2626', ag_sun3) returning id into t_sun3_3;
  insert into teams (name, short_name, color, age_group_id) values ('Real Beds', 'RB', '#059669', ag_sun3) returning id into t_sun3_4;
  insert into teams (name, short_name, color, age_group_id) values ('Wodson Park', 'WP', '#7c3aed', ag_sun3) returning id into t_sun3_5;
  insert into teams (name, short_name, color, age_group_id) values ('Durham', 'DUR', '#0891b2', ag_sun3) returning id into t_sun3_6;
  insert into teams (name, short_name, color, age_group_id) values ('AP Saints', 'AS', '#be185d', ag_sun3) returning id into t_sun3_7;
  insert into teams (name, short_name, color, age_group_id) values ('Hatfield', 'HAT', '#ea580c', ag_sun3) returning id into t_sun3_8;
  insert into teams (name, short_name, color, age_group_id) values ('Little Sutton', 'LS', '#1e40af', ag_sun3) returning id into t_sun3_9;

  -- Sunday / Under 15's — 10 teams, 0 matches
  insert into teams (name, short_name, color, age_group_id) values ('MK Dons', 'MD', '#0b1221', ag_sun4) returning id into t_sun4_1;
  insert into teams (name, short_name, color, age_group_id) values ('Magic', 'MAG', '#f59e0b', ag_sun4) returning id into t_sun4_2;
  insert into teams (name, short_name, color, age_group_id) values ('Blaze Elite', 'BE', '#dc2626', ag_sun4) returning id into t_sun4_3;
  insert into teams (name, short_name, color, age_group_id) values ('Clan', 'CLA', '#059669', ag_sun4) returning id into t_sun4_4;
  insert into teams (name, short_name, color, age_group_id) values ('Real Beds', 'RB', '#7c3aed', ag_sun4) returning id into t_sun4_5;
  insert into teams (name, short_name, color, age_group_id) values ('Wodson Park', 'WP', '#0891b2', ag_sun4) returning id into t_sun4_6;
  insert into teams (name, short_name, color, age_group_id) values ('Durham', 'DUR', '#be185d', ag_sun4) returning id into t_sun4_7;
  insert into teams (name, short_name, color, age_group_id) values ('Marlow Kites Wildcats', 'MKW', '#ea580c', ag_sun4) returning id into t_sun4_8;
  insert into teams (name, short_name, color, age_group_id) values ('AP Saints', 'AS', '#1e40af', ag_sun4) returning id into t_sun4_9;
  insert into teams (name, short_name, color, age_group_id) values ('Swan', 'SWA', '#eab308', ag_sun4) returning id into t_sun4_10;

end $$;
