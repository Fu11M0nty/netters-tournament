-- Netball tournament results — seed data
-- Run after schema.sql against a fresh (or truncated) database.
--
-- Seeds:
--   * All 10 age groups (6 Saturday, 4 Sunday)
--   * Teams and a full round-robin fixture list for:
--       Saturday / Under 11  (8 teams, 28 matches)
--       Saturday / Under 13  (6 teams, 15 matches)
--       Sunday   / Under 12  (7 teams, 21 matches)
--       Sunday   / Under 14  (9 teams, 36 matches)
--   * Just over half of fixtures completed with varied scores
--   * Remaining fixtures scheduled with null scores
--
-- Kickoff cadence: 10-minute matches + 5-minute turnaround = 15 min slots,
-- starting at 09:00 on 2025-06-07 (Sat) and 2025-06-08 (Sun).
-- Each seeded age group uses its own court so its fixture stream is sequential.

do $$
declare
  -- Saturday age groups
  ag_sat_u10 uuid;
  ag_sat_u11 uuid;
  ag_sat_u12 uuid;
  ag_sat_u13 uuid;
  ag_sat_u14 uuid;
  ag_sat_u15 uuid;

  -- Sunday age groups
  ag_sun_u12 uuid;
  ag_sun_u13 uuid;
  ag_sun_u14 uuid;
  ag_sun_u15 uuid;

  -- Saturday Under 11 teams
  s11_t1 uuid; s11_t2 uuid; s11_t3 uuid; s11_t4 uuid;
  s11_t5 uuid; s11_t6 uuid; s11_t7 uuid; s11_t8 uuid;

  -- Saturday Under 13 teams
  s13_t1 uuid; s13_t2 uuid; s13_t3 uuid;
  s13_t4 uuid; s13_t5 uuid; s13_t6 uuid;

  -- Sunday Under 12 teams
  u12_t1 uuid; u12_t2 uuid; u12_t3 uuid; u12_t4 uuid;
  u12_t5 uuid; u12_t6 uuid; u12_t7 uuid;

  -- Sunday Under 14 teams
  u14_t1 uuid; u14_t2 uuid; u14_t3 uuid; u14_t4 uuid; u14_t5 uuid;
  u14_t6 uuid; u14_t7 uuid; u14_t8 uuid; u14_t9 uuid;
begin
  -- =========================================================================
  -- Age groups
  -- =========================================================================
  insert into age_groups (name, slug, day, display_order) values ('Under 10', 'under-10', 'saturday', 1) returning id into ag_sat_u10;
  insert into age_groups (name, slug, day, display_order) values ('Under 11', 'under-11', 'saturday', 2) returning id into ag_sat_u11;
  insert into age_groups (name, slug, day, display_order) values ('Under 12', 'under-12', 'saturday', 3) returning id into ag_sat_u12;
  insert into age_groups (name, slug, day, display_order) values ('Under 13', 'under-13', 'saturday', 4) returning id into ag_sat_u13;
  insert into age_groups (name, slug, day, display_order) values ('Under 14', 'under-14', 'saturday', 5) returning id into ag_sat_u14;
  insert into age_groups (name, slug, day, display_order) values ('Under 15', 'under-15', 'saturday', 6) returning id into ag_sat_u15;

  insert into age_groups (name, slug, day, display_order) values ('Under 12', 'under-12', 'sunday',   1) returning id into ag_sun_u12;
  insert into age_groups (name, slug, day, display_order) values ('Under 13', 'under-13', 'sunday',   2) returning id into ag_sun_u13;
  insert into age_groups (name, slug, day, display_order) values ('Under 14', 'under-14', 'sunday',   3) returning id into ag_sun_u14;
  insert into age_groups (name, slug, day, display_order) values ('Under 15', 'under-15', 'sunday',   4) returning id into ag_sun_u15;

  -- =========================================================================
  -- Saturday / Under 11 — 8 teams, 28 matches
  -- 15 completed, 13 scheduled
  -- =========================================================================
  insert into teams (name, short_name, color, age_group_id) values ('Westside Wolves',   'WOL', '#1d4ed8', ag_sat_u11) returning id into s11_t1;
  insert into teams (name, short_name, color, age_group_id) values ('Northgate Stars',   'NOR', '#f59e0b', ag_sat_u11) returning id into s11_t2;
  insert into teams (name, short_name, color, age_group_id) values ('City Falcons',      'CIT', '#dc2626', ag_sat_u11) returning id into s11_t3;
  insert into teams (name, short_name, color, age_group_id) values ('Riverside Raiders', 'RIV', '#059669', ag_sat_u11) returning id into s11_t4;
  insert into teams (name, short_name, color, age_group_id) values ('Eastend Eagles',    'EAS', '#7c3aed', ag_sat_u11) returning id into s11_t5;
  insert into teams (name, short_name, color, age_group_id) values ('Southview Swifts',  'SOU', '#0891b2', ag_sat_u11) returning id into s11_t6;
  insert into teams (name, short_name, color, age_group_id) values ('Parkside Panthers', 'PAR', '#be185d', ag_sat_u11) returning id into s11_t7;
  insert into teams (name, short_name, color, age_group_id) values ('Highfield Hawks',   'HIG', '#ea580c', ag_sat_u11) returning id into s11_t8;

  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values
    -- completed
    (ag_sat_u11, s11_t1, s11_t2, 12,    8,    'Court 1', '2025-06-07 09:00:00+00', 'completed'),
    (ag_sat_u11, s11_t1, s11_t3, 11,    9,    'Court 1', '2025-06-07 09:15:00+00', 'completed'),
    (ag_sat_u11, s11_t1, s11_t4, 14,    7,    'Court 1', '2025-06-07 09:30:00+00', 'completed'),
    (ag_sat_u11, s11_t1, s11_t5,  6,   10,    'Court 1', '2025-06-07 09:45:00+00', 'completed'),
    (ag_sat_u11, s11_t1, s11_t6, 11,   11,    'Court 1', '2025-06-07 10:00:00+00', 'completed'),
    (ag_sat_u11, s11_t1, s11_t7, 13,    9,    'Court 1', '2025-06-07 10:15:00+00', 'completed'),
    (ag_sat_u11, s11_t1, s11_t8,  8,    8,    'Court 1', '2025-06-07 10:30:00+00', 'completed'),
    (ag_sat_u11, s11_t2, s11_t3,  7,   12,    'Court 1', '2025-06-07 10:45:00+00', 'completed'),
    (ag_sat_u11, s11_t2, s11_t4, 10,    6,    'Court 1', '2025-06-07 11:00:00+00', 'completed'),
    (ag_sat_u11, s11_t2, s11_t5, 13,    9,    'Court 1', '2025-06-07 11:15:00+00', 'completed'),
    (ag_sat_u11, s11_t2, s11_t6, 14,    8,    'Court 1', '2025-06-07 11:30:00+00', 'completed'),
    (ag_sat_u11, s11_t2, s11_t7,  5,    9,    'Court 1', '2025-06-07 11:45:00+00', 'completed'),
    (ag_sat_u11, s11_t2, s11_t8, 11,    7,    'Court 1', '2025-06-07 12:00:00+00', 'completed'),
    (ag_sat_u11, s11_t3, s11_t4,  6,   11,    'Court 1', '2025-06-07 12:15:00+00', 'completed'),
    (ag_sat_u11, s11_t3, s11_t5, 10,    8,    'Court 1', '2025-06-07 12:30:00+00', 'completed'),
    -- scheduled
    (ag_sat_u11, s11_t3, s11_t6, null, null,  'Court 1', '2025-06-07 12:45:00+00', 'scheduled'),
    (ag_sat_u11, s11_t3, s11_t7, null, null,  'Court 1', '2025-06-07 13:00:00+00', 'scheduled'),
    (ag_sat_u11, s11_t3, s11_t8, null, null,  'Court 1', '2025-06-07 13:15:00+00', 'scheduled'),
    (ag_sat_u11, s11_t4, s11_t5, null, null,  'Court 1', '2025-06-07 13:30:00+00', 'scheduled'),
    (ag_sat_u11, s11_t4, s11_t6, null, null,  'Court 1', '2025-06-07 13:45:00+00', 'scheduled'),
    (ag_sat_u11, s11_t4, s11_t7, null, null,  'Court 1', '2025-06-07 14:00:00+00', 'scheduled'),
    (ag_sat_u11, s11_t4, s11_t8, null, null,  'Court 1', '2025-06-07 14:15:00+00', 'scheduled'),
    (ag_sat_u11, s11_t5, s11_t6, null, null,  'Court 1', '2025-06-07 14:30:00+00', 'scheduled'),
    (ag_sat_u11, s11_t5, s11_t7, null, null,  'Court 1', '2025-06-07 14:45:00+00', 'scheduled'),
    (ag_sat_u11, s11_t5, s11_t8, null, null,  'Court 1', '2025-06-07 15:00:00+00', 'scheduled'),
    (ag_sat_u11, s11_t6, s11_t7, null, null,  'Court 1', '2025-06-07 15:15:00+00', 'scheduled'),
    (ag_sat_u11, s11_t6, s11_t8, null, null,  'Court 1', '2025-06-07 15:30:00+00', 'scheduled'),
    (ag_sat_u11, s11_t7, s11_t8, null, null,  'Court 1', '2025-06-07 15:45:00+00', 'scheduled');

  -- =========================================================================
  -- Saturday / Under 13 — 6 teams, 15 matches
  -- 8 completed, 7 scheduled
  -- =========================================================================
  insert into teams (name, short_name, color, age_group_id) values ('Oakwood Owls',        'OAK', '#1e40af', ag_sat_u13) returning id into s13_t1;
  insert into teams (name, short_name, color, age_group_id) values ('Lakeside Lightning',  'LAK', '#eab308', ag_sat_u13) returning id into s13_t2;
  insert into teams (name, short_name, color, age_group_id) values ('Meadowbrook Meteors', 'MEA', '#b91c1c', ag_sat_u13) returning id into s13_t3;
  insert into teams (name, short_name, color, age_group_id) values ('Brookside Bears',     'BRO', '#15803d', ag_sat_u13) returning id into s13_t4;
  insert into teams (name, short_name, color, age_group_id) values ('Hillcrest Hornets',   'HIL', '#6d28d9', ag_sat_u13) returning id into s13_t5;
  insert into teams (name, short_name, color, age_group_id) values ('Redfield Rovers',     'RED', '#c2410c', ag_sat_u13) returning id into s13_t6;

  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values
    (ag_sat_u13, s13_t1, s13_t2, 10,    8,    'Court 2', '2025-06-07 09:00:00+00', 'completed'),
    (ag_sat_u13, s13_t1, s13_t3,  9,    9,    'Court 2', '2025-06-07 09:15:00+00', 'completed'),
    (ag_sat_u13, s13_t1, s13_t4, 12,    6,    'Court 2', '2025-06-07 09:30:00+00', 'completed'),
    (ag_sat_u13, s13_t1, s13_t5, null, null,  'Court 2', '2025-06-07 09:45:00+00', 'scheduled'),
    (ag_sat_u13, s13_t1, s13_t6, null, null,  'Court 2', '2025-06-07 10:00:00+00', 'scheduled'),
    (ag_sat_u13, s13_t2, s13_t3, null, null,  'Court 2', '2025-06-07 10:15:00+00', 'scheduled'),
    (ag_sat_u13, s13_t2, s13_t4, null, null,  'Court 2', '2025-06-07 10:30:00+00', 'scheduled'),
    (ag_sat_u13, s13_t2, s13_t5,  9,   11,    'Court 2', '2025-06-07 10:45:00+00', 'completed'),
    (ag_sat_u13, s13_t2, s13_t6, 13,    7,    'Court 2', '2025-06-07 11:00:00+00', 'completed'),
    (ag_sat_u13, s13_t3, s13_t4,  9,   11,    'Court 2', '2025-06-07 11:15:00+00', 'completed'),
    (ag_sat_u13, s13_t3, s13_t5, 11,    7,    'Court 2', '2025-06-07 11:30:00+00', 'completed'),
    (ag_sat_u13, s13_t3, s13_t6, null, null,  'Court 2', '2025-06-07 11:45:00+00', 'scheduled'),
    (ag_sat_u13, s13_t4, s13_t5, null, null,  'Court 2', '2025-06-07 12:00:00+00', 'scheduled'),
    (ag_sat_u13, s13_t4, s13_t6, 10,    8,    'Court 2', '2025-06-07 12:15:00+00', 'completed'),
    (ag_sat_u13, s13_t5, s13_t6, null, null,  'Court 2', '2025-06-07 12:30:00+00', 'scheduled');

  -- =========================================================================
  -- Sunday / Under 12 — 7 teams, 21 matches
  -- 11 completed, 10 scheduled
  -- =========================================================================
  insert into teams (name, short_name, color, age_group_id) values ('Willowdale Warriors', 'WIL', '#2563eb', ag_sun_u12) returning id into u12_t1;
  insert into teams (name, short_name, color, age_group_id) values ('Ashford Aces',        'ASH', '#d97706', ag_sun_u12) returning id into u12_t2;
  insert into teams (name, short_name, color, age_group_id) values ('Elmwood Eagles',      'ELM', '#b45309', ag_sun_u12) returning id into u12_t3;
  insert into teams (name, short_name, color, age_group_id) values ('Fairview Flames',     'FAI', '#dc2626', ag_sun_u12) returning id into u12_t4;
  insert into teams (name, short_name, color, age_group_id) values ('Grangehill Griffins', 'GRA', '#047857', ag_sun_u12) returning id into u12_t5;
  insert into teams (name, short_name, color, age_group_id) values ('Bridgewater Blaze',   'BRI', '#9333ea', ag_sun_u12) returning id into u12_t6;
  insert into teams (name, short_name, color, age_group_id) values ('Clifton Comets',      'CLI', '#0e7490', ag_sun_u12) returning id into u12_t7;

  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values
    (ag_sun_u12, u12_t1, u12_t2, 11,    9,    'Court 1', '2025-06-08 09:00:00+00', 'completed'),
    (ag_sun_u12, u12_t1, u12_t3,  8,   12,    'Court 1', '2025-06-08 09:15:00+00', 'completed'),
    (ag_sun_u12, u12_t1, u12_t4, 10,   10,    'Court 1', '2025-06-08 09:30:00+00', 'completed'),
    (ag_sun_u12, u12_t1, u12_t5, 14,    7,    'Court 1', '2025-06-08 09:45:00+00', 'completed'),
    (ag_sun_u12, u12_t1, u12_t6,  6,   11,    'Court 1', '2025-06-08 10:00:00+00', 'completed'),
    (ag_sun_u12, u12_t1, u12_t7,  9,    8,    'Court 1', '2025-06-08 10:15:00+00', 'completed'),
    (ag_sun_u12, u12_t2, u12_t3, 11,    6,    'Court 1', '2025-06-08 10:30:00+00', 'completed'),
    (ag_sun_u12, u12_t2, u12_t4, 11,    8,    'Court 1', '2025-06-08 10:45:00+00', 'completed'),
    (ag_sun_u12, u12_t2, u12_t5, 10,   10,    'Court 1', '2025-06-08 11:00:00+00', 'completed'),
    (ag_sun_u12, u12_t2, u12_t6, 12,    9,    'Court 1', '2025-06-08 11:15:00+00', 'completed'),
    (ag_sun_u12, u12_t2, u12_t7, 11,    9,    'Court 1', '2025-06-08 11:30:00+00', 'completed'),
    -- scheduled
    (ag_sun_u12, u12_t3, u12_t4, null, null,  'Court 1', '2025-06-08 11:45:00+00', 'scheduled'),
    (ag_sun_u12, u12_t3, u12_t5, null, null,  'Court 1', '2025-06-08 12:00:00+00', 'scheduled'),
    (ag_sun_u12, u12_t3, u12_t6, null, null,  'Court 1', '2025-06-08 12:15:00+00', 'scheduled'),
    (ag_sun_u12, u12_t3, u12_t7, null, null,  'Court 1', '2025-06-08 12:30:00+00', 'scheduled'),
    (ag_sun_u12, u12_t4, u12_t5, null, null,  'Court 1', '2025-06-08 12:45:00+00', 'scheduled'),
    (ag_sun_u12, u12_t4, u12_t6, null, null,  'Court 1', '2025-06-08 13:00:00+00', 'scheduled'),
    (ag_sun_u12, u12_t4, u12_t7, null, null,  'Court 1', '2025-06-08 13:15:00+00', 'scheduled'),
    (ag_sun_u12, u12_t5, u12_t6, null, null,  'Court 1', '2025-06-08 13:30:00+00', 'scheduled'),
    (ag_sun_u12, u12_t5, u12_t7, null, null,  'Court 1', '2025-06-08 13:45:00+00', 'scheduled'),
    (ag_sun_u12, u12_t6, u12_t7, null, null,  'Court 1', '2025-06-08 14:00:00+00', 'scheduled');

  -- =========================================================================
  -- Sunday / Under 14 — 9 teams, 36 matches
  -- 19 completed, 17 scheduled
  -- =========================================================================
  insert into teams (name, short_name, color, age_group_id) values ('Maplewood Magpies',   'MAP', '#1e3a8a', ag_sun_u14) returning id into u14_t1;
  insert into teams (name, short_name, color, age_group_id) values ('Pinehurst Pumas',     'PIN', '#b45309', ag_sun_u14) returning id into u14_t2;
  insert into teams (name, short_name, color, age_group_id) values ('Cedarvale Cyclones',  'CED', '#991b1b', ag_sun_u14) returning id into u14_t3;
  insert into teams (name, short_name, color, age_group_id) values ('Stonegate Storm',     'STO', '#065f46', ag_sun_u14) returning id into u14_t4;
  insert into teams (name, short_name, color, age_group_id) values ('Thornhill Thunder',   'THO', '#5b21b6', ag_sun_u14) returning id into u14_t5;
  insert into teams (name, short_name, color, age_group_id) values ('Ironbridge Ibis',     'IRO', '#155e75', ag_sun_u14) returning id into u14_t6;
  insert into teams (name, short_name, color, age_group_id) values ('Kingsmead Kestrels',  'KIN', '#a21caf', ag_sun_u14) returning id into u14_t7;
  insert into teams (name, short_name, color, age_group_id) values ('Larkspur Lynx',       'LAR', '#9a3412', ag_sun_u14) returning id into u14_t8;
  insert into teams (name, short_name, color, age_group_id) values ('Mossbank Mavericks',  'MOS', '#166534', ag_sun_u14) returning id into u14_t9;

  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values
    (ag_sun_u14, u14_t1, u14_t2, 11,    8,    'Court 2', '2025-06-08 09:00:00+00', 'completed'),
    (ag_sun_u14, u14_t1, u14_t3,  9,   12,    'Court 2', '2025-06-08 09:15:00+00', 'completed'),
    (ag_sun_u14, u14_t1, u14_t4, 13,   10,    'Court 2', '2025-06-08 09:30:00+00', 'completed'),
    (ag_sun_u14, u14_t1, u14_t5,  7,   14,    'Court 2', '2025-06-08 09:45:00+00', 'completed'),
    (ag_sun_u14, u14_t1, u14_t6, 10,   10,    'Court 2', '2025-06-08 10:00:00+00', 'completed'),
    (ag_sun_u14, u14_t1, u14_t7, 12,    9,    'Court 2', '2025-06-08 10:15:00+00', 'completed'),
    (ag_sun_u14, u14_t1, u14_t8,  8,   11,    'Court 2', '2025-06-08 10:30:00+00', 'completed'),
    (ag_sun_u14, u14_t1, u14_t9, 11,    7,    'Court 2', '2025-06-08 10:45:00+00', 'completed'),
    (ag_sun_u14, u14_t2, u14_t3, 10,   13,    'Court 2', '2025-06-08 11:00:00+00', 'completed'),
    (ag_sun_u14, u14_t2, u14_t4,  9,    9,    'Court 2', '2025-06-08 11:15:00+00', 'completed'),
    (ag_sun_u14, u14_t2, u14_t5, 14,    8,    'Court 2', '2025-06-08 11:30:00+00', 'completed'),
    (ag_sun_u14, u14_t2, u14_t6,  6,   10,    'Court 2', '2025-06-08 11:45:00+00', 'completed'),
    (ag_sun_u14, u14_t2, u14_t7, 12,   11,    'Court 2', '2025-06-08 12:00:00+00', 'completed'),
    (ag_sun_u14, u14_t2, u14_t8, 13,   10,    'Court 2', '2025-06-08 12:15:00+00', 'completed'),
    (ag_sun_u14, u14_t2, u14_t9, 11,    6,    'Court 2', '2025-06-08 12:30:00+00', 'completed'),
    (ag_sun_u14, u14_t3, u14_t4,  9,   14,    'Court 2', '2025-06-08 12:45:00+00', 'completed'),
    (ag_sun_u14, u14_t3, u14_t5, 13,    7,    'Court 2', '2025-06-08 13:00:00+00', 'completed'),
    (ag_sun_u14, u14_t3, u14_t6, 10,   10,    'Court 2', '2025-06-08 13:15:00+00', 'completed'),
    (ag_sun_u14, u14_t3, u14_t7, 12,   10,    'Court 2', '2025-06-08 13:30:00+00', 'completed'),
    -- scheduled
    (ag_sun_u14, u14_t3, u14_t8, null, null,  'Court 2', '2025-06-08 13:45:00+00', 'scheduled'),
    (ag_sun_u14, u14_t3, u14_t9, null, null,  'Court 2', '2025-06-08 14:00:00+00', 'scheduled'),
    (ag_sun_u14, u14_t4, u14_t5, null, null,  'Court 2', '2025-06-08 14:15:00+00', 'scheduled'),
    (ag_sun_u14, u14_t4, u14_t6, null, null,  'Court 2', '2025-06-08 14:30:00+00', 'scheduled'),
    (ag_sun_u14, u14_t4, u14_t7, null, null,  'Court 2', '2025-06-08 14:45:00+00', 'scheduled'),
    (ag_sun_u14, u14_t4, u14_t8, null, null,  'Court 2', '2025-06-08 15:00:00+00', 'scheduled'),
    (ag_sun_u14, u14_t4, u14_t9, null, null,  'Court 2', '2025-06-08 15:15:00+00', 'scheduled'),
    (ag_sun_u14, u14_t5, u14_t6, null, null,  'Court 2', '2025-06-08 15:30:00+00', 'scheduled'),
    (ag_sun_u14, u14_t5, u14_t7, null, null,  'Court 2', '2025-06-08 15:45:00+00', 'scheduled'),
    (ag_sun_u14, u14_t5, u14_t8, null, null,  'Court 2', '2025-06-08 16:00:00+00', 'scheduled'),
    (ag_sun_u14, u14_t5, u14_t9, null, null,  'Court 2', '2025-06-08 16:15:00+00', 'scheduled'),
    (ag_sun_u14, u14_t6, u14_t7, null, null,  'Court 2', '2025-06-08 16:30:00+00', 'scheduled'),
    (ag_sun_u14, u14_t6, u14_t8, null, null,  'Court 2', '2025-06-08 16:45:00+00', 'scheduled'),
    (ag_sun_u14, u14_t6, u14_t9, null, null,  'Court 2', '2025-06-08 17:00:00+00', 'scheduled'),
    (ag_sun_u14, u14_t7, u14_t8, null, null,  'Court 2', '2025-06-08 17:15:00+00', 'scheduled'),
    (ag_sun_u14, u14_t7, u14_t9, null, null,  'Court 2', '2025-06-08 17:30:00+00', 'scheduled'),
    (ag_sun_u14, u14_t8, u14_t9, null, null,  'Court 2', '2025-06-08 17:45:00+00', 'scheduled');
end $$;
