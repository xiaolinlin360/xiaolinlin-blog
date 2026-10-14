/**
 * 时间格式化
 * @param timeStr 时间字符串
 * @returns 格式化后的时间字符串
 * @description 格式化时间字符串为一小时内、一小时前、24小时内、3天前、具体日期
 * @example
 * formatTime('2023-12-12T12:00:00Z') // '一小时前'
 * formatTime('2023-12-12T12:00:00Z') // '2023-12-12'
 */

const formatTime = (timeStr: string) => {
  if (!timeStr) return ''

  // 将 ISO 时间字符串转为时间戳（毫秒）
  const targetTime = new Date(timeStr).getTime()
  const nowTime = Date.now()

  // 计算时间差（毫秒），并转化为小时
  // 加个 Math.max 防止由于服务器时间稍微快于本地时间导致的负数
  const diffMs = Math.max(0, nowTime - targetTime)
  const diffHours = diffMs / (1000 * 60 * 60)

  // 1. 一小时以内
  if (diffHours < 1) {
    return '一小时内'
  }

  // 2. 一小时~2小时（因为是2小时以内，向下取整也就是1）
  if (diffHours < 2) {
    return '一小时前'
  }

  // 3. 一天以内（2小时~24小时），向下取整
  if (diffHours < 24) {
    return `${Math.floor(diffHours)}小时前`
  }

  // 4. 超过一天的处理（用户没提，但必须兜底，否则逻辑就漏了）
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays <= 3) {
    return `${diffDays}天前`
  }

  // 5. 超过3天，直接展示具体的年月日
  const date = new Date(timeStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default formatTime
