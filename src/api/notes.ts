import http from '@/utils/http'

// 笔记对象（根据 notes 表结构定义）
export interface NoteItem {
  id: string
  title: string
  content: string
  subset_id: string | null // 关联分类ID
  created_at: string
}

// --- 获取笔记列表 ---
interface NoteListRes {
  code: number
  data: {
    notes: NoteItem[]
    pageNum: number
    pageSize: number
  }
}
export const getNotes = (data: {
  pageNum?: number // 页码，默认 1
  pageSize?: number // 每页条数，默认 10
  subset_id?: string | undefined // 可选：按 subset_id 过滤
  note_ids?: string | string[] // 可选：按特定ID组过滤
}) => {
  return http.post<any, NoteListRes>('/notes/getNotes', data)
}

// --- 获取笔记总数 ---
interface TotalNoteRes {
  code: number
  data: {
    total: number
  }
}
export const getTotalNotes = (data?: { subset_id?: string; note_ids?: string | string[] }) => {
  return http.post<any, TotalNoteRes>('/notes/getTotalNotes', data || {})
}

// --- 新增笔记 ---
interface CreateNoteReq {
  title: string
  content: string
  subset_id?: string | null
}
interface CreateNoteRes {
  code: number
  data: NoteItem
}
export const insertNotes = (data: CreateNoteReq) => {
  return http.post<any, CreateNoteRes>('/notes/insertNotes', data)
}

// --- 修改笔记 ---
interface UpdateNoteReq {
  id: string
  title?: string
  content?: string
  subset_id?: string | null
}
interface UpdateNoteRes {
  code: number
  data: NoteItem
}
export const updateNotes = (data: UpdateNoteReq) => {
  return http.post<any, UpdateNoteRes>('/notes/updateNotes', data)
}

// --- 删除笔记 ---
interface DeleteNoteRes {
  code: number
  data: {
    message: string
  }
}
export const deleteNotes = (id: string) => {
  return http.post<any, DeleteNoteRes>('/notes/deleteNotes', { id })
}
