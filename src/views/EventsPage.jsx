'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CalendarRange, Clock3, MapPin, Plus, UserRound, X } from 'lucide-react'
import { useWorkspace } from '../components/WorkspaceContext.jsx'
import { initialEvents } from '../data/workspace.js'

const categories = ['全部', '会议', '工作', '活动', '个人']
const emptyForm = {
  title: '',
  category: '工作',
  date: '2026-10-10',
  time: '09:00',
  location: '',
  summary: '',
}

function loadEvents() {
  try {
    const savedEvents = JSON.parse(localStorage.getItem('flowdesk-events'))
    return Array.isArray(savedEvents) && savedEvents.length ? savedEvents : initialEvents
  } catch {
    return initialEvents
  }
}

function formatEventDate(date) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date(`${date}T00:00:00`))
}

function EventsPage() {
  const { query, can } = useWorkspace()
  const [events, setEvents] = useState(loadEvents)
  const [category, setCategory] = useState('全部')
  const [form, setForm] = useState(emptyForm)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    localStorage.setItem('flowdesk-events', JSON.stringify(events))
  }, [events])

  const visibleEvents = useMemo(
    () => events
      .filter((event) => {
        const keyword = query.trim().toLowerCase()
        const matchesSearch = !keyword || [event.title, event.summary, event.location].some((value) => value.toLowerCase().includes(keyword))
        const matchesCategory = category === '全部' || event.category === category
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [category, events, query],
  )

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function createEvent(event) {
    event.preventDefault()
    const colors = { 会议: '#ed6a5a', 工作: '#2a9d8f', 活动: '#e9a23b', 个人: '#8b6fc0' }
    setEvents((current) => [
      ...current,
      {
        id: Date.now(),
        ...form,
        title: form.title.trim(),
        location: form.location.trim() || '待确定',
        summary: form.summary.trim() || '暂无补充说明。',
        status: '新建',
        color: colors[form.category],
        author: '我创建的',
      },
    ])
    setForm(emptyForm)
    setIsCreating(false)
  }

  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">时间与动态</p><h1>事件记录</h1><p>记录重要事件，保留清晰的时间、地点和背景信息。</p></div>
        {can('events.manage') && <button className="primary-action" onClick={() => setIsCreating(true)}><Plus size={18} />新建事件</button>}
      </header>

      <div className="event-toolbar">
        <div className="filter-tabs" role="group" aria-label="筛选事件类型">
          {categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <span>共 {visibleEvents.length} 条记录</span>
      </div>

      <section className="event-list" aria-label="事件列表">
        {visibleEvents.map((event) => (
          <article className="event-row" key={event.id}>
            <div className="event-date-block">
              <strong>{event.date.slice(8)}</strong>
              <span>{event.date.slice(5, 7)} 月</span>
            </div>
            <span className="event-line" style={{ '--event-color': event.color }} />
            <div className="event-content">
              <div className="event-title-row">
                <div><span className="event-category" style={{ color: event.color }}>{event.category}</span><h2>{event.title}</h2></div>
                <span className="event-status">{event.status}</span>
              </div>
              <p>{event.summary}</p>
              <footer className="event-meta">
                <span><CalendarDays size={15} />{formatEventDate(event.date)}</span>
                <span><Clock3 size={15} />{event.time}</span>
                <span><MapPin size={15} />{event.location}</span>
                <span><UserRound size={15} />{event.author}</span>
              </footer>
            </div>
          </article>
        ))}
        {visibleEvents.length === 0 && <div className="event-empty"><CalendarRange size={28} /><strong>没有找到相关事件</strong><p>调整筛选条件，或创建一条新的事件记录。</p></div>}
      </section>

      {isCreating && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsCreating(false)}>
          <section className="event-modal" role="dialog" aria-modal="true" aria-labelledby="new-event-title" onMouseDown={(event) => event.stopPropagation()}>
            <header><div><p className="eyebrow">添加记录</p><h2 id="new-event-title">新建事件</h2></div><button className="icon-button" onClick={() => setIsCreating(false)} aria-label="关闭"><X size={20} /></button></header>
            <form className="event-form" onSubmit={createEvent}>
              <label className="form-field form-field--full"><span>事件标题</span><input autoFocus required value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="例如：产品方案评审会" /></label>
              <label className="form-field"><span>事件类型</span><select value={form.category} onChange={(event) => updateForm('category', event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="form-field"><span>日期</span><input required type="date" value={form.date} onChange={(event) => updateForm('date', event.target.value)} /></label>
              <label className="form-field"><span>时间</span><input required type="time" value={form.time} onChange={(event) => updateForm('time', event.target.value)} /></label>
              <label className="form-field"><span>地点</span><input value={form.location} onChange={(event) => updateForm('location', event.target.value)} placeholder="线上或具体地点" /></label>
              <label className="form-field form-field--full"><span>事件说明</span><textarea rows="4" value={form.summary} onChange={(event) => updateForm('summary', event.target.value)} placeholder="补充事件背景、目标或相关信息" /></label>
              <div className="modal-actions form-field--full"><button type="button" className="secondary-action" onClick={() => setIsCreating(false)}>取消</button><button type="submit" className="primary-action">创建事件</button></div>
            </form>
          </section>
        </div>
      )}
    </>
  )
}

export default EventsPage
