'use client'

import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { parseCsv } from '@/lib/csv'
import type { AgeGroup, Team, Tournament } from '@/lib/types'

interface AdminImportProps {
  tournament: Tournament
  ageGroups: AgeGroup[]
  onClose: () => void
  onImported: () => void
}

type Mode = 'teams' | 'players'

interface TeamRow {
  name: string
  short_name?: string
  color?: string
  age_group_id: string
  rowNo: number
  errors: string[]
}

interface PlayerRow {
  name: string
  team_name: string
  team_id: string | null
  dob: string | null
  registration_no: string | null
  notes: string | null
  rowNo: number
  errors: string[]
}

const TEAM_TEMPLATE = 'name,short_name,color\nSparks U13,SPK,#e11d2d\nMK Netters,MKN,#0b1221\n'
const PLAYER_TEMPLATE =
  'name,team,dob,registration_no,notes\nJane Smith,Sparks U13,2010-05-12,EN-12345,\nAlex Lee,MK Netters,2010-09-03,EN-12346,Captain\n'

export default function AdminImport({
  tournament,
  ageGroups,
  onClose,
  onImported,
}: AdminImportProps) {
  const [mode, setMode] = useState<Mode>('teams')
  const [csvText, setCsvText] = useState('')
  const [targetAgeGroup, setTargetAgeGroup] = useState<string>(
    ageGroups[0]?.id ?? ''
  )
  const [teams, setTeams] = useState<Team[]>([])
  const [importing, setImporting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    let cancelled = false
    async function loadTeams() {
      const ageGroupIds = ageGroups.map((g) => g.id)
      if (ageGroupIds.length === 0) {
        setTeams([])
        return
      }
      const { data } = await supabase
        .from('teams')
        .select('*')
        .in('age_group_id', ageGroupIds)
      if (cancelled) return
      setTeams((data ?? []) as Team[])
    }
    loadTeams()
    return () => {
      cancelled = true
    }
  }, [supabase, ageGroups])

  const parsed = useMemo(() => {
    if (csvText.trim() === '') return null
    return parseCsv(csvText)
  }, [csvText])

  const teamsByName = useMemo(() => {
    const map = new Map<string, Team>()
    for (const t of teams) map.set(t.name.toLowerCase().trim(), t)
    return map
  }, [teams])

  const teamRows = useMemo<TeamRow[]>(() => {
    if (mode !== 'teams' || !parsed) return []
    return parsed.rows.map((row, i) => {
      const errors: string[] = []
      const name = row['name'] ?? ''
      if (!name) errors.push('Name is required')
      const color = row['color']?.trim() ?? ''
      if (color && !/^#[0-9a-fA-F]{6}$/.test(color)) {
        errors.push('Colour must be a #RRGGBB hex value')
      }
      if (!targetAgeGroup) errors.push('Select an age group above')
      return {
        name: name.trim(),
        short_name: row['short_name']?.trim() || undefined,
        color: color || undefined,
        age_group_id: targetAgeGroup,
        rowNo: i + 2,
        errors,
      }
    })
  }, [mode, parsed, targetAgeGroup])

  const playerRows = useMemo<PlayerRow[]>(() => {
    if (mode !== 'players' || !parsed) return []
    return parsed.rows.map((row, i) => {
      const errors: string[] = []
      const name = row['name']?.trim() ?? ''
      const team_name = row['team']?.trim() ?? ''
      if (!name) errors.push('Name is required')
      if (!team_name) errors.push('Team is required')
      const team = teamsByName.get(team_name.toLowerCase())
      if (team_name && !team) errors.push(`Team "${team_name}" not found`)
      const dob = row['dob']?.trim() || null
      if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        errors.push('DOB must be YYYY-MM-DD')
      }
      return {
        name,
        team_name,
        team_id: team?.id ?? null,
        dob,
        registration_no: row['registration_no']?.trim() || null,
        notes: row['notes']?.trim() || null,
        rowNo: i + 2,
        errors,
      }
    })
  }, [mode, parsed, teamsByName])

  const validTeamRows = teamRows.filter((r) => r.errors.length === 0)
  const validPlayerRows = playerRows.filter((r) => r.errors.length === 0)
  const teamErrorCount = teamRows.length - validTeamRows.length
  const playerErrorCount = playerRows.length - validPlayerRows.length

  async function handleImport() {
    if (mode === 'teams') {
      if (validTeamRows.length === 0) {
        toast.error('Nothing to import.')
        return
      }
      setImporting(true)
      const payload = validTeamRows.map((r) => ({
        name: r.name,
        short_name: r.short_name ?? null,
        color: r.color ?? null,
        age_group_id: r.age_group_id,
      }))
      const { data, error } = await supabase
        .from('teams')
        .insert(payload)
        .select()
      setImporting(false)
      if (error) {
        toast.error(`Import failed: ${error.message}`)
        return
      }
      if (!data || data.length === 0) {
        toast.error('Insert blocked by RLS. Check teams_auth_insert policy.')
        return
      }
      toast.success(`Imported ${data.length} team${data.length === 1 ? '' : 's'}`)
      setCsvText('')
      onImported()
      return
    }

    if (validPlayerRows.length === 0) {
      toast.error('Nothing to import.')
      return
    }
    setImporting(true)
    const payload = validPlayerRows.map((r) => ({
      team_id: r.team_id!,
      name: r.name,
      dob: r.dob,
      registration_no: r.registration_no,
      notes: r.notes,
    }))
    const { data, error } = await supabase
      .from('players')
      .insert(payload)
      .select()
    setImporting(false)
    if (error) {
      toast.error(`Import failed: ${error.message}`)
      return
    }
    if (!data || data.length === 0) {
      toast.error('Insert blocked by RLS. Check players_auth_insert policy.')
      return
    }
    toast.success(
      `Imported ${data.length} player${data.length === 1 ? '' : 's'}`
    )
    setCsvText('')
    onImported()
  }

  const headerHint =
    mode === 'teams'
      ? 'name (required) · short_name · color (#RRGGBB)'
      : 'name (required) · team (required, must match an existing team in this tournament) · dob (YYYY-MM-DD) · registration_no · notes'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Bulk import — {tournament.name}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Close
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Import mode"
        className="inline-flex rounded-md border border-zinc-300 bg-white p-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        {(['teams', 'players'] as Mode[]).map((m) => {
          const active = mode === m
          return (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setMode(m)
                setCsvText('')
              }}
              className={
                active
                  ? 'rounded bg-mk-red px-3 py-1 text-xs font-semibold text-white'
                  : 'rounded px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }
            >
              {m === 'teams' ? 'Teams' : 'Players'}
            </button>
          )
        })}
      </div>

      {mode === 'teams' && (
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Target age group
          <select
            value={targetAgeGroup}
            onChange={(e) => setTargetAgeGroup(e.target.value)}
            className="mt-1 w-full max-w-sm rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          >
            {ageGroups.length === 0 && <option value="">No age groups</option>}
            {ageGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.day === 'saturday' ? 'Sat' : 'Sun'} · {g.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
        <p className="font-semibold">Expected columns</p>
        <p className="mt-1">{headerHint}</p>
        <button
          type="button"
          onClick={() =>
            setCsvText(mode === 'teams' ? TEAM_TEMPLATE : PLAYER_TEMPLATE)
          }
          className="mt-2 rounded-md border border-zinc-300 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
        >
          Load example
        </button>
      </div>

      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        CSV
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          rows={10}
          spellCheck={false}
          placeholder="Paste CSV here (first row must be the header)"
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-xs text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      {parsed && (
        <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {mode === 'teams' ? 'Teams' : 'Players'} preview ·{' '}
              {parsed.rows.length} row{parsed.rows.length === 1 ? '' : 's'}
            </span>
            {(mode === 'teams' ? teamErrorCount : playerErrorCount) > 0 && (
              <span className="text-red-700 dark:text-red-400">
                {(mode === 'teams' ? teamErrorCount : playerErrorCount)} row
                {(mode === 'teams' ? teamErrorCount : playerErrorCount) === 1
                  ? ''
                  : 's'}{' '}
                will be skipped
              </span>
            )}
          </div>
          <div className="max-h-72 overflow-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-zinc-50 text-left dark:bg-zinc-900">
                <tr>
                  <th className="px-2 py-1 font-semibold text-zinc-600 dark:text-zinc-400">
                    Row
                  </th>
                  <th className="px-2 py-1 font-semibold text-zinc-600 dark:text-zinc-400">
                    Status
                  </th>
                  {mode === 'teams' ? (
                    <>
                      <th className="px-2 py-1 font-semibold">Name</th>
                      <th className="px-2 py-1 font-semibold">Short</th>
                      <th className="px-2 py-1 font-semibold">Colour</th>
                    </>
                  ) : (
                    <>
                      <th className="px-2 py-1 font-semibold">Name</th>
                      <th className="px-2 py-1 font-semibold">Team</th>
                      <th className="px-2 py-1 font-semibold">DOB</th>
                      <th className="px-2 py-1 font-semibold">Reg #</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {(mode === 'teams' ? teamRows : playerRows).map((r, i) => (
                  <tr
                    key={i}
                    className={
                      r.errors.length > 0
                        ? 'bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200'
                        : 'odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-950 dark:even:bg-zinc-900/40'
                    }
                  >
                    <td className="px-2 py-1 tabular-nums">{r.rowNo}</td>
                    <td className="px-2 py-1">
                      {r.errors.length > 0 ? r.errors.join(' · ') : 'OK'}
                    </td>
                    {mode === 'teams' ? (
                      <>
                        <td className="px-2 py-1">{(r as TeamRow).name}</td>
                        <td className="px-2 py-1">
                          {(r as TeamRow).short_name ?? ''}
                        </td>
                        <td className="px-2 py-1 font-mono">
                          {(r as TeamRow).color ?? ''}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-1">{(r as PlayerRow).name}</td>
                        <td className="px-2 py-1">
                          {(r as PlayerRow).team_name}
                        </td>
                        <td className="px-2 py-1 tabular-nums">
                          {(r as PlayerRow).dob ?? ''}
                        </td>
                        <td className="px-2 py-1 font-mono">
                          {(r as PlayerRow).registration_no ?? ''}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleImport}
          disabled={
            importing ||
            (mode === 'teams' ? validTeamRows.length : validPlayerRows.length) === 0
          }
          className="rounded-md bg-mk-red px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-mk-red-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {importing
            ? 'Importing…'
            : mode === 'teams'
              ? `Import ${validTeamRows.length} team${validTeamRows.length === 1 ? '' : 's'}`
              : `Import ${validPlayerRows.length} player${validPlayerRows.length === 1 ? '' : 's'}`}
        </button>
      </div>
    </div>
  )
}
