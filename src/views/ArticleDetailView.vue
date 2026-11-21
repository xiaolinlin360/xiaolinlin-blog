<template>
  <div class="article-detail">
    <p class="hint">文章详情页还没做，先把路由和 id 占住</p>
    <p class="id">id = {{ uuid }}</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

// 地址栏 /article/<uuid> 里的那段
const route = useRoute()
const uuid = route.params.uuid
</script>

<style scoped lang="scss">
.article-detail {
  padding: 60px 0;
  text-align: center;

  .hint {
    font-size: 14px;
    color: $my-text-sub;
  }

  .id {
    margin-top: 10px;
    font-size: 12px;
    color: $my-text-light;
  }
}
</style>
