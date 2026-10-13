<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>
<script setup lang="ts">
// import { ref } from 'vue'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { login } from '@/api/users'

onMounted(async () => {
  //登录
  const res = await login({ name: '博客主', password: '123456' })
  userStore.setUserData(res.data.user)
  userStore.setToken(res.token)
})
const userStore = useUserStore()
const title = ref('登录')
</script>
