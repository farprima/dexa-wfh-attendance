import type { FormEvent } from 'react'
import { api, type Employee, useAction } from '../api'
import { Alert } from '../components/Alert'

export function LoginPage({ onLogin }: { onLogin: (user: Employee) => void }) {
  const login = useAction(async (credentials: FormData) => {
    const { token, user } = await api<{ token: string; user: Employee }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(credentials)),
    })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    onLogin(user)
  })

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    login.run(new FormData(event.currentTarget))
  }

  return (
    <main className="login">
      <form className="card" onSubmit={submit}>
        <h1>WFH Attendance</h1>
        <label>
          Email
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <Alert message={login.error} />
        <button disabled={login.busy}>{login.busy ? 'Logging in...' : 'Log in'}</button>
      </form>
    </main>
  )
}
