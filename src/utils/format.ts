import { API_BASE } from '@/utils/http'

/** 封面可能是 /data/xxx 相对路径，也可能直接是外链 */
export const coverOf = (url: string) => (url.startsWith('http') ? url : API_BASE + url)

/** 后端给的是 ISO 时间串，切出日期 2026-10-18 */
export const dateOf = (iso: string) => iso.split('T')[0]

/** 卡片里的简介：优先用 introduce，没有就把正文的标签去掉凑一段 */
export const excerptOf = (article: { introduce: string | null; content: string }) =>
  article.introduce ||
  article.content
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

