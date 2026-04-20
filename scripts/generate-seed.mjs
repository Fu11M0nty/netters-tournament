// Generates supabase/seed_real.sql from the CSV schedule(s) in data/ and the
// canonical rosters below.
//
// Saturday: reads data/saturday_schedule.csv (organiser-created schedule).
// Sunday:   reads data/sunday_schedule.csv if present, otherwise falls back to
//           an auto-generated round-robin on a single court per age group.
//
// Run with: node scripts/generate-seed.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// ---------------------------------------------------------------------------
// Canonical rosters. CSV home/away names get normalised to these via the
// alias map below; anything not found is reported as an error.
// ---------------------------------------------------------------------------

const tournament = {
  saturday: {
    date: '2026-04-25',
    ageGroups: [
      {
        name: "Under 10's",
        displayOrder: 1,
        teams: [
          'MK Netters', 'AP Saints', 'Little Sutton Green', 'Turnford',
          'Hertford Hornets', 'Hatfield', 'Sarum Hall School',
        ],
      },
      {
        name: "Under 11's",
        displayOrder: 2,
        teams: [
          'MK Netters', 'Durham', 'Market Harborough Wildcats U11',
          'Little Sutton Green', 'Lyndon Centre Sapphires U11', 'Turnford',
          'Hertford Hornets', 'Norfolk United', 'Hatfield', 'Sparks',
        ],
      },
      {
        name: "Under 12's",
        displayOrder: 3,
        teams: [
          'MK Netters', 'Durham', 'Woodley', 'AP Saints', 'Little Sutton Ice',
          'Lyndon Centre Corals U12', 'BB U12 Stars', 'Marlow Kites', 'Swan',
          'Sparks',
        ],
      },
      {
        name: "Under 13's",
        displayOrder: 4,
        teams: [
          'MK Netters', 'Durham', 'AP Saints', 'BB U13 Sparklers', 'Rv Leapers',
          'Lyndon Centre Emeralds U13', 'Sparks', 'Norfolk United',
          'Olney Galaxy', 'Marlow Kites',
        ],
      },
      {
        name: "Under 14's",
        displayOrder: 5,
        teams: [
          'MK Netters', "JM's White", 'Durham', 'AP Saints', 'Barr Beacon',
          'MH Rockets', 'Lyndon Centre Gems U14', 'Norfolk United', 'Swan',
        ],
      },
      {
        name: "Under 15's",
        displayOrder: 6,
        teams: [
          'MK Netters', 'Durham', 'Market Harborough Lunars U15',
          'Lyndon Centre Crystals U15', 'Barr Beacon Blaze', 'Hatfield',
        ],
      },
    ],
  },
  sunday: {
    date: '2026-04-26',
    ageGroups: [
      {
        name: 'U12',
        displayOrder: 1,
        court: 'Court 1',
        start: '09:00',
        teams: [
          'MK Dons', 'Magic', 'Clan', 'Durham', 'AP Saints', 'Little Sutton',
          'Turnford Yellow',
        ],
      },
      {
        name: 'U13',
        displayOrder: 2,
        court: 'Court 2',
        start: '09:00',
        teams: [
          'MK Dons', 'Magic', 'Blaze Elite', 'Eagles', 'Real Beds', 'Poole',
          'Swan', 'AP Saints', 'Barr Beacon', 'Hatfield',
        ],
      },
      {
        name: 'U14',
        displayOrder: 3,
        court: 'Court 3',
        start: '09:00',
        teams: [
          'MK Dons', 'Magic', 'Turnford NC Black', 'Real Beds', 'Wodson Park',
          'Durham', 'AP Saints', 'Hatfield', 'Little Sutton',
        ],
      },
      {
        name: 'U15',
        displayOrder: 4,
        court: 'Court 4',
        start: '09:00',
        teams: [
          'MK Dons', 'Magic', 'Blaze Elite', 'Clan', 'Real Beds', 'Wodson Park',
          'Durham', 'Marlow Kites Wildcats', 'AP Saints', 'Swan',
        ],
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// Team-name alias map, keyed by canonical age-group name. Left side is the
// lower-cased CSV spelling, right side is the canonical roster name.
// ---------------------------------------------------------------------------

const ALIASES = {
  "Under 10's": {
    'sarum': 'Sarum Hall School',
  },
  "Under 11's": {
    'market h wildcats': 'Market Harborough Wildcats U11',
    'lyndon centre sapphires': 'Lyndon Centre Sapphires U11',
    'lyndon centres sapphires': 'Lyndon Centre Sapphires U11',
    'lundin centre sapphires': 'Lyndon Centre Sapphires U11',
    'hertford': 'Hertford Hornets',
  },
  "Under 12's": {
    'durhan': 'Durham',
    'little sutton ice': 'Little Sutton Ice',
    'lyndon corals': 'Lyndon Centre Corals U12',
    // CSV typo: "Lyndon Crystals" appears in U12 rows but no U12 Crystals
    // exists; organiser confirmed this was meant to be Corals.
    'lyndon crystals': 'Lyndon Centre Corals U12',
    'bb stars': 'BB U12 Stars',
  },
  "Under 13's": {
    'lyndon emeralds': 'Lyndon Centre Emeralds U13',
    'bb sparklers': 'BB U13 Sparklers',
    'rv leapers': 'Rv Leapers',
    'olney galxy': 'Olney Galaxy',
  },
  "Under 14's": {
    'jms white': "JM's White",
    'lyndon gems': 'Lyndon Centre Gems U14',
    'market h rockets': 'MH Rockets',
  },
  "Under 15's": {
    'duraham': 'Durham',
    'lyndon crystals': 'Lyndon Centre Crystals U15',
    'market h lunars': 'Market Harborough Lunars U15',
    'market h lunas': 'Market Harborough Lunars U15',
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function shortName(name) {
  const cleaned = name.replace(/'s\b/g, '').trim()
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase()
  let s = words.map((w) => w[0]).join('').toUpperCase()
  if (s.length > 5) s = s.slice(0, 5)
  return s
}

const PALETTE = [
  '#1d4ed8', '#f59e0b', '#dc2626', '#059669', '#7c3aed',
  '#0891b2', '#be185d', '#ea580c', '#1e40af', '#eab308',
]

function colorFor(name, idx) {
  const lower = name.toLowerCase()
  if (lower === 'mk netters') return '#e11d2d'
  if (lower === 'mk dons') return '#0b1221'
  return PALETTE[idx % PALETTE.length]
}

function pairs(n) {
  const out = []
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) out.push([i, j])
  }
  return out
}

function addMinutes(hhmm, mins) {
  const [h, m] = hhmm.split(':').map(Number)
  const total = h * 60 + m + mins
  const nh = Math.floor(total / 60)
  const nm = total % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

function esc(s) {
  return s.replace(/'/g, "''")
}

function parseDdmmyyyy(s) {
  // "25/04/2026 09:00" -> "2026-04-25 09:00:00+00"
  const [date, time] = s.trim().split(/\s+/)
  const [dd, mm, yyyy] = date.split('/')
  return `${yyyy}-${mm}-${dd} ${time}:00+00`
}

function parseCsv(text) {
  const rows = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
    .map((r) => r.trim())
    .filter(Boolean)
  const [header, ...body] = rows
  const cols = header.split(',').map((c) => c.trim().toLowerCase())
  const idx = {
    ageGroup: cols.indexOf('age group'),
    home: cols.indexOf('home team'),
    away: cols.indexOf('away team'),
    court: cols.indexOf('court number'),
    dt: cols.indexOf('date and time'),
  }
  for (const [k, v] of Object.entries(idx)) {
    if (v === -1) throw new Error(`CSV missing column: ${k}`)
  }
  return body.map((line, i) => {
    const parts = line.split(',').map((p) => p.trim())
    return {
      lineNo: i + 2, // 1-indexed incl header
      ageGroup: parts[idx.ageGroup],
      home: parts[idx.home],
      away: parts[idx.away],
      court: parts[idx.court],
      datetime: parts[idx.dt],
    }
  })
}

function normaliseTeam(ageGroup, raw, aliasLog) {
  const roster = tournament.saturday.ageGroups.find((g) => g.name === ageGroup)
  if (!roster) return null
  const exact = roster.teams.find((t) => t.toLowerCase() === raw.toLowerCase())
  if (exact) return exact
  const alias = ALIASES[ageGroup]?.[raw.toLowerCase()]
  if (alias) {
    aliasLog.push({ ageGroup, from: raw, to: alias })
    return alias
  }
  return null
}

// ---------------------------------------------------------------------------
// Build day structures
// ---------------------------------------------------------------------------

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')

const aliasLog = []
const issues = []

function loadDayFromCsv(day, csvPath) {
  const text = readFileSync(csvPath, 'utf8')
  const rows = parseCsv(text)

  const dayInfo = tournament[day]
  const groupsByName = Object.fromEntries(
    dayInfo.ageGroups.map((g) => [g.name, { ...g, matches: [] }])
  )

  for (const row of rows) {
    const g = groupsByName[row.ageGroup]
    if (!g) {
      issues.push(`line ${row.lineNo}: unknown age group "${row.ageGroup}"`)
      continue
    }
    const home = normaliseTeam(row.ageGroup, row.home, aliasLog)
    const away = normaliseTeam(row.ageGroup, row.away, aliasLog)
    if (!home) issues.push(`line ${row.lineNo} (${row.ageGroup}): unknown home team "${row.home}"`)
    if (!away) issues.push(`line ${row.lineNo} (${row.ageGroup}): unknown away team "${row.away}"`)
    if (!home || !away) continue
    if (home === away) {
      issues.push(`line ${row.lineNo} (${row.ageGroup}): ${home} vs itself`)
      continue
    }
    g.matches.push({
      home,
      away,
      court: row.court,
      kickoff: parseDdmmyyyy(row.datetime),
      kickoffRaw: row.datetime,
      lineNo: row.lineNo,
    })
  }

  // Per-group validation: round-robin completeness + duplicates
  for (const g of Object.values(groupsByName)) {
    const expected = new Set()
    for (let i = 0; i < g.teams.length; i++) {
      for (let j = i + 1; j < g.teams.length; j++) {
        const a = g.teams[i]
        const b = g.teams[j]
        const key = [a, b].sort().join(' | ')
        expected.add(key)
      }
    }
    const seen = new Map()
    for (const m of g.matches) {
      const key = [m.home, m.away].sort().join(' | ')
      seen.set(key, (seen.get(key) ?? 0) + 1)
    }
    for (const [key, count] of seen) {
      if (count > 1) {
        issues.push(`${day}/${g.name}: duplicate fixture ${key} (${count}x)`)
      }
      if (!expected.has(key)) {
        issues.push(`${day}/${g.name}: unexpected fixture ${key} (not in roster pairs)`)
      }
    }
    for (const key of expected) {
      if (!seen.has(key)) {
        issues.push(`${day}/${g.name}: missing fixture ${key}`)
      }
    }
  }

  // Court conflicts: only one match per (court, kickoff) across all groups.
  // (Teams are scoped to one age group per CLAUDE.md, so cross-group team
  // collisions aren't conflicts — the same club name is a different squad.)
  const courtSlots = new Map() // key: "court|kickoff" -> [entries]
  for (const g of Object.values(groupsByName)) {
    for (const m of g.matches) {
      const key = `${m.court}|${m.kickoff}`
      if (!courtSlots.has(key)) courtSlots.set(key, [])
      courtSlots.get(key).push({ group: g.name, home: m.home, away: m.away, line: m.lineNo })
    }
  }
  for (const [key, list] of courtSlots) {
    if (list.length > 1) {
      const [court, time] = key.split('|')
      issues.push(
        `${day}: court clash — ${court} @ ${time}: ` +
          list.map((x) => `${x.group} ${x.home} vs ${x.away} (line ${x.line})`).join(', ')
      )
    }
  }

  return groupsByName
}

function generateRoundRobinDay(day) {
  const dayInfo = tournament[day]
  const groupsByName = {}
  for (const g of dayInfo.ageGroups) {
    const fx = pairs(g.teams.length)
    const matches = fx.map(([i, j], idx) => ({
      home: g.teams[i],
      away: g.teams[j],
      court: g.court,
      kickoff: `${dayInfo.date} ${addMinutes(g.start, idx * 15)}:00+00`,
    }))
    groupsByName[g.name] = { ...g, matches }
  }
  return groupsByName
}

// Saturday from CSV
const saturdayCsv = resolve(repoRoot, 'data', 'saturday_schedule.csv')
if (!existsSync(saturdayCsv)) {
  console.error(`Missing ${saturdayCsv}`)
  process.exit(1)
}
const saturdayGroups = loadDayFromCsv('saturday', saturdayCsv)

// Sunday from CSV if present, else auto-generated
const sundayCsv = resolve(repoRoot, 'data', 'sunday_schedule.csv')
let sundayGroups
let sundaySource
if (existsSync(sundayCsv)) {
  sundayGroups = loadDayFromCsv('sunday', sundayCsv)
  sundaySource = 'CSV'
} else {
  sundayGroups = generateRoundRobinDay('sunday')
  sundaySource = 'auto (round-robin, one court per group, 15-min cadence)'
}

// ---------------------------------------------------------------------------
// Emit SQL
// ---------------------------------------------------------------------------

let sql = `-- =============================================================================
-- MK Netters & MK Dons tournament — generated seed data
--
-- Regenerate by editing scripts/generate-seed.mjs (rosters + aliases) and/or
-- data/saturday_schedule.csv / data/sunday_schedule.csv, then running:
--     node scripts/generate-seed.mjs
--
-- All fixtures are generated as 'scheduled' with null scores — the organiser
-- enters scores via /admin as matches complete.
--
-- If the database already has data you want replaced, uncomment the
-- truncate line below (run AFTER schema.sql).
-- =============================================================================

-- truncate matches, teams, age_groups restart identity cascade;

do $$
declare
`

// Build day -> groupsByName lookup in the order we want to emit
const bundle = { saturday: saturdayGroups, sunday: sundayGroups }

const vars = []
for (const day of ['saturday', 'sunday']) {
  for (const g of tournament[day].ageGroups) {
    const prefix = `${day.slice(0, 3)}${g.displayOrder}`
    vars.push(`ag_${prefix}`)
    g.teams.forEach((_, idx) => vars.push(`t_${prefix}_${idx + 1}`))
  }
}

for (let i = 0; i < vars.length; i += 6) {
  sql += '  ' + vars.slice(i, i + 6).map((v) => `${v} uuid`).join('; ') + ';\n'
}

sql += `begin\n`

for (const day of ['saturday', 'sunday']) {
  const dayInfo = tournament[day]
  const dayTitle = day[0].toUpperCase() + day.slice(1)
  const groups = bundle[day]

  sql += `\n  -- =========================================================================\n`
  sql += `  -- ${dayTitle} — ${dayInfo.date}\n`
  sql += `  -- =========================================================================\n\n`

  for (const g of dayInfo.ageGroups) {
    const prefix = `${day.slice(0, 3)}${g.displayOrder}`
    const slug = slugify(g.name)
    sql += `  insert into age_groups (name, slug, day, display_order) values `
    sql += `('${esc(g.name)}', '${slug}', '${day}', ${g.displayOrder}) `
    sql += `returning id into ag_${prefix};\n`
  }
  sql += '\n'

  for (const g of dayInfo.ageGroups) {
    const prefix = `${day.slice(0, 3)}${g.displayOrder}`
    const agVar = `ag_${prefix}`
    const live = groups[g.name]
    const teamVar = {}
    g.teams.forEach((team, idx) => {
      teamVar[team] = `t_${prefix}_${idx + 1}`
    })

    sql += `  -- ${dayTitle} / ${g.name} — ${g.teams.length} teams, ${live.matches.length} matches\n`
    g.teams.forEach((team, idx) => {
      sql += `  insert into teams (name, short_name, color, age_group_id) values `
      sql += `('${esc(team)}', '${shortName(team)}', '${colorFor(team, idx)}', ${agVar}) `
      sql += `returning id into ${teamVar[team]};\n`
    })
    sql += '\n'

    if (live.matches.length === 0) continue

    // Stable ordering by kickoff then court
    const ordered = [...live.matches].sort((a, b) => {
      if (a.kickoff !== b.kickoff) return a.kickoff < b.kickoff ? -1 : 1
      return (a.court || '').localeCompare(b.court || '')
    })

    sql += `  insert into matches (age_group_id, home_team_id, away_team_id, home_score, away_score, court, kickoff_time, status) values\n`
    const rows = ordered.map((m) => {
      const hVar = teamVar[m.home]
      const aVar = teamVar[m.away]
      const court = m.court ? `'${esc(m.court)}'` : 'null'
      return `    (${agVar}, ${hVar}, ${aVar}, null, null, ${court}, '${m.kickoff}', 'scheduled')`
    })
    sql += rows.join(',\n') + ';\n\n'
  }
}

sql += `end $$;\n`

const outPath = resolve(repoRoot, 'supabase', 'seed_real.sql')
writeFileSync(outPath, sql)

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const totalGroups =
  tournament.saturday.ageGroups.length + tournament.sunday.ageGroups.length
const totalTeams = [...tournament.saturday.ageGroups, ...tournament.sunday.ageGroups]
  .reduce((a, g) => a + g.teams.length, 0)
const totalMatches =
  Object.values(saturdayGroups).reduce((a, g) => a + g.matches.length, 0) +
  Object.values(sundayGroups).reduce((a, g) => a + g.matches.length, 0)

console.log(`Wrote ${outPath}`)
console.log(`  ${totalGroups} age groups, ${totalTeams} teams, ${totalMatches} matches`)
console.log(`  Saturday: CSV (${saturdayCsv})`)
console.log(`  Sunday:   ${sundaySource}`)

if (aliasLog.length) {
  console.log(`\nTeam-name aliases applied (${aliasLog.length}):`)
  // de-dupe by (group, from, to)
  const seen = new Set()
  const counts = new Map()
  for (const a of aliasLog) {
    const key = `${a.ageGroup}::${a.from}::${a.to}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
    seen.add(key)
  }
  const sorted = [...seen].map((k) => {
    const [ageGroup, from, to] = k.split('::')
    return { ageGroup, from, to, count: counts.get(k) }
  }).sort((a, b) => a.ageGroup.localeCompare(b.ageGroup) || a.from.localeCompare(b.from))
  for (const a of sorted) {
    console.log(`  [${a.ageGroup}] "${a.from}" -> "${a.to}"  (${a.count}x)`)
  }
}

if (issues.length) {
  console.log(`\nData issues (${issues.length}):`)
  for (const msg of issues) console.log(`  - ${msg}`)
  console.log('\nSQL was still written, but the above should be resolved before running it against Supabase.')
} else {
  console.log('\nNo data issues detected.')
}
