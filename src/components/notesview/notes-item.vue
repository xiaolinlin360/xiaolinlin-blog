<template>
  <div class="note-item">
    <!-- 头部：标题 & 时间 & 删除 -->
    <div class="card-header">
      <div class="header-left">
        <span class="title">{{ note.title }}</span>
        <span class="star">🌟</span>
      </div>
      <div class="header-right">
        <span class="time">{{ formatDate(note.created_at) }}</span>
        <el-button link class="delete-btn" @click="$emit('delete', note.id)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 正文：直接渲染 Markdown，图片自然作为内容的一部分 -->
    <div class="card-content">
      <MarkdownRender :content="note.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MarkdownRender from 'markstream-vue'
import { Delete } from '@element-plus/icons-vue'

export interface Note {
  id: string
  title: string
  created_at: string
  content: string // 包含图片的完整 markdown 内容
}

const props = defineProps<{
  note: Note
}>()

defineEmits<{
  (e: 'delete', id: string): void
}>()

// 格式化时间（复用你 article-item 里的逻辑）
const formatDate = (timeStr: string) => {
  if (!timeStr) return ''
  // 支持 "2023-08-24 18:32:45" 或 ISO 格式
  if (timeStr.includes('T')) {
    return timeStr.split('T')[0]
  }
  return timeStr
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.note-item {
  background-color: $my-bg-card;
  border: 1px solid $my-border-color;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px $my-shadow-color;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px $my-shadow-color;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;

      .title {
        font-size: 16px;
        font-weight: 600;
        color: $my-text-main;
      }

      .star {
        font-size: 14px;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;

      .time {
        font-size: 12px;
        color: $my-text-sub;
      }

      .delete-btn {
        color: $my-text-sub;
        font-size: 14px;

        &:hover {
          color: var(--el-color-danger);
        }
      }
    }
  }

  .card-content {
    font-size: 14px;
    color: $my-text-main;
    line-height: 1.6;
    word-wrap: break-word; // 防止长文本撑破

    // 深度选择器：约束 Markdown 内部图片的样式，实现并排且有间距
    :deep(p) {
      margin: 0 0 8px 0;
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      border: 1px solid $my-border-color;
      vertical-align: middle;
      margin-right: 8px; // 图片之间的间距
      margin-bottom: 8px;
    }
  }
}
</style>
