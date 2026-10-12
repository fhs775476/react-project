'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from './AppProvider.jsx'

export default function ProtectedPage({ permission, children }) {
  const { ready, can, defaultPath } = useApp()
  const router = useRouter()
  const allowed = can(permission)

  useEffect(() => {
    if (ready && !allowed && defaultPath) router.replace(defaultPath)
  }, [ready, allowed, defaultPath, router])

  if (!ready || !allowed) return defaultPath ? null : <div className="empty-state">当前账号没有可访问的页面，请联系管理员分配权限。</div>
  return children
}
