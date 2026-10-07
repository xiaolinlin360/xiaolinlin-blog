<template>
  <div class="comments-card">
    <div class="card-header">
      <span class="title">评论 1234</span>
    </div>

    <div class="comment-list">
      <div class="comment-item" v-for="item in commentList" :key="item.id">
        <el-avatar :size="36" :src="item.avatar" class="avatar" />
        <div class="comment-body">
          <div class="comment-header">
            <span class="nickname">{{ item.nickname }}</span>
            <span class="time">{{ item.time }}</span>
            <el-icon class="delete-icon"><Delete /></el-icon>
          </div>
          <p class="comment-text">{{ item.content }}</p>
          <div class="comment-tags">
            <el-tag v-for="tag in item.tags" :key="tag" size="small" class="tag-item">{{
              tag
            }}</el-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-wrapper">
      <el-pagination layout="prev, pager, next" :total="2345" :page-size="5" small />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const commentList = ref([
  {
    id: 1,
    nickname: '哈举办',
    time: '2024-01-18 14:32:32',
    content: '很高兴见到了你，你是那么的美丽动人！',
    tags: ['追光时光'],
    avatar: '',
  },
  {
    id: 2,
    nickname: '哈举办',
    time: '2024-01-18 14:32:32',
    content: '很高兴见到了你，你是那么的美丽动人！',
    tags: ['西北大环线第一天'],
    avatar: '',
  },
  {
    id: 3,
    nickname: '哈举办',
    time: '2024-01-18 14:32:32',
    content: '很高兴见到了你，你是那么的美丽动人！',
    tags: ['西北大环线第一天'],
    avatar: '',
  },
  {
    id: 4,
    nickname: '哈举办',
    time: '2024-01-18 14:32:32',
    content: '很高兴见到了你，你是那么的美丽动人！',
    tags: ['这是已经被删除的文章'],
    avatar: '',
  },
])
</script>

<style scoped lang="scss">
.comments-card {
  background-color: $my-bg-card;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px $my-shadow-color;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;

  .card-header {
    margin-bottom: 16px;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: $my-text-main;
    }
  }

  .comment-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;

    &::-webkit-scrollbar {
      display: none;
    }

    .comment-item {
      display: flex;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid $my-border-color;

      &:last-child {
        border-bottom: none;
      }

      .comment-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;

        .comment-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: $my-text-sub;
          .nickname {
            font-weight: 600;
            color: $my-text-main;
          }
          .delete-icon {
            margin-left: auto;
            cursor: pointer;
            &:hover {
              color: #f56c6c;
            }
          }
        }

        .comment-text {
          font-size: 13px;
          color: $my-text-main;
          margin: 0;
          line-height: 1.4;
        }

        .comment-tags {
          display: flex;
          align-items: center;
          gap: 8px;
          .tag-item {
            background-color: rgba(43, 92, 255, 0.1);
            border: none;
            color: #2b5cff;
          }
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    :deep(.el-pagination.is-background .el-pager li.is-active) {
      background-color: #2b5cff;
    }
  }
}
</style>
