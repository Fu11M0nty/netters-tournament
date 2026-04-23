-- =============================================================================
-- Remove AP Saints' Saturday Under 13's fixtures
--
-- AP Saints pulled out of the Saturday Under 13's group. This deletes every
-- match in that group where AP Saints is either the home or away team.
-- The team row itself is left in place so history references still resolve.
-- Safe to re-run (nothing to delete on the second pass).
-- =============================================================================

do $$
declare
  ag uuid;
  team_id uuid;
begin
  select id into ag
    from age_groups
    where slug = 'under-13s' and day = 'saturday';

  select id into team_id
    from teams
    where name = 'AP Saints' and age_group_id = ag;

  delete from matches
    where age_group_id = ag
      and (home_team_id = team_id or away_team_id = team_id);
end $$;
