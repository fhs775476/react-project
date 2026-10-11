import { useMemo, useState } from 'react'
import { Check, Pencil, Plus, ShieldCheck, UserRound, Users, X } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { PERMISSIONS } from '../lib/system.js'

const blankUser = { name: '', email: '', department: '', roleId: 'viewer', status: 'active' }

function SystemPage({ system, onChange, currentEmail }) {
  const { query, can } = useOutletContext()
  const editable = can('system.manage')
  const [tab, setTab] = useState('users')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [roleName, setRoleName] = useState('')
  const users = useMemo(() => system.users.filter((user) =>
    [user.name, user.email, user.department].some((value) => value.toLowerCase().includes(query.trim().toLowerCase()))
  ), [query, system.users])

  function openUser(user = null) {
    setEditingId(user?.id ?? null)
    setForm(user ? { name: user.name, email: user.email, department: user.department, roleId: user.roleId, status: user.status } : { ...blankUser, roleId: system.roles.find((role) => role.id === 'viewer')?.id ?? system.roles[0].id })
    setError('')
  }

  function saveUser(event) {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    if (system.users.some((user) => user.email.toLowerCase() === email && user.id !== editingId)) {
      setError('此邮箱已存在。')
      return
    }
    if (editingId && system.users.find((user) => user.id === editingId)?.email === currentEmail && (form.roleId !== 'admin' || form.status !== 'active')) {
      setError('不能停用当前管理员或移除自己的管理员角色。')
      return
    }
    const record = { ...form, name: form.name.trim(), email, department: form.department.trim() || '未分组', id: editingId ?? crypto.randomUUID() }
    onChange({ ...system, users: editingId ? system.users.map((user) => user.id === editingId ? record : user) : [...system.users, record] })
    setForm(null)
  }

  function addRole(event) {
    event.preventDefault()
    const name = roleName.trim()
    if (!name || system.roles.some((role) => role.name === name)) return
    onChange({ ...system, roles: [...system.roles, { id: crypto.randomUUID(), name, description: '自定义角色', permissions: ['overview.view'] }] })
    setRoleName('')
  }

  function togglePermission(role, key) {
    if (!editable || role.locked) return
    const permissions = role.permissions.includes(key) ? role.permissions.filter((item) => item !== key) : [...role.permissions, key]
    // 编辑权限需要对应的查看权限，避免出现不可进入的编辑页面。
    const parent = { 'events.manage': 'events.view', 'tasks.manage': 'tasks.view', 'system.manage': 'system.view' }[key]
    const children = { 'events.view': 'events.manage', 'tasks.view': 'tasks.manage', 'system.view': 'system.manage' }
    const withParent = parent && permissions.includes(key) && !permissions.includes(parent) ? [...permissions, parent] : permissions
    const nextPermissions = children[key] && !withParent.includes(key) ? withParent.filter((item) => item !== children[key]) : withParent
    onChange({ ...system, roles: system.roles.map((item) => item.id === role.id ? { ...item, permissions: nextPermissions } : item) })
  }

  function removeRole(role) {
    if (role.locked || system.users.some((user) => user.roleId === role.id)) return
    onChange({ ...system, roles: system.roles.filter((item) => item.id !== role.id) })
  }

  return <>
    <header className="page-heading">
      <div><p className="eyebrow">工作空间设置</p><h1>系统管理</h1><p>维护用户资料、账号状态和角色权限。</p></div>
      {tab === 'users' && editable && <button className="primary-action" onClick={() => openUser()}><Plus size={18} />添加用户</button>}
    </header>

    <section className="system-summary" aria-label="系统管理概览">
      <article><Users size={20} /><strong>{system.users.length}</strong><span>用户总数</span></article>
      <article><UserRound size={20} /><strong>{system.users.filter((user) => user.status === 'active').length}</strong><span>启用账号</span></article>
      <article><ShieldCheck size={20} /><strong>{system.roles.length}</strong><span>角色数量</span></article>
    </section>

    <div className="system-tabs" role="tablist" aria-label="系统管理栏目">
      <button role="tab" aria-selected={tab === 'users'} className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>用户信息</button>
      <button role="tab" aria-selected={tab === 'roles'} className={tab === 'roles' ? 'active' : ''} onClick={() => setTab('roles')}>权限分配</button>
    </div>

    {tab === 'users' ? <section className="system-panel" aria-label="用户列表">
      <div className="system-panel-heading"><div><h2>用户列表</h2><p>通过角色为用户分配访问和编辑权限</p></div><span>{users.length} 位用户</span></div>
      <div className="system-table-wrap"><table className="system-table"><thead><tr><th>用户</th><th>部门</th><th>角色</th><th>状态</th><th>操作</th></tr></thead><tbody>
        {users.map((user) => <tr key={user.id}><td><div className="system-user"><span className="avatar">{user.name.slice(0, 2)}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td><td>{user.department}</td><td><span className="system-role-badge">{system.roles.find((role) => role.id === user.roleId)?.name ?? '未分配'}</span></td><td><span className={`system-status ${user.status === 'active' ? 'system-status--active' : ''}`}>{user.status === 'active' ? '已启用' : '已停用'}</span></td><td>{editable && <button className="system-edit" onClick={() => openUser(user)} aria-label={`编辑${user.name}`}><Pencil size={15} />编辑</button>}</td></tr>)}
      </tbody></table></div>
      {users.length === 0 && <p className="empty-state">没有找到符合条件的用户</p>}
    </section> : <section className="system-panel" aria-label="角色权限">
      <div className="system-panel-heading"><div><h2>角色权限</h2><p>勾选角色可使用的功能，管理员始终拥有全部权限</p></div></div>
      {editable && <form className="system-add-role" onSubmit={addRole}><input value={roleName} onChange={(event) => setRoleName(event.target.value)} placeholder="输入新角色名称" aria-label="新角色名称" required /><button className="secondary-action" type="submit"><Plus size={16} />新增角色</button></form>}
      <div className="system-table-wrap"><table className="system-table permission-table"><thead><tr><th>权限</th>{system.roles.map((role) => <th key={role.id}><strong>{role.name}</strong><small>{role.description}</small>{editable && !role.locked && !system.users.some((user) => user.roleId === role.id) && <button className="role-remove" onClick={() => removeRole(role)} aria-label={`删除${role.name}`} title="删除未使用的角色"><X size={14} /></button>}</th>)}</tr></thead><tbody>
        {PERMISSIONS.map((permission) => <tr key={permission.key}><td>{permission.label}</td>{system.roles.map((role) => <td key={role.id}><button className={`permission-check ${role.permissions.includes(permission.key) ? 'permission-check--on' : ''}`} onClick={() => togglePermission(role, permission.key)} disabled={!editable || role.locked} aria-label={`${role.name}：${permission.label}`} aria-pressed={role.permissions.includes(permission.key)}>{role.permissions.includes(permission.key) && <Check size={14} strokeWidth={3} />}</button></td>)}</tr>)}
      </tbody></table></div>
    </section>}

    {form && <div className="modal-backdrop" role="presentation" onMouseDown={() => setForm(null)}><section className="event-modal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title" onMouseDown={(event) => event.stopPropagation()}><header><div><p className="eyebrow">系统管理</p><h2 id="user-modal-title">{editingId ? '编辑用户' : '添加用户'}</h2></div><button className="icon-button" onClick={() => setForm(null)} aria-label="关闭"><X size={20} /></button></header><form className="event-form" onSubmit={saveUser}>
      {error && <p className="form-error form-field--full" role="alert">{error}</p>}
      <label className="form-field"><span>姓名</span><input autoFocus required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
      <label className="form-field"><span>邮箱</span><input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
      <label className="form-field"><span>部门</span><input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} /></label>
      <label className="form-field"><span>角色</span><select value={form.roleId} onChange={(event) => setForm({ ...form, roleId: event.target.value })}>{system.roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
      <label className="form-field"><span>账号状态</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="active">已启用</option><option value="disabled">已停用</option></select></label>
      <div className="modal-actions form-field--full"><button type="button" className="secondary-action" onClick={() => setForm(null)}>取消</button><button type="submit" className="primary-action">保存用户</button></div>
    </form></section></div>}
  </>
}

export default SystemPage
