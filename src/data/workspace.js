export const initialEvents = [
  { id: 1, title: '品牌方案评审会', category: '会议', date: '2026-10-10', time: '10:00', location: '三楼会议室', summary: '评审新版品牌视觉方案并确认后续落地节奏。', status: '即将开始', color: '#ed6a5a', author: '设计团队' },
  { id: 2, title: '移动端新版发布', category: '工作', date: '2026-10-12', time: '14:30', location: '线上', summary: '发布 2.4.0 版本，重点优化导航和首屏性能。', status: '已计划', color: '#2a9d8f', author: '产品团队' },
  { id: 3, title: '秋季内容共创', category: '活动', date: '2026-10-16', time: '13:30', location: '创意空间', summary: '围绕秋季主题完成选题讨论与内容排期。', status: '已计划', color: '#e9a23b', author: '内容团队' },
  { id: 4, title: '数据看板验收', category: '工作', date: '2026-10-18', time: '16:00', location: '线上', summary: '核对核心指标口径并完成上线前验收。', status: '待确认', color: '#4d7cfe', author: '研发团队' },
  { id: 5, title: '季度团队复盘', category: '会议', date: '2026-10-22', time: '15:00', location: '多功能厅', summary: '回顾季度目标，分享经验并确定下一阶段重点。', status: '已计划', color: '#8b6fc0', author: '全体成员' },
]

export const initialEventTasks = [
  { id: 1, title: '确认评审会参会名单', event: '品牌方案评审会', due: '今天', priority: '高', done: false },
  { id: 2, title: '整理品牌方案演示稿', event: '品牌方案评审会', due: '今天', priority: '中', done: false },
  { id: 3, title: '完成发布检查清单', event: '移动端新版发布', due: '明天', priority: '高', done: true },
  { id: 4, title: '准备应用商店更新文案', event: '移动端新版发布', due: '明天', priority: '中', done: false },
  { id: 5, title: '收集秋季选题提案', event: '秋季内容共创', due: '10 月 14 日', priority: '中', done: false },
  { id: 6, title: '核对指标定义文档', event: '数据看板验收', due: '10 月 17 日', priority: '低', done: false },
]
