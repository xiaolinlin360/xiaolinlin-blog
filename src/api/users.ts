import http from '@/utils/http'
//验证是否注册
export const isRegistered = (data: { id: string }) => {
  return http.post('/user/isRegistered', data)
}

//注册用户
export const register = (data: { name: string; password: string }) => {
  return http.post('/user/insertUser', data)
}

//登录
interface LoginRes {
  code: number
  token: string
  data: {
    message: string
    user: {
      name: string
      id: string
      mail: string
      password: string
      imgurl: string
      role: string
      created_at: string
      updated_at: string
    }
  }
}
export const login = (data: { name: string; password: string }) => {
  return http.post<any, LoginRes>('/user/login', data)
}
