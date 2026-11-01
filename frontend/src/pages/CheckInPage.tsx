import { type FormEvent, useEffect, useState } from 'react'
import { api, type Attendance, formatDate, formatTime, today, useAction, useApi } from '../api'
import { Alert } from '../components/Alert'
import { Photo } from '../components/Photo'
import { PhotoInput } from '../components/PhotoInput'
import { Table } from '../components/Table'

export function CheckInPage() {
  const history = useApi<Attendance[]>('/attendances/me')
  const checkedIn = history.data?.find((attendance) => attendance.workDate === today())
  const [now, setNow] = useState(() => new Date())
  const [photo, setPhoto] = useState<File | null>(null)

  const checkIn = useAction(async (photo: File) => {
    const body = new FormData()
    body.append('photo', photo)
    await api('/attendances', { method: 'POST', body })
    await history.reload()
  })

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  function submit(event: FormEvent) {
    event.preventDefault()
    if (photo) checkIn.run(photo)
  }

  return (
    <>
      <section className="card check-in">
        <p className="muted">{formatDate(now)}</p>
        <p className="clock">{now.toLocaleTimeString('en-GB')}</p>
        {checkedIn ? (
          <p className="success">You checked in today at {formatTime(checkedIn.checkedInAt)}</p>
        ) : (
          <form onSubmit={submit}>
            <PhotoInput onChange={setPhoto} />
            <Alert message={checkIn.error} />
            <button disabled={!photo || !history.data || checkIn.busy}>
              {checkIn.busy ? 'Checking in...' : 'Check in'}
            </button>
          </form>
        )}
      </section>

      <h2>My attendance</h2>
      <Alert message={history.error} />
      <Table
        rows={history.data}
        empty="No check-ins yet."
        columns={[
          { header: 'Date', render: (row) => formatDate(row.checkedInAt) },
          { header: 'Time', render: (row) => formatTime(row.checkedInAt) },
          { header: 'Photo', render: (row) => <Photo name={row.photo} /> },
        ]}
      />
    </>
  )
}
