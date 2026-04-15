export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-mk-ink/10 bg-mk-ink text-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-semibold uppercase tracking-wider">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-mk-red" />
          MK Netters <span className="text-mk-gold">&amp;</span> MK Dons Tournament
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://mknetters.co.uk/"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-white"
          >
            mknetters.co.uk
          </a>
          <span aria-hidden="true">·</span>
          <span>Live scores &amp; standings</span>
        </div>
      </div>
    </footer>
  )
}
