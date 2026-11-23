import { http } from '@/utils/http'

export interface NoteItem {
  id: string
  title: string
  /** markdown 原文 */
  content: string
  subset_id: string
  created_at: string
}

/** 随笔列表：不用登录 */
export const getNotes = (pageSize = 20, pageNum = 1) =>
  http<{ notes: NoteItem[] }>('POST', '/notes/getNotes', { pageSize, pageNum })