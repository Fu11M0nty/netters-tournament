import type { Match, StandingRow, Team } from './types'

export type ForfeitReason = 'no_show' | 'late'

export function forfeitSide(match: Match): {
  side: 'home' | 'away' | null
  reason: ForfeitReason | null
} {
  if (match.home_no_show) return { side: 'home', reason: 'no_show' }
  if (match.away_no_show) return { side: 'away', reason: 'no_show' }
  if (match.home_late_minutes >= 4) return { side: 'home', reason: 'late' }
  if (match.away_late_minutes >= 4) return { side: 'away', reason: 'late' }
  return { side: null, reason: null }
}

export function pointsForMatch(
  homeScore: number,
  awayScore: number
): { home: number; away: number } {
  if (homeScore === awayScore) return { home: 3, away: 3 }
  const homeWon = homeScore > awayScore
  const winnerScore = homeWon ? homeScore : awayScore
  const loserScore = homeWon ? awayScore : homeScore
  const loserBonus = loserScore * 2 > winnerScore ? 1 : 0
  return homeWon
    ? { home: 5, away: loserBonus }
    : { home: loserBonus, away: 5 }
}

export function calculateStandings(
  teams: Team[],
  matches: Match[]
): StandingRow[] {
  const stats = new Map<
    string,
    {
      team: Team
      played: number
      won: number
      drawn: number
      lost: number
      goals_for: number
      goals_against: number
      points: number
    }
  >()

  for (const team of teams) {
    stats.set(team.id, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goals_for: 0,
      goals_against: 0,
      points: 0,
    })
  }

  for (const match of matches) {
    if (match.status !== 'completed') continue
    if (match.home_score === null || match.away_score === null) continue

    const home = stats.get(match.home_team_id)
    const away = stats.get(match.away_team_id)
    if (!home || !away) continue

    const { side: forfeitedSide } = forfeitSide(match)
    const adjustedHome =
      forfeitedSide !== null
        ? match.home_score
        : match.home_score - 2 * match.home_late_minutes
    const adjustedAway =
      forfeitedSide !== null
        ? match.away_score
        : match.away_score - 2 * match.away_late_minutes

    home.played += 1
    away.played += 1
    home.goals_for += adjustedHome
    home.goals_against += adjustedAway
    away.goals_for += adjustedAway
    away.goals_against += adjustedHome

    const pts = pointsForMatch(adjustedHome, adjustedAway)
    home.points += pts.home
    away.points += pts.away

    if (adjustedHome === adjustedAway) {
      home.drawn += 1
      away.drawn += 1
    } else if (adjustedHome > adjustedAway) {
      home.won += 1
      away.lost += 1
    } else {
      away.won += 1
      home.lost += 1
    }
  }

  for (const match of matches) {
    const home = stats.get(match.home_team_id)
    const away = stats.get(match.away_team_id)
    if (home && match.home_umpire_no_show) home.points -= 1
    if (away && match.away_umpire_no_show) away.points -= 1
  }

  const rows = Array.from(stats.values()).map((s) => {
    const goal_difference = s.goals_for - s.goals_against
    return {
      team: s.team,
      played: s.played,
      won: s.won,
      drawn: s.drawn,
      lost: s.lost,
      goals_for: s.goals_for,
      goals_against: s.goals_against,
      goal_difference,
      points: s.points,
    }
  })

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goal_difference !== a.goal_difference)
      return b.goal_difference - a.goal_difference
    if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for
    return a.team.name.localeCompare(b.team.name)
  })

  return rows.map((row, i) => ({ position: i + 1, ...row }))
}
