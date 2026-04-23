import { forfeitSide, pointsForMatch } from '@/lib/standings'
import TeamLogo from './TeamLogo'
import { formatKickoffTime } from '@/lib/time'
import type { Match, Team } from '@/lib/types'

interface ResultCardProps {
  match: Match
  homeTeam: Team
  awayTeam: Team
}

function formatKickoff(iso: string): string {
  return formatKickoffTime(iso)
}

function PointsChip({ points }: { points: number }) {
  const base =
    'inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide tabular-nums'
  const tone =
    points >= 5
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
      : points > 0
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
        : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
  const prefix = points > 0 ? '+' : points < 0 ? '−' : ''
  const magnitude = Math.abs(points)
  return (
    <span
      aria-label={`${points} ${Math.abs(points) === 1 ? 'point' : 'points'} awarded`}
      className={`${base} ${tone}`}
    >
      {prefix}
      {magnitude} pt{magnitude === 1 ? '' : 's'}
    </span>
  )
}

function PenaltyBadges({
  lateMinutes,
  umpireNoShow,
  forfeitNoShow,
  forfeitLate,
}: {
  lateMinutes: number
  umpireNoShow: boolean
  forfeitNoShow: boolean
  forfeitLate: boolean
}) {
  if (
    lateMinutes <= 0 &&
    !umpireNoShow &&
    !forfeitNoShow &&
    !forfeitLate
  )
    return null
  const base =
    'inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide tabular-nums'
  return (
    <div className="mt-1 flex flex-wrap justify-center gap-1">
      {forfeitNoShow && (
        <span
          title="Team did not turn up — match forfeited 10-0"
          className={`${base} bg-red-600 text-white`}
        >
          Forfeit · no show
        </span>
      )}
      {forfeitLate && (
        <span
          title={`Team was ${lateMinutes} minutes late — match forfeited 10-0`}
          className={`${base} bg-red-600 text-white`}
        >
          Forfeit · {lateMinutes}+ min late
        </span>
      )}
      {!forfeitLate && !forfeitNoShow && lateMinutes > 0 && (
        <span
          title={`Conceded ${lateMinutes * 2} goals for arriving ${lateMinutes} min late`}
          className={`${base} bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300`}
        >
          −{lateMinutes * 2} goals · {lateMinutes} min late
        </span>
      )}
      {umpireNoShow && (
        <span
          title="−1 point deduction: team did not provide an umpire"
          className={`${base} bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300`}
        >
          −1 pt · no umpire
        </span>
      )}
    </div>
  )
}

export default function ResultCard({
  match,
  homeTeam,
  awayTeam,
}: ResultCardProps) {
  const homeRaw = match.home_score ?? 0
  const awayRaw = match.away_score ?? 0
  const forfeit = forfeitSide(match)
  const isForfeit = forfeit.side !== null
  const homeAdjusted = isForfeit
    ? homeRaw
    : homeRaw - 2 * match.home_late_minutes
  const awayAdjusted = isForfeit
    ? awayRaw
    : awayRaw - 2 * match.away_late_minutes
  const homeLateApplied = !isForfeit && match.home_late_minutes > 0
  const awayLateApplied = !isForfeit && match.away_late_minutes > 0
  const homeWon = homeAdjusted > awayAdjusted
  const awayWon = awayAdjusted > homeAdjusted
  const basePoints = pointsForMatch(homeAdjusted, awayAdjusted)
  const points = {
    home: basePoints.home - (match.home_umpire_no_show ? 1 : 0),
    away: basePoints.away - (match.away_umpire_no_show ? 1 : 0),
  }

  const winnerScoreClass = 'text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tabular-nums'
  const loserScoreClass = 'text-2xl font-semibold text-zinc-400 dark:text-zinc-600 tabular-nums'

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 px-4 pt-4 pb-3 sm:gap-4">
        {/* Home */}
        <div className="flex min-w-0 flex-col items-center gap-2 text-center">
          <TeamLogo team={homeTeam} size="md" />
          <div className="w-full min-w-0">
            <p
              className={
                homeWon
                  ? 'line-clamp-2 break-words text-sm font-bold leading-tight text-zinc-900 dark:text-zinc-50'
                  : 'line-clamp-2 break-words text-sm font-medium leading-tight text-zinc-600 dark:text-zinc-400'
              }
              title={homeTeam.name}
            >
              {homeTeam.name}
            </p>
            <div className="mt-1 flex justify-center">
              <PointsChip points={points.home} />
            </div>
            <PenaltyBadges
              lateMinutes={match.home_late_minutes}
              umpireNoShow={match.home_umpire_no_show}
              forfeitNoShow={match.home_no_show}
              forfeitLate={forfeit.side === 'home' && forfeit.reason === 'late'}
            />
          </div>
        </div>

        {/* Score */}
        <div className="flex shrink-0 items-center gap-2 self-center px-2">
          <div className="flex flex-col items-center">
            {homeLateApplied && (
              <span className="text-xs font-medium text-zinc-400 line-through tabular-nums dark:text-zinc-600">
                {homeRaw}
              </span>
            )}
            <span className={homeWon ? winnerScoreClass : loserScoreClass}>
              {homeAdjusted}
            </span>
          </div>
          <span className="self-center text-base text-zinc-300 dark:text-zinc-700">
            –
          </span>
          <div className="flex flex-col items-center">
            {awayLateApplied && (
              <span className="text-xs font-medium text-zinc-400 line-through tabular-nums dark:text-zinc-600">
                {awayRaw}
              </span>
            )}
            <span className={awayWon ? winnerScoreClass : loserScoreClass}>
              {awayAdjusted}
            </span>
          </div>
        </div>

        {/* Away */}
        <div className="flex min-w-0 flex-col items-center gap-2 text-center">
          <TeamLogo team={awayTeam} size="md" />
          <div className="w-full min-w-0">
            <p
              className={
                awayWon
                  ? 'line-clamp-2 break-words text-sm font-bold leading-tight text-zinc-900 dark:text-zinc-50'
                  : 'line-clamp-2 break-words text-sm font-medium leading-tight text-zinc-600 dark:text-zinc-400'
              }
              title={awayTeam.name}
            >
              {awayTeam.name}
            </p>
            <div className="mt-1 flex justify-center">
              <PointsChip points={points.away} />
            </div>
            <PenaltyBadges
              lateMinutes={match.away_late_minutes}
              umpireNoShow={match.away_umpire_no_show}
              forfeitNoShow={match.away_no_show}
              forfeitLate={forfeit.side === 'away' && forfeit.reason === 'late'}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-zinc-100 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-500 dark:border-zinc-900 dark:bg-zinc-900/50 dark:text-zinc-400">
        {isForfeit ? (
          <span className="inline-flex items-center gap-1 font-semibold text-red-700 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Forfeit · {forfeit.reason === 'no_show' ? 'no show' : '4+ min late'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Full time
          </span>
        )}
        <span aria-hidden="true">·</span>
        <span>{formatKickoff(match.kickoff_time)}</span>
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
