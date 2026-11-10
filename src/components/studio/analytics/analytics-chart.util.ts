import { DailyAnalyticsRecord } from './analytics.types'

export interface Point {
  x: number
  y: number
}

export function computeChartPoints(
  records: DailyAnalyticsRecord[],
  key: 'pageViews' | 'uniqueVisitors',
  width = 700,
  height = 170,
  padding = 24
): Point[] {
  if (!records || records.length === 0) return []
  if (records.length === 1) {
    return [{ x: width / 2, y: height / 2 }]
  }

  const values = records.map((r) => r[key] || 0)
  const maxVal = Math.max(...values, 10)
  const minVal = 0

  const availableWidth = width
  const availableHeight = height - padding * 2

  return records.map((r, i) => {
    const x = Math.round((i / (records.length - 1)) * availableWidth)
    const normalized = (r[key] - minVal) / (maxVal - minVal)
    const y = Math.round(height - padding - normalized * availableHeight)
    return { x, y }
  })
}

export function buildSmoothPath(points: Point[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const cx1 = p0.x + (p1.x - p0.x) / 2
    const cy1 = p0.y
    const cx2 = p0.x + (p1.x - p0.x) / 2
    const cy2 = p1.y
    d += ` C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`
  }
  return d
}

export function buildAreaPath(points: Point[], height = 170): string {
  if (points.length === 0) return ''
  const line = buildSmoothPath(points)
  const last = points[points.length - 1]
  const first = points[0]
  return `${line} L ${last.x} ${height} L ${first.x} ${height} Z`
}
