import { useEffect, useState } from 'react'
import {
  BarChart3,
  Bell,
  CalendarRange,
  CheckSquare2,
  Home,
  LogOut,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getUser, hasPermission } from '../lib/system.js'

const navItems = [
  { label: '概览', icon: Home, to: '/', permission: 'overview.view' },
  { label: '事件记录', icon: CalendarRange, to: '/events', permission: 'events.view' },
  { label: '事件任务', icon: CheckSquare2, to: '/event-tasks', permission: 'tasks.view' },
  { label: '数据', icon: BarChart3, to: '/analytics', permission: 'analytics.view' },
  { label: '系统管理', icon: ShieldCheck, to: '/system', permission: 'system.view' },
]

const searchHints = {
  '/': '搜索事件',
  '/events': '搜索事件',
  '/event-tasks': '搜索事件任务',
  '/analytics': '搜索数据',
  '/system': '搜索用户',
}

function Dashboard({ user, system, onSignOut }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pageQueries, setPageQueries] = useState({})
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('flowdesk-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const location = useLocation()
  const query = pageQueries[location.pathname] ?? ''
  const firstName = getUser(system, user.email)?.name || user.email.split('@')[0]
  const initials = firstName.slice(0, 2).toUpperCase()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('flowdesk-theme', theme)
  }, [theme])

  return (
    <div className="dashboard-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-mark"><Sparkles size={19} /></span>
          <span>Flowdesk</span>
          <button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="关闭菜单"><X size={20} /></button>
        </div>

        <nav className="side-nav" aria-label="主导航">
          <p className="nav-caption">工作空间</p>
          {navItems.filter((item) => hasPermission(system, user.email, item.permission)).map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={19} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-mini">
            <span className="avatar">{initials}</span>
            <span className="profile-copy"><strong>{firstName}</strong><small>{user.email}</small></span>
            <button className="icon-button" onClick={onSignOut} aria-label="退出登录" title="退出登录"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="关闭菜单" />}

      <main className="dashboard-main">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)} aria-label="打开菜单"><Menu size={21} /></button>
          <label className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setPageQueries((current) => ({ ...current, [location.pathname]: event.target.value }))}
              placeholder={searchHints[location.pathname] ?? '搜索'}
              aria-label="搜索当前页面"
            />
          </label>
          <button
            className="icon-button theme-toggle"
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            aria-label={theme === 'light' ? '切换到深色主题' : '切换到浅色主题'}
            title={theme === 'light' ? '切换到深色主题' : '切换到浅色主题'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="icon-button notification-button" aria-label="通知"><Bell size={20} /><span className="notification-dot" /></button>
          <span className="avatar avatar--top">{initials}</span>
        </header>

        <div className="dashboard-content">
          <Outlet context={{ query, user, can: (permission) => hasPermission(system, user.email, permission) }} />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
