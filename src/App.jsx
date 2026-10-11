import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import EventsPage from './pages/EventsPage.jsx'
import Login from './pages/Login.jsx'
import OverviewPage from './pages/OverviewPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import SystemPage from './pages/SystemPage.jsx'
import { getUser, hasPermission, loadSystem, saveSystem } from './lib/system.js'
import './App.css'

function initialSystem() {
  const system = loadSystem()
  const email = sessionStorage.getItem('flowdesk-user')
  if (email && system.users.length === 0) {
    const next = { ...system, users: [{ id: crypto.randomUUID(), name: email.split('@')[0], email, department: '管理团队', roleId: 'admin', status: 'active' }] }
    saveSystem(next)
    return next
  }
  return system
}

function App() {
  const [system, setSystem] = useState(initialSystem)
  const [user, setUser] = useState(() => {
    const email = sessionStorage.getItem('flowdesk-user')
    return email && getUser(loadSystem(), email)?.status === 'active' ? { email } : null
  })

  function handleLogin(nextUser) {
    if (system.users.length === 0) {
      const next = { ...system, users: [{ id: crypto.randomUUID(), name: nextUser.email.split('@')[0], email: nextUser.email, department: '管理团队', roleId: 'admin', status: 'active' }] }
      saveSystem(next)
      setSystem(next)
    }
    sessionStorage.setItem('flowdesk-user', nextUser.email)
    setUser(nextUser)
  }

  function handleSignOut() {
    sessionStorage.removeItem('flowdesk-user')
    setUser(null)
  }

  function updateSystem(next) {
    saveSystem(next)
    setSystem(next)
    if (user && getUser(next, user.email)?.status !== 'active') handleSignOut()
  }

  const can = (permission) => Boolean(user && hasPermission(system, user.email, permission))
  const defaultPath = ['overview.view', 'events.view', 'tasks.view', 'analytics.view', 'system.view']
    .map((permission, index) => [permission, ['/', '/events', '/event-tasks', '/analytics', '/system'][index]])
    .find(([permission]) => can(permission))?.[1]
  const guarded = (permission, element) => can(permission) ? element : defaultPath ? <Navigate to={defaultPath} replace /> : <div className="empty-state">当前账号没有可访问的页面，请联系管理员分配权限。</div>

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to={defaultPath ?? '/'} replace /> : <Login onSuccess={handleLogin} />}
      />
      <Route
        element={user && getUser(system, user.email)?.status === 'active' ? <Dashboard user={user} system={system} onSignOut={handleSignOut} /> : <Navigate to="/login" replace />}
      >
        <Route index element={guarded('overview.view', <OverviewPage />)} />
        <Route path="events" element={guarded('events.view', <EventsPage />)} />
        <Route path="event-tasks" element={guarded('tasks.view', <TasksPage />)} />
        <Route path="projects" element={<Navigate to="/events" replace />} />
        <Route path="tasks" element={<Navigate to="/event-tasks" replace />} />
        <Route path="analytics" element={guarded('analytics.view', <AnalyticsPage />)} />
        <Route path="system" element={guarded('system.view', <SystemPage system={system} onChange={updateSystem} currentEmail={user?.email} />)} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App
