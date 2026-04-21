const LONDON = 'Europe/London'

export function formatKickoffTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: LONDON,
  })
}

export function formatKickoffDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }
): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    ...opts,
    timeZone: LONDON,
  })
}

function londonParts(iso: string): Record<string, string> {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: LONDON,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(iso))
  const out: Record<string, string> = {}
  for (const p of parts) if (p.type !== 'literal') out[p.type] = p.value
  if (out.hour === '24') out.hour = '00'
  return out
}

export function getLondonTimeHHmm(iso: string): string {
  const p = londonParts(iso)
  return `${p.hour}:${p.minute}`
}

export function buildIsoFromLondonTime(originalIso: string, hhmm: string): string {
  const p = londonParts(originalIso)
  const year = Number(p.year)
  const month = Number(p.month)
  const day = Number(p.day)
  const [h, m] = hhmm.split(':').map(Number)

  for (const offsetHours of [1, 0, -1]) {
    const candidate = new Date(
      Date.UTC(year, month - 1, day, h - offsetHours, m)
    )
    const lp = londonParts(candidate.toISOString())
    if (
      Number(lp.year) === year &&
      Number(lp.month) === month &&
      Number(lp.day) === day &&
      Number(lp.hour) === h &&
      Number(lp.minute) === m
    ) {
      return candidate.toISOString()
    }
  }
  return new Date(Date.UTC(year, month - 1, day, h, m)).toISOString()
}
