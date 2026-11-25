import { http } from '@/utils/http'

export interface GuestbookItem {
  id: string
  nickname: string
  content: string
  created_at: string
}

/** 留言列表：最新的在前 */
export const getGuestbooks = (pageSize = 10, pageNum = 1) =>
  http<{ guestbooks: GuestbookItem[] }>('POST', '/guestbooks/getGuestbook', { pageSize, pageNum })

export const getTotalGuestbook = () =>
  http<{ total: number }>('POST', '/guestbooks/getTotalGuestbook')

/** 发表留言（匿名，称呼 + 内容） */
export const insertGuestbook = (nickname: string, content: string) =>
  http<GuestbookItem>('POST', '/guestbooks/insertGuestbook', { nickname, content })