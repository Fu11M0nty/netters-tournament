import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { Tournament } from '@/lib/types'

export const dynamic = 'force-dynamic'

const STATUS_TONE: Record<Tournament['status'], string> = {
  live: 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900',
  upcoming:
    'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900',
  complete:
    'bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800',
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return ''
  const opts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/London',
  }
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('en-GB', opts).format(new Date(iso))
  if (!end || end === start) return fmt(start)
  return `${fmt(start)} – ${fmt(end)}`
}

export default async function Hub() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('tournaments')
    .select('*')
    .order('display_order', { ascending: true })
    .order('start_date', { ascending: false })

  const tournaments = (data ?? []) as Tournament[]

  return (
    <main className="mx-auto w-full max-w-4xl pb-16">
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
            MK Netters &amp; MK Dons
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Tournaments
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
            Pick a tournament to see standings, results and fixtures.
          </p>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6">
        {tournaments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-mk-ink/15 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
            No tournaments yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tournaments.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/${t.slug}`}
                  className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-mk-ink/15 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-mk-red hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${STATUS_TONE[t.status]}`}
                    >
                      {t.status}
                    </span>
                    <h2 className="mt-3 text-xl font-extrabold tracking-tight text-mk-ink dark:text-zinc-50">
                      {t.name}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {formatDateRange(t.start_date, t.end_date) || '—'}
                    </p>
                  </div>
                  <span className="inline-flex items-center text-xs font-semibold text-mk-red">
                    Open tournament
                    <span
                      aria-hidden="true"
                      className="ml-1 transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
