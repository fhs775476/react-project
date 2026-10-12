'use client'

// 此文件同时导出 Provider 与读取它的 Hook。
// oxlint-disable react/only-export-components, react/set-state-in-effect

import { createContext, useContext, useEffect, useState } from 'react'
import { getUser, hasPermission, loadSystem, saveSystem } from '../lib/system.js'

const AppContext = createContext(null)
const routes = [
  ['overview.view', '/'],
  ['events.view', '/events'],
  ['tasks.view', '/event-tasks'],
  ['analytics.view', '/analytics'],
  ['system.view', '/system'],
]

export function AppProvider({ children }) {
  const [system, setSystem] = useState(null)
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // 浏览器存储仅在挂载后可读，因此此处同步本地演示账号。
  useEffect(() => {
    let next = loadSystem()
    const email = sessionStorage.getItem('flowdesk-user')
    if (email && next.users.length === 0) {
      next = { ...next, users: [{ id: crypto.randomUUID(), name: email.split('@')[0], email, department: '管理团队', roleId: 'admin', status: 'active' }] }
      saveSystem(next)
    }
    setSystem(next)
    setUser(email && getUser(next, email)?.status === 'active' ? { email } : null)
    setReady(true)
  }, [])

  function login(nextUser) {
    if (system.users.length === 0) {
      const next = { ...system, users: [{ id: crypto.randomUUID(), name: nextUser.email.split('@')[0], email: nextUser.email, department: '管理团队', roleId: 'admin', status: 'active' }] }
      saveSystem(next)
      setSystem(next)
    }
    sessionStorage.setItem('flowdesk-user', nextUser.email)
    setUser(nextUser)
  }

  function logout() {
    sessionStorage.removeItem('flowdesk-user')
    setUser(null)
  }

  function updateSystem(next) {
    saveSystem(next)
    setSystem(next)
    if (user && getUser(next, user.email)?.status !== 'active') logout()
  }

  const can = (permission) => Boolean(system && user && hasPermission(system, user.email, permission))
  const defaultPath = routes.find(([permission]) => can(permission))?.[1]

  return <AppContext.Provider value={{ ready, system, user, login, logout, updateSystem, can, defaultPath }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp 必须在 AppProvider 内使用')
  return context
}
