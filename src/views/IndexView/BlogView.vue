<template>
  <div class="blog-view">
    <HeadTitle :title="'博客文章'" />
    <Subset @subset_id="handleSubsetIdChange" />
    <Article :subsetId="subsetId" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import HeadTitle from '@/components/bar/HeadTitle.vue'
import Subset from '@/components/filesview/subset.vue'
import Article from '@/components/articles/article.vue'
const subsetId = ref<string | undefined>(undefined)
const handleSubsetIdChange = (id: string | undefined) => {
  subsetId.value = id || undefined
}
</script>
<style scoped lang="scss">
.blog-view {
  background-color: $my-bg-page;
}
</style>
