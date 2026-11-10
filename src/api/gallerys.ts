import http from '@/utils/http'

/** 图库卡片（列表用，gallery_urls 是照片 url 数组） */
export interface Gallery {
  id: string
  title: string
  subset_id?: string
  created_at: string
  gallery_urls: string[]
  photo_count?: number
}

/** 单张照片（files 表里挂了 gallery_id 的记录） */
export interface GalleryPhoto {
  id: string
  file_name: string
  url: string
  size: string
  type: string
}

/** 图库详情（编辑回显用） */
export interface GalleryDetail extends Gallery {
  photos: GalleryPhoto[]
}

interface GalleryRes {
  code: number
  message: string
  data: {
    gallerys: Gallery[]
    pageNum: number
    pageSize: number
  }
}
export const getGallery = (data: {
  pageNum: number
  pageSize: number
  subset_id?: string
}) => {
  return http.post<any, GalleryRes>('/gallerys/getGallery', data)
}

// 获取画廊总数
interface TotalGalleryRes {
  code: number
  message: string
  data: { total: number }
}
export const getTotalGallery = (subset_id?: string) => {
  return http.post<any, TotalGalleryRes>('/gallerys/getTotalGallery', { subset_id })
}

// 获取图库详情（编辑回显）
interface GalleryDetailRes {
  code: number
  message: string
  data: GalleryDetail
}
export const getGalleryDetail = (id: string) => {
  return http.post<any, GalleryDetailRes>('/gallerys/getGalleryDetail', { id })
}

/** 新建 / 编辑图库共用的载荷 */
export interface GalleryPayload {
  title: string
  subset_id: string
  /** 照片在 files 表里的 id 列表，后端会把它们挂到图库上 */
  photo_ids: string[]
}

interface SaveGalleryRes {
  code: number
  message: string
  data: { id: string }
}
export const insertGallery = (data: GalleryPayload) => {
  return http.post<any, SaveGalleryRes>('/gallerys/insertGallery', data)
}

export const updateGallery = (data: GalleryPayload & { id: string }) => {
  return http.post<any, SaveGalleryRes>('/gallerys/updateGallery', data)
}

// 删除图库
interface DeleteGalleryRes {
  code: number
  message: string
  data: null
}
export const deleteGallery = (data: { id: string }) => {
  return http.post<any, DeleteGalleryRes>('/gallerys/deleteGallery', data)
}
