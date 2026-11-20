import { API_BASE } from '@/utils/http'

/** 封面可能是 /data/xxx 相对路径，也可能直接是外链 */
export const coverOf = (url: string) => (url.startsWith('http') ? url : API_BASE + url)

/** 后端给的是 ISO 时间串，切出日期 2026-10-18 */
export const dateOf = (iso: string) => iso.split('T')[0]
