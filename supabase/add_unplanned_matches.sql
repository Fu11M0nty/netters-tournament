-- =============================================================================
-- Phase C — Drag-and-drop scheduler foundation
--
-- Adds an `is_planned` flag to `matches`. Existing matches default to
-- `true` (already in the schedule), so no public behaviour changes.
-- Future matches can be created with `is_planned = false` to land in the
-- "Unplanned" pool of the scheduler until an organiser drags them onto a
-- court + time slot.
--
-- Safe to re-run.
-- =============================================================================

alter table matches
  add column if not exists is_planned boolean not null default true;

create index if not exists matches_is_planned_idx on matches(is_planned);
