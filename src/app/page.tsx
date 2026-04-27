import { createServerSupabaseClient } from '@/lib/supabase'
import { calculateStandings } from '@/lib/standings'
import MiniStandings from '@/components/MiniStandings'
import type { AgeGroup, Day, Match, Team } from '@/lib/types'

export const dynamic = 'force-dynamic'

const DAY_LABEL: Record<Day, string> = {
  saturday: 'Saturday · 25 Apr 2026',
  sunday: 'Sunday · 26 Apr 2026',
}

export default async function Home() {
  const supabase = await createServerSupabaseClient()

  const [groupsRes, teamsRes, matchesRes] = await Promise.all([
    supabase
      .from('age_groups')
      .select('*')
      .order('display_order', { ascending: true }),
    supabase.from('teams').select('*'),
    supabase.from('matches').select('*'),
  ])

  const groups: AgeGroup[] = groupsRes.data ?? []
  const teams: Team[] = teamsRes.data ?? []
  const matches: Match[] = matchesRes.data ?? []

  const teamsByGroup = new Map<string, Team[]>()
  for (const t of teams) {
    const arr = teamsByGroup.get(t.age_group_id) ?? []
    arr.push(t)
    teamsByGroup.set(t.age_group_id, arr)
  }
  const matchesByGroup = new Map<string, Match[]>()
  for (const m of matches) {
    const arr = matchesByGroup.get(m.age_group_id) ?? []
    arr.push(m)
    matchesByGroup.set(m.age_group_id, arr)
  }

  const totalGroups = groups.length
  const totalTeams = teams.length
  const totalMatches = matches.length
  const playedMatches = matches.filter((m) => m.status === 'completed').length

  const days: Day[] = ['saturday', 'sunday']

  return (
    <main className="mx-auto w-full max-w-6xl pb-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-mk-ink via-mk-ink-soft to-mk-ink text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mk-red/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-[-80px] h-64 w-64 rounded-full bg-mk-gold/20 blur-3xl"
        />
        <div className="relative px-4 pt-8 pb-10 sm:px-8 sm:pt-12 sm:pb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-mk-gold ring-1 ring-mk-gold/40 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-mk-gold" />
            Weekend Tournament
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            MK Netters{' '}
            <span className="text-mk-gold">&amp;</span>{' '}
            MK Dons 2026
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
            Live standings across every age group, both days. Tap any group to
            open its full table, results and fixtures.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-white/90 ring-1 ring-white/15">
              <span className="text-mk-gold">{totalGroups}</span> groups
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-white/90 ring-1 ring-white/15">
              <span className="text-mk-gold">{totalTeams}</span> teams
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-white/90 ring-1 ring-white/15">
              <span className="text-mk-gold">{playedMatches}</span> /{' '}
              {totalMatches} played
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {days.map((d) => (
              <a
                key={d}
                href={`#${d}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-white/20"
              >
                {d === 'saturday' ? 'Saturday' : 'Sunday'}
              </a>
            ))}
          </div>
        </div>
      </section>

      {days.map((d) => {
        const groupsForDay = groups.filter((g) => g.day === d)
        if (groupsForDay.length === 0) return null
        return (
          <section
            key={d}
            id={d}
            aria-labelledby={`${d}-heading`}
            className="px-4 pt-8 sm:px-6"
          >
            <header className="mb-4 flex items-center gap-3">
              <h2
                id={`${d}-heading`}
                className="text-xs font-extrabold uppercase tracking-[0.25em] text-mk-red"
              >
                {DAY_LABEL[d]}
              </h2>
              <span className="h-px flex-1 bg-mk-red/30" />
            </header>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupsForDay.map((g) => {
                const groupTeams = teamsByGroup.get(g.id) ?? []
                const groupMatches = matchesByGroup.get(g.id) ?? []
                const standings = calculateStandings(groupTeams, groupMatches)
                return (
                  <MiniStandings
                    key={g.id}
                    group={g}
                    standings={standings}
                    matches={groupMatches}
                  />
                )
              })}
            </div>
          </section>
        )
      })}
    </main>
  )
}
