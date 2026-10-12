// Next.js 需要在根布局同时导出 metadata 和组件。
// oxlint-disable react/only-export-components
import '../index.css'
import '../App.css'
import { AppProvider } from '../components/AppProvider.jsx'

export const metadata = {
  title: 'Flowdesk · 工作台',
  description: '事件、任务与团队管理工作台',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body><AppProvider>{children}</AppProvider></body></html>
}
