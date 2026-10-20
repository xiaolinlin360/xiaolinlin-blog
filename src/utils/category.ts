import { getCategory } from '@/api/subsets'
import { type CategoryRef } from '@/api/subsets'

// 利用闭包原理直接缓存，避免并发请求，但不知道会不会内存泄漏
let categoriesPromise: CategoryRef[] | null = null

export const getCategoryIdByPath = async (path: string) => {
  // 1. 如果还没请求过，发请求
  if (!categoriesPromise) {
    const res = await getCategory()
    categoriesPromise = res.data
  }
  // 2. 从列表里找当前 path 对应的 id
  const category: string | undefined = categoriesPromise.find(
    (c: CategoryRef) => c.path === path
  )?.id
  return category
}
