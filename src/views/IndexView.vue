<template>
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
</template>

<script lang="ts" setup>
import MenuBar from '@/components/bar/MenuBar.vue'
</script>

<style lang="scss" scoped>
.index-layout {
  display: flex; /* 启用 Flex 布局，实现左右并排 */
  width: 100%;
  height: calc(100vh - 60px); /* 减去顶部 HeadBar 的高度（假设是 60px） */
  overflow: hidden; /* 防止整体出现滚动条 */
  background-color: #f5f6f8; /* 整体背景色 */
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
