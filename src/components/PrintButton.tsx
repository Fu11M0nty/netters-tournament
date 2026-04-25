'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import type { Day } from '@/lib/types'

interface PrintButtonProps {
  ageGroupName: string
  day: Day
  label?: string
}

function sanitizeFilenameSegment(s: string): string {
  return s
    .replace(/['"]/g, '')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function PrintButton({
  ageGroupName,
  day,
  label = 'Download PDF',
}: PrintButtonProps) {
  const [generating, setGenerating] = useState(false)

  async function handleDownload() {
    const target = document.querySelector<HTMLElement>('[data-pdf-root]')
    if (!target) {
      toast.error('Nothing to export.')
      return
    }

    setGenerating(true)
    const hidden = Array.from(
      target.querySelectorAll<HTMLElement>('[data-print-hide]')
    )
    const previousDisplay = hidden.map((el) => el.style.display)
    hidden.forEach((el) => {
      el.style.display = 'none'
    })

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf'),
      ])

      const canvas = await html2canvas(target, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const imgData = canvas.toDataURL('image/jpeg', 0.85)

      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const dayLabel = day === 'saturday' ? 'Saturday' : 'Sunday'
      const filename = `MK-Netters-and-MK-Dons-Tournament-2026-${dayLabel}-${sanitizeFilenameSegment(ageGroupName)}.pdf`
      pdf.save(filename)
    } catch (err) {
      toast.error(
        err instanceof Error ? `PDF failed: ${err.message}` : 'PDF failed'
      )
    } finally {
      hidden.forEach((el, i) => {
        el.style.display = previousDisplay[i]
      })
      setGenerating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={generating}
      title="Download this group's standings, results and fixtures as a PDF"
      className="print:hidden inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
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
      {generating ? 'Generating…' : label}
    </button>
  )
}
