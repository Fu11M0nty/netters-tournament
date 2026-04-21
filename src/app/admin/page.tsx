'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AdminMatchList from '@/components/AdminMatchList'
import AdminTeamList from '@/components/AdminTeamList'
import AdminFixtureMatrix from '@/components/AdminFixtureMatrix'
import { createClient } from '@/lib/supabase'
import type { AgeGroup, Day, Match, Team } from '@/lib/types'

type AdminView = 'matches' | 'matrix' | 'teams'

const VIEW_LABELS: Record<AdminView, string> = {
  matches: 'Matches',
  matrix: 'Matrix',
  teams: 'Teams',
}

export default function AdminPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([])
  const [day, setDay] = useState<Day>('saturday')
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [dayMatches, setDayMatches] = useState<Match[]>([])
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [view, setView] = useState<AdminView>('matches')

  useEffect(() => {
    let cancelled = false
    async function loadGroups() {
      const { data, error } = await supabase
        .from('age_groups')
        .select('*')
        .order('display_order', { ascending: true })

      if (cancelled) return
      if (error) {
        toast.error(`Could not load age groups: ${error.message}`)
        setLoadingGroups(false)
        return
      }
      setAgeGroups(data ?? [])
      setLoadingGroups(false)
    }
    loadGroups()
    return () => {
      cancelled = true
    }
  }, [supabase])

  const groupsForDay = useMemo(
    () => ageGroups.filter((g) => g.day === day),
    [ageGroups, day]
  )

  useEffect(() => {
    if (groupsForDay.length === 0) {
      setCurrentGroupId(null)
      return
    }
    const stillValid = groupsForDay.some((g) => g.id === currentGroupId)
    if (!stillValid) {
      setCurrentGroupId(groupsForDay[0].id)
    }
  }, [groupsForDay, currentGroupId])

  const currentGroup = useMemo(
    () => ageGroups.find((g) => g.id === currentGroupId) ?? null,
    [ageGroups, currentGroupId]
  )

  const groupIdsForDay = useMemo(
    () => groupsForDay.map((g) => g.id),
    [groupsForDay]
  )

  const loadDayMatches = useCallback(async () => {
    if (groupIdsForDay.length === 0) {
      setDayMatches([])
      return
    }
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .in('age_group_id', groupIdsForDay)
    if (error) {
      toast.error(`Could not load day schedule: ${error.message}`)
      return
    }
    setDayMatches(data ?? [])
  }, [groupIdsForDay, supabase])

  useEffect(() => {
    loadDayMatches()
  }, [loadDayMatches])

  const loadMatches = useCallback(async () => {
    if (!currentGroupId) {
      setTeams([])
      setMatches([])
      return
    }
    setLoadingMatches(true)
    const [teamsRes, matchesRes] = await Promise.all([
      supabase
        .from('teams')
        .select('*')
        .eq('age_group_id', currentGroupId)
        .order('name', { ascending: true }),
      supabase
        .from('matches')
        .select('*')
        .eq('age_group_id', currentGroupId)
        .order('kickoff_time', { ascending: true }),
    ])

    if (teamsRes.error) {
      toast.error(`Could not load teams: ${teamsRes.error.message}`)
    }
    if (matchesRes.error) {
      toast.error(`Could not load matches: ${matchesRes.error.message}`)
    }

    setTeams(teamsRes.data ?? [])
    setMatches(matchesRes.data ?? [])
    setLoadingMatches(false)
  }, [currentGroupId, supabase])

  useEffect(() => {
    loadMatches()
  }, [loadMatches])

  const handleSaved = useCallback(async () => {
    await Promise.all([loadMatches(), loadDayMatches()])
  }, [loadMatches, loadDayMatches])

  async function handleSignOut() {
    setSigningOut(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(`Sign out failed: ${error.message}`)
      setSigningOut(false)
      return
    }
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-zinc-50 pb-16 dark:bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Admin console
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Enter and edit match scores
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </header>

      <nav
        aria-label="Tournament day"
        className="flex gap-2 border-b border-zinc-200 bg-white px-4 pt-3 dark:border-zinc-800 dark:bg-zinc-950"
      >
        {(['saturday', 'sunday'] as Day[]).map((d) => {
          const active = d === day
          return (
            <button
              key={d}
              type="button"
              onClick={() => setDay(d)}
              aria-current={active ? 'page' : undefined}
              className={
                active
                  ? 'inline-flex items-center justify-center rounded-t-lg bg-mk-red px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-sm'
                  : 'inline-flex items-center justify-center rounded-t-lg px-5 py-3 text-sm font-semibold tracking-wide text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
              }
            >
              {d === 'saturday' ? 'Saturday' : 'Sunday'}
            </button>
          )
        })}
      </nav>

      <nav
        aria-label="Age group"
        className="overflow-x-auto whitespace-nowrap border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      >
        {groupsForDay.length === 0 ? (
          <div className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
            {loadingGroups
              ? 'Loading age groups…'
              : 'No age groups scheduled for this day.'}
          </div>
        ) : (
          <ul className="flex w-max gap-1 px-4 py-2">
            {groupsForDay.map((group) => {
              const active = group.id === currentGroupId
              return (
                <li key={group.id} className="inline-block shrink-0">
                  <button
                    type="button"
                    onClick={() => setCurrentGroupId(group.id)}
                    aria-current={active ? 'page' : undefined}
                    className={
                      active
                        ? 'inline-block rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900'
                        : 'inline-block rounded-full px-4 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
                    }
                  >
                    {group.name}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </nav>

      <section className="px-4 pt-5">
        {currentGroup ? (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {currentGroup.name}
              </h2>
              <div
                role="tablist"
                aria-label="Admin view"
                className="inline-flex rounded-md border border-zinc-300 bg-white p-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                {(['matches', 'matrix', 'teams'] as AdminView[]).map((v) => {
                  const active = view === v
                  return (
                    <button
                      key={v}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setView(v)}
                      className={
                        active
                          ? 'rounded bg-mk-red px-3 py-1 text-xs font-semibold text-white'
                          : 'rounded px-3 py-1 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                      }
                    >
                      {VIEW_LABELS[v]}
                    </button>
                  )
                })}
              </div>
            </div>
            {loadingMatches ? (
              <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
                Loading…
              </p>
            ) : view === 'matches' ? (
              <AdminMatchList
                matches={matches}
                teams={teams}
                ageGroupName={currentGroup.name}
                onSaved={handleSaved}
              />
            ) : view === 'matrix' ? (
              <AdminFixtureMatrix
                teams={teams}
                matches={matches}
                dayMatches={dayMatches}
              />
            ) : (
              <AdminTeamList
                teams={teams}
                ageGroupName={currentGroup.name}
                onSaved={handleSaved}
              />
            )}
          </>
        ) : (
          !loadingGroups && (
            <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
              Select a day with scheduled age groups.
            </p>
          )
        )}
      </section>
    </main>
  )
}
