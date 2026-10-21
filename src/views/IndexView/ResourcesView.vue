<template>
  <div>
    <headTitle :title="'ResourcesView'" />
    <subset @subset_id="handleSubsetIdChange" />
  </div>
</template>
<script setup lang="ts">
// import { ref } from 'vue'
import headTitle from '@/components/bar/HeadTitle.vue'
import subset from '@/components/filesview/subset.vue'
const handleSubsetIdChange = (id: string | undefined) => {
  console.log(id)
}
</script>
