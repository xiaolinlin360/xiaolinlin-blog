<template>
  <div v-loading="loading" class="gather-cards">
    <div class="stat-card card-blue">
      <div class="card-info">
        <span class="card-title">本地文件</span>
        <span class="card-value">{{ stats.storage }}</span>
      </div>
    </div>
    <div class="stat-card card-pink">
      <div class="card-info">
        <span class="card-title">博客文章</span>
        <span class="card-value">{{ stats.articles }}</span>
      </div>
      <div class="card-action">
        <el-icon><Plus /></el-icon>
      </div>
    </div>
    <div class="stat-card card-green">
      <div class="card-info">
        <span class="card-title">摄影图库</span>
        <span class="card-value">{{ stats.galleries }}</span>
      </div>
      <div class="card-action">
        <el-icon><Plus /></el-icon>
      </div>
    </div>
    <div class="stat-card card-lightblue">
      <div class="card-info">
        <span class="card-title">随笔随记</span>
        <span class="card-value">{{ stats.notes }}</span>
      </div>
      <div class="card-action">
        <el-icon><Plus /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getStorageSize } from '@/api/files'
import { getTotalArticle } from '@/api/blog'
import { getTotalGallery } from '@/api/gallerys'
import { getTotalNotes } from '@/api/notes'

const loading = ref(false)

const stats = ref({
  storage: '-', // data 目录占用，后端已格式化成 "434.36 MB"
  articles: 0,
  galleries: 0,
  notes: 0,
})

// 四个数各自独立，用 Promise.all 并发拿，任何一个失败不影响其他卡片
const fetchStats = async () => {
  loading.value = true
  try {
    const [storageRes, articleRes, galleryRes, noteRes] = await Promise.all([
      getStorageSize(),
      getTotalArticle(),
      getTotalGallery(),
      getTotalNotes(),
    ])

    stats.value = {
      storage: storageRes.data.text,
      articles: articleRes.data.total,
      galleries: galleryRes.data.total,
      notes: noteRes.data.total,
    }
  } catch (error) {
    console.error('获取总览数据失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
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
