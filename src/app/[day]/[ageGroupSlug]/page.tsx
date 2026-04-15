import { createServerSupabaseClient } from '@/lib/supabase'
import TournamentView from '@/components/TournamentView'
import NotFoundMessage from '@/components/NotFoundMessage'
import type { AgeGroup, Day, Match, Team } from '@/lib/types'

interface Props {
  params: Promise<{ day: string; ageGroupSlug: string }>
  searchParams: Promise<{ team?: string | string[] }>
}

export default async function AgeGroupPage({ params, searchParams }: Props) {
  const { day, ageGroupSlug } = await params
  const { team: teamParam } = await searchParams
  const teamFilterId = typeof teamParam === 'string' ? teamParam : null

  if (day !== 'saturday' && day !== 'sunday') {
    return <NotFoundMessage title="Group not found" />
  }

  const supabase = await createServerSupabaseClient()

  const { data: allGroupsData } = await supabase
    .from('age_groups')
    .select('*')
    .order('display_order', { ascending: true })

  const allGroups: AgeGroup[] = allGroupsData ?? []
  const saturdayGroups = allGroups.filter((g) => g.day === 'saturday')
  const sundayGroups = allGroups.filter((g) => g.day === 'sunday')
  const ageGroupsForDay = day === 'saturday' ? saturdayGroups : sundayGroups

  const currentGroup = ageGroupsForDay.find((g) => g.slug === ageGroupSlug)

  if (!currentGroup) {
    return (
      <NotFoundMessage
        title="Group not found"
        description={`There is no "${ageGroupSlug}" age group on ${day === 'saturday' ? 'Saturday' : 'Sunday'}.`}
      />
    )
  }

  const [teamsRes, matchesRes] = await Promise.all([
    supabase
      .from('teams')
      .select('*')
      .eq('age_group_id', currentGroup.id)
      .order('name', { ascending: true }),
    supabase
      .from('matches')
      .select('*')
      .eq('age_group_id', currentGroup.id)
      .order('kickoff_time', { ascending: true }),
  ])

  const teams: Team[] = teamsRes.data ?? []
  const matches: Match[] = matchesRes.data ?? []

  return (
    <TournamentView
      day={day as Day}
      currentGroup={currentGroup}
      saturdayGroups={saturdayGroups}
      sundayGroups={sundayGroups}
      teams={teams}
      matches={matches}
      teamFilterId={teamFilterId}
    />
  )
}
