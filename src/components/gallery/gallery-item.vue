<template>
  <div class="gallery-card">
    <!-- 上半部分：智能图片拼图区 -->
    <div class="image-section" :class="`grid-${displayImages.length}`">
      <el-image
        v-for="(url, index) in displayImages"
        :key="index"
        :src="url"
        fit="cover"
        class="grid-img"
        lazy>
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <!-- 超过4张时显示遮罩提示 -->
      <div v-if="(gallery.gallery_urls?.length || 0) > 4" class="more-mask">
        +{{ gallery.gallery_urls.length - 4 }}
      </div>
    </div>

    <!-- 悬浮操作区 -->
    <div class="action-overlay">
      <el-button circle size="small" @click="$emit('edit', gallery)">
        <el-icon><EditPen /></el-icon>
      </el-button>
      <el-button type="danger" circle size="small" @click="$emit('delete', gallery.id)">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>

    <!-- 下半部分：信息区 -->
    <div class="info-section">
      <p class="desc">{{ gallery.title || '暂无简介' }}</p>
      <div class="meta-info">
        <span class="date">{{ formatDate(gallery.created_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Picture, EditPen, Delete } from '@element-plus/icons-vue'
// import { ref } from 'vue'
import { type Gallery } from '@/api/gallerys'

const props = defineProps<{
  gallery: Gallery // 建议替换为你实际的 API 类型定义
}>()

defineEmits<{
  (e: 'edit', gallery: Gallery): void
  (e: 'delete', id: string): void
}>()

// 默认占位图
const FALLBACK_IMG = 'https://picsum.photos/400/300?random='

// 最多展示前4张，如果没有图片给个默认图
const displayImages = computed(() => {
  const urls = props.gallery.gallery_urls || []
  if (urls.length === 0) return [`${FALLBACK_IMG}${props.gallery.id || 1}`]
  return urls.slice(0, 4).map((url: string) => url || `${FALLBACK_IMG}${Math.random()}`)
})

const formatDate = (timeStr: string) => {
  if (!timeStr) return ''
  return timeStr.split('T')[0]
}
</script>

<style lang="scss" scoped>
.gallery-card {
  background-color: $my-bg-card;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: $my-bg-hover;
    transform: translateY(-2px);

    .action-overlay {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // 图片拼图区
  .image-section {
    width: 100%;
    height: 180px;
    display: grid;
    gap: 2px;
    position: relative;
    background-color: $my-bg-hover;

    .grid-img {
      width: 100%;
      height: 100%;
      display: block;
    }

    .image-slot {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999;
      font-size: 24px;
    }

    // 布局逻辑
    &.grid-1 {
      grid-template-columns: 1fr;
    }
    &.grid-2 {
      grid-template-columns: 1fr 1fr;
    }
    &.grid-3 {
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr 1fr;
      .grid-img:first-child {
        grid-row: span 2; // 第一张占两行
      }
    }
    &.grid-4 {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
    }

    .more-mask {
      position: absolute;
      right: 2px;
      bottom: 2px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
  }

  // 悬浮操作区
  .action-overlay {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 8px;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 10;
  }

  // 底部信息区
  .info-section {
    padding: 12px 16px;

    .desc {
      font-size: 12px;
      color: $my-text-sub;
      margin-bottom: 12px;
      height: 18px; // 固定高度防止抖动
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .meta-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #909399;
      .date {
        margin-left: auto;
      }
      .stats {
        display: flex;
        gap: 12px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 3px;
        }
      }
    }
  }
}
</style>
