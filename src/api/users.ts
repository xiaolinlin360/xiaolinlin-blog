import http from '@/utils/http'

//验证是否注册
export const isRegistered = (data: { id: string }) => {
  return http.post('/user/isRegistered', data)
}

//注册用户
// TODO 这个函数和后端还不一致：后端 /user/insertUser 要的是 id/name/email/created_at，
// 而且 users.password 是 NOT NULL，不带密码插入必然 500。做注册功能时要一起改。
export const register = (data: { name: string; password: string }) => {
  return http.post('/user/insertUser', data)
}

//登录
export interface LoginUser {
  id: string
  name: string
  email: string | null
  created_at: string
}

interface LoginRes {
  code: number
  /** token 在响应的顶层，不在 data 里（后端就是这么返回的） */
  token: string
  data: {
    message: string
    user: LoginUser
  }
}
export const login = (data: { name: string; password: string }) => {
  return http.post<any, LoginRes>('/user/login', data)
}
