<template>
  <div class="index-page">
    <!-- 顶栏跟着布局走：登录后才出现，/login 是整页无顶栏 -->
    <HeadBar />

    <div class="index-layout">
      <!-- 左侧菜单栏 -->
      <div class="layout-sidebar">
        <MenuBar />
      </div>

      <!-- 右侧主内容区 -->
      <div class="layout-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeadBar from '@/components/bar/HeadBar.vue'
import MenuBar from '@/components/bar/MenuBar.vue'
</script>

<style lang="scss" scoped>
/* 外层用 flex 纵向排：HeadBar 60px + 剩余高度，
   比原来写死 calc(100vh - 60px) 更稳（HeadBar 改高度不用同步改这里） */
.index-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.index-layout {
  flex: 1;
  min-height: 0; /* 关键：允许子项在 flex 里滚动，而不是把父级撑高 */
  display: flex; /* 启用 Flex 布局，实现左右并排 */
  width: 100%;
  overflow: hidden; /* 防止整体出现滚动条 */
  background-color: $my-bg-page; /* 整体背景色 */
}

.layout-sidebar {
  width: 220px; /* 侧边栏固定宽度 */
  flex-shrink: 0; /* 防止侧边栏被压缩 */
  height: 100%;
}

.layout-content {
  flex: 1; /* 占据剩余空间 */
  height: 100%;
  overflow-y: auto; /* 内容超出时，仅在右侧区域滚动 */
  box-sizing: border-box;
}
</style>
