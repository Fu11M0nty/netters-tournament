-- =============================================================================
-- Backup the matches table
--
-- Snapshots every row currently in `matches` into `matches_backup`, stamped
-- with the time the snapshot was taken. The backup table accumulates history
-- — running this script multiple times keeps every previous snapshot, so you
-- can roll back to any point in time.
--
-- The backup table has no foreign keys or unique constraints (the same match
-- id can appear many times, once per snapshot).
--
-- Safe to re-run. Idempotent for the schema; appends a new snapshot for the
-- data on every run.
--
-- ──────────────────────────────────────────────────────────────────────────
-- Restore example (run manually with care — overwrites current values):
--
--   update matches m
--   set home_score          = b.home_score,
--       away_score          = b.away_score,
--       status              = b.status,
--       home_umpire_no_show = b.home_umpire_no_show,
--       away_umpire_no_show = b.away_umpire_no_show,
--       home_late_minutes   = b.home_late_minutes,
--       away_late_minutes   = b.away_late_minutes,
--       home_no_show        = b.home_no_show,
--       away_no_show        = b.away_no_show,
--       scoresheet_url      = b.scoresheet_url
--   from matches_backup b
--   where b.id = m.id
--     and b.backed_up_at = (
--       select max(backed_up_at) from matches_backup
--     );
-- =============================================================================

create table if not exists matches_backup (
  id                  uuid not null,
  age_group_id        uuid not null,
  home_team_id        uuid not null,
  away_team_id        uuid not null,
  home_score          int,
  away_score          int,
  court               text,
  kickoff_time        timestamptz not null,
  status              text not null,
  home_umpire_no_show boolean not null,
  away_umpire_no_show boolean not null,
  home_late_minutes   int not null,
  away_late_minutes   int not null,
  home_no_show        boolean not null,
  away_no_show        boolean not null,
  scoresheet_url      text,
  created_at          timestamptz not null,
  backed_up_at        timestamptz not null default now()
);

create index if not exists matches_backup_backed_up_at_idx
  on matches_backup (backed_up_at desc);

create index if not exists matches_backup_id_backed_up_at_idx
  on matches_backup (id, backed_up_at desc);

insert into matches_backup (
  id, age_group_id, home_team_id, away_team_id,
  home_score, away_score, court, kickoff_time, status,
  home_umpire_no_show, away_umpire_no_show,
  home_late_minutes, away_late_minutes,
  home_no_show, away_no_show,
  scoresheet_url, created_at, backed_up_at
)
select
  id, age_group_id, home_team_id, away_team_id,
  home_score, away_score, court, kickoff_time, status,
  home_umpire_no_show, away_umpire_no_show,
  home_late_minutes, away_late_minutes,
  home_no_show, away_no_show,
  scoresheet_url, created_at,
  now()
from matches;

-- Quick sanity check after running:
--   select backed_up_at, count(*) from matches_backup
--     group by backed_up_at order by backed_up_at desc;
