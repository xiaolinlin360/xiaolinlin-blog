<template>
  <div class="article-item">
    <!-- 左侧封面图 -->
    <div class="cover-wrap">
      <el-image :src="coverUrl" fit="cover" class="cover-img">
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>

    <!-- 右侧内容 -->
    <div class="content-wrap">
      <!-- 标题 -->
      <h3 class="title">{{ article.title }}</h3>

      <!-- 简介 -->
      <p class="introduce">{{ article.introduce }}</p>

      <!-- 标签列表 -->
      <div class="tag-list" v-if="article.labels?.length">
        <el-tag
          v-for="label in article.labels"
          :key="label.id"
          class="custom-tag"
          type="info"
          effect="plain"
          @click="copyLabelId(label.id)">
          {{ label.label_name }}
        </el-tag>
      </div>

      <!-- 底部信息栏 -->
      <div class="meta-info">
        <div class="left-meta">
          <span class="author">所属: {{ article.username_name }}</span>
          <span class="date">{{ formatDate(article.created_at) }}</span>
          <div class="stats">
            <span class="stat-item"
              ><el-icon><View /></el-icon> 0</span
            >
            <span class="stat-item"
              ><el-icon><Star /></el-icon> 0</span
            >
            <span class="stat-item clickable" title="查看评论" @click="$emit('comment', article)">
              <el-icon><ChatDotRound /></el-icon> 评论
            </span>
            <!-- 附件按钮：点击复制 file_urls 原始数组 -->
            <span
              v-if="article.file_urls?.length"
              class="stat-item attachment"
              @click="copyAttachments">
              <el-icon><Paperclip /></el-icon> {{ article.file_urls.length }}
            </span>
          </div>
        </div>

        <!-- 操作按钮组 -->
        <div class="action-group">
          <el-tooltip content="编辑" placement="top">
            <el-button link class="action-btn" @click="$emit('edit', article)">
              <el-icon><EditPen /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link class="action-btn delete-btn" @click="$emit('delete', article.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Picture,
  View,
  Star,
  ChatDotRound,
  EditPen,
  Delete,
  Paperclip,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { toAbsoluteUrl } from '@/utils/asset'
import type { Article } from '@/api/blog' // 引入你定义的接口

const props = defineProps<{
  article: Article
}>()

defineEmits<{
  (e: 'edit', article: Article): void
  (e: 'delete', id: string): void
  (e: 'comment', article: Article): void
}>()

const coverUrl = computed(() => {
  // 后端在列表里已经把封面文件 join 出来了（字段名是 url，形如 /data/<id>/<name>）
  const raw = props.article.url
  if (!raw) {
    // 没传封面时给个占位图，避免卡片空白
    return `https://picsum.photos/200/200?random=${props.article.id.slice(0, 5)}`
  }
  return toAbsoluteUrl(raw)
})

// 格式化时间
const formatDate = (timeStr: string) => {
  if (!timeStr) return ''
  return timeStr.split('T')[0] // 只取 YYYY-MM-DD 部分
}

// 复制附件原始数组
const copyAttachments = async () => {
  const urls = props.article.file_urls
  if (!urls?.length) return
  try {
    await navigator.clipboard.writeText(JSON.stringify(urls))
    ElMessage.success(`已复制 ${urls.length} 个附件链接`)
  } catch {
    ElMessage.error('复制失败，请检查浏览器权限')
  }
}

// 复制标签 ID
const copyLabelId = async (id: string) => {
  try {
    await navigator.clipboard.writeText(id)
    ElMessage.success('已复制标签 ID')
  } catch {
    ElMessage.error('复制失败，请检查浏览器权限')
  }
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.article-item {
  display: flex;
  background-color: $my-bg-card;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 12px 0 $my-shadow-color;
  }

  // 左侧封面
  .cover-wrap {
    width: 160px;
    height: 110px;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    margin-right: 16px;

    .cover-img {
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
      background-color: $my-bg-hover;
      color: $my-text-sub;
      font-size: 24px;
    }
  }

  // 右侧内容
  .content-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0; // 防止文本撑破容器

    .title {
      font-size: 16px;
      font-weight: 600;
      color: $my-text-main;
      margin-bottom: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .introduce {
      font-size: 13px;
      color: $my-text-sub;
      line-height: 1.6;
      margin-bottom: 12px;
      // 多行文本截断 (最多2行)
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
    }

    // 标签列表样式
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;

      .custom-tag {
        background-color: $my-bg-hover;
        border-color: transparent;
        color: $my-text-sub;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-9);
        }
      }
    }

    // 底部信息
    .meta-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: $my-text-sub;

      .left-meta {
        display: flex;
        align-items: center;
        gap: 16px;

        .stats {
          display: flex;
          gap: 12px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;

            .el-icon {
              font-size: 14px;
            }

            // 「评论」入口：可点击
            &.clickable {
              cursor: pointer;
              transition: color 0.2s;

              &:hover {
                color: var(--el-color-primary);
              }
            }
          }

          // 附件按钮交互反馈
          .attachment {
            cursor: pointer;
            transition: color 0.2s;

            &:hover {
              color: var(--el-color-primary);
            }
          }
        }
      }

      // 操作按钮 (默认隐藏，悬浮显示)
      .action-group {
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.2s;

        .action-btn {
          color: $my-text-sub;
          font-size: 16px;

          &:hover {
            color: var(--el-color-primary);
          }

          &.delete-btn:hover {
            color: var(--el-color-danger);
          }
        }
      }
    }
  }

  // 鼠标悬浮显示操作按钮
  &:hover {
    .meta-info .action-group {
      opacity: 1;
    }
  }
}
</style>
