'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import TeamEditForm from './TeamEditForm'
import TeamLogoDropzone from './TeamLogoDropzone'
import TeamPlayersDialog from './TeamPlayersDialog'
import { createClient } from '@/lib/supabase'
import { restoreTeam, softDeleteTeam } from '@/lib/matches'
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
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)
  const [deletedTeams, setDeletedTeams] = useState<Team[]>([])
  const [loadingDeleted, setLoadingDeleted] = useState(false)
  const supabase = createClient()

  const loadDeleted = useCallback(async () => {
    setLoadingDeleted(true)
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('age_group_id', ageGroupId)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })
    setLoadingDeleted(false)
    if (error) {
      toast.error(`Could not load deleted teams: ${error.message}`)
      return
    }
    setDeletedTeams((data ?? []) as Team[])
  }, [supabase, ageGroupId])

  useEffect(() => {
    if (showDeleted) loadDeleted()
  }, [showDeleted, loadDeleted])

  async function handleDelete(team: Team) {
    if (
      !window.confirm(
        `Delete "${team.name}"? Their fixtures will also be marked deleted and hidden from the schedule and standings. (Soft delete — can be restored.)`
      )
    ) {
      return
    }
    setBusyId(team.id)
    const r = await softDeleteTeam(supabase, team.id)
    setBusyId(null)
    if (r.error) {
      toast.error(`Could not delete: ${r.error}`)
      return
    }
    toast.success(
      `Deleted ${team.name}` +
        (r.matches > 0
          ? ` · ${r.matches} fixture${r.matches === 1 ? '' : 's'} hidden`
          : '')
    )
    onSaved()
    if (showDeleted) loadDeleted()
  }

  async function handleRestore(team: Team) {
    setBusyId(team.id)
    const r = await restoreTeam(supabase, team.id)
    setBusyId(null)
    if (r.error) {
      toast.error(`Could not restore: ${r.error}`)
      return
    }
    toast.success(
      `Restored ${team.name}` +
        (r.matches > 0
          ? ` · ${r.matches} fixture${r.matches === 1 ? '' : 's'} reactivated`
          : '')
    )
    onSaved()
    loadDeleted()
  }

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
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setShowDeleted((s) => !s)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          {showDeleted ? 'Hide deleted' : 'Show deleted'}
        </button>
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
            <button
              type="button"
              onClick={() => handleDelete(team)}
              disabled={busyId === team.id}
              className="rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              {busyId === team.id ? '…' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      )}

      {showDeleted && (
        <section className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900/40">
          <header className="mb-2 flex items-baseline justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Deleted teams ({deletedTeams.length})
            </p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Audit trail · soft-deleted, recoverable
            </p>
          </header>
          {loadingDeleted ? (
            <p className="text-center text-xs text-zinc-400">Loading…</p>
          ) : deletedTeams.length === 0 ? (
            <p className="text-center text-xs text-zinc-400">
              No deleted teams in this group.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
              {deletedTeams.map((team) => (
                <li
                  key={team.id}
                  className="flex items-center gap-3 px-3 py-2 opacity-70"
                >
                  <span className="rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Deleted
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-700 line-through dark:text-zinc-300">
                      {team.name}
                    </p>
                    <p className="text-[10px] tabular-nums text-zinc-500 dark:text-zinc-400">
                      Deleted{' '}
                      {team.deleted_at
                        ? new Date(team.deleted_at).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Europe/London',
                          })
                        : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRestore(team)}
                    disabled={busyId === team.id}
                    className="rounded-md border border-emerald-400 bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 disabled:opacity-60 dark:border-emerald-700 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-emerald-950"
                  >
                    {busyId === team.id ? '…' : 'Restore'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
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
