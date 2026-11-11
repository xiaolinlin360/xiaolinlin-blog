<template>
  <div class="resources-view">
    <headTitle :title="'ResourcesView'" />
    <subset @subset_id="handleSubsetIdChange" />
    <resources></resources>
  </div>
</template>
<script setup lang="ts">
// import { ref } from 'vue'
import headTitle from '@/components/bar/HeadTitle.vue'
import subset from '@/components/filesview/subset.vue'
import resources from '@/components/resources/resources.vue'
const handleSubsetIdChange = (id: string | undefined) => {
  console.log(id)
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.resources-view {
  height: 100%;
  background-color: $my-bg-page; // 使用规范中的页面背景色
}
</style>
