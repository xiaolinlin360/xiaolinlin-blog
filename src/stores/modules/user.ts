import { ref } from 'vue'
import { defineStore } from 'pinia'

/** 后端 login 返回的用户信息（users 表里那几列，不含密码） */
export interface UserInfo {
  id?: string
  name?: string
  email?: string | null
  created_at?: string
}

//用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    //token（已带 "Bearer " 前缀，拦截器直接塞 header）
    const token = ref('')
    //设置token
    const setToken = (newToken: string) => {
      token.value = `Bearer ${newToken}`
    }
    //移除token
    const removeToken = () => {
      token.value = ''
    }

    const userData = ref<UserInfo>({})
    //设置用户数据
    const setUserData = (user: UserInfo) => {
      userData.value = user
    }

    /** 退出登录：token 和用户信息一起清，避免残留上一个账号的名字 */
    const logout = () => {
      token.value = ''
      userData.value = {}
    }

    return { token, setToken, removeToken, userData, setUserData, logout }
  },
  {
    persist: true,
  }
)
