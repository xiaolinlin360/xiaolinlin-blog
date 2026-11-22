import { http } from '@/utils/http'

export interface GalleryItem {
  id: string
  title: string
  subset_id: string
  created_at: string
  /** 相册里的照片地址列表，第一个当封面 */
  gallery_urls: string[]
  photo_count: number
}

/** 相册里的一张照片 */
export interface GalleryPhoto {
  id: string
  file_name: string
  /** /data/xxx/yy 相对路径，或者完整外链 */
  url: string
  size: string
  type: string
}

export interface GalleryDetail {
  id: string
  title: string
  subset_id: string
  created_at: string
  photos: GalleryPhoto[]
}

/** 相册列表：不用登录，照片地址是 /data/... 相对路径 */
export const getGalleries = (pageSize = 30, pageNum = 1) =>
  http<{ gallerys: GalleryItem[] }>('POST', '/gallerys/getGallery', { pageSize, pageNum })

/** 相册内页：一本相册 + 里面所有照片 */
export const getGalleryDetail = (id: string) =>
  http<GalleryDetail>('POST', '/gallerys/getGalleryDetail', { id })
