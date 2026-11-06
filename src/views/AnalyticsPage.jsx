'use client'

import { useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock3, Target, Users } from 'lucide-react'
import EChart from '../components/EChart.jsx'
import { useWorkspace } from '../components/WorkspaceContext.jsx'

const weeklyData = [
  { day: '周一', value: 62 },
  { day: '周二', value: 78 },
  { day: '周三', value: 55 },
  { day: '周四', value: 88 },
  { day: '周五', value: 72 },
  { day: '周六', value: 36 },
  { day: '周日', value: 48 },
]
const weeklyAverage = Math.round(weeklyData.reduce((total, item) => total + item.value, 0) / weeklyData.length)

const eventTypes = [
  { name: '会议', color: '#ed6a5a' },
  { name: '工作', color: '#2a9d8f' },
  { name: '活动', color: '#e9a23b' },
  { name: '个人', color: '#8b6fc0' },
]

function AnalyticsPage() {
  const { events, theme } = useWorkspace()
  const dark = theme === 'dark'
  const ink = dark ? '#ecf2ef' : '#18201d'
  const muted = dark ? '#9ba8a2' : '#68716d'
  const line = dark ? '#2b3932' : '#dde2de'
  const surface = dark ? '#18221d' : '#ffffff'
  const green = dark ? '#6fc59d' : '#205b45'

  const typeData = useMemo(() => eventTypes.map((type) => ({
    ...type,
    value: events.filter((event) => event.category === type.name).length,
  })), [events])

  const barOption = useMemo(() => ({
    animationDuration: 450,
    grid: { left: 8, right: 8, top: 26, bottom: 8, containLabel: true },
    tooltip: { trigger: 'axis', valueFormatter: (value) => `${value}%`, backgroundColor: surface, borderColor: line, textStyle: { color: ink } },
    xAxis: { type: 'category', data: weeklyData.map((item) => item.day), axisTick: { show: false }, axisLine: { lineStyle: { color: line } }, axisLabel: { color: muted } },
    yAxis: { type: 'value', min: 0, max: 100, axisLabel: { color: muted, formatter: '{value}%' }, axisLine: { show: false }, splitLine: { lineStyle: { color: line } } },
    series: [{ type: 'bar', data: weeklyData.map((item) => item.value), barMaxWidth: 38, itemStyle: { color: green, borderRadius: [5, 5, 0, 0] }, label: { show: true, position: 'top', formatter: '{c}%', color: muted, fontSize: 11 } }],
  }), [green, ink, line, muted, surface])

  const pieOption = useMemo(() => ({
    animationDuration: 450,
    color: eventTypes.map((type) => type.color),
    tooltip: { trigger: 'item', formatter: '{b}: {c} 个 ({d}%)', backgroundColor: surface, borderColor: line, textStyle: { color: ink } },
    series: [{ type: 'pie', radius: ['57%', '78%'], center: ['50%', '50%'], avoidLabelOverlap: false, label: { show: false }, labelLine: { show: false }, itemStyle: { borderColor: surface, borderWidth: 3 }, data: events.length ? typeData.filter((type) => type.value > 0).map((type) => ({ name: type.name, value: type.value, itemStyle: { color: type.color } })) : [{ name: '暂无事件', value: 1, itemStyle: { color: line } }] }],
  }), [events.length, ink, line, surface, typeData])

  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">团队表现</p><h1>数据</h1><p>了解事件执行效率、投入时间与团队协作趋势。</p></div>
        <select className="period-select" aria-label="数据周期" defaultValue="本月"><option>本周</option><option>本月</option><option>本季度</option></select>
      </header>

      <section className="analytics-kpis">
        <article><span className="kpi-icon"><CheckCircle2 size={20} /></span><p>完成任务</p><strong>96</strong><small className="positive"><ArrowUpRight size={14} />12.4%</small></article>
        <article><span className="kpi-icon"><Clock3 size={20} /></span><p>专注时间</p><strong>138h</strong><small className="positive"><ArrowUpRight size={14} />8.1%</small></article>
        <article><span className="kpi-icon"><Target size={20} /></span><p>按时完成率</p><strong>87%</strong><small className="positive"><ArrowUpRight size={14} />3.2%</small></article>
        <article><span className="kpi-icon"><Users size={20} /></span><p>活跃成员</p><strong>18</strong><small className="negative"><ArrowDownRight size={14} />1 人</small></article>
      </section>

      <div className="analytics-grid">
        <section className="chart-panel">
          <div className="section-heading"><div><h2>工作效率趋势</h2><p>每日完成任务比例 · 演示数据</p></div><span className="chart-total">本周均值 {weeklyAverage}%</span></div>
          <EChart option={barOption} className="efficiency-chart" label="本周每日工作效率柱状图" />
        </section>

        <section className="chart-panel workload-panel">
          <div className="section-heading"><div><h2>事件类型分布</h2><p>当前事件记录占比</p></div></div>
          <div className="donut-wrap">
            <div className="donut-visual">
              <EChart option={pieOption} className="event-type-chart" label="当前事件类型占比圆环图" />
              <span className="donut-center"><strong>{events.length}</strong>个事件</span>
            </div>
            <div className="chart-legend">
              {typeData.map((type) => <span key={type.name}><i style={{ background: type.color }} />{type.name}<strong>{events.length ? Math.round(type.value / events.length * 100) : 0}%</strong></span>)}
            </div>
          </div>
        </section>
      </div>

      <section className="insight-strip">
        <div><span>最高效的一天</span><strong>星期四</strong><small>完成 18 项任务</small></div>
        <div><span>平均任务周期</span><strong>2.4 天</strong><small>较上月缩短 0.3 天</small></div>
        <div><span>最活跃事件</span><strong>品牌方案评审会</strong><small>本月更新 42 次</small></div>
      </section>
    </>
  )
}

export default AnalyticsPage
