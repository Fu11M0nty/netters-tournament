'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import type { Court, Day } from '@/lib/types'

interface CourtEditFormProps {
  mode: 'create' | 'edit'
  tournamentId: string
  day: Day
  court?: Court
  defaultDisplayOrder?: number
  onSaved: () => void
  onCancel: () => void
}

export default function CourtEditForm({
  mode,
  tournamentId,
  day,
  court,
  defaultDisplayOrder,
  onSaved,
  onCancel,
}: CourtEditFormProps) {
  const [name, setName] = useState(court?.name ?? '')
  const [displayOrder, setDisplayOrder] = useState<string>(
    String(court?.display_order ?? defaultDisplayOrder ?? 1)
  )
  const [startTime, setStartTime] = useState(court?.start_time ?? '08:00')
  const [endTime, setEndTime] = useState(court?.end_time ?? '17:00')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('Court name is required.')
      return
    }
    if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
      toast.error('Start and end times must be HH:MM.')
      return
    }
    if (endTime <= startTime) {
      toast.error('End time must be after start time.')
      return
    }
    const order = Number(displayOrder)
    if (!Number.isInteger(order)) {
      toast.error('Display order must be a whole number.')
      return
    }

    const payload = {
      tournament_id: tournamentId,
      day: court?.day ?? day,
      name: trimmed,
      display_order: order,
      start_time: startTime,
      end_time: endTime,
    }

    setSaving(true)
    const { data, error } =
      mode === 'create'
        ? await supabase.from('courts').insert(payload).select()
        : await supabase
            .from('courts')
            .update(payload)
            .eq('id', court!.id)
            .select()
    setSaving(false)

    if (error) {
      toast.error(`Could not save: ${error.message}`)
      return
    }
    if (!data || data.length === 0) {
      toast.error(
        mode === 'create'
          ? 'Insert blocked by RLS — check courts_auth_insert policy.'
          : 'Update blocked by RLS — check courts_auth_update policy.'
      )
      return
    }
    toast.success(mode === 'create' ? 'Court created' : 'Court saved')
    onSaved()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="court-edit-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-mk-red">
            {(court?.day ?? day) === 'saturday' ? 'Saturday' : 'Sunday'}
          </p>
          <h2
            id="court-edit-title"
            className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-50"
          >
            {mode === 'create' ? 'New court' : 'Edit court'}
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="court-name"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Court name
            </label>
            <input
              id="court-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Court 1"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div>
            <label
              htmlFor="court-order"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Display order
            </label>
            <input
              id="court-order"
              type="number"
              step="1"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TimeField
              id="court-start"
              label="Start time"
              value={startTime}
              onChange={setStartTime}
            />
            <TimeField
              id="court-end"
              label="End time"
              value={endTime}
              onChange={setEndTime}
            />
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

function clampInt(value: string, min: number, max: number, fallback: number): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(min, Math.min(max, Math.trunc(n)))
}

function TimeField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [hh = '08', mm = '00'] = value.split(':')

  const inputClass =
    'w-full rounded-md border border-zinc-300 bg-white px-2 py-2 text-center text-sm tabular-nums text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50'

  return (
    <div>
      <label
        htmlFor={`${id}-hh`}
        className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <div className="flex items-center gap-1">
        <input
          id={`${id}-hh`}
          type="number"
          min={0}
          max={23}
          step={1}
          value={hh}
          onChange={(e) => {
            const next = String(clampInt(e.target.value, 0, 23, 0)).padStart(2, '0')
            onChange(`${next}:${mm}`)
          }}
          className={inputClass}
          aria-label={`${label} hour`}
          inputMode="numeric"
        />
        <span className="text-zinc-500" aria-hidden="true">
          :
        </span>
        <input
          type="number"
          min={0}
          max={59}
          step={5}
          value={mm}
          onChange={(e) => {
            const next = String(clampInt(e.target.value, 0, 59, 0)).padStart(2, '0')
            onChange(`${hh}:${next}`)
          }}
          className={inputClass}
          aria-label={`${label} minute`}
          inputMode="numeric"
        />
      </div>
    </div>
  )
}
