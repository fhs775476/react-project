export const PERMISSIONS = [
  { key: 'overview.view', label: '查看概览' },
  { key: 'events.view', label: '查看事件' },
  { key: 'events.manage', label: '管理事件' },
  { key: 'tasks.view', label: '查看任务' },
  { key: 'tasks.manage', label: '管理任务' },
  { key: 'analytics.view', label: '查看数据' },
  { key: 'system.view', label: '查看系统管理' },
  { key: 'system.manage', label: '管理用户与权限' },
]

export const DEFAULT_ROLES = [
  { id: 'admin', name: '管理员', description: '拥有全部权限', permissions: PERMISSIONS.map((item) => item.key), locked: true },
  { id: 'editor', name: '编辑者', description: '管理事件和任务', permissions: ['overview.view', 'events.view', 'events.manage', 'tasks.view', 'tasks.manage', 'analytics.view'] },
  { id: 'viewer', name: '查看者', description: '查看工作空间内容', permissions: ['overview.view', 'events.view', 'tasks.view', 'analytics.view'] },
]

const STORAGE_KEY = 'flowdesk-system'

export function loadSystem() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && Array.isArray(saved.users) && Array.isArray(saved.roles) && saved.roles.some((role) => role.id === 'admin')) return saved
  } catch { /* 使用初始数据 */ }
  return { users: [], roles: DEFAULT_ROLES }
}

export function saveSystem(system) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(system))
}

export function getUser(system, email) {
  return system.users.find((item) => item.email.toLowerCase() === email.toLowerCase())
}

export function hasPermission(system, email, permission) {
  const user = getUser(system, email)
  if (!user || user.status !== 'active') return false
  return Boolean(system.roles.find((role) => role.id === user.roleId)?.permissions.includes(permission))
}
