import { initialEvents, initialEventTasks } from '../data/workspace.js'

function readList(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return Array.isArray(value) ? value : fallback
  } catch {
    return fallback
  }
}

export function loadWorkspace() {
  const events = readList('flowdesk-events', initialEvents)
  const tasks = readList('flowdesk-tasks', initialEventTasks).map((task) => {
    const { event, ...fields } = task
    const eventId = task.eventId ?? events.find((item) => item.title === event)?.id ?? null
    return { ...fields, eventId: events.some((item) => String(item.id) === String(eventId)) ? eventId : null }
  })
  return { events, tasks }
}

export function getTaskEventName(task, events) {
  return events.find((event) => String(event.id) === String(task.eventId))?.title ?? '未关联事件'
}
