-- =============================================================================
-- commit_schedule() RPC
--
-- Atomically applies a list of (match_id, court, kickoff_time) placements
-- produced by the auto-plan algorithm. Each row sets the match's court and
-- kickoff_time and marks it as planned. The whole batch runs inside a single
-- function invocation, so any error rolls back every update.
--
-- Argument shape:
--   plan = [
--     { "id": "uuid", "court": "Court 1", "kickoff_time": "2026-04-25T09:00:00.000Z" },
--     ...
--   ]
--
-- Returns the number of rows updated. Re-runnable (CREATE OR REPLACE).
-- =============================================================================

create or replace function commit_schedule(plan jsonb)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  rows_updated int := 0;
  affected int;
begin
  if jsonb_typeof(plan) <> 'array' then
    raise exception 'plan must be a jsonb array';
  end if;

  for item in select * from jsonb_array_elements(plan)
  loop
    update matches
      set
        court = item->>'court',
        kickoff_time = (item->>'kickoff_time')::timestamptz,
        is_planned = true
      where id = (item->>'id')::uuid;
    get diagnostics affected = row_count;
    rows_updated := rows_updated + affected;
  end loop;

  return rows_updated;
end;
$$;

revoke all on function commit_schedule(jsonb) from public;
grant execute on function commit_schedule(jsonb) to authenticated;
