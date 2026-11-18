/** 后端地址，可以在 .env 里用 VITE_API_BASE 覆盖 */
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'
//封装http，不使用axios
export const http = async <T>(method: string = 'GET', path: string, body: unknown = {}) => {
  const res = await fetch(API_BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (json.code !== 200) {
    throw new Error(json.message || '请求失败')
  }
  return json.data as T
}
