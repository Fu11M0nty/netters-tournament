'use client'

import { useState } from 'react'
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

function formatKickoff(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ScoreEntryForm({
  match,
  homeTeam,
  awayTeam,
  ageGroupName,
  onSave,
  onCancel,
}: ScoreEntryFormProps) {
  const [homeScore, setHomeScore] = useState<string>(
    match.home_score !== null ? String(match.home_score) : ''
  )
  const [awayScore, setAwayScore] = useState<string>(
    match.away_score !== null ? String(match.away_score) : ''
  )
  const [status, setStatus] = useState<MatchStatus>(match.status)
  const [saving, setSaving] = useState(false)

  const submitDisabled =
    saving || homeScore.trim() === '' || awayScore.trim() === ''

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

    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('matches')
      .update({
        home_score: home,
        away_score: away,
        status,
      })
      .eq('id', match.id)

    setSaving(false)

    if (error) {
      toast.error(`Could not save: ${error.message}`)
      return
    }

    toast.success('Score saved')
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
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
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
            {formatKickoff(match.kickoff_time)}
            {match.court ? ` | ${match.court}` : ''}
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
