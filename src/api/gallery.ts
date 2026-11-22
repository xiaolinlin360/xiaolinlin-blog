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

/** 相册列表：不用登录，照片地址是 /data/... 相对路径 */
export const getGalleries = (pageSize = 30, pageNum = 1) =>
  http<{ gallerys: GalleryItem[] }>('POST', '/gallerys/getGallery', { pageSize, pageNum })
