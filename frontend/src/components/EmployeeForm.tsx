import type { FormEvent } from 'react'
import { api, type Employee, useAction } from '../api'
import { Alert } from './Alert'

interface Props {
  employee?: Employee
  onSaved: () => void
  onCancel: () => void
}

export function EmployeeForm({ employee, onSaved, onCancel }: Props) {
  const save = useAction(async (form: FormData) => {
    const fields = Object.fromEntries(form)
    if (!fields.password) delete fields.password
    await api(employee ? `/employees/${employee.id}` : '/employees', {
      method: employee ? 'PATCH' : 'POST',
      body: JSON.stringify(fields),
    })
    onSaved()
  })

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    save.run(new FormData(event.currentTarget))
  }

  return (
    <form onSubmit={submit}>
      <label>
        Name
        <input name="name" defaultValue={employee?.name} required />
      </label>
      <label>
        Email
        <input name="email" type="email" defaultValue={employee?.email} required />
      </label>
      <label>
        Position
        <input name="position" defaultValue={employee?.position} required />
      </label>
      <label>
        Role
        <select name="role" defaultValue={employee?.role ?? 'EMPLOYEE'}>
          <option value="EMPLOYEE">Employee</option>
          <option value="ADMIN">HR admin</option>
        </select>
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          minLength={6}
          required={!employee}
          placeholder={employee && 'Leave empty to keep the current one'}
        />
      </label>
      <Alert message={save.error} />
      <div className="actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button disabled={save.busy}>{save.busy ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}
