-- =============================================================================
-- Per-age-group match rules
--
-- Adds five columns to `age_groups` so each group can define how its matches
-- are structured:
--
--   match_format            : 'continuous' | 'halves' | 'quarters'
--   period_minutes          : length of each period of play
--                             (= total minutes for 'continuous',
--                                minutes per half for 'halves',
--                                minutes per quarter for 'quarters')
--   break_q1_q2_minutes     : break between quarters 1 and 2 (quarters only)
--   break_half_time_minutes : half-time break (halves & quarters)
--   break_q3_q4_minutes     : break between quarters 3 and 4 (quarters only)
--
-- Total match duration is derived in the app from these values.
-- Safe to re-run.
-- =============================================================================

alter table age_groups
  add column if not exists match_format text not null default 'continuous';
alter table age_groups
  add column if not exists period_minutes int not null default 12;
alter table age_groups
  add column if not exists break_q1_q2_minutes int not null default 0;
alter table age_groups
  add column if not exists break_half_time_minutes int not null default 0;
alter table age_groups
  add column if not exists break_q3_q4_minutes int not null default 0;

alter table age_groups
  drop constraint if exists age_groups_match_format_check;
alter table age_groups
  add constraint age_groups_match_format_check
  check (match_format in ('continuous', 'halves', 'quarters'));

alter table age_groups
  drop constraint if exists age_groups_period_minutes_positive;
alter table age_groups
  add constraint age_groups_period_minutes_positive
  check (period_minutes > 0);

alter table age_groups
  drop constraint if exists age_groups_break_q1_q2_nonneg;
alter table age_groups
  add constraint age_groups_break_q1_q2_nonneg
  check (break_q1_q2_minutes >= 0);

alter table age_groups
  drop constraint if exists age_groups_break_half_time_nonneg;
alter table age_groups
  add constraint age_groups_break_half_time_nonneg
  check (break_half_time_minutes >= 0);

alter table age_groups
  drop constraint if exists age_groups_break_q3_q4_nonneg;
alter table age_groups
  add constraint age_groups_break_q3_q4_nonneg
  check (break_q3_q4_minutes >= 0);
