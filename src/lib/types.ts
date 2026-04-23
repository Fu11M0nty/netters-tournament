export type Day = 'saturday' | 'sunday'

export interface AgeGroup {
  id: string
  name: string
  slug: string
  day: Day
  display_order: number
}

export interface Team {
  id: string
  name: string
  short_name: string | null
  color: string | null
  logo_url: string | null
  age_group_id: string
}

export type MatchStatus = 'scheduled' | 'completed'

export interface Match {
  id: string
  age_group_id: string
  home_team_id: string
  away_team_id: string
  home_score: number | null
  away_score: number | null
  court: string | null
  kickoff_time: string
  status: MatchStatus
  home_umpire_no_show: boolean
  away_umpire_no_show: boolean
}

export interface StandingRow {
  position: number
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
}
