import { useState } from 'react'
import { type Attendance, type Employee, formatDate, formatTime, today, useApi } from '../api'
import { Alert } from '../components/Alert'
import { Photo } from '../components/Photo'
import { Table } from '../components/Table'

export function AttendancePage() {
  const [filter, setFilter] = useState({ from: today(), to: today(), employeeId: '' })
  const query = new URLSearchParams(Object.entries(filter).filter(([, value]) => value))
  const attendances = useApi<Attendance[]>(`/attendances?${query}`)
  const employees = useApi<Employee[]>('/employees')

  const set = (key: keyof typeof filter) => (event: { target: { value: string } }) =>
    setFilter({ ...filter, [key]: event.target.value })

  return (
    <>
      <h1>Attendance</h1>
      <div className="filters">
        <label>
          From
          <input type="date" value={filter.from} max={filter.to} onChange={set('from')} />
        </label>
        <label>
          To
          <input type="date" value={filter.to} min={filter.from} onChange={set('to')} />
        </label>
        <label>
          Employee
          <select value={filter.employeeId} onChange={set('employeeId')}>
            <option value="">All employees</option>
            {employees.data?.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Alert message={attendances.error} />
      <Table
        rows={attendances.data}
        empty="No check-ins in this period."
        columns={[
          { header: 'Employee', render: (row) => row.employeeName },
          { header: 'Date', render: (row) => formatDate(row.checkedInAt) },
          { header: 'Time', render: (row) => formatTime(row.checkedInAt) },
          { header: 'Photo', render: (row) => <Photo name={row.photo} /> },
        ]}
      />
    </>
  )
}
