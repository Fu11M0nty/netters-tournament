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
const SLOT_PX = 16
const COLUMN_WIDTH_PX = 160

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const ageGroupIds = useMemo(
    () => ageGroups.map((g) => g.id),
    [ageGroups]
  )

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
        }
      })
      .filter((m): m is MatchWithMeta => m !== null)
      .filter((m) => m.groupDay === day)
  }, [matches, groupById, teamById, day])

  const planned = useMemo(
    () => enriched.filter((m) => m.is_planned),
    [enriched]
  )
  const unplanned = useMemo(
    () => enriched.filter((m) => !m.is_planned),
    [enriched]
  )

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
    toast.success(tournament.schedule_locked ? 'Schedule unlocked' : 'Schedule locked')
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
        <div className="flex items-center gap-2">
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
              locked={tournament.schedule_locked}
            />
          </div>
          <DragOverlay>
            {activeMatch ? <MatchCard match={activeMatch} dragging /> : null}
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
  locked,
}: {
  courts: string[]
  matches: MatchWithMeta[]
  locked: boolean
}) {
  return (
    <div className="flex-1 overflow-x-auto rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950">
      <div
        className="relative flex"
        style={{ height: TOTAL_SLOTS * SLOT_PX + 32 }}
      >
        {/* Time axis */}
        <div className="sticky left-0 z-10 w-12 shrink-0 border-r border-zinc-200 bg-zinc-50 text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <div className="h-8 border-b border-zinc-200 dark:border-zinc-800" />
          <div className="relative" style={{ height: TOTAL_SLOTS * SLOT_PX }}>
            {Array.from({ length: 18 }).map((_, i) => {
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
  locked,
}: {
  court: string
  matches: MatchWithMeta[]
  locked: boolean
}) {
  return (
    <div
      className="relative"
      style={{ height: TOTAL_SLOTS * SLOT_PX }}
    >
      {/* Slot grid background + droppable cells */}
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
      {/* Match cards */}
      {matches.map((m) => {
        if (!m.kickoff_time) return null
        const slot = slotIndexFromIso(m.kickoff_time)
        const top = slot * SLOT_PX
        const height = Math.max(
          (m.duration_minutes / SLOT_MINUTES) * SLOT_PX,
          SLOT_PX * 2
        )
        return (
          <DraggableMatch
            key={m.id}
            match={m}
            locked={locked}
            style={{
              position: 'absolute',
              top,
              left: 4,
              right: 4,
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
  style,
}: {
  match: MatchWithMeta
  locked: boolean
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
      }}
    >
      <MatchCard match={match} />
    </div>
  )
}

function MatchCard({
  match,
  dragging = false,
}: {
  match: MatchWithMeta
  dragging?: boolean
}) {
  const completed = match.status === 'completed'
  const baseColor = completed
    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200'
    : 'border-mk-red/40 bg-mk-red-soft text-mk-ink dark:border-mk-red/60 dark:bg-mk-red/20 dark:text-zinc-50'
  return (
    <div
      className={`overflow-hidden rounded-md border px-2 py-1 text-[11px] shadow-sm ${baseColor} ${
        dragging ? 'rotate-1 ring-2 ring-mk-red/50' : ''
      }`}
    >
      <p className="truncate text-[10px] font-semibold uppercase tracking-wide opacity-70">
        {match.groupName}
        {match.is_planned && match.kickoff_time
          ? ` · ${formatKickoffTime(match.kickoff_time)}`
          : ''}
      </p>
      <p className="truncate font-semibold">{match.homeName}</p>
      <p className="truncate font-semibold">vs {match.awayName}</p>
    </div>
  )
}
