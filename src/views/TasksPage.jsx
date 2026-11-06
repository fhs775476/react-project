'use client'

import { useState } from 'react'
import { CalendarDays, Check, CircleAlert, ListTodo, Pencil, Plus, Trash2, X } from 'lucide-react'
import PaginatedList from '../components/PaginatedList.jsx'
import { useWorkspace } from '../components/WorkspaceContext.jsx'

const filters = ['全部', '待完成', '已完成']
const emptyForm = { title: '', eventId: '', due: '', priority: '中', done: false }

function TasksPage() {
  const { query, can, events, tasks, saveTask, deleteTask, toggleTask, getTaskEventName } = useWorkspace()
  const [filter, setFilter] = useState('全部')
  const [form, setForm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const completedCount = tasks.filter((task) => task.done).length
  const visibleTasks = tasks.filter((task) => {
    const keyword = query.trim().toLowerCase()
    const matchesSearch = task.title.toLowerCase().includes(keyword) || getTaskEventName(task).toLowerCase().includes(keyword)
    const matchesFilter = filter === '全部' || (filter === '已完成' ? task.done : !task.done)
    return matchesSearch && matchesFilter
  })

  function openTask(task = null) {
    setEditingId(task?.id ?? null)
    setForm(task ? {
      title: task.title, eventId: task.eventId ?? '', due: task.due,
      priority: task.priority, done: task.done,
    } : { ...emptyForm })
  }

  function submitTask(event) {
    event.preventDefault()
    if (!can('tasks.manage')) return
    saveTask({
      id: editingId ?? crypto.randomUUID(),
      ...form,
      title: form.title.trim(), due: form.due.trim() || '待安排',
      eventId: form.eventId === '' ? null : events.find((event) => String(event.id) === String(form.eventId))?.id ?? null,
    })
    setForm(null)
  }

  function removeTask(task) {
    if (can('tasks.manage') && window.confirm(`确定删除「${task.title}」吗？`)) deleteTask(task.id)
  }

  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">事件执行</p><h1>事件任务</h1><p>跟进每个事件的准备事项，确保关键节点按时完成。</p></div>
        {can('tasks.manage') && <button className="primary-action" onClick={() => openTask()}><Plus size={18} />添加事件任务</button>}
      </header>

      <section className="task-summary-grid">
        <article><ListTodo size={20} /><div><strong>{tasks.length}</strong><span>全部事件任务</span></div></article>
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
        <div className="task-table-head"><span>事件任务</span><span>优先级</span><span>截止时间</span><span>操作</span></div>
        <PaginatedList
          key={`${query}:${filter}`}
          items={visibleTasks}
          className="task-page-list"
          label="事件任务"
          emptyState={<p className="empty-state">没有符合条件的任务</p>}
          renderItem={(task) => (
            <article className={`task-row ${task.done ? 'task-row--done' : ''}`} key={task.id}>
              <button className="task-check" onClick={() => toggleTask(task.id)} disabled={!can('tasks.manage')} aria-label={task.done ? `恢复${task.title}` : `完成${task.title}`}>{task.done && <Check size={14} strokeWidth={3} />}</button>
              <div className="task-row-main"><strong>{task.title}</strong><small>关联事件：{getTaskEventName(task)}</small></div>
              <span className={`priority priority--${task.priority}`}>{task.priority}</span>
              <span className="task-date"><CalendarDays size={15} />{task.due}</span>
              <div className="record-actions task-row-actions">{can('tasks.manage') && <><button className="icon-button" onClick={() => openTask(task)} aria-label={`编辑${task.title}`} title="编辑任务"><Pencil size={16} /></button><button className="icon-button delete-action" onClick={() => removeTask(task)} aria-label={`删除${task.title}`} title="删除任务"><Trash2 size={16} /></button></>}</div>
            </article>
          )}
        />
      </section>

      {form && <div className="modal-backdrop" role="presentation" onMouseDown={() => setForm(null)}>
        <section className="event-modal" role="dialog" aria-modal="true" aria-labelledby="task-form-title" onMouseDown={(event) => event.stopPropagation()}>
          <header><div><p className="eyebrow">事件执行</p><h2 id="task-form-title">{editingId === null ? '添加事件任务' : '编辑事件任务'}</h2></div><button className="icon-button" onClick={() => setForm(null)} aria-label="关闭"><X size={20} /></button></header>
          <form className="event-form" onSubmit={submitTask}>
            <label className="form-field form-field--full"><span>任务名称</span><input autoFocus required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="例如：准备会议资料" /></label>
            <label className="form-field"><span>关联事件</span><select value={form.eventId} onChange={(event) => setForm({ ...form, eventId: event.target.value })}><option value="">未关联事件</option>{events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select></label>
            <label className="form-field"><span>截止时间</span><input value={form.due} onChange={(event) => setForm({ ...form, due: event.target.value })} placeholder="例如：2026-10-25" /></label>
            <label className="form-field"><span>优先级</span><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}><option>高</option><option>中</option><option>低</option></select></label>
            <label className="form-field"><span>状态</span><select value={form.done ? 'done' : 'pending'} onChange={(event) => setForm({ ...form, done: event.target.value === 'done' })}><option value="pending">待完成</option><option value="done">已完成</option></select></label>
            <div className="modal-actions form-field--full"><button type="button" className="secondary-action" onClick={() => setForm(null)}>取消</button><button type="submit" className="primary-action">保存任务</button></div>
          </form>
        </section>
      </div>}
    </>
  )
}

export default TasksPage
