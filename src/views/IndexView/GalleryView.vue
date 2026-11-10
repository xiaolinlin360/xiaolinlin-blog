<template>
  <div class="gallery-view">
    <HeadTitle :title="'摄影图库'">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建图库
      </el-button>
    </HeadTitle>
    <Subset @subset_id="handleSubsetIdChange" />
    <Gallery ref="galleryRef" :subsetId="subsetId" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import HeadTitle from '@/components/bar/HeadTitle.vue'
import Subset from '@/components/filesview/subset.vue'
import Gallery from '@/components/gallery/gallery.vue'

const subsetId = ref<string | undefined>(undefined)
const handleSubsetIdChange = (id: string | undefined) => {
  subsetId.value = id || undefined
}

// 抽屉由 Gallery 内部持有，这里只负责触发"新建"
const galleryRef = ref<InstanceType<typeof Gallery>>()
const handleCreate = () => {
  galleryRef.value?.openCreate()
}
</script>
<style scoped lang="scss">
.gallery-view {
  background-color: $my-bg-page;
}
</style>
