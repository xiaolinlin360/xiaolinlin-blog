<template>
  <div class="head-title">
    <!-- 左侧大标题 -->
    <h1 class="head-title__text">{{ title }}</h1>

    <!-- 右侧内容，由插槽传入 -->
    <div class="head-title__extra">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.head-title {
  padding: 0 25px;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid $my-border-color;
}

.head-title__text {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: $my-text-main;
}

.head-title__extra {
  display: flex;
  align-items: center;
  gap: 8px;
  color: $my-text-sub;
}
</style>
