import { url as API_BASE } from './http'

/**
 * 把后端返回的静态资源路径拼成可直接访问的绝对地址。
 *
 * 为什么需要：后端存的是 `/data/<fileId>/<fileName>` 这种相对路径，
 * 而前端跑在 5173、后端在 3001。直接把相对路径塞进 <img src> 或 markdown，
 * 浏览器会去前端域名下找（5173/data/...）→ 404。
 *
 * - API_BASE 带不带尾斜杠都能正确拼接（不会拼出 `//data`）
 * - 本身已是绝对地址（http/https/blob/data）时原样返回
 * - 空值返回空串，调用方自己决定要不要兜底占位图
 */
export const toAbsoluteUrl = (pathOrUrl: string): string => {
  if (!pathOrUrl) return ''
  try {
    return new URL(pathOrUrl, API_BASE).href
  } catch {
    return `${API_BASE.replace(/\/+$/, '')}${pathOrUrl}`
  }
}

export default toAbsoluteUrl
