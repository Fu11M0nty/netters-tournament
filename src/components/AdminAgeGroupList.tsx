'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import AgeGroupEditForm from './AgeGroupEditForm'
import { createClient } from '@/lib/supabase'
import { describeMatchRules } from '@/lib/matchRules'
import type { AgeGroup, Tournament } from '@/lib/types'

interface AdminAgeGroupListProps {
  tournament: Tournament
  ageGroups: AgeGroup[]
  onChanged: () => void
  onClose: () => void
}

export default function AdminAgeGroupList({
  tournament,
  ageGroups,
  onChanged,
  onClose,
}: AdminAgeGroupListProps) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<AgeGroup | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient()

  const sorted = [...ageGroups].sort(
    (a, b) =>
      a.day.localeCompare(b.day) ||
      a.display_order - b.display_order ||
      a.name.localeCompare(b.name)
  )

  const nextDisplayOrder =
    ageGroups.reduce((max, g) => Math.max(max, g.display_order), 0) + 1

  async function handleDelete(g: AgeGroup) {
    if (
      !window.confirm(
        `Delete "${g.name}" (${g.day}) and ALL its teams + matches? This cannot be undone.`
      )
    ) {
      return
    }
    setDeletingId(g.id)
    const { data, error } = await supabase
      .from('age_groups')
      .delete()
      .eq('id', g.id)
      .select()
    setDeletingId(null)
    if (error) {
      toast.error(`Could not delete: ${error.message}`)
      return
    }
    if (!data || data.length === 0) {
      toast.error('Delete blocked by RLS — check age_groups_auth_delete policy.')
      return
    }
    toast.success('Age group deleted')
    onChanged()
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Age groups — {tournament.name}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-md bg-mk-red px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-mk-red-dark"
          >
            New age group
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Close
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          No age groups yet. Click&nbsp;
          <span className="font-semibold">New age group</span> to get started.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {sorted.map((g) => (
            <li
              key={g.id}
              className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    {g.name}
                  </h3>
                  <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                    {g.day === 'saturday' ? 'Sat' : 'Sun'}
                  </span>
                  {g.gender && (
                    <span className="inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                      {g.gender}
                    </span>
                  )}
                  {g.skill_level && (
                    <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      {g.skill_level}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  /{g.slug} · order {g.display_order}
                </p>
                <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold">
                    {g.match_format === 'continuous'
                      ? 'Continuous'
                      : g.match_format === 'halves'
                        ? '2 halves'
                        : '4 quarters'}
                  </span>{' '}
                  — {describeMatchRules(g)}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(g)}
                  className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(g)}
                  disabled={deletingId === g.id}
                  className="rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950"
                >
                  {deletingId === g.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {creating && (
        <AgeGroupEditForm
          mode="create"
          tournamentId={tournament.id}
          defaultDisplayOrder={nextDisplayOrder}
          onSaved={() => {
            setCreating(false)
            onChanged()
          }}
          onCancel={() => setCreating(false)}
        />
      )}
      {editing && (
        <AgeGroupEditForm
          mode="edit"
          tournamentId={tournament.id}
          ageGroup={editing}
          onSaved={() => {
            setEditing(null)
            onChanged()
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
