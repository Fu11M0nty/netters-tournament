'use client'

interface PrintButtonProps {
  label?: string
}

export default function PrintButton({ label = 'Download PDF' }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      title="Open the print dialog and choose 'Save as PDF'"
      className="print:hidden inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-white/20"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
        <path d="M5 21h14" />
      </svg>
      {label}
    </button>
  )
}
