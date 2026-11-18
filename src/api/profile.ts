import { http } from '@/utils/http'

//获取站点主人 博主A 个人信息
export interface SiteProfile {
  name: string
  imgurl: string
  email?: string
  phone?: string
}
export const getProfile = () => http<SiteProfile>('POST', '/user/getProfile')
