import { NavLink, Outlet } from 'react-router'
import type { Employee } from '../api'

interface Props {
  user: Employee
  onLogout: () => void
}

export function Layout({ user, onLogout }: Props) {
  return (
    <>
      <header>
        <div className="bar">
          <strong>WFH Attendance</strong>
          <nav>
            <NavLink to="/" end>
              Check in
            </NavLink>
            {user.role === 'ADMIN' && (
              <>
                <NavLink to="/employees">Employees</NavLink>
                <NavLink to="/attendances">Attendance</NavLink>
              </>
            )}
          </nav>
          <div className="user">
            <span>{user.name}</span>
            <button className="link muted" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet context={user} />
      </main>
    </>
  )
}
