import { useMemo, useState } from 'react'
import { CalendarDays, LayoutGrid, List, MoreHorizontal, Plus, Users } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { projects } from '../data/workspace.js'

const filters = ['全部', '进行中', '已完成']

function ProjectsPage() {
  const { query } = useOutletContext()
  const [filter, setFilter] = useState('全部')
  const [view, setView] = useState('grid')
  const visibleProjects = useMemo(
    () => projects.filter((project) => {
      const matchesSearch = project.name.includes(query.trim())
      const matchesFilter = filter === '全部' || (filter === '进行中' ? project.status !== '已完成' : project.status === '已完成')
      return matchesSearch && matchesFilter
    }),
    [filter, query],
  )

  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">工作空间</p><h1>项目</h1><p>集中查看进度、成员与重要时间节点。</p></div>
        <button className="primary-action"><Plus size={18} />新建项目</button>
      </header>

      <div className="page-toolbar">
        <div className="filter-tabs" role="group" aria-label="筛选项目">
          {filters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        <div className="view-switch" role="group" aria-label="视图模式">
          <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="网格视图"><LayoutGrid size={18} /></button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="列表视图"><List size={18} /></button>
        </div>
      </div>

      <section className={`projects-page-grid ${view === 'list' ? 'projects-page-grid--list' : ''}`}>
        {visibleProjects.map((project) => (
          <article className="project-detail-card" key={project.id}>
            <div className="project-card-top">
              <span className="project-icon project-icon--large" style={{ background: project.color }}>{project.name.slice(0, 1)}</span>
              <button className="icon-button" aria-label={`${project.name}更多操作`}><MoreHorizontal size={19} /></button>
            </div>
            <div className="project-main"><span className="project-tag">{project.tag} · {project.status}</span><h2>{project.name}</h2></div>
            <div className="progress-label"><span>总体进度</span><strong>{project.progress}%</strong></div>
            <div className="progress-track"><span style={{ width: `${project.progress}%`, background: project.color }} /></div>
            <footer className="project-meta"><span><Users size={15} />{project.members} 位成员</span><span><CalendarDays size={15} />{project.due}</span></footer>
          </article>
        ))}
        {visibleProjects.length === 0 && <p className="empty-state">没有符合条件的项目</p>}
      </section>
    </>
  )
}

export default ProjectsPage
