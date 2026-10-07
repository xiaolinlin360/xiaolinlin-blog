<template>
  <div class="gather-cards">
    <div class="stat-card card-blue">
      <div class="card-info">
        <span class="card-title">本地文件</span>
        <span class="card-value">434.36M</span>
      </div>
    </div>
    <div class="stat-card card-pink">
      <div class="card-info">
        <span class="card-title">博客文章</span>
        <span class="card-value">12</span>
      </div>
      <div class="card-action">
        <el-icon><Plus /></el-icon>
      </div>
    </div>
    <div class="stat-card card-green">
      <div class="card-info">
        <span class="card-title">摄影图库</span>
        <span class="card-value">12</span>
      </div>
      <div class="card-action">
        <el-icon><Plus /></el-icon>
      </div>
    </div>
    <div class="stat-card card-lightblue">
      <div class="card-info">
        <span class="card-title">随笔随记</span>
        <span class="card-value">12</span>
      </div>
      <div class="card-action">
        <el-icon><Plus /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.gather-cards {
  display: flex;
  gap: 16px;
  width: 100%;

  .stat-card {
    flex: 1;
    height: 100px;
    border-radius: 8px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;

    &.card-blue {
      background-color: #2d5cf6;
      color: #fff;
    }
    &.card-pink {
      background-color: #fce2d6;
      color: #333;
    }
    &.card-green {
      background-color: #d1f2cd;
      color: #333;
    }
    &.card-lightblue {
      background-color: #d3f0fc;
      color: #333;
    }

    .card-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .card-title {
        font-size: 14px;
        font-weight: 500;
      }
      .card-value {
        font-size: 26px;
        font-weight: 600;
        line-height: 1;
      }
    }

    .card-action {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #555;
    }
  }
}
</style>
