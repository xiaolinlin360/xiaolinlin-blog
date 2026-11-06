<template>
  <div class="gallery-view">
    <HeadTitle :title="'摄影图库'" />
    <Subset @subset_id="handleSubsetIdChange" />
    <Gallery :subsetId="subsetId" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import HeadTitle from '@/components/bar/HeadTitle.vue'
import Subset from '@/components/filesview/subset.vue'
import Gallery from '@/components/gallery/gallery.vue'
const subsetId = ref<string | undefined>(undefined)
const handleSubsetIdChange = (id: string | undefined) => {
  subsetId.value = id || undefined
}
</script>
<style scoped lang="scss">
.gallery-view {
  background-color: $my-bg-page;
}
</style>
