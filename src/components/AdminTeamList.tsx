'use client'

import { useMemo, useState } from 'react'
import TeamEditForm from './TeamEditForm'
import TeamLogoDropzone from './TeamLogoDropzone'
import TeamPlayersDialog from './TeamPlayersDialog'
import type { Team } from '@/lib/types'

interface AdminTeamListProps {
  teams: Team[]
  ageGroupId: string
  ageGroupName: string
  onSaved: () => void
}

export default function AdminTeamList({
  teams,
  ageGroupId,
  ageGroupName,
  onSaved,
}: AdminTeamListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [playersTeamId, setPlayersTeamId] = useState<string | null>(null)

  const sorted = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams]
  )

  const editingTeam = editingId
    ? sorted.find((t) => t.id === editingId) ?? null
    : null
  const playersTeam = playersTeamId
    ? sorted.find((t) => t.id === playersTeamId) ?? null
    : null

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-md bg-mk-red px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-mk-red-dark"
        >
          Add team
        </button>
      </div>
      {sorted.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          No teams in this age group yet. Click&nbsp;
          <span className="font-semibold">Add team</span> to start building the
          roster.
        </p>
      ) : (
      <ul className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {sorted.map((team) => (
          <li
            key={team.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <TeamLogoDropzone team={team} size="md" onSaved={onSaved} />
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
              onClick={() => setPlayersTeamId(team.id)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Players
            </button>
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
      )}

      {creating && (
        <TeamEditForm
          ageGroupId={ageGroupId}
          ageGroupName={ageGroupName}
          onSave={() => {
            setCreating(false)
            onSaved()
          }}
          onCancel={() => setCreating(false)}
        />
      )}
      {editingTeam && (
        <TeamEditForm
          team={editingTeam}
          ageGroupId={ageGroupId}
          ageGroupName={ageGroupName}
          onSave={() => {
            setEditingId(null)
            onSaved()
          }}
          onCancel={() => setEditingId(null)}
        />
      )}
      {playersTeam && (
        <TeamPlayersDialog
          team={playersTeam}
          onClose={() => setPlayersTeamId(null)}
        />
      )}
    </>
  )
}
