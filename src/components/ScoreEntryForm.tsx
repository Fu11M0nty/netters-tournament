'use client'

import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import type { Match, MatchStatus, Team } from '@/lib/types'

interface ScoreEntryFormProps {
  match: Match
  homeTeam: Team
  awayTeam: Team
  ageGroupName: string
  onSave: () => void
  onCancel: () => void
}

function toLocalTimeValue(iso: string): string {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function formatLocalDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function buildIsoFromTime(originalIso: string, hhmm: string): string {
  const d = new Date(originalIso)
  const [h, m] = hhmm.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

export default function ScoreEntryForm({
  match,
  homeTeam,
  awayTeam,
  ageGroupName,
  onSave,
  onCancel,
}: ScoreEntryFormProps) {
  const originalTime = useMemo(() => toLocalTimeValue(match.kickoff_time), [match.kickoff_time])
  const originalCourt = match.court ?? ''

  const [homeScore, setHomeScore] = useState<string>(
    match.home_score !== null ? String(match.home_score) : ''
  )
  const [awayScore, setAwayScore] = useState<string>(
    match.away_score !== null ? String(match.away_score) : ''
  )
  const [status, setStatus] = useState<MatchStatus>(match.status)
  const [kickoffTime, setKickoffTime] = useState<string>(originalTime)
  const [court, setCourt] = useState<string>(originalCourt)
  const [confirmScheduleChange, setConfirmScheduleChange] = useState(false)
  const [saving, setSaving] = useState(false)

  const scheduleChanged =
    kickoffTime !== originalTime || court.trim() !== originalCourt.trim()

  const submitDisabled =
    saving ||
    homeScore.trim() === '' ||
    awayScore.trim() === '' ||
    kickoffTime.trim() === '' ||
    (scheduleChanged && !confirmScheduleChange)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const home = Number(homeScore)
    const away = Number(awayScore)
    if (
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0
    ) {
      toast.error('Scores must be non-negative whole numbers.')
      return
    }

    if (!/^\d{2}:\d{2}$/.test(kickoffTime)) {
      toast.error('Kickoff time must be in HH:MM format.')
      return
    }

    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('matches')
      .update({
        home_score: home,
        away_score: away,
        status,
        kickoff_time: buildIsoFromTime(match.kickoff_time, kickoffTime),
        court: court.trim() === '' ? null : court.trim(),
      })
      .eq('id', match.id)

    setSaving(false)

    if (error) {
      toast.error(`Could not save: ${error.message}`)
      return
    }

    toast.success(scheduleChanged ? 'Match updated (schedule changed)' : 'Score saved')
    onSave()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="score-entry-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-mk-red dark:text-mk-red">
            {ageGroupName}
          </p>
          <h2
            id="score-entry-title"
            className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-50"
          >
            {homeTeam.name} vs {awayTeam.name}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {formatLocalDate(match.kickoff_time)}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="home-score"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {homeTeam.name}
              </label>
              <input
                id="home-score"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base tabular-nums text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
            <div>
              <label
                htmlFor="away-score"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {awayTeam.name}
              </label>
              <input
                id="away-score"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base tabular-nums text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as MatchStatus)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Schedule
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="kickoff-time"
                  className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Kickoff time
                </label>
                <input
                  id="kickoff-time"
                  type="time"
                  value={kickoffTime}
                  onChange={(e) => setKickoffTime(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm tabular-nums text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </div>
              <div>
                <label
                  htmlFor="court"
                  className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Court
                </label>
                <input
                  id="court"
                  type="text"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  placeholder="e.g. Court 1"
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </div>
            </div>

            {scheduleChanged && (
              <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200">
                <p className="font-semibold">Schedule change detected</p>
                <p className="mt-1">
                  Changing the time or court may clash with other fixtures on
                  the same court or leave a team double-booked. Confirm the
                  change is intentional before saving.
                </p>
                <label className="mt-2 flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={confirmScheduleChange}
                    onChange={(e) => setConfirmScheduleChange(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-amber-400 text-mk-red focus:ring-mk-red"
                  />
                  <span>I have checked for conflicts and want to apply this change.</span>
                </label>
              </div>
            )}
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
              disabled={submitDisabled}
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
