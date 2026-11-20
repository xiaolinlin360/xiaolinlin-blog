import { http } from '@/utils/http'

/** 大分类：文章 / 图库 / 随笔 …（path 就是前端的路由） */
export interface Category {
  id: string
  name: string
  path: string
}

/** 大分类下面的子分类，博客页顶上那排标签就是它 */
export interface Subset {
  id: string
  name: string
  category_id: string
}

/** 所有大分类 */
export const getCategories = () => http<Category[]>('POST', '/subsets/getCategory')

/** 某个大分类下的子分类 */
export const getSubsets = (categoryId: string) =>
  http<Subset[]>('POST', '/subsets/getSubset', { category_id: categoryId })
