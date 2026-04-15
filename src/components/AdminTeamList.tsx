'use client'

import { useMemo, useState } from 'react'
import TeamEditForm from './TeamEditForm'
import TeamLogo from './TeamLogo'
import type { Team } from '@/lib/types'

interface AdminTeamListProps {
  teams: Team[]
  ageGroupName: string
  onSaved: () => void
}

export default function AdminTeamList({
  teams,
  ageGroupName,
  onSaved,
}: AdminTeamListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const sorted = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams]
  )

  const editingTeam = editingId
    ? sorted.find((t) => t.id === editingId) ?? null
    : null

  if (sorted.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
        No teams in this age group.
      </p>
    )
  }

  return (
    <>
      <ul className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {sorted.map((team) => (
          <li
            key={team.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <TeamLogo team={team} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {team.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                {team.short_name && (
                  <span className="font-mono uppercase">{team.short_name}</span>
                )}
                {team.color && (
                  <span className="inline-flex items-center gap-1">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2 w-2 rounded-full ring-1 ring-zinc-300 dark:ring-zinc-700"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="tabular-nums">{team.color}</span>
                  </span>
                )}
                {!team.logo_url && <span>No logo</span>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditingId(team.id)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {editingTeam && (
        <TeamEditForm
          team={editingTeam}
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
