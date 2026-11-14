<template>
  <el-drawer
    v-model="visible"
    :title="`评论 · ${article.title}`"
    size="760px"
    class="drawer-comments"
    destroy-on-close>
    <!-- 打开时才挂载 giscus，避免一进文章列表就加载一个 iframe -->
    <div v-if="visible" class="comment-box">
      <Giscus
        :key="article.id"
        :repo="giscus.repo"
        :repo-id="giscus.repoId"
        :category="giscus.category"
        :category-id="giscus.categoryId"
        mapping="specific"
        :term="`article:${article.id}`"
        :theme="isDark ? 'dark' : 'light'"
        lang="zh-CN"
        strict="0"
        reactions-enabled="1"
        emit-metadata="1"
        input-position="top"
        loading="lazy" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDark } from '@vueuse/core'
import Giscus from '@giscus/vue'
import type { Article } from '@/api/blog'

/** giscus 配置，来自 https://giscus.app 生成的那段参数 */
const giscus = {
  repo: 'xiaolinlin360/blog-giscus',
  repoId: 'R_kgDOVq6Rkg',
  category: 'General',
  categoryId: 'DIC_kwDOVq6Rks4DK50m',
} as const // 防止修改，定义为常量

const visible = ref(false)
const article = ref<Pick<Article, 'id' | 'title'>>({ id: '', title: '' })

/** 跟随顶栏的暗色开关，切换时 giscus 会自己换主题 */
const isDark = useDark()

/**
 * 打开某篇文章的评论区
 *
 * term 用文章 id，不用 pathname：
 * 本项目是 hash 路由，所有页面的 pathname 都是 /，用 pathname 会让全部文章共用一个评论区。
 * 用 id 之后，一篇文章就是一个独立的 Discussion。
 */
const open = (item: Pick<Article, 'id' | 'title'>) => {
  article.value = item
  visible.value = true
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.drawer-comments {
  :deep(.el-drawer__body) {
    padding: 16px 20px 24px;
    background-color: $my-bg-card;
  }
}

.comment-box {
  min-height: 200px;
}
</style>
