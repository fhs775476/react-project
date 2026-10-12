'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from './AppProvider.jsx'
import Login from '../views/Login.jsx'

export default function LoginScreen() {
  const { ready, user, login, defaultPath } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (ready && user) router.replace(defaultPath ?? '/')
  }, [ready, user, defaultPath, router])

  if (!ready || user) return null
  return <Login onSuccess={(nextUser) => { login(nextUser); router.replace('/') }} />
}
