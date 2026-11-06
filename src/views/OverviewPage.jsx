'use client'

import { useMemo } from 'react'
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckSquare2,
  Clock3,
  CalendarRange,
  Plus,
  Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useWorkspace } from '../components/WorkspaceContext.jsx'

function OverviewPage() {
  const { query, user, can, events, tasks, toggleTask, getTaskEventName } = useWorkspace()
  const router = useRouter()
  const navigate = (path) => router.push(path)
  const firstName = user.email.split('@')[0]
  const completedCount = tasks.filter((task) => task.done).length
  const visibleProjects = useMemo(
    () => events.filter((event) => event.title.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).slice(0, 3),
    [events, query],
  )
  const recentTasks = tasks.slice(0, 3)

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">星期五，10 月 10 日</p>
          <h1>早上好，{firstName}</h1>
          <p>这是你的工作概览，今天也一起把重要的事做好。</p>
        </div>
        {can('events.manage') && <button className="primary-action" onClick={() => navigate('/events')}><Plus size={18} />新建事件</button>}
      </section>

      <section className="stats-grid" aria-label="数据概览">
        {can('events.view') && <article className="stat-card"><div className="stat-top"><span>事件记录</span><CalendarRange size={19} /></div><strong>{events.length}</strong><p>当前记录总数</p></article>}
        {can('tasks.view') && <article className="stat-card"><div className="stat-top"><span>已完成任务</span><CheckSquare2 size={19} /></div><strong>{completedCount}</strong><p>共 {tasks.length} 项任务</p></article>}
        <article className="stat-card stat-card--accent"><div className="stat-top"><span>团队专注时间</span><Clock3 size={19} /></div><strong>32.5h</strong><p>本周目标 40 小时</p><div className="mini-progress"><span style={{ width: '81%' }} /></div></article>
      </section>

      <div className="content-grid">
        {can('events.view') && <section className="workspace-section events-section">
          <div className="section-heading"><div><h2>近期事件</h2><p>查看即将发生的重要安排</p></div>{can('events.view') && <button className="text-button" onClick={() => navigate('/events')}>查看全部 <ArrowUpRight size={16} /></button>}</div>
          <div className="project-list">
            {visibleProjects.map((event) => (
              <article className="project-card" key={event.id}>
                <div className="project-card-top"><span className="project-icon" style={{ background: event.color }} aria-hidden="true">{event.title.slice(0, 1)}</span></div>
                <span className="project-tag">{event.category} · {event.status}</span><h3>{event.title}</h3>
                <p className="event-card-summary">{event.summary}</p>
                <div className="project-due"><CalendarDays size={15} /> {event.date} · {event.time}</div>
              </article>
            ))}
            {visibleProjects.length === 0 && <p className="empty-state">没有找到相关事件</p>}
          </div>
        </section>}

        {can('tasks.view') && <section className="workspace-section task-section">
          <div className="section-heading"><div><h2>事件任务</h2><p>{completedCount}/{tasks.length} 已完成</p></div>{can('tasks.manage') && <button className="icon-button add-task" onClick={() => navigate('/event-tasks')} aria-label="添加事件任务"><Plus size={19} /></button>}</div>
          <div className="task-progress"><span style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }} /></div>
          <div className="task-list">
            {recentTasks.map((task) => (
              <button className={`task-item ${task.done ? 'task-item--done' : ''}`} key={task.id} onClick={() => toggleTask(task.id)} disabled={!can('tasks.manage')}>
                <span className="task-check">{task.done && <Check size={14} strokeWidth={3} />}</span>
                <span className="task-copy"><strong>{task.title}</strong><small>{getTaskEventName(task)} · {task.due}</small></span>
              </button>
            ))}
            {recentTasks.length === 0 && <p className="empty-state">暂无事件任务</p>}
          </div>
          <div className="focus-note"><Sparkles size={18} /><div><strong>今日小提示</strong><p>先完成最重要的一件事，再处理其他事项。</p></div></div>
        </section>}
      </div>
    </>
  )
}

export default OverviewPage
