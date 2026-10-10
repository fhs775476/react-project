import { useMemo, useState } from 'react'
import { CalendarDays, Check, CircleAlert, ListTodo, Plus } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { initialTasks } from '../data/workspace.js'

const filters = ['全部', '待完成', '已完成']

function TasksPage() {
  const { query } = useOutletContext()
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState('全部')
  const completedCount = tasks.filter((task) => task.done).length
  const visibleTasks = useMemo(
    () => tasks.filter((task) => {
      const matchesSearch = task.title.includes(query.trim()) || task.project.includes(query.trim())
      const matchesFilter = filter === '全部' || (filter === '已完成' ? task.done : !task.done)
      return matchesSearch && matchesFilter
    }),
    [filter, query, tasks],
  )

  function toggleTask(id) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  function addTask() {
    setTasks((current) => [
      ...current,
      { id: Date.now(), title: '新任务', project: '个人待办', due: '待安排', priority: '中', done: false },
    ])
  }

  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">工作安排</p><h1>任务</h1><p>按优先级推进任务，清楚掌握每天的工作量。</p></div>
        <button className="primary-action" onClick={addTask}><Plus size={18} />添加任务</button>
      </header>

      <section className="task-summary-grid">
        <article><ListTodo size={20} /><div><strong>{tasks.length}</strong><span>全部任务</span></div></article>
        <article><CircleAlert size={20} /><div><strong>{tasks.length - completedCount}</strong><span>待完成</span></div></article>
        <article><Check size={20} /><div><strong>{completedCount}</strong><span>已完成</span></div></article>
      </section>

      <section className="task-board">
        <div className="task-board-header">
          <div className="filter-tabs" role="group" aria-label="筛选任务">
            {filters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
          </div>
          <span>{visibleTasks.length} 项任务</span>
        </div>
        <div className="task-table-head"><span>任务</span><span>优先级</span><span>截止时间</span></div>
        <div className="task-page-list">
          {visibleTasks.map((task) => (
            <article className={`task-row ${task.done ? 'task-row--done' : ''}`} key={task.id}>
              <button className="task-check" onClick={() => toggleTask(task.id)} aria-label={task.done ? `恢复${task.title}` : `完成${task.title}`}>{task.done && <Check size={14} strokeWidth={3} />}</button>
              <div className="task-row-main"><strong>{task.title}</strong><small>{task.project}</small></div>
              <span className={`priority priority--${task.priority}`}>{task.priority}</span>
              <span className="task-date"><CalendarDays size={15} />{task.due}</span>
            </article>
          ))}
          {visibleTasks.length === 0 && <p className="empty-state">没有符合条件的任务</p>}
        </div>
      </section>
    </>
  )
}

export default TasksPage
