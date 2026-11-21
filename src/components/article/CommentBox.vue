<template>
  <!-- key 只跟文章 id 绑：切深浅色不能进 key，
       否则整个 iframe 会被重建、评论区白闪一下重新加载 -->
  <Giscus
    :key="articleId"
    :repo="giscus.repo"
    :repo-id="giscus.repoId"
    :category="giscus.category"
    :category-id="giscus.categoryId"
    mapping="specific"
    :term="`article:${articleId}`"
    :theme="isDark ? 'dark' : 'light'"
    lang="zh-CN"
    strict="0"
    reactions-enabled="1"
    emit-metadata="1"
    input-position="top"
    loading="lazy"
  />
</template>

<script setup lang="ts">
import Giscus from '@giscus/vue'
import { isDark } from '@/composables/useTheme'

defineProps<{ articleId: string }>()

const giscus = {
  repo: 'xiaolinlin360/blog-giscus',
  repoId: 'R_kgDOVq6Rkg',
  category: 'General',
  categoryId: 'DIC_kwDOVq6Rks4DK50m',
} as const
</script>
