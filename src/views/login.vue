<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>
<script setup lang="ts">
// import { ref } from 'vue'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import http from '@/utils/http'
onMounted(async () => {
  const res = await http.post('/login', { name: '博客主', password: '123456' })
  userStore.setUserData(res)
  console.log(userStore.userData)
})
const userStore = useUserStore()
const title = ref('登录')
</script>
