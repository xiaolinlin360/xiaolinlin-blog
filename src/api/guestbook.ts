import { http } from '@/utils/http'

export interface GuestbookItem {
  id: string
  nickname: string
  content: string
  created_at: string
  /** 博主的回复，没有就是 null */
  reply?: string | null
  replied_at?: string | null
}

/** 留言列表：最新的在前（email 不公开，接口不会返回） */
export const getGuestbooks = (pageSize = 10, pageNum = 1) =>
  http<{ guestbooks: GuestbookItem[] }>('POST', '/guestbooks/getGuestbook', { pageSize, pageNum })

export const getTotalGuestbook = () =>
  http<{ total: number }>('POST', '/guestbooks/getTotalGuestbook')

/** 发表留言（匿名，称呼 + 内容 + 可选邮箱） */
export const insertGuestbook = (nickname: string, content: string, email = '') =>
  http<GuestbookItem>('POST', '/guestbooks/insertGuestbook', { nickname, content, email })

/** 回复留言（只有博主能调） */
export const replyGuestbook = (id: string, reply: string) =>
  http<{ id: string; reply: string | null; replied_at: string | null }>(
    'POST',
    '/guestbooks/reply',
    { id, reply }
  )