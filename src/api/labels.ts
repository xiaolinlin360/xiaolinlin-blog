import http from '@/utils/http'

// 获取标签
export interface Labels {
  id: string
  label_name: string
  created_at: string
}
interface getLabelsRef {
  data: Labels[]
  code: number
}
export const getLabels = (params?: { keyword?: string }) => {
  return http.post<any, getLabelsRef>('/labels/getLabels', params)
}

// 插入标签
interface insertLabelsRef {
  data: { message: string }
  code: number
}
export const insertLabels = (data: { label_name: string }) => {
  return http.post<any, insertLabelsRef>('/labels/insertLabels', data)
}

// 更新标签
interface updateLabelsRef {
  data: { message: string }
  code: number
}
export const updateLabels = (data: { id: string; label_name: string }) => {
  return http.post<any, updateLabelsRef>('/labels/updateLabels', data)
}

// 删除标签
interface deleteLabelsRef {
  data: { message: string }
  code: number
}
export const deleteLabels = (data: { id: string }) => {
  return http.post<any, deleteLabelsRef>('/labels/deleteLabels', data)
}
