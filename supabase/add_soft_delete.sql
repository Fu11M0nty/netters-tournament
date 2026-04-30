-- =============================================================================
-- Soft-delete teams and matches
--
-- Adds `deleted_at timestamptz` to both `teams` and `matches`. The column is
-- null for active rows and timestamped on soft-delete. Application queries
-- filter `deleted_at IS NULL` to hide them from match, schedule and matrix
-- views; admin can still surface them as an audit trail and restore.
--
-- Partial indexes accelerate the common "active rows only" reads.
-- Safe to re-run.
-- =============================================================================

alter table teams
  add column if not exists deleted_at timestamptz;

alter table matches
  add column if not exists deleted_at timestamptz;

create index if not exists teams_active_idx
  on teams (age_group_id) where deleted_at is null;

create index if not exists matches_active_idx
  on matches (age_group_id) where deleted_at is null;
