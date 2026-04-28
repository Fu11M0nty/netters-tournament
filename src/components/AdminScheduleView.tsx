'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import {
  buildIsoFromLondonTime,
  formatKickoffTime,
  getLondonTimeHHmm,
} from '@/lib/time'
import type { AgeGroup, Day, Match, Team, Tournament } from '@/lib/types'

const DAY_START_HHMM = '08:00'
const SLOT_MINUTES = 5
const TOTAL_SLOTS = 108 // 08:00 → 17:00
const SLOT_PX = 20
const COLUMN_WIDTH_PX = 200
const DEFAULT_BACK_TO_BACK_MIN = 20
const BACK_TO_BACK_KEY = 'mk-admin-b2b-minutes'

interface ColorTheme {
  bg: string
  bgDark: string
  border: string
  text: string
  textDark: string
  dot: string
}

const AGE_GROUP_PALETTE: ColorTheme[] = [
  {
    bg: 'bg-sky-100',
    bgDark: 'dark:bg-sky-950/60',
    border: 'border-sky-400 dark:border-sky-700',
    text: 'text-sky-900',
    textDark: 'dark:text-sky-200',
    dot: 'bg-sky-500',
  },
  {
    bg: 'bg-amber-100',
    bgDark: 'dark:bg-amber-950/60',
    border: 'border-amber-400 dark:border-amber-700',
    text: 'text-amber-900',
    textDark: 'dark:text-amber-200',
    dot: 'bg-amber-500',
  },
  {
    bg: 'bg-emerald-100',
    bgDark: 'dark:bg-emerald-950/60',
    border: 'border-emerald-400 dark:border-emerald-700',
    text: 'text-emerald-900',
    textDark: 'dark:text-emerald-200',
    dot: 'bg-emerald-500',
  },
  {
    bg: 'bg-violet-100',
    bgDark: 'dark:bg-violet-950/60',
    border: 'border-violet-400 dark:border-violet-700',
    text: 'text-violet-900',
    textDark: 'dark:text-violet-200',
    dot: 'bg-violet-500',
  },
  {
    bg: 'bg-rose-100',
    bgDark: 'dark:bg-rose-950/60',
    border: 'border-rose-400 dark:border-rose-700',
    text: 'text-rose-900',
    textDark: 'dark:text-rose-200',
    dot: 'bg-rose-500',
  },
  {
    bg: 'bg-cyan-100',
    bgDark: 'dark:bg-cyan-950/60',
    border: 'border-cyan-400 dark:border-cyan-700',
    text: 'text-cyan-900',
    textDark: 'dark:text-cyan-200',
    dot: 'bg-cyan-500',
  },
  {
    bg: 'bg-fuchsia-100',
    bgDark: 'dark:bg-fuchsia-950/60',
    border: 'border-fuchsia-400 dark:border-fuchsia-700',
    text: 'text-fuchsia-900',
    textDark: 'dark:text-fuchsia-200',
    dot: 'bg-fuchsia-500',
  },
  {
    bg: 'bg-lime-100',
    bgDark: 'dark:bg-lime-950/60',
    border: 'border-lime-400 dark:border-lime-700',
    text: 'text-lime-900',
    textDark: 'dark:text-lime-200',
    dot: 'bg-lime-500',
  },
]

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function minutesToHHMM(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const DAY_START_MIN = hhmmToMinutes(DAY_START_HHMM)

function slotIndexFromIso(iso: string): number {
  const hhmm = getLondonTimeHHmm(iso)
  const minutes = hhmmToMinutes(hhmm)
  const idx = Math.floor((minutes - DAY_START_MIN) / SLOT_MINUTES)
  return Math.max(0, Math.min(TOTAL_SLOTS - 1, idx))
}

function minutesFromIso(iso: string): number {
  return hhmmToMinutes(getLondonTimeHHmm(iso))
}

function hhmmFromSlotIndex(idx: number): string {
  return minutesToHHMM(DAY_START_MIN + idx * SLOT_MINUTES)
}

function dateForDay(t: Tournament, day: Day): string | null {
  if (day === 'saturday') return t.start_date
  return t.end_date ?? t.start_date
}

interface AdminScheduleViewProps {
  tournament: Tournament
  ageGroups: AgeGroup[]
  onClose: () => void
  onTournamentChanged: () => void
}

interface MatchWithMeta extends Match {
  homeName: string
  awayName: string
  groupName: string
  groupDay: Day
  groupColor: ColorTheme
}

interface LaneAssignment {
  lane: number
  totalLanes: number
}

function assignLanes(
  matches: MatchWithMeta[]
): Map<string, LaneAssignment> {
  // For each court, sweep by start time; find first lane that's free.
  const result = new Map<string, LaneAssignment>()
  const sorted = [...matches].sort((a, b) => {
    const aStart = a.kickoff_time ? minutesFromIso(a.kickoff_time) : 0
    const bStart = b.kickoff_time ? minutesFromIso(b.kickoff_time) : 0
    return aStart - bStart
  })

  let cluster: { match: MatchWithMeta; start: number; end: number }[] = []
  let clusterMaxEnd = -1

  function flushCluster() {
    if (cluster.length === 0) return
    const laneEnds: number[] = []
    const laneAssignments: number[] = []
    for (const c of cluster) {
      let lane = laneEnds.findIndex((end) => end <= c.start)
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(c.end)
      } else {
        laneEnds[lane] = c.end
      }
      laneAssignments.push(lane)
    }
    const totalLanes = laneEnds.length
    cluster.forEach((c, i) => {
      result.set(c.match.id, { lane: laneAssignments[i], totalLanes })
    })
    cluster = []
    clusterMaxEnd = -1
  }

  for (const m of sorted) {
    if (!m.kickoff_time) continue
    const start = minutesFromIso(m.kickoff_time)
    const end = start + Math.max(m.duration_minutes, 1)
    if (cluster.length === 0) {
      cluster = [{ match: m, start, end }]
      clusterMaxEnd = end
      continue
    }
    if (start >= clusterMaxEnd) {
      flushCluster()
      cluster = [{ match: m, start, end }]
      clusterMaxEnd = end
      continue
    }
    cluster.push({ match: m, start, end })
    clusterMaxEnd = Math.max(clusterMaxEnd, end)
  }
  flushCluster()
  return result
}

export default function AdminScheduleView({
  tournament,
  ageGroups,
  onClose,
  onTournamentChanged,
}: AdminScheduleViewProps) {
  const supabase = createClient()
  const [day, setDay] = useState<Day>('saturday')
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showCourtsEditor, setShowCourtsEditor] = useState(false)
  const [courtsDraft, setCourtsDraft] = useState<string>(
    tournament.courts.join('\n')
  )
  const [savingCourts, setSavingCourts] = useState(false)
  const [savingLock, setSavingLock] = useState(false)
  const [backToBackMin, setBackToBackMin] = useState<number>(
    DEFAULT_BACK_TO_BACK_MIN
  )
  const [b2bLoaded, setB2bLoaded] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      setB2bLoaded(true)
      return
    }
    try {
      const stored = window.localStorage.getItem(BACK_TO_BACK_KEY)
      if (stored !== null) {
        const n = Number(stored)
        if (Number.isFinite(n) && n >= 0) setBackToBackMin(n)
      }
    } catch {
      // ignore quota / unavailable storage errors
    }
    setB2bLoaded(true)
  }, [])

  useEffect(() => {
    if (!b2bLoaded) return
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(BACK_TO_BACK_KEY, String(backToBackMin))
    } catch {
      // ignore
    }
  }, [backToBackMin, b2bLoaded])

  const ageGroupIds = useMemo(() => ageGroups.map((g) => g.id), [ageGroups])

  // Stable color map keyed by age group id.
  const groupColorMap = useMemo(() => {
    const map = new Map<string, ColorTheme>()
    const sorted = [...ageGroups].sort(
      (a, b) =>
        a.day.localeCompare(b.day) ||
        a.display_order - b.display_order ||
        a.name.localeCompare(b.name)
    )
    sorted.forEach((g, i) => {
      map.set(g.id, AGE_GROUP_PALETTE[i % AGE_GROUP_PALETTE.length])
    })
    return map
  }, [ageGroups])

  const groupById = useMemo(() => {
    const m = new Map<string, AgeGroup>()
    for (const g of ageGroups) m.set(g.id, g)
    return m
  }, [ageGroups])

  const teamById = useMemo(() => {
    const m = new Map<string, Team>()
    for (const t of teams) m.set(t.id, t)
    return m
  }, [teams])

  const load = useCallback(async () => {
    if (ageGroupIds.length === 0) {
      setMatches([])
      setTeams([])
      setLoading(false)
      return
    }
    setLoading(true)
    const [m, t] = await Promise.all([
      supabase.from('matches').select('*').in('age_group_id', ageGroupIds),
      supabase.from('teams').select('*').in('age_group_id', ageGroupIds),
    ])
    if (m.error) toast.error(`Could not load matches: ${m.error.message}`)
    if (t.error) toast.error(`Could not load teams: ${t.error.message}`)
    setMatches((m.data ?? []) as Match[])
    setTeams((t.data ?? []) as Team[])
    setLoading(false)
  }, [supabase, ageGroupIds])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setCourtsDraft(tournament.courts.join('\n'))
  }, [tournament.courts])

  const courts =
    tournament.courts.length > 0
      ? tournament.courts
      : ['Court 1', 'Court 2', 'Court 3', 'Court 4', 'Court 5']

  const enriched: MatchWithMeta[] = useMemo(() => {
    return matches
      .map((m) => {
        const g = groupById.get(m.age_group_id)
        const home = teamById.get(m.home_team_id)
        const away = teamById.get(m.away_team_id)
        if (!g || !home || !away) return null
        return {
          ...m,
          homeName: home.name,
          awayName: away.name,
          groupName: g.name,
          groupDay: g.day,
          groupColor:
            groupColorMap.get(g.id) ?? AGE_GROUP_PALETTE[0],
        }
      })
      .filter((m): m is MatchWithMeta => m !== null)
      .filter((m) => m.groupDay === day)
  }, [matches, groupById, teamById, groupColorMap, day])

  const planned = useMemo(
    () => enriched.filter((m) => m.is_planned && m.kickoff_time),
    [enriched]
  )
  const unplanned = useMemo(
    () => enriched.filter((m) => !m.is_planned),
    [enriched]
  )

  // Court clash: same (court, kickoff_time) on this day appears in 2+ matches.
  const courtClashIds = useMemo(() => {
    const byKey = new Map<string, string[]>()
    for (const m of planned) {
      if (!m.court || !m.kickoff_time) continue
      const key = `${m.court}|${m.kickoff_time}`
      const arr = byKey.get(key) ?? []
      arr.push(m.id)
      byKey.set(key, arr)
    }
    const out = new Set<string>()
    for (const arr of byKey.values()) {
      if (arr.length > 1) arr.forEach((id) => out.add(id))
    }
    return out
  }, [planned])

  // Back-to-back: same team in two matches with start-to-start gap < threshold.
  const backToBackIds = useMemo(() => {
    if (backToBackMin <= 0) return new Set<string>()
    const byTeam = new Map<string, MatchWithMeta[]>()
    for (const m of planned) {
      for (const tid of [m.home_team_id, m.away_team_id]) {
        const arr = byTeam.get(tid) ?? []
        arr.push(m)
        byTeam.set(tid, arr)
      }
    }
    const flagged = new Set<string>()
    for (const list of byTeam.values()) {
      const sorted = [...list].sort((a, b) => {
        const aT = a.kickoff_time ? minutesFromIso(a.kickoff_time) : 0
        const bT = b.kickoff_time ? minutesFromIso(b.kickoff_time) : 0
        return aT - bT
      })
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1]
        const curr = sorted[i]
        if (!prev.kickoff_time || !curr.kickoff_time) continue
        const gap =
          minutesFromIso(curr.kickoff_time) - minutesFromIso(prev.kickoff_time)
        if (gap >= 0 && gap < backToBackMin) {
          flagged.add(prev.id)
          flagged.add(curr.id)
        }
      }
    }
    return flagged
  }, [planned, backToBackMin])

  // Lane assignments per court.
  const lanesByCourt = useMemo(() => {
    const map = new Map<string, Map<string, LaneAssignment>>()
    for (const court of courts) {
      const courtMatches = planned.filter((m) => m.court === court)
      map.set(court, assignLanes(courtMatches))
    }
    return map
  }, [planned, courts])

  // Legend: only show age groups that have at least one match this day.
  const legend = useMemo(() => {
    const ids = new Set(enriched.map((m) => m.age_group_id))
    return ageGroups
      .filter((g) => ids.has(g.id))
      .filter((g) => g.day === day)
      .sort((a, b) => a.display_order - b.display_order)
  }, [ageGroups, enriched, day])

  const activeMatch = activeId
    ? enriched.find((m) => m.id === activeId) ?? null
    : null

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    if (tournament.schedule_locked) {
      toast.error('Schedule is locked')
      return
    }
    const { active, over } = event
    if (!over) return
    const matchId = active.id as string
    const match = enriched.find((m) => m.id === matchId)
    if (!match) return

    const overId = over.id as string

    if (overId === 'unplanned') {
      if (!match.is_planned) return
      const { error, data } = await supabase
        .from('matches')
        .update({ is_planned: false })
        .eq('id', matchId)
        .select()
      if (error) {
        toast.error(`Could not unplan: ${error.message}`)
        return
      }
      if (!data || data.length === 0) {
        toast.error('Update blocked by RLS')
        return
      }
      await load()
      return
    }

    if (overId.startsWith('slot:')) {
      const [, courtName, slotIdxStr] = overId.split(':')
      const slotIdx = Number(slotIdxStr)
      if (!courtName || Number.isNaN(slotIdx)) return
      const hhmm = hhmmFromSlotIndex(slotIdx)
      const baseDate = dateForDay(tournament, day)
      const baseIso =
        match.kickoff_time && match.is_planned
          ? match.kickoff_time
          : baseDate
            ? `${baseDate}T08:00:00.000Z`
            : new Date().toISOString()
      const newIso = buildIsoFromLondonTime(baseIso, hhmm)

      const { error, data } = await supabase
        .from('matches')
        .update({
          is_planned: true,
          court: courtName,
          kickoff_time: newIso,
        })
        .eq('id', matchId)
        .select()
      if (error) {
        toast.error(`Could not move: ${error.message}`)
        return
      }
      if (!data || data.length === 0) {
        toast.error('Update blocked by RLS')
        return
      }
      await load()
    }
  }

  async function handleToggleLock() {
    setSavingLock(true)
    const { error, data } = await supabase
      .from('tournaments')
      .update({ schedule_locked: !tournament.schedule_locked })
      .eq('id', tournament.id)
      .select()
    setSavingLock(false)
    if (error) {
      toast.error(`Could not change lock: ${error.message}`)
      return
    }
    if (!data || data.length === 0) {
      toast.error('Update blocked by RLS')
      return
    }
    toast.success(
      tournament.schedule_locked ? 'Schedule unlocked' : 'Schedule locked'
    )
    onTournamentChanged()
  }

  async function handleSaveCourts() {
    const list = courtsDraft
      .split(/\n+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
    setSavingCourts(true)
    const { error, data } = await supabase
      .from('tournaments')
      .update({ courts: list })
      .eq('id', tournament.id)
      .select()
    setSavingCourts(false)
    if (error) {
      toast.error(`Could not save courts: ${error.message}`)
      return
    }
    if (!data || data.length === 0) {
      toast.error('Update blocked by RLS')
      return
    }
    toast.success('Courts saved')
    setShowCourtsEditor(false)
    onTournamentChanged()
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Schedule — {tournament.name}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Back-to-back &lt;
            <input
              type="number"
              min={0}
              max={120}
              step={1}
              value={backToBackMin}
              onChange={(e) => {
                const n = Number(e.target.value)
                setBackToBackMin(Number.isFinite(n) && n >= 0 ? n : 0)
              }}
              className="w-14 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs tabular-nums text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            min
          </label>
          <button
            type="button"
            onClick={() => setShowCourtsEditor((s) => !s)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {showCourtsEditor ? 'Hide courts' : 'Manage courts'}
          </button>
          <button
            type="button"
            onClick={handleToggleLock}
            disabled={savingLock}
            className={
              tournament.schedule_locked
                ? 'rounded-md border border-amber-400 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200'
                : 'rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'
            }
          >
            {tournament.schedule_locked ? '🔒 Locked' : '🔓 Unlocked'}
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

      {showCourtsEditor && (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Courts (one per line)
          </p>
          <textarea
            value={courtsDraft}
            onChange={(e) => setCourtsDraft(e.target.value)}
            rows={6}
            spellCheck={false}
            className="w-full max-w-md rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-xs text-zinc-900 shadow-sm focus:border-mk-red focus:outline-none focus:ring-1 focus:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            placeholder="Court 1&#10;Court 2&#10;Court 3"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleSaveCourts}
              disabled={savingCourts}
              className="rounded-md bg-mk-red px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-mk-red-dark disabled:opacity-60"
            >
              {savingCourts ? 'Saving…' : 'Save courts'}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {(['saturday', 'sunday'] as Day[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDay(d)}
            className={
              d === day
                ? 'rounded-md bg-mk-red px-3 py-1.5 text-sm font-semibold text-white shadow-sm'
                : 'rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'
            }
          >
            {d === 'saturday' ? 'Saturday' : 'Sunday'}
          </button>
        ))}
      </div>

      {legend.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-950">
          <span className="font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Age groups
          </span>
          {legend.map((g) => {
            const c = groupColorMap.get(g.id) ?? AGE_GROUP_PALETTE[0]
            return (
              <span
                key={g.id}
                className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300"
              >
                <span className={`inline-block h-3 w-3 rounded-sm ${c.dot}`} />
                {g.name}
              </span>
            )
          })}
          <span className="ml-auto inline-flex flex-wrap items-center gap-3 text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-red-200 ring-1 ring-red-500" />
              Court clash
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-amber-200 ring-1 ring-amber-500" />
              Back-to-back &lt; {backToBackMin} min
            </span>
          </span>
        </div>
      )}

      {loading ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          Loading…
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={(e: DragStartEvent) => setActiveId(e.active.id as string)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="flex gap-3">
            <UnplannedColumn
              matches={unplanned}
              locked={tournament.schedule_locked}
            />
            <ScheduleGrid
              courts={courts}
              matches={planned}
              lanesByCourt={lanesByCourt}
              courtClashIds={courtClashIds}
              backToBackIds={backToBackIds}
              locked={tournament.schedule_locked}
            />
          </div>
          <DragOverlay>
            {activeMatch ? (
              <div style={{ width: COLUMN_WIDTH_PX - 16 }}>
                <MatchCard match={activeMatch} dragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}

function UnplannedColumn({
  matches,
  locked,
}: {
  matches: MatchWithMeta[]
  locked: boolean
}) {
  const { isOver, setNodeRef } = useDroppable({ id: 'unplanned' })
  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col rounded-lg border ${
        isOver
          ? 'border-mk-red bg-mk-red/5'
          : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950'
      }`}
    >
      <header className="border-b border-zinc-200 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        Unplanned · {matches.length}
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {matches.length === 0 ? (
          <p className="rounded border border-dashed border-zinc-300 p-3 text-center text-xs text-zinc-400 dark:border-zinc-700">
            Drag matches here to take them out of the schedule.
          </p>
        ) : (
          matches.map((m) => (
            <DraggableMatch key={m.id} match={m} locked={locked} />
          ))
        )}
      </div>
    </div>
  )
}

function ScheduleGrid({
  courts,
  matches,
  lanesByCourt,
  courtClashIds,
  backToBackIds,
  locked,
}: {
  courts: string[]
  matches: MatchWithMeta[]
  lanesByCourt: Map<string, Map<string, LaneAssignment>>
  courtClashIds: Set<string>
  backToBackIds: Set<string>
  locked: boolean
}) {
  return (
    <div className="flex-1 overflow-x-auto rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950">
      <div className="relative flex" style={{ minHeight: TOTAL_SLOTS * SLOT_PX + 32 }}>
        {/* Time axis */}
        <div className="sticky left-0 z-10 w-12 shrink-0 border-r border-zinc-200 bg-zinc-50 text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <div className="h-8 border-b border-zinc-200 dark:border-zinc-800" />
          <div className="relative" style={{ height: TOTAL_SLOTS * SLOT_PX }}>
            {Array.from({ length: 19 }).map((_, i) => {
              const minutes = DAY_START_MIN + i * 30
              const top = (i * 30 * SLOT_PX) / SLOT_MINUTES
              return (
                <div
                  key={i}
                  className="absolute right-1 -translate-y-1/2 tabular-nums"
                  style={{ top }}
                >
                  {minutesToHHMM(minutes)}
                </div>
              )
            })}
          </div>
        </div>

        {/* Court columns */}
        {courts.map((court) => {
          const courtMatches = matches.filter((m) => m.court === court)
          const lanes = lanesByCourt.get(court) ?? new Map()
          return (
            <div
              key={court}
              className="border-r border-zinc-200 dark:border-zinc-800"
              style={{ width: COLUMN_WIDTH_PX }}
            >
              <header className="sticky top-0 z-10 h-8 border-b border-zinc-200 bg-zinc-50 px-2 text-center text-xs font-semibold leading-8 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                {court}
              </header>
              <CourtColumnDroppable
                court={court}
                matches={courtMatches}
                lanes={lanes}
                courtClashIds={courtClashIds}
                backToBackIds={backToBackIds}
                locked={locked}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CourtColumnDroppable({
  court,
  matches,
  lanes,
  courtClashIds,
  backToBackIds,
  locked,
}: {
  court: string
  matches: MatchWithMeta[]
  lanes: Map<string, LaneAssignment>
  courtClashIds: Set<string>
  backToBackIds: Set<string>
  locked: boolean
}) {
  return (
    <div className="relative" style={{ height: TOTAL_SLOTS * SLOT_PX }}>
      {Array.from({ length: TOTAL_SLOTS }).map((_, idx) => {
        const isHalfHour = (DAY_START_MIN + idx * SLOT_MINUTES) % 30 === 0
        return (
          <SlotCell
            key={idx}
            court={court}
            slotIndex={idx}
            isHalfHour={isHalfHour}
          />
        )
      })}
      {matches.map((m) => {
        if (!m.kickoff_time) return null
        const slot = slotIndexFromIso(m.kickoff_time)
        const top = slot * SLOT_PX
        const height = Math.max(
          (m.duration_minutes / SLOT_MINUTES) * SLOT_PX,
          SLOT_PX * 2
        )
        const lane = lanes.get(m.id) ?? { lane: 0, totalLanes: 1 }
        const widthPct = 100 / lane.totalLanes
        const leftPct = lane.lane * widthPct
        return (
          <DraggableMatch
            key={m.id}
            match={m}
            locked={locked}
            courtClash={courtClashIds.has(m.id)}
            backToBack={backToBackIds.has(m.id)}
            style={{
              position: 'absolute',
              top,
              left: `calc(${leftPct}% + 2px)`,
              width: `calc(${widthPct}% - 4px)`,
              height,
            }}
          />
        )
      })}
    </div>
  )
}

function SlotCell({
  court,
  slotIndex,
  isHalfHour,
}: {
  court: string
  slotIndex: number
  isHalfHour: boolean
}) {
  const id = `slot:${court}:${slotIndex}`
  const { isOver, setNodeRef } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={
        isOver
          ? 'absolute w-full bg-mk-red/20'
          : isHalfHour
            ? 'absolute w-full border-t border-zinc-200 dark:border-zinc-800'
            : 'absolute w-full'
      }
      style={{
        top: slotIndex * SLOT_PX,
        height: SLOT_PX,
      }}
    />
  )
}

function DraggableMatch({
  match,
  locked,
  courtClash = false,
  backToBack = false,
  style,
}: {
  match: MatchWithMeta
  locked: boolean
  courtClash?: boolean
  backToBack?: boolean
  style?: React.CSSProperties
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: match.id,
    disabled: locked,
  })
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        opacity: isDragging ? 0.4 : 1,
        cursor: locked ? 'not-allowed' : 'grab',
        touchAction: 'none',
        overflow: 'hidden',
      }}
    >
      <MatchCard
        match={match}
        courtClash={courtClash}
        backToBack={backToBack}
      />
    </div>
  )
}

function MatchCard({
  match,
  dragging = false,
  courtClash = false,
  backToBack = false,
}: {
  match: MatchWithMeta
  dragging?: boolean
  courtClash?: boolean
  backToBack?: boolean
}) {
  const c = match.groupColor
  const completed = match.status === 'completed'
  const borderClass = courtClash
    ? 'border-2 border-red-500 dark:border-red-500'
    : backToBack
      ? 'border-2 border-amber-500 dark:border-amber-500'
      : `border ${c.border}`
  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-md px-1.5 py-0.5 text-[11px] shadow-sm ${c.bg} ${c.bgDark} ${borderClass} ${c.text} ${c.textDark} ${
        dragging ? 'rotate-1 ring-2 ring-mk-red/50' : ''
      }`}
      title={[
        `${match.groupName}: ${match.homeName} vs ${match.awayName}`,
        match.is_planned && match.kickoff_time
          ? `Kickoff ${formatKickoffTime(match.kickoff_time)} · ${match.duration_minutes} min`
          : 'Unplanned',
        match.court ? `Court: ${match.court}` : '',
        completed ? 'Completed' : '',
        courtClash ? 'Court clash with another fixture' : '',
        backToBack ? 'Back-to-back match for one of these teams' : '',
      ]
        .filter(Boolean)
        .join(' — ')}
    >
      {(courtClash || backToBack) && (
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-1 ${courtClash ? 'bg-red-500' : 'bg-amber-500'}`}
        />
      )}
      {(courtClash || backToBack) && (
        <span
          className={`absolute right-0.5 top-0.5 z-10 inline-flex items-center gap-0.5 rounded-sm px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide leading-none text-white ${courtClash ? 'bg-red-600' : 'bg-amber-600'}`}
        >
          ⚠ {courtClash ? 'Clash' : 'B2B'}
        </span>
      )}
      <p className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide opacity-80">
        <span className="truncate">{match.groupName}</span>
        {match.is_planned && match.kickoff_time && (
          <span className="ml-1 shrink-0 tabular-nums">
            {formatKickoffTime(match.kickoff_time)}
          </span>
        )}
      </p>
      <p className="truncate font-semibold leading-tight">
        {match.homeName} <span className="opacity-60">vs</span> {match.awayName}
      </p>
    </div>
  )
}
