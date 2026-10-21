<template>
  <div>
    <headTitle :title="'GalleryView'" />
    <subset @subset_id="handleSubsetIdChange" />
  </div>
</template>
<script setup lang="ts">
// import { ref } from 'vue'
import subset from '@/components/filesview/subset.vue'
import headTitle from '@/components/bar/HeadTitle.vue'
const handleSubsetIdChange = (id: string | undefined) => {
  console.log(id)
}
</script>
