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

/** 文章列表：不用登录，后端只会给已发布的（登录了才看得到草稿）。top = 顶部分类 */
export const getArticles = (pageSize = 10, pageNum = 1, top?: string) =>
  http<ArticlePage>('POST', '/article/getArticle', {
    pageSize,
    pageNum,
    top: top || null,
  })

/** 文章总数：传 top 就只数那个分类的 */
export const getTotalArticle = (top?: string) =>
  http<{ total: number }>('POST', '/article/getTotalArticle', { top: top || null })

/** 文章附件（详情里带回来的） */
export interface Attachment {
  id: string
  file_name: string
  /** /data/xxx/yyy 这种相对路径，用的时候拼后端地址 */
  url: string
  size: string
  type: string
}

/** 详情比列表多这几个字段 */
export interface ArticleDetail extends ArticleItem {
  /** 作者 id，用来判断是不是博主A 自己写的 */
  user_id: string
  /** 浏览量 */
  views: number
  /** 点赞（收藏）数 */
  praise_count: number
  attachments: Attachment[]
}

/** 文章详情：匿名只能看已发布的，草稿会 404 */
export const getArticleDetail = (id: string) =>
  http<ArticleDetail>('POST', '/article/getArticleDetail', { id })

/** 打开详情页时调一次，返回最新的浏览量 */
export const addView = (id: string) => http<{ views: number }>('POST', '/article/addView', { id })

