<template>
  <Giscus
    v-if="filled"
    :key="isDark ? 'dark' : 'light'"
    :repo="config.repo"
    :repo-id="config.repoId"
    :category="config.category"
    :category-id="config.categoryId"
    mapping="pathname"
    reactions-enabled="1"
    emit-metadata="0"
    input-position="top"
    :theme="isDark ? 'dark' : 'light'"
    lang="zh-CN"
    loading="lazy" />

  <!-- 配置没填之前先显示这句，免得挂一个报错的 iframe -->
  <p v-else class="hint">评论还没配置：去 giscus.app 拿到 4 个参数填到 CommentBox.vue 里</p>
</template>

<script setup lang="ts">
import Giscus from '@giscus/vue'
import { isDark } from '@/composables/useTheme'

// 去 https://giscus.app 填仓库、选分类，把这 4 个换成你自己的
const config = {
  repo: 'xiaolinlin360/blog-comments',
  repoId: 'R_xxx',
  category: 'General',
  categoryId: 'DIC_xxx',
} as const

/** 4 个参数填完了再改成 true */
const filled = false
</script>

<style scoped lang="scss">
.hint {
  padding: 30px 0;
  text-align: center;
  font-size: 12px;
  color: $my-text-light;
}
</style>
