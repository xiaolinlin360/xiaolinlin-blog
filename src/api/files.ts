import http from '@/utils/http'
// 文件对象（根据 files 表推断，字段名可按实际表结构调整）
export interface FileItem {
  id: string
  user_id: string
  file_name: string
  type: string
  size: string
  url: string
  created_at: string
  article_id: string | null // 关联文章ID (uuid，可为 null)
  gallery_id: string | null // 关联画廊ID (uuid，可为 null)
}
interface FileRes {
  code: number
  data: {
    files: FileItem[]
    pageNum: number
    pageSize: number
  }
}

// 获取文件（分页查询）
// 注意：后端 file_urls 实际用于 `id = ANY(...)` 过滤，因此需传入 id 数组
export const getFiles = (data: {
  pageNum?: number // 页码，默认 1
  pageSize?: number // 每页条数，默认 10，最大 100
  file_urls?: string | string[] // 实际用作 id 过滤（单值/多值均可）
}) => {
  return http.post<any, FileRes>('/files/getFile', data)
}

// 获取文件总数
interface TotalFileRes {
  code: number
  data: {
    total: number
  }
}
export const getTotalFile = () => {
  return http.post<any, TotalFileRes>('/files/getTotalFile')
}

//上传文件
interface FormDataFile {
  gallery_id?: string | null
  article_id?: string | null
  file: File
}
interface FormDataFileRes {
  code: number
  data: {
    message: string
  }
}
export const uploadFile = (data: FormDataFile) => {
  return http.post<any, FormDataFileRes>('/files/upload', data)
}
