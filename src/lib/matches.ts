import type { createClient } from './supabase'
import { totalMatchMinutes } from './matchRules'
import type { AgeGroup, Day } from './types'

type Supabase = ReturnType<typeof createClient>

interface AgeGroupRow extends AgeGroup {}

interface TournamentDates {
  start_date: string | null
  end_date: string | null
}

function placeholderIso(day: Day, t: TournamentDates): string {
  const dateStr =
    day === 'saturday'
      ? t.start_date ?? t.end_date
      : t.end_date ?? t.start_date
  if (dateStr) return `${dateStr}T08:00:00.000Z`
  // Fall back to today if the tournament has no dates yet — value is irrelevant
  // because the match starts unplanned and the user drags it onto a real slot.
  return new Date().toISOString()
}

/**
 * Ensure a round-robin set of matches exists for the age group: every pair of
 * teams that doesn't yet have a match between them gets one created. New
 * matches start in the unplanned pool (`is_planned = false`) so the organiser
 * can drag them onto the schedule.
 */
export async function ensureRoundRobinMatches(
  supabase: Supabase,
  ageGroupId: string
): Promise<{ created: number; error?: string }> {
  const { data: ag, error: agErr } = await supabase
    .from('age_groups')
    .select('*')
    .eq('id', ageGroupId)
    .single()
  if (agErr || !ag) {
    return { created: 0, error: agErr?.message ?? 'Age group not found' }
  }
  const ageGroup = ag as AgeGroupRow

  const { data: tournament, error: tErr } = await supabase
    .from('tournaments')
    .select('start_date, end_date')
    .eq('id', ageGroup.tournament_id)
    .single()
  if (tErr || !tournament) {
    return { created: 0, error: tErr?.message ?? 'Tournament not found' }
  }

  const { data: teamsData } = await supabase
    .from('teams')
    .select('id, name')
    .eq('age_group_id', ageGroupId)
    .is('deleted_at', null)
  const teams = (teamsData ?? []) as { id: string; name: string }[]
  if (teams.length < 2) return { created: 0 }

  const { data: existingMatches } = await supabase
    .from('matches')
    .select('home_team_id, away_team_id')
    .eq('age_group_id', ageGroupId)
    .is('deleted_at', null)
  const existingPairs = new Set<string>(
    ((existingMatches ?? []) as {
      home_team_id: string
      away_team_id: string
    }[]).map((m) => [m.home_team_id, m.away_team_id].sort().join('|'))
  )

  const placeholder = placeholderIso(ageGroup.day, tournament as TournamentDates)
  const totalMin = totalMatchMinutes(ageGroup)

  const toInsert: Record<string, unknown>[] = []

  // Use the "Circle Method" for round-robin scheduling to ensure unique teams per round
  type TeamOrBye = typeof teams[0] | null
  const schedulingTeams: TeamOrBye[] = [...teams]
  if (schedulingTeams.length % 2 !== 0) {
    schedulingTeams.push(null) // Add a dummy team for the "bye"
  }

  const numTeams = schedulingTeams.length
  const rounds = numTeams - 1
  const matchesPerRound = numTeams / 2

  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < matchesPerRound; i++) {
      const home = schedulingTeams[i]
      const away = schedulingTeams[numTeams - 1 - i]

      // If neither team is the dummy "bye" team, schedule the match
      if (home !== null && away !== null) {
        const key = [home.id, away.id].sort().join('|')
        if (!existingPairs.has(key)) {
          toInsert.push({
            age_group_id: ageGroupId,
            home_team_id: home.id,
            away_team_id: away.id,
            court: null,
            kickoff_time: placeholder,
            status: 'scheduled',
            duration_minutes: totalMin,
            is_planned: false,
            round_number: round + 1, // Store the assigned round
          })
        }
      }
    }

    // Rotate the array for the next round: keep index 0 fixed, shift the rest
    const last = schedulingTeams.pop()!
    schedulingTeams.splice(1, 0, last)
  }

  if (toInsert.length === 0) return { created: 0 }

  const { data, error } = await supabase
    .from('matches')
    .insert(toInsert)
    .select('id')
  if (error) return { created: 0, error: error.message }
  return { created: data?.length ?? 0 }
}

/**
 * Push the age group's match rules onto every existing match in that group by
 * setting `matches.duration_minutes` to the total computed from the rules.
 */
export async function applyMatchRulesToGroup(
  supabase: Supabase,
  ageGroupId: string,
  totalMin: number
): Promise<{ updated: number; error?: string }> {
  const { data, error } = await supabase
    .from('matches')
    .update({ duration_minutes: totalMin })
    .eq('age_group_id', ageGroupId)
    .is('deleted_at', null)
    .select('id')
  if (error) return { updated: 0, error: error.message }
  return { updated: data?.length ?? 0 }
}

/**
 * Soft-delete a team by stamping `deleted_at`. All matches that reference the
 * team (home or away) are stamped with the same timestamp so they vanish from
 * match, schedule and matrix views. Returns counts for the audit toast.
 */
export async function softDeleteTeam(
  supabase: Supabase,
  teamId: string
): Promise<{
  team: number
  matches: number
  error?: string
}> {
  const stamp = new Date().toISOString()
  const { data: t, error: tErr } = await supabase
    .from('teams')
    .update({ deleted_at: stamp })
    .eq('id', teamId)
    .is('deleted_at', null)
    .select('id')
  if (tErr) return { team: 0, matches: 0, error: tErr.message }
  if (!t || t.length === 0) {
    return {
      team: 0,
      matches: 0,
      error: 'Team not found, already deleted, or RLS blocked',
    }
  }

  const { data: m, error: mErr } = await supabase
    .from('matches')
    .update({ deleted_at: stamp })
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .is('deleted_at', null)
    .select('id')
  if (mErr) return { team: 1, matches: 0, error: mErr.message }
  return { team: 1, matches: m?.length ?? 0 }
}

/**
 * Restore a soft-deleted team. Matches involving this team are restored only
 * when the OPPOSING team is also active — that prevents resurrecting a fixture
 * whose other half is still gone.
 */
export async function restoreTeam(
  supabase: Supabase,
  teamId: string
): Promise<{
  team: number
  matches: number
  error?: string
}> {
  const { data: t, error: tErr } = await supabase
    .from('teams')
    .update({ deleted_at: null })
    .eq('id', teamId)
    .not('deleted_at', 'is', null)
    .select('id')
  if (tErr) return { team: 0, matches: 0, error: tErr.message }
  if (!t || t.length === 0) {
    return {
      team: 0,
      matches: 0,
      error: 'Team not found, already active, or RLS blocked',
    }
  }

  const { data: candidates, error: cErr } = await supabase
    .from('matches')
    .select('id, home_team_id, away_team_id')
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .not('deleted_at', 'is', null)
  if (cErr) return { team: 1, matches: 0, error: cErr.message }
  const cands = (candidates ?? []) as {
    id: string
    home_team_id: string
    away_team_id: string
  }[]
  if (cands.length === 0) return { team: 1, matches: 0 }

  const otherIds = Array.from(
    new Set(
      cands.map((m) => (m.home_team_id === teamId ? m.away_team_id : m.home_team_id))
    )
  )
  const { data: activeOthers } = await supabase
    .from('teams')
    .select('id')
    .in('id', otherIds)
    .is('deleted_at', null)
  const activeSet = new Set(
    ((activeOthers ?? []) as { id: string }[]).map((r) => r.id)
  )

  const restoreIds = cands
    .filter((m) =>
      activeSet.has(m.home_team_id === teamId ? m.away_team_id : m.home_team_id)
    )
    .map((m) => m.id)

  if (restoreIds.length === 0) return { team: 1, matches: 0 }

  const { data: m, error: mErr } = await supabase
    .from('matches')
    .update({ deleted_at: null })
    .in('id', restoreIds)
    .select('id')
  if (mErr) return { team: 1, matches: 0, error: mErr.message }
  return { team: 1, matches: m?.length ?? 0 }
}
