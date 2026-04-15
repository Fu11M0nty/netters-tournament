import type { Team } from '@/lib/types'

interface TeamLogoProps {
  team: Team
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const SIZE_CLASS: Record<NonNullable<TeamLogoProps['size']>, string> = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-12 w-12 text-xs',
  lg: 'h-16 w-16 text-sm',
}

function initialsFor(team: Team): string {
  if (team.short_name) return team.short_name.slice(0, 3).toUpperCase()
  const words = team.name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export default function TeamLogo({ team, size = 'md' }: TeamLogoProps) {
  const sizeClass = SIZE_CLASS[size]
  const base = `inline-flex ${sizeClass} shrink-0 items-center justify-center rounded-full overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800`

  if (team.logo_url) {
    return (
      <span className={`${base} bg-white`}>
        {}
        <img
          src={team.logo_url}
          alt=""
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </span>
    )
  }

  const bg = team.color ?? '#52525b'
  return (
    <span
      aria-hidden="true"
      className={`${base} font-bold text-white`}
      style={{ backgroundColor: bg }}
    >
      {initialsFor(team)}
    </span>
  )
}
