import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import type { Employee } from './api'
import { Layout } from './components/Layout'
import { AttendancePage } from './pages/AttendancePage'
import { CheckInPage } from './pages/CheckInPage'
import { EmployeesPage } from './pages/EmployeesPage'
import { LoginPage } from './pages/LoginPage'

export default function App() {
  const [user, setUser] = useState<Employee | null>(() =>
    JSON.parse(localStorage.getItem('user') ?? 'null'),
  )

  function logout() {
    localStorage.clear()
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <Route element={<Layout user={user} onLogout={logout} />}>
            <Route index element={<CheckInPage />} />
            {user.role === 'ADMIN' && (
              <>
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="attendances" element={<AttendancePage />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <>
            <Route path="login" element={<LoginPage onLogin={setUser} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}
