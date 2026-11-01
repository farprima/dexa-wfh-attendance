export function Photo({ name }: { name: string }) {
  const url = `/uploads/${name}`
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <img className="thumb" src={url} loading="lazy" alt="Check-in photo" />
    </a>
  )
}
