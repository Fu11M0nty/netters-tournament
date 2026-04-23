'use client'

import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import TeamLogo from './TeamLogo'
import { createClient } from '@/lib/supabase'
import type { Team } from '@/lib/types'

interface TeamLogoDropzoneProps {
  team: Team
  onSaved: () => void
  size?: 'sm' | 'md' | 'lg'
}

const LOGO_BUCKET = 'team-logos'
const MAX_LOGO_BYTES = 2 * 1024 * 1024

export default function TeamLogoDropzone({
  team,
  onSaved,
  size = 'md',
}: TeamLogoDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.')
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error('Logo must be under 2 MB.')
      return
    }

    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const path = `${team.id}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      setUploading(false)
      toast.error(`Upload failed: ${uploadError.message}`)
      return
    }

    const { data: publicUrl } = supabase.storage
      .from(LOGO_BUCKET)
      .getPublicUrl(path)

    const { error: updateError } = await supabase
      .from('teams')
      .update({ logo_url: publicUrl.publicUrl })
      .eq('id', team.id)

    setUploading(false)

    if (updateError) {
      toast.error(`Could not save: ${updateError.message}`)
      return
    }

    toast.success(`${team.name} logo updated`)
    onSaved()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) void uploadFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void uploadFile(file)
  }

  return (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        if (!dragOver) setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      disabled={uploading}
      aria-label={`Upload logo for ${team.name}`}
      title="Drop an image here or click to upload"
      className={
        'relative inline-flex shrink-0 items-center justify-center rounded-full transition-all ' +
        (dragOver
          ? 'ring-2 ring-mk-red ring-offset-2 ring-offset-white dark:ring-offset-zinc-950'
          : 'ring-1 ring-transparent hover:ring-mk-red/60') +
        (uploading ? ' opacity-60' : '')
      }
    >
      <TeamLogo team={team} size={size} />
      {uploading && (
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-[10px] font-bold uppercase tracking-wider text-white">
          …
        </span>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </button>
  )
}
