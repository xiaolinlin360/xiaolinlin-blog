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
      token.value = newToken
      token.value =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuWNmuWuouS4uyIsImlhdCI6MTc5MTUzMDU3MCwiZXhwIjoxNzkyMTM1MzcwfQ.SDC18Thl6GsLa3JOJoHCz32jxjqUdsPu_Yqhim7karU'
    }
    //移除token
    const removeToken = () => {
      token.value = ''
    }

    return { token, setToken, removeToken }
  },
  {
    persist: true,
  }
)
