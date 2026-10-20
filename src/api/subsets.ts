import http from '@/utils/http'

// 拿到categoryController中的所有子集
export interface CategoryRef {
  id: string
  name: string
  created_at: string
  path: string
}
export interface getCategoryRef {
  data: CategoryRef[]
  code: number
}
export const getCategory = () => {
  return http.post<any, getCategoryRef>('/subsets/getCategory')
}

// 拿到subsetController中的所有子集
export interface SubsetRef {
  id: string
  name: string
  created_at: string
}
export interface getSubsetRef {
  data: SubsetRef[]
  code: number
}
export const getSubset = (data: { category_id: string }) => {
  return http.post<any, getSubsetRef>('/subsets/getSubset', data)
}
