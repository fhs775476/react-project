'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'

echarts.use([BarChart, PieChart, GridComponent, TooltipComponent, SVGRenderer])

export default function EChart({ option, className, label }) {
  const container = useRef(null)

  useEffect(() => {
    const node = container.current
    if (!node) return

    const chart = echarts.init(node, null, { renderer: 'svg' })
    chart.setOption(option)
    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(node)

    return () => {
      observer.disconnect()
      chart.dispose()
    }
  }, [option])

  return <div ref={container} className={className} role="img" aria-label={label} />
}
