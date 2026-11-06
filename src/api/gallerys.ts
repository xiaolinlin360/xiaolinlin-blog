import http from '@/utils/http'

// 画廊项
export interface Gallery {
  id: string // 主键
  title: string // 画廊标题
  created_at: string // 创建时间
  gallery_urls: string[] // 画廊下文件 URL 列表
}
interface GalleryRes {
  code: number
  data: {
    gallerys: Gallery[]
    pageNum: number
    pageSize: number
  }
}
export const getGallery = async (data: {
  pageNum: number
  pageSize: number
  subset_id?: string
}) => {
  const a = await http.post<any, GalleryRes>('/gallerys/getGallery', data)
  console.log(a)
  return a
}

// 获取画廊总数响应
interface TotalGalleryRes {
  code: number
  data: {
    total: number
  }
}
export const getTotalGallery = (subset_id?: string) => {
  return http.post<any, TotalGalleryRes>('/gallerys/getTotalGallery', { subset_id })
}

// 删除画廊响应
interface DeleteGalleryRes {
  code: number
  data: {
    message: string
  }
}
export const deleteGallery = (data: { id: string }) => {
  return http.post<any, DeleteGalleryRes>('/gallerys/deleteGallery', data)
}
