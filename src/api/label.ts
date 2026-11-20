import { http } from '@/utils/http'

export interface LabelItem {
  id: string
  label_name: string
  /** 用了这个标签的文章数（前台只数已发布的） */
  count: number
}

/** 全部标签：没登录时后端只数已发布文章 */
export const getLabels = () => http<LabelItem[]>('POST', '/labels/getLabels')
