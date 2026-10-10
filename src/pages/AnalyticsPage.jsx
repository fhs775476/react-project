import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock3, Target, Users } from 'lucide-react'

const weeklyData = [
  { day: '周一', value: 62 },
  { day: '周二', value: 78 },
  { day: '周三', value: 55 },
  { day: '周四', value: 88 },
  { day: '周五', value: 72 },
  { day: '周六', value: 36 },
  { day: '周日', value: 48 },
]

function AnalyticsPage() {
  return (
    <>
      <header className="page-heading">
        <div><p className="eyebrow">团队表现</p><h1>数据</h1><p>了解项目效率、投入时间与团队协作趋势。</p></div>
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
          <div className="section-heading"><div><h2>工作效率趋势</h2><p>每日完成任务比例</p></div><span className="chart-total">本周 72%</span></div>
          <div className="bar-chart" aria-label="本周每日工作效率柱状图">
            {weeklyData.map((item) => (
              <div className="bar-column" key={item.day}>
                <span className="bar-value">{item.value}%</span>
                <div className="bar-track"><span style={{ height: `${item.value}%` }} /></div>
                <small>{item.day}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="chart-panel workload-panel">
          <div className="section-heading"><div><h2>项目分布</h2><p>当前工作投入占比</p></div></div>
          <div className="donut-wrap">
            <div className="donut-chart"><span><strong>6</strong>个项目</span></div>
            <div className="chart-legend">
              <span><i style={{ background: '#2a9d8f' }} />产品研发 <strong>42%</strong></span>
              <span><i style={{ background: '#ed6a5a' }} />视觉设计 <strong>31%</strong></span>
              <span><i style={{ background: '#e9a23b' }} />内容运营 <strong>17%</strong></span>
              <span><i style={{ background: '#8b6fc0' }} />用户研究 <strong>10%</strong></span>
            </div>
          </div>
        </section>
      </div>

      <section className="insight-strip">
        <div><span>最高效的一天</span><strong>星期四</strong><small>完成 18 项任务</small></div>
        <div><span>平均任务周期</span><strong>2.4 天</strong><small>较上月缩短 0.3 天</small></div>
        <div><span>最活跃项目</span><strong>品牌视觉升级</strong><small>本月更新 42 次</small></div>
      </section>
    </>
  )
}

export default AnalyticsPage
