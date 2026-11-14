import http from '@/utils/http'

/** 一条留言：只有称呼、内容和时间，没有用户概念 */
export interface Guestbook {
  id: string
  nickname: string
  content: string
  created_at: string
}

// 获取留言列表
interface GuestbookListRes {
  code: number
  message: string
  data: {
    guestbooks: Guestbook[]
    pageNum: number
    pageSize: number
  }
}
export const getGuestbook = (data: { pageNum: number; pageSize: number }) => {
  return http.post<any, GuestbookListRes>('/guestbooks/getGuestbook', data)
}

// 获取留言总数
interface GuestbookTotalRes {
  code: number
  message: string
  data: { total: number }
}
export const getTotalGuestbook = () => {
  return http.post<any, GuestbookTotalRes>('/guestbooks/getTotalGuestbook')
}

// 发表留言
interface InsertGuestbookRes {
  code: number
  message: string
  data: Guestbook
}
export const insertGuestbook = (data: { nickname: string; content: string }) => {
  return http.post<any, InsertGuestbookRes>('/guestbooks/insertGuestbook', data)
}

// 删除留言
interface DeleteGuestbookRes {
  code: number
  message: string
  data: null
}
export const deleteGuestbook = (id: string) => {
  return http.post<any, DeleteGuestbookRes>('/guestbooks/deleteGuestbook', { id })
}
