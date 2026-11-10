<template>
  <div class="notes-view">
    <headTitle :title="'随笔随记'" />
    <subset @subset_id="handleSubsetIdChange" />
    <Notes :subsetId="subsetId"></Notes>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import headTitle from '@/components/bar/HeadTitle.vue'
import subset from '@/components/filesview/subset.vue'
import Notes from '@/components/notesview/notes.vue'

const subsetId = ref<string | undefined>(undefined)
const handleSubsetIdChange = (id: string | undefined) => {
  subsetId.value = id || undefined
}
</script>
<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.notes-view {
  background-color: $my-bg-page; // 使用规范中的页面背景色
}
</style>
