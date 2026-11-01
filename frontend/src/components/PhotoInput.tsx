import { type ChangeEvent, useState } from 'react'

// Opens the camera on phones and the file picker elsewhere, then previews the photo.
export function PhotoInput({ onChange }: { onChange: (file: File | null) => void }) {
  const [preview, setPreview] = useState('')

  function choose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    URL.revokeObjectURL(preview)
    setPreview(file ? URL.createObjectURL(file) : '')
    onChange(file)
  }

  return (
    <label className="photo-input">
      {preview ? <img src={preview} alt="Preview" /> : <span>Take or choose a photo</span>}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="user"
        onChange={choose}
      />
    </label>
  )
}
