'use client'

import ProtectedPage from '../../../components/ProtectedPage.jsx'
import { useApp } from '../../../components/AppProvider.jsx'
import SystemPage from '../../../views/SystemPage.jsx'

export default function Page() {
  const { system, user, updateSystem } = useApp()
  return <ProtectedPage permission="system.view"><SystemPage system={system} onChange={updateSystem} currentEmail={user?.email} /></ProtectedPage>
}
