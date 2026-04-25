'use client'

import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { compressImage } from '@/lib/image'
import type { Match } from '@/lib/types'

interface MatchScoresheetCaptureProps {
  match: Match
  onUploaded: () => void
}

const SCORESHEET_BUCKET = 'scoresheets'
const MAX_SCORESHEET_SOURCE_BYTES = 20 * 1024 * 1024

export default function MatchScoresheetCapture({
  match,
  onUploaded,
}: MatchScoresheetCaptureProps) {
  const [url, setUrl] = useState<string | null>(match.scoresheet_url)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.')
      return
    }
    if (file.size > MAX_SCORESHEET_SOURCE_BYTES) {
      toast.error('Source image too large (max 20 MB).')
      return
    }

    setUploading(true)
    try {
      const compressed = await compressImage(file, 960, 0.5)
      const supabase = createClient()
      const path = `${match.id}/${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from(SCORESHEET_BUCKET)
        .upload(path, compressed, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        })
      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message}`)
        return
      }
      const { data: publicUrl } = supabase.storage
        .from(SCORESHEET_BUCKET)
        .getPublicUrl(path)

      const { error: updateError } = await supabase
        .from('matches')
        .update({ scoresheet_url: publicUrl.publicUrl })
        .eq('id', match.id)
      if (updateError) {
        toast.error(`Could not save: ${updateError.message}`)
        return
      }

      setUrl(publicUrl.publicUrl)
      toast.success(`Scoresheet uploaded (${Math.round(compressed.size / 1024)} KB)`)
      onUploaded()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) void uploadFile(file)
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title="View scoresheet photo"
          className="block shrink-0 overflow-hidden rounded-md border border-zinc-300 bg-white shadow-sm hover:ring-2 hover:ring-mk-red dark:border-zinc-700 dark:bg-zinc-900"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Scoresheet"
            className="h-8 w-8 object-cover"
          />
        </a>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        title={
          uploading
            ? 'Uploading…'
            : url
              ? 'Replace scoresheet photo'
              : 'Capture / upload scoresheet'
        }
        aria-label={url ? 'Replace scoresheet' : 'Upload scoresheet'}
        className={
          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-white shadow-sm transition-colors disabled:opacity-60 dark:bg-zinc-900 ' +
          (url
            ? 'border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
            : 'border-dashed border-zinc-400 text-zinc-500 hover:border-mk-red hover:text-mk-red dark:border-zinc-600 dark:text-zinc-400')
        }
      >
        {uploading ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 animate-spin"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="9" opacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
          </svg>
        ) : (
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
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
