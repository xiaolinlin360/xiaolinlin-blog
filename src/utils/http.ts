import axios from 'axios'
import { useUserStore } from '@/stores/index.ts'
import { ElMessage } from 'element-plus'
import router from '@/router/index.ts'

const url = 'http://localhost:3001/'
const http = axios.create({
  baseURL: url,
  timeout: 5000,
})

/** 登录接口的 401 含义是「账号或密码错」，不能当成会话过期 */
const LOGIN_PATH = '/user/login'

/**
 * 从后端的错误响应里挖出一句能给用户看的话。
 *
 * 后端历史上有几种信封形状，按优先级兜一下：
 *   { code, message, data }     ← 新写法（article / gallerys / guestbook）
 *   { data: { message } }       ← 老写法（大多数 controller）
 *   { error: '...' }            ← labels.js 的失败分支
 */
const pickMessage = (error: any): string => {
  const body = error?.response?.data
  return body?.message || body?.data?.message || body?.error || error?.message || '请求失败'
}

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data?.code === 200) {
      return response.data
    }
    // 2xx 里仍然可能带业务失败
    ElMessage.error(pickMessage({ response }))
    return Promise.reject(response.data)
  },
  (error) => {
    const status = error?.response?.status
    console.log(error.response)
    const isLoginRequest = String(error?.config?.url ?? '').includes(LOGIN_PATH)

    // 401 且不是登录请求 = token 过期/无效：清登录态并回登录页
    if (status === 401 && !isLoginRequest) {
      const userStore = useUserStore()
      userStore.logout()
      ElMessage.error('登录已过期，请重新登录')

      const current = router.currentRoute.value
      if (current.path !== '/login') {
        router.push({ path: '/login', query: { redirect: current.fullPath } })
      }
      return Promise.reject(error)
    }

    // 其余 4xx / 5xx（400 参数错、404 不存在、429 太频繁、500 服务端错）
    // 统一把后端的中文提示弹出来 —— 以前 400 是静默的，用户表现为"点了没反应"
    ElMessage.error(pickMessage(error))
    return Promise.reject(error)
  }
)

export default http
export { url }
