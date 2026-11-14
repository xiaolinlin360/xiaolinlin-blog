<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">逸刻博客后台</h1>
      <p class="subtitle">登录后管理文章、图库与留言</p>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit">
        <el-form-item prop="name">
          <el-input
            v-model="form.name"
            size="large"
            placeholder="用户名"
            :prefix-icon="User"
            autocomplete="username" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            size="large"
            placeholder="密码"
            show-password
            :prefix-icon="Lock"
            autocomplete="current-password"
            @keyup.enter="handleSubmit" />
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :loading="loading"
          native-type="submit">
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { login } from '@/api/users'
import { useUserStore } from '@/stores/index'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({ name: '', password: '' })

const rules: FormRules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleSubmit = async () => {
  if (loading.value || !formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return // 校验失败，el-form 自己会标红
  }

  loading.value = true
  try {
    const res = await login({ name: form.name.trim(), password: form.password })
    userStore.setUserData(res.data.user)
    userStore.setToken(res.token)
    ElMessage.success('登录成功')

    // 回到被拦截前想去的页面；没有就进总览
    const redirect = route.query.redirect
    router.replace(typeof redirect === 'string' && redirect ? redirect : '/OverviewView')
  } catch {
    // 失败提示已经由 http.ts 拦截器统一弹出，这里只需要吞掉异常
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background-color: $my-bg-page;
}

.login-card {
  width: 100%;
  max-width: 360px;
  padding: 32px 28px;
  border-radius: 12px;
  background-color: $my-bg-card;
  border: 1px solid $my-border-color;
  box-shadow: 0 8px 24px $my-shadow-color;

  .title {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: $my-text-main;
    text-align: center;
  }

  .subtitle {
    margin: 8px 0 24px;
    font-size: 13px;
    color: $my-text-sub;
    text-align: center;
  }

  .submit-btn {
    width: 100%;
    margin-top: 4px;
  }
}
</style>
