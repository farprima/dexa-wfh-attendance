import { useState } from 'react'
import { useOutletContext } from 'react-router'
import { api, type Employee, useAction, useApi } from '../api'
import { Alert } from '../components/Alert'
import { EmployeeForm } from '../components/EmployeeForm'
import { Modal } from '../components/Modal'
import { Table } from '../components/Table'

export function EmployeesPage() {
  const user = useOutletContext<Employee>()
  const employees = useApi<Employee[]>('/employees')
  const [editing, setEditing] = useState<Employee | 'new' | null>(null)

  const remove = useAction(async (employee: Employee) => {
    if (!confirm(`Delete ${employee.name}?`)) return
    await api(`/employees/${employee.id}`, { method: 'DELETE' })
    await employees.reload()
  })

  return (
    <>
      <div className="page-title">
        <h1>Employees</h1>
        <button onClick={() => setEditing('new')}>Add employee</button>
      </div>
      <Alert message={remove.error || employees.error} />
      <Table
        rows={employees.data}
        empty="No employees yet."
        columns={[
          { header: 'Name', render: (row) => row.name },
          { header: 'Email', render: (row) => row.email },
          { header: 'Position', render: (row) => row.position },
          { header: 'Role', render: (row) => (row.role === 'ADMIN' ? 'HR admin' : 'Employee') },
          {
            header: '',
            render: (row) => (
              <div className="row-actions">
                <button className="link" onClick={() => setEditing(row)}>
                  Edit
                </button>
                {row.id !== user.id && (
                  <button className="link danger" onClick={() => remove.run(row)}>
                    Delete
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />
      {editing && (
        <Modal
          title={editing === 'new' ? 'Add employee' : 'Edit employee'}
          onClose={() => setEditing(null)}
        >
          <EmployeeForm
            employee={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null)
              employees.reload()
            }}
          />
        </Modal>
      )}
    </>
  )
}
