import { http } from '@/utils/http'

//获取站点主人 博主A 个人信息
export interface SiteProfile {
  id: string
  name: string
  imgurl: string
  /** 只有登录（带 token）调的时候才有 */
  email?: string
  phone?: string
}
export const getProfile = () => http<SiteProfile>('POST', '/user/getProfile')
