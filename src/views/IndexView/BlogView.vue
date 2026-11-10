<template>
  <div class="blog-view">
    <HeadTitle :title="'博客文章'">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        发布文章
      </el-button>
    </HeadTitle>
    <Subset @subset_id="handleSubsetIdChange" />
    <Article ref="articleRef" :subsetId="subsetId" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import HeadTitle from '@/components/bar/HeadTitle.vue'
import Subset from '@/components/filesview/subset.vue'
import Article from '@/components/articles/article.vue'

const subsetId = ref<string | undefined>(undefined)
const handleSubsetIdChange = (id: string | undefined) => {
  subsetId.value = id || undefined
}

// 抽屉由 Article 内部持有，这里只负责触发"新建"
const articleRef = ref<InstanceType<typeof Article>>()
const handleCreate = () => {
  articleRef.value?.openCreate()
}
</script>
<style scoped lang="scss">
.blog-view {
  background-color: $my-bg-page;
}
</style>
