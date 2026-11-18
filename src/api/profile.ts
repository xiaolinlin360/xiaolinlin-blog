import { http } from '@/utils/http'

/** 站点主人（权限 0 那位，博主A） */
export interface SiteProfile {
  name: string
  /** /data/xxx/yyy.webp 这种相对路径，用的时候要拼后端地址 */
  imgurl: string
  /** 只有登录（带 token）调的时候才有 */
  email?: string
  phone?: string
}

/**
 * 个人信息：带 token 返回自己的，不带就返回站点主人（前台首页用）。
 * 后台和前台共用这一个接口，不用维护两套。
 */
export const getProfile = () => http<SiteProfile>('POST', '/user/getProfile')
