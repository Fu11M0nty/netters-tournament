// Tiny RFC4180-ish CSV parser. Handles quoted fields, escaped quotes (""),
// commas inside quotes, and CRLF or LF line endings. First row is the header.

export interface ParsedCsv {
  headers: string[]
  rows: Record<string, string>[]
}

function parseCells(text: string): string[][] {
  const out: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuote = false
  let i = 0
  while (i < text.length) {
    const c = text[i]
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i += 2
          continue
        }
        inQuote = false
        i++
        continue
      }
      cell += c
      i++
      continue
    }
    if (c === '"') {
      inQuote = true
      i++
      continue
    }
    if (c === ',') {
      row.push(cell)
      cell = ''
      i++
      continue
    }
    if (c === '\r') {
      i++
      continue
    }
    if (c === '\n') {
      row.push(cell)
      cell = ''
      out.push(row)
      row = []
      i++
      continue
    }
    cell += c
    i++
  }
  if (cell !== '' || row.length > 0) {
    row.push(cell)
    out.push(row)
  }
  return out.filter((r) => r.some((c) => c !== ''))
}

export function parseCsv(text: string): ParsedCsv {
  const cells = parseCells(text)
  if (cells.length === 0) return { headers: [], rows: [] }
  const headers = cells[0].map((h) => h.trim().toLowerCase())
  const rows = cells.slice(1).map((row) => {
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = (row[i] ?? '').trim()
    })
    return obj
  })
  return { headers, rows }
}
