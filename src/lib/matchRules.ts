import type { AgeGroup, MatchFormat } from './types'

interface MatchRules {
  match_format: MatchFormat
  period_minutes: number
  break_q1_q2_minutes: number
  break_half_time_minutes: number
  break_q3_q4_minutes: number
}

export function totalMatchMinutes(rules: MatchRules): number {
  if (rules.match_format === 'continuous') return rules.period_minutes
  if (rules.match_format === 'halves') {
    return 2 * rules.period_minutes + rules.break_half_time_minutes
  }
  return (
    4 * rules.period_minutes +
    rules.break_q1_q2_minutes +
    rules.break_half_time_minutes +
    rules.break_q3_q4_minutes
  )
}

export function describeMatchRules(g: AgeGroup): string {
  const total = totalMatchMinutes(g)
  if (g.match_format === 'continuous') {
    return `${g.period_minutes} min straight`
  }
  if (g.match_format === 'halves') {
    return `2 × ${g.period_minutes} + ${g.break_half_time_minutes} HT (${total} min total)`
  }
  return `4 × ${g.period_minutes} + breaks ${g.break_q1_q2_minutes}/${g.break_half_time_minutes}/${g.break_q3_q4_minutes} (${total} min total)`
}
