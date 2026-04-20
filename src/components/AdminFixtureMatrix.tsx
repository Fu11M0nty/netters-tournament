'use client'

import { useMemo } from 'react'
import TeamLogo from '@/components/TeamLogo'
import type { Match, Team } from '@/lib/types'

interface AdminFixtureMatrixProps {
  teams: Team[]
  matches: Match[]
  dayMatches?: Match[]
}

const BACK_TO_BACK_THRESHOLD_MS = 30 * 60 * 1000

function formatKickoff(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminFixtureMatrix({
  teams,
  matches,
  dayMatches,
}: AdminFixtureMatrixProps) {
  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams]
  )

  const matchByPair = useMemo(() => {
    const map = new Map<string, Match>()
    for (const m of matches) {
      const key = [m.home_team_id, m.away_team_id].sort().join('|')
      map.set(key, m)
    }
    return map
  }, [matches])

  const courtConflictIds = useMemo(() => {
    const scope = dayMatches && dayMatches.length > 0 ? dayMatches : matches
    const byCourtTime = new Map<string, string[]>()
    for (const m of scope) {
      if (!m.court) continue
      const key = `${m.court}|${m.kickoff_time}`
      const arr = byCourtTime.get(key) ?? []
      arr.push(m.id)
      byCourtTime.set(key, arr)
    }
    const conflicts = new Set<string>()
    for (const arr of byCourtTime.values()) {
      if (arr.length > 1) arr.forEach((id) => conflicts.add(id))
    }
    return conflicts
  }, [dayMatches, matches])

  const backToBackIds = useMemo(() => {
    const byTeam = new Map<string, Match[]>()
    for (const m of matches) {
      for (const tid of [m.home_team_id, m.away_team_id]) {
        const arr = byTeam.get(tid) ?? []
        arr.push(m)
        byTeam.set(tid, arr)
      }
    }
    const flagged = new Set<string>()
    for (const list of byTeam.values()) {
      const sorted = [...list].sort(
        (a, b) =>
          new Date(a.kickoff_time).getTime() -
          new Date(b.kickoff_time).getTime()
      )
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1]
        const curr = sorted[i]
        const gap =
          new Date(curr.kickoff_time).getTime() -
          new Date(prev.kickoff_time).getTime()
        if (gap >= 0 && gap < BACK_TO_BACK_THRESHOLD_MS) {
          flagged.add(prev.id)
          flagged.add(curr.id)
        }
      }
    }
    return flagged
  }, [matches])

  if (sortedTeams.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
        No teams in this age group.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <table className="min-w-full border-collapse text-xs">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-900">
            <th
              scope="col"
              className="sticky left-0 z-10 min-w-[12rem] border-b border-r border-zinc-200 bg-zinc-50 px-3 py-2 text-left font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              Team
            </th>
            {sortedTeams.map((t) => (
              <th
                key={t.id}
                scope="col"
                title={t.name}
                className="border-b border-zinc-200 px-2 py-2 align-bottom font-semibold text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
              >
                <div className="flex justify-center">
                  <TeamLogo team={t} size="sm" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((row) => (
            <tr key={row.id} className="odd:bg-white even:bg-zinc-50/50 dark:odd:bg-zinc-950 dark:even:bg-zinc-900/30">
              <th
                scope="row"
                className="sticky left-0 z-10 border-b border-r border-zinc-200 bg-inherit px-3 py-2 text-left font-medium text-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
              >
                <div className="flex items-center gap-2">
                  <TeamLogo team={row} size="sm" />
                  <span>{row.name}</span>
                </div>
              </th>
              {sortedTeams.map((col) => {
                if (row.id === col.id) {
                  return (
                    <td
                      key={col.id}
                      aria-hidden="true"
                      className="border-b border-zinc-200 bg-zinc-100 px-2 py-2 text-center text-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-700"
                    >
                      —
                    </td>
                  )
                }
                const key = [row.id, col.id].sort().join('|')
                const match = matchByPair.get(key)
                if (!match) {
                  return (
                    <td
                      key={col.id}
                      className="border-b border-zinc-200 px-2 py-2 text-center text-zinc-300 dark:border-zinc-800 dark:text-zinc-700"
                    >
                      ·
                    </td>
                  )
                }
                const completed = match.status === 'completed'
                const courtClash = courtConflictIds.has(match.id)
                const backToBack = backToBackIds.has(match.id)
                const baseCell = 'border-b border-zinc-200 px-2 py-2 text-center dark:border-zinc-800'
                const colorClass = courtClash
                  ? 'bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-200'
                  : backToBack
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                    : completed
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-zinc-700 dark:text-zinc-300'
                const titleParts = [`${row.name} vs ${col.name}`]
                if (courtClash) titleParts.push('Court/time conflict with another fixture')
                if (backToBack) titleParts.push('Back-to-back match for one of the teams')
                return (
                  <td
                    key={col.id}
                    title={titleParts.join(' — ')}
                    className={`${baseCell} ${colorClass}`}
                  >
                    <div className="font-semibold tabular-nums">
                      {formatKickoff(match.kickoff_time)}
                    </div>
                    {match.court && (
                      <div className="text-[10px] opacity-80">
                        {match.court}
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
