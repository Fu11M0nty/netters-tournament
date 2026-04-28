'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/slugify'
import type { AgeGroup, Day } from '@/lib/types'

interface AgeGroupEditFormProps {
  mode: 'create' | 'edit'
  tournamentId: string
  ageGroup?: AgeGroup
  defaultDisplayOrder?: number
  onSaved: () => void
  onCancel: () => void
}

const DAYS: Day[] = ['saturday', 'sunday']

export default function AgeGroupEditForm({
  mode,
  tournamentId,
  ageGroup,
  defaultDisplayOrder,
  onSaved,
  onCancel,
}: AgeGroupEditFormProps) {
  const [name, setName] = useState(ageGroup?.name ?? '')
  const [slug, setSlug] = useState(ageGroup?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [day, setDay] = useState<Day>(ageGroup?.day ?? 'saturday')
  const [displayOrder, setDisplayOrder] = useState<string>(
    String(ageGroup?.display_order ?? defaultDisplayOrder ?? 1)
  )
  const [gender, setGender] = useState(ageGroup?.gender ?? '')
  const [skillLevel, setSkillLevel] = useState(ageGroup?.skill_level ?? '')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedSlug = slug.trim()
    if (!trimmedName || !trimmedSlug) {
      toast.error('Name and slug are required.')
      return
    }
    if (!/^[a-z0-9-]+$/.test(trimmedSlug)) {
      toast.error('Slug can only contain lowercase letters, numbers and hyphens.')
      return
    }
    const order = Number(displayOrder)
    if (!Number.isInteger(order)) {
      toast.error('Display order must be a whole number.')
      return
    }

    const payload = {
      tournament_id: tournamentId,
      name: trimmedName,
      slug: trimmedSlug,
      day,
      display_order: order,
      gender: gender.trim() === '' ? null : gender.trim(),
      skill_level: skillLevel.trim() === '' ? null : skillLevel.trim(),
    }

    setSaving(true)
    const { data, error } =
      mode === 'create'
        ? await supabase.from('age_groups').insert(payload).select()
        : await supabase
            .from('age_groups')
            .update(payload)
            .eq('id', ageGroup!.id)
            .select()
    setSaving(false)

    if (error) {
      toast.error(`Could not save: ${error.message}`)
      return
    }
    if (!data || data.length === 0) {
      toast.error(
        mode === 'create'
          ? 'Insert blocked by RLS — check age_groups_auth_insert policy.'
          : 'Update blocked by RLS — check age_groups_auth_update policy.'
      )
      return
    }
    toast.success(mode === 'create' ? 'Age group created' : 'Age group saved')
    onSaved()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-group-edit-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <header className="mb-4">
          <h2
            id="age-group-edit-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-50"
          >
            {mode === 'create' ? 'New age group' : 'Edit age group'}
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="ag-name"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Name
            </label>
            <input
              id="ag-name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Under 13's"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div>
            <label
              htmlFor="ag-slug"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              URL slug
            </label>
            <input
              id="ag-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
              placeholder="under-13s"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="ag-day"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Day
              </label>
              <select
                id="ag-day"
                value={day}
                onChange={(e) => setDay(e.target.value as Day)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d === 'saturday' ? 'Saturday' : 'Sunday'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="ag-order"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Display order
              </label>
              <input
                id="ag-order"
                type="number"
                step="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="ag-gender"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Gender{' '}
                <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                id="ag-gender"
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Mixed / Girls / Boys"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
            <div>
              <label
                htmlFor="ag-skill"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Skill level{' '}
                <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                id="ag-skill"
                type="text"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                placeholder="Club / Performance"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex-1 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md bg-mk-red px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-mk-red-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
