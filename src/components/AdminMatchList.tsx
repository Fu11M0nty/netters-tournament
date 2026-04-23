'use client'

import { useMemo, useState } from 'react'
import ScoreEntryForm from './ScoreEntryForm'
import TeamLogo from './TeamLogo'
import { formatKickoffTime } from '@/lib/time'
import type { Match, Team } from '@/lib/types'

interface AdminMatchListProps {
  matches: Match[]
  teams: Team[]
  ageGroupName: string
  onSaved: () => void
}

function formatKickoff(iso: string): string {
  return formatKickoffTime(iso)
}

export default function AdminMatchList({
  matches,
  teams,
  ageGroupName,
  onSaved,
}: AdminMatchListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterTeamId, setFilterTeamId] = useState<string | null>(null)

  const teamById = useMemo(() => {
    const map = new Map<string, Team>()
    for (const t of teams) map.set(t.id, t)
    return map
  }, [teams])

  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams]
  )

  const sorted = useMemo(
    () =>
      [...matches].sort(
        (a, b) =>
          new Date(a.kickoff_time).getTime() -
          new Date(b.kickoff_time).getTime()
      ),
    [matches]
  )

  const visible = useMemo(
    () =>
      filterTeamId === null
        ? sorted
        : sorted.filter(
            (m) =>
              m.home_team_id === filterTeamId ||
              m.away_team_id === filterTeamId
          ),
    [sorted, filterTeamId]
  )

  const duplicateIds = useMemo(() => {
    const byPair = new Map<string, string[]>()
    for (const m of matches) {
      const key = [m.home_team_id, m.away_team_id].sort().join('|')
      const arr = byPair.get(key) ?? []
      arr.push(m.id)
      byPair.set(key, arr)
    }
    const dupes = new Set<string>()
    for (const arr of byPair.values()) {
      if (arr.length > 1) arr.forEach((id) => dupes.add(id))
    }
    return dupes
  }, [matches])

  const editingMatch = editingId
    ? sorted.find((m) => m.id === editingId) ?? null
    : null
  const editingHome = editingMatch ? teamById.get(editingMatch.home_team_id) : null
  const editingAway = editingMatch ? teamById.get(editingMatch.away_team_id) : null

  if (sorted.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
        No matches in this age group.
      </p>
    )
  }

  const activeFilterTeam = filterTeamId ? teamById.get(filterTeamId) : null

  return (
    <>
      <nav
        aria-label="Filter matches by team"
        className="-mx-4 mb-3 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      >
        <ul className="flex w-max items-center gap-2 py-1">
          <li className="shrink-0">
            <button
              type="button"
              onClick={() => setFilterTeamId(null)}
              aria-pressed={filterTeamId === null}
              className={
                filterTeamId === null
                  ? 'inline-flex h-12 items-center rounded-full bg-mk-red px-4 text-xs font-bold uppercase tracking-wider text-white shadow-sm'
                  : 'inline-flex h-12 items-center rounded-full border border-mk-ink/15 bg-white px-4 text-xs font-bold uppercase tracking-wider text-mk-ink hover:border-mk-red hover:text-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
              }
            >
              All teams
            </button>
          </li>
          {sortedTeams.map((team) => {
            const active = team.id === filterTeamId
            return (
              <li key={team.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterTeamId(active ? null : team.id)}
                  aria-pressed={active}
                  aria-label={team.name}
                  title={team.name}
                  className={
                    active
                      ? 'inline-flex h-12 w-12 items-center justify-center rounded-full bg-mk-red p-0.5 shadow-sm ring-2 ring-mk-red ring-offset-2 ring-offset-mk-cream dark:ring-offset-zinc-950'
                      : 'inline-flex h-12 w-12 items-center justify-center rounded-full bg-white p-0.5 ring-1 ring-mk-ink/15 transition-colors hover:ring-mk-red dark:bg-zinc-900 dark:ring-zinc-700'
                  }
                >
                  <TeamLogo team={team} size="md" />
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          No matches for {activeFilterTeam?.name ?? 'this filter'}.
        </p>
      ) : (
      <ul className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {visible.map((match) => {
          const home = teamById.get(match.home_team_id)
          const away = teamById.get(match.away_team_id)
          if (!home || !away) return null

          const hasScore =
            match.home_score !== null && match.away_score !== null
          const scoreLabel = hasScore
            ? `${match.home_score} – ${match.away_score}`
            : '–'

          const isDuplicate = duplicateIds.has(match.id)
          return (
            <li
              key={match.id}
              title={isDuplicate ? 'Duplicate fixture — this pair is scheduled more than once' : undefined}
              className={
                isDuplicate
                  ? 'flex animate-pulse flex-col gap-2 bg-fuchsia-100 px-4 py-3 dark:bg-fuchsia-950/60 sm:flex-row sm:items-center sm:gap-4'
                  : 'flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4'
              }
            >
              <div className="flex shrink-0 gap-3 text-xs text-zinc-500 tabular-nums dark:text-zinc-400 sm:w-32">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {formatKickoff(match.kickoff_time)}
                </span>
                {match.court && <span>{match.court}</span>}
              </div>

              <div className="flex-1 text-sm text-zinc-900 dark:text-zinc-100">
                {isDuplicate && (
                  <span className="mr-2 rounded-sm bg-fuchsia-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Duplicate
                  </span>
                )}
                <span className="font-medium">{home.name}</span>
                {match.home_umpire_no_show && (
                  <span
                    title={`${home.name} did not provide an umpire — −1 pt`}
                    className="ml-1 rounded-sm bg-red-600 px-1 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                  >
                    −1
                  </span>
                )}
                <span className="mx-2 text-zinc-400">vs</span>
                <span className="font-medium">{away.name}</span>
                {match.away_umpire_no_show && (
                  <span
                    title={`${away.name} did not provide an umpire — −1 pt`}
                    className="ml-1 rounded-sm bg-red-600 px-1 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                  >
                    −1
                  </span>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3 sm:w-auto">
                <span
                  className={
                    hasScore
                      ? 'rounded-md bg-zinc-100 px-2.5 py-1 text-sm font-semibold tabular-nums text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50'
                      : 'rounded-md bg-zinc-50 px-2.5 py-1 text-sm text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600'
                  }
                >
                  {scoreLabel}
                </span>
                <span
                  className={
                    match.status === 'completed'
                      ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'
                  }
                >
                  {match.status === 'completed' ? 'Completed' : 'Scheduled'}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingId(match.id)}
                  className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Edit
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      )}

      {editingMatch && editingHome && editingAway && (
        <ScoreEntryForm
          match={editingMatch}
          homeTeam={editingHome}
          awayTeam={editingAway}
          teams={teams}
          ageGroupName={ageGroupName}
          onSave={() => {
            setEditingId(null)
            onSaved()
          }}
          onCancel={() => setEditingId(null)}
        />
      )}
    </>
  )
}
