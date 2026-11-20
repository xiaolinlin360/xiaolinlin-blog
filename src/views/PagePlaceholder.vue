<!-- 后面可能废弃这个文件 -->

<template>
  <div class="page-placeholder">
    <p class="path">{{ route.path }}</p>
    <p class="tip">「{{ route.name }}」页面还没做，先用它占位</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped lang="scss">
.page-placeholder {
  /* 故意撑高，好让你能滚动页面看到顶栏的毛玻璃效果；首页做完后改回 40vh */
  min-height: 120vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed $my-border-color;
  border-radius: 20px;
  background-color: $my-bg-card;

  .path {
    font-size: 20px;
    font-weight: 600;
    color: $my-text-main;
  }

  .tip {
    font-size: 13px;
    color: $my-text-light;
  }
}
</style>
