import Link from 'next/link'

const LOGO_URL =
  'https://img1.wsimg.com/isteam/ip/d78161f7-6327-45dc-a42c-224f38e73a24/N%20%26%20D.jpg'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-mk-ink/10 bg-mk-ink text-white shadow-lg shadow-mk-ink/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-mk-gold/70 transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_URL}
              alt="MK Netters & MK Dons"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mk-gold">
              Hosted by
            </span>
            <span className="text-sm font-extrabold tracking-tight text-white sm:text-base">
              MK Netters <span className="text-mk-gold">&amp;</span> MK Dons
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mk-gold" />
            Tournament 2026
          </span>
          <Link
            href="/admin"
            className="inline-flex items-center rounded-full bg-mk-red px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-mk-red-dark"
          >
            Admin
          </Link>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center rounded-full bg-mk-red px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-mk-red-dark sm:hidden"
        >
          Admin
        </Link>
      </div>
    </header>
  )
}
