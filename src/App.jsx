import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import Login from './pages/Login.jsx'
import OverviewPage from './pages/OverviewPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    const email = sessionStorage.getItem('flowdesk-user')
    return email ? { email } : null
  })

  function handleLogin(nextUser) {
    sessionStorage.setItem('flowdesk-user', nextUser.email)
    setUser(nextUser)
  }

  function handleSignOut() {
    sessionStorage.removeItem('flowdesk-user')
    setUser(null)
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login onSuccess={handleLogin} />}
      />
      <Route
        element={user ? <Dashboard user={user} onSignOut={handleSignOut} /> : <Navigate to="/login" replace />}
      >
        <Route index element={<OverviewPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App
