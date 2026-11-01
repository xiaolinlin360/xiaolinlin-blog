import http from '@/utils/http'

//获取博客列表// 单篇文章
export interface Article {
  id: string
  user_id: string
  subset_id: string
  title: string
  introduce: string
  file_id: string | null
  cover_file_id: string
  state: boolean
  content: string
  created_at: string
  username_name: string
  labels: {
    id: string
    label_name: string
  }[]
}
// data 层
interface ArticleData {
  articles: Article[]
  pageSize: number
  pageNum: number
}
// 最外层
interface Blog {
  data: ArticleData
  code: number
  message?: string
}
export const getArticle = (data: {
  pageNum: number
  pageSize: number
  subset_id: string | undefined
}) => {
  return http.post<any, Blog>('/article/getArticle', data)
}

//获取博客文章总数
interface TotalBlogRes {
  code: number
  data: { total: number }
}
export const getTotalArticle = () => {
  return http.post<any, TotalBlogRes>('/article/getTotalArticle')
}

//修改博客文章发布状态
interface UpdateArticleReq {
  code: number
  data: { message: string }
}
export const updateArticle = (data: UpdateArticleReq) => {
  return http.post<any, UpdateArticleReq>('/article/updateArticle', data)
}

//删除博客文章
interface DeleteArticleReq {
  code: number
  data: { message: string; error: string }
}
export const deleteArticle = (id: string) => {
  return http.post<any, DeleteArticleReq>('/article/deleteArticle', { id })
}
