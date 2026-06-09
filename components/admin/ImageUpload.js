'use client'

import { useState } from 'react'
import { img } from '@/lib/cloudinary'

export default function ImageUpload({ name, folder = '', initial = '', onChange = null }) {
  const [publicId, setPublicId] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', 'arenabase_upload')
      // Allow caller to pass either a full folder (e.g. "arenabase/tournaments/slug")
      // or a subfolder (e.g. "tournaments/slug"). Avoid duplicating the
      // top-level `arenabase` segment if it's already present.
      if (folder) {
        const target = folder.startsWith('arenabase') ? folder : `arenabase/${folder}`
        fd.append('folder', target)
      }

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: fd }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Upload failed')

      setPublicId(data.public_id)
      if (typeof onChange === 'function') onChange(data.public_id)
    } catch (err) {
      setError(err.message || 'Upload error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <label style={{display:'block', marginBottom:8}}>
        <input type="file" accept="image/*" onChange={handleFile} />
      </label>

      <input type="hidden" name={name} value={publicId || ''} />

      {loading && <p>Uploading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {publicId && (
        <div style={{ marginTop: 8 }}>
          <p style={{ margin: '6px 0' }}>Uploaded ID: <code>{publicId}</code></p>
          <img
            src={img.tournamentBanner(publicId)}
            alt="Preview"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }}
          />
        </div>
      )}
    </div>
  )
}
