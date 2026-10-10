import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckSquare2,
  Clock3,
  FolderKanban,
  MoreHorizontal,
  Plus,
  Sparkles,
} from 'lucide-react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { initialTasks, projects } from '../data/workspace.js'

function OverviewPage() {
  const { query, user } = useOutletContext()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(initialTasks.slice(0, 3))
  const firstName = user.email.split('@')[0]
  const completedCount = tasks.filter((task) => task.done).length
  const visibleProjects = useMemo(
    () => projects.slice(0, 3).filter((project) => project.name.includes(query.trim())),
    [query],
  )

  function toggleTask(id) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">星期五，10 月 10 日</p>
          <h1>早上好，{firstName}</h1>
          <p>这是你的工作概览，今天也一起把重要的事做好。</p>
        </div>
        <button className="primary-action" onClick={() => navigate('/projects')}><Plus size={18} />新建项目</button>
      </section>

      <section className="stats-grid" aria-label="数据概览">
        <article className="stat-card"><div className="stat-top"><span>进行中项目</span><FolderKanban size={19} /></div><strong>8</strong><p><span className="trend-up">+2</span> 较上周</p></article>
        <article className="stat-card"><div className="stat-top"><span>本周完成</span><CheckSquare2 size={19} /></div><strong>24</strong><p><span className="trend-up">+18%</span> 完成效率</p></article>
        <article className="stat-card stat-card--accent"><div className="stat-top"><span>团队专注时间</span><Clock3 size={19} /></div><strong>32.5h</strong><p>本周目标 40 小时</p><div className="mini-progress"><span style={{ width: '81%' }} /></div></article>
      </section>

      <div className="content-grid">
        <section className="workspace-section projects-section">
          <div className="section-heading"><div><h2>近期项目</h2><p>继续推进你的核心工作</p></div><button className="text-button" onClick={() => navigate('/projects')}>查看全部 <ArrowUpRight size={16} /></button></div>
          <div className="project-list">
            {visibleProjects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-card-top"><span className="project-icon" style={{ background: project.color }} aria-hidden="true">{project.name.slice(0, 1)}</span><button className="icon-button" aria-label={`${project.name}更多操作`}><MoreHorizontal size={19} /></button></div>
                <span className="project-tag">{project.tag}</span><h3>{project.name}</h3>
                <div className="progress-label"><span>项目进度</span><strong>{project.progress}%</strong></div>
                <div className="progress-track"><span style={{ width: `${project.progress}%`, background: project.color }} /></div>
                <div className="project-due"><CalendarDays size={15} /> 截止 {project.due}</div>
              </article>
            ))}
            {visibleProjects.length === 0 && <p className="empty-state">没有找到相关项目</p>}
          </div>
        </section>

        <section className="workspace-section task-section">
          <div className="section-heading"><div><h2>今日待办</h2><p>{completedCount}/{tasks.length} 已完成</p></div><button className="icon-button add-task" onClick={() => navigate('/tasks')} aria-label="添加任务"><Plus size={19} /></button></div>
          <div className="task-progress"><span style={{ width: `${(completedCount / tasks.length) * 100}%` }} /></div>
          <div className="task-list">
            {tasks.map((task) => (
              <button className={`task-item ${task.done ? 'task-item--done' : ''}`} key={task.id} onClick={() => toggleTask(task.id)}>
                <span className="task-check">{task.done && <Check size={14} strokeWidth={3} />}</span>
                <span className="task-copy"><strong>{task.title}</strong><small>{task.project} · {task.due}</small></span>
              </button>
            ))}
          </div>
          <div className="focus-note"><Sparkles size={18} /><div><strong>今日小提示</strong><p>先完成最重要的一件事，再处理其他事项。</p></div></div>
        </section>
      </div>
    </>
  )
}

export default OverviewPage
