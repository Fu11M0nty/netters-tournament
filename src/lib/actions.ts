'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { ensureRoundRobinMatches } from './matches'

export async function regenerateUnplannedFixtures(ageGroupId: string) {
  const cookieStore = await cookies()

  // Initialize Supabase Server Client securely for the Server Action
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Ignore if called from a context where cookies cannot be set
          }
        },
      },
    }
  )

  // Step 1: Delete ONLY the unplanned & scheduled matches for this age group
  const { error: deleteError } = await supabase
    .from('matches')
    .delete()
    .eq('age_group_id', ageGroupId)
    .eq('status', 'scheduled')
    .eq('is_planned', false)

  if (deleteError) {
    return { success: false, error: deleteError.message }
  }

  // Step 2: Recreate the fixtures using the updated Circle Method algorithm
  const { created, error: createError } = await ensureRoundRobinMatches(supabase as any, ageGroupId)

  if (createError) {
    return { success: false, error: createError }
  }

  // Step 3: Refresh the admin view so the UI instantly updates with the new fixtures
  revalidatePath('/admin')

  return { success: true, created }
}