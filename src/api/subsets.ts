import http from '@/utils/http'

// 拿到categoryController中的所有子集
export interface CategoryRef {
  id: string
  name: string
  created_at: string
  path: string
}
interface getCategoryRef {
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
interface getSubsetRef {
  data: SubsetRef[]
  code: number
}
export const getSubset = (data: { category_id: string }) => {
  return http.post<any, getSubsetRef>('/subsets/getSubset', data)
}

//添加分组
export interface insertSubsetReq {
  message: string
}
interface insertSubsetRef {
  data: insertSubsetReq[]
  code: number
}
export const insertSubset = (data: { category_id: string | undefined; name: string }) => {
  return http.post<any, insertSubsetRef>('/subsets/insertSubset', data)
}

//更新分组
export interface updateSubsetReq {
  message: string
}
interface updateSubsetRef {
  data: updateSubsetReq[]
  code: number
}
export const updateSubset = (data: { id: string; name: string }) => {
  return http.post<any, updateSubsetRef>('/subsets/updateSubset', data)
}

//删除分组
export interface deleteSubsetReq {
  message: string
}
interface deleteSubsetRef {
  data: deleteSubsetReq[]
  code: number
}
export const deleteSubset = (data: { id: string }) => {
  return http.post<any, deleteSubsetRef>('/subsets/deleteSubset', data)
}
