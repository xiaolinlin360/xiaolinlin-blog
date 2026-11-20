import { http } from '@/utils/http'

export interface ArticleLabel {
  id: string
  label_name: string
}

export interface ArticleItem {
  id: string
  title: string
  /** 简介，列表里优先用它当摘要 */
  introduce: string | null
  content: string
  /** true = 已发布，false = 草稿（前台拿到的永远是 true） */
  state: boolean
  /** 封面：可能是 /data/xxx 相对路径，也可能直接是外链 */
  url: string | null
  created_at: string
  subset_id: string | null
  username_name: string | null
  labels: ArticleLabel[]
}

export interface ArticlePage {
  articles: ArticleItem[]
  pageSize: number
  pageNum: number
}

/** 文章列表：不用登录，后端只会给已发布的（登录了才看得到草稿） */
export const getArticles = (pageSize = 10, pageNum = 1, subsetId?: string) =>
  http<ArticlePage>('POST', '/article/getArticle', {
    pageSize,
    pageNum,
    subset_id: subsetId || null,
  })

/** 文章总数：传子分类就只数那个分类的 */
export const getTotalArticle = (subsetId?: string) =>
  http<{ total: number }>('POST', '/article/getTotalArticle', { subset_id: subsetId || null })

