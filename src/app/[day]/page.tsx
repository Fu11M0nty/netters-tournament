import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import NotFoundMessage from '@/components/NotFoundMessage'

interface Props {
  params: Promise<{ day: string }>
}

export default async function DayPage({ params }: Props) {
  const { day } = await params

  if (day !== 'saturday' && day !== 'sunday') {
    return <NotFoundMessage title="Day not found" />
  }

  const supabase = await createServerSupabaseClient()
  const { data: ageGroups } = await supabase
    .from('age_groups')
    .select('*')
    .eq('day', day)
    .order('display_order', { ascending: true })

  if (!ageGroups || ageGroups.length === 0) {
    return <NotFoundMessage title="No groups available" />
  }

  redirect(`/${day}/${ageGroups[0].slug}`)
}
