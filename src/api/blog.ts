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

/** 文章详情（编辑回显用，多一个封面 id） */
export interface ArticleDetail extends Article {
  cover_file_id: string | null
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

//获取博客文章总数（传 subset_id 时只统计该分组，分页器才准）
interface TotalBlogRes {
  code: number
  message: string
  data: { total: number }
}
export const getTotalArticle = (subset_id?: string) => {
  return http.post<any, TotalBlogRes>('/article/getTotalArticle', { subset_id })
}

//获取文章详情
interface ArticleDetailRes {
  code: number
  message: string
  data: ArticleDetail
}
export const getArticleDetail = (id: string) => {
  return http.post<any, ArticleDetailRes>('/article/getArticleDetail', { id })
}

/** 新建 / 编辑文章共用的表单载荷 */
export interface ArticlePayload {
  title: string
  introduce: string
  content: string
  subset_id: string
  cover_file_id?: string | null
  state: boolean
}

interface SaveArticleRes {
  code: number
  message: string
  data: { id: string }
}

//新建文章
export const insertArticle = (data: ArticlePayload) => {
  return http.post<any, SaveArticleRes>('/article/insertArticle', data)
}

//编辑文章
export const updateArticle = (data: ArticlePayload & { id: string }) => {
  return http.post<any, SaveArticleRes>('/article/updateArticle', data)
}

//单独改发布状态（列表里快速切换用）
interface UpdateArticleStatusRes {
  code: number
  message: string
  data: null
}
export const updateArticleStatus = (data: { id: string; state: boolean }) => {
  return http.post<any, UpdateArticleStatusRes>('/article/updateArticleStatus', data)
}

//删除博客文章
interface DeleteArticleReq {
  code: number
  message: string
  data: null
}
export const deleteArticle = (id: string) => {
  return http.post<any, DeleteArticleReq>('/article/deleteArticle', { id })
}
