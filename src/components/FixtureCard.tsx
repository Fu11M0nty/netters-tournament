import TeamLogo from './TeamLogo'
import type { Match, Team } from '@/lib/types'

interface FixtureCardProps {
  match: Match
  homeTeam: Team
  awayTeam: Team
}

function formatKickoff(iso: string): { time: string; date: string } {
  const d = new Date(iso)
  return {
    time: d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    date: d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }),
  }
}

export default function FixtureCard({
  match,
  homeTeam,
  awayTeam,
}: FixtureCardProps) {
  const { time, date } = formatKickoff(match.kickoff_time)

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 px-4 pt-4 pb-3 sm:gap-4">
        {/* Home */}
        <div className="flex min-w-0 flex-col items-center gap-2 text-center">
          <TeamLogo team={homeTeam} size="md" />
          <p
            className="w-full min-w-0 line-clamp-2 break-words text-sm font-medium leading-tight text-zinc-700 dark:text-zinc-300"
            title={homeTeam.name}
          >
            {homeTeam.name}
          </p>
        </div>

        {/* vs / kickoff */}
        <div className="flex shrink-0 flex-col items-center gap-0.5 self-center px-2">
          <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {time}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            vs
          </span>
        </div>

        {/* Away */}
        <div className="flex min-w-0 flex-col items-center gap-2 text-center">
          <TeamLogo team={awayTeam} size="md" />
          <p
            className="w-full min-w-0 line-clamp-2 break-words text-sm font-medium leading-tight text-zinc-700 dark:text-zinc-300"
            title={awayTeam.name}
          >
            {awayTeam.name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-zinc-100 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-500 dark:border-zinc-900 dark:bg-zinc-900/50 dark:text-zinc-400">
        <span>{date}</span>
        {match.court && (
          <>
            <span aria-hidden="true">·</span>
            <span>{match.court}</span>
          </>
        )}
      </div>
    </article>
  )
}
