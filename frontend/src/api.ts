import { useCallback, useEffect, useState } from 'react'

export type Role = 'ADMIN' | 'EMPLOYEE'

export interface Employee {
  id: number
  name: string
  email: string
  position: string
  role: Role
}

export interface Attendance {
  id: number
  employeeId: number
  employeeName?: string
  workDate: string
  checkedInAt: string
  photo: string
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (typeof init.body === 'string') headers.set('Content-Type', 'application/json')

  const response = await fetch(`/api${path}`, { ...init, headers })
  if (response.status === 401 && token) {
    localStorage.clear()
    location.assign('/login')
  }
  if (!response.ok) {
    const { message } = await response.json().catch(() => ({}))
    throw new Error([message ?? response.statusText].flat().join(', '))
  }
  return response.status === 204 ? (undefined as T) : response.json()
}

export function useApi<T>(path: string) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState('')
  const reload = useCallback(
    () =>
      api<T>(path).then(
        (data) => {
          setData(data)
          setError('')
        },
        (error: Error) => setError(error.message),
      ),
    [path],
  )
  useEffect(() => {
    reload()
  }, [reload])
  return { data, error, reload }
}

// Runs an async action, tracking whether it is busy and the message it failed with.
export function useAction<A extends unknown[]>(action: (...args: A) => Promise<unknown>) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function run(...args: A) {
    setBusy(true)
    setError('')
    try {
      await action(...args)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setBusy(false)
    }
  }
  return { run, busy, error }
}

export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export const formatTime = (date: string | Date) =>
  new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

export const today = () => new Date().toLocaleDateString('en-CA')
