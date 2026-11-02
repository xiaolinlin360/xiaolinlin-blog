import http from '@/utils/http'

/** 标签 */
export interface Label {
  id: string
  label_name: string
}

/** 单篇文章主体（对应 article 表） */
export interface Article {
  id: string
  state: boolean
  title: string
  content: string
  user_id: string
  url: string
  file_urls: string[]
  introduce: string
  subset_id: string
  created_at: string
  username_name: string
  labels: Label[]
}

/** data 层 */
export interface ArticleListData {
  articles: Article[]
  pageSize: number
  pageNum: number
}

/** 最外层响应 */
export interface BlogResponse {
  data: ArticleListData
  code: number
  message?: string
}

export interface ArticleQuery {
  pageNum: number
  pageSize: number
  subset_id?: string
}

export const getArticle = (data: ArticleQuery) => {
  return http.post<any, BlogResponse>('/article/getArticle', data)
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
