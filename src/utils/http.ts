import axios from 'axios'
import { useUserStore } from '@/stores/index.ts'
import { ElMessage } from 'element-plus'
import router from '@/router/index.ts'

const url = 'http://localhost:3001'
const http = axios.create({
  baseURL: url,
  timeout: 5000,
  headers: { 'X-Custom-Header': 'foobar' },
})

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
    console.log(error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code === 200) {
      return response.data
    }
    ElMessage.error(response.data.message || '请求失败')
    return Promise.reject(response.data)
  },
  (error) => {
    if (error.response?.status === 400) {
      return Promise.reject(error.response.data.data?.message)
    }
    if (error.response?.status === 401) {
      console.log(error)
      ElMessage.error('登录过期，请重新登录')
      router.push('/login')
      return Promise.reject(error.response.data.data?.message)
    }
    ElMessage.error(error.message || '请求失败')
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default http
export { url }
