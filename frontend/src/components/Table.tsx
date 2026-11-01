import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
}

interface Props<T> {
  columns: Column<T>[]
  rows?: T[]
  empty: string
}

export function Table<T extends { id: number }>({ columns, rows, empty }: Props<T>) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.header} data-label={column.header}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows?.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="muted">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
