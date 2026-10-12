'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from './AppProvider.jsx'
import Dashboard from '../views/Dashboard.jsx'

export default function ProtectedLayout({ children }) {
  const { ready, user, system, logout } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (ready && !user) router.replace('/login')
  }, [ready, user, router])

  if (!ready || !user) return null
  return <Dashboard user={user} system={system} onSignOut={() => { logout(); router.replace('/login') }}>{children}</Dashboard>
}
