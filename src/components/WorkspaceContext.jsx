'use client'

import { createContext, useContext } from 'react'

export const WorkspaceContext = createContext(null)

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('useWorkspace 必须在工作台内使用')
  return context
}
