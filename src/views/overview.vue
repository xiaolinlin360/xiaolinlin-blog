<template>
  <div class="overview-page">
    <!-- 顶部：四个统计卡片 -->
    <gather class="top-gather" />

    <!-- 下方左右两列布局 -->
    <div class="main-content">
      <!-- 左侧：图表区域 -->
      <div class="left-charts">
        <datas />
      </div>

      <!-- 右侧：评论区域 -->
      <div class="right-comments">
        <commonnt />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gather from '@/components/overview/gather.vue'
import datas from '@/components/overview/datas.vue'
import commonnt from '@/components/overview/commonnt.vue'
</script>

<style scoped lang="scss">
.overview-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: $my-bg-page; // 页面背景（浅灰/深蓝黑）
  min-height: 100%;
  transition: background-color 0.3s;

  .main-content {
    display: flex;
    gap: 20px;
    flex: 1;

    .left-charts {
      flex: 1.5; // 左侧图表占比更大
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .right-comments {
      flex: 1; // 右侧评论占比稍小
    }
  }
}
</style>
