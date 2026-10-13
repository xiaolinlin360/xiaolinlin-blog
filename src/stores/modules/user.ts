import { ref } from 'vue'
import { defineStore } from 'pinia'

//用户模块 token setToken removeToken

export const useUserStore = defineStore(
  'big-user',
  () => {
    //token
    const token = ref('')
    //设置token
    const setToken = (newToken: string) => {
      token.value = `Bearer ${newToken}`
      console.log(token.value)
    }
    //移除token
    const removeToken = () => {
      token.value = ''
    }
    const userData = ref({})
    //设置用户数据
    const setUserData = (user: any) => {
      userData.value = user
    }
    return { token, setToken, removeToken, userData, setUserData }
  },
  {
    persist: true,
  }
)
