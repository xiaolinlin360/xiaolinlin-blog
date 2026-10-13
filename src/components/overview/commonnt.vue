<template>
  <div class="comments-card">
    <div class="card-header">
      <span class="title">评论 {{ total }}</span>
    </div>

    <!-- 评论列表区域，高度自适应并支持内部滚动 -->
    <div class="comment-list">
      <div class="comment-item" v-for="item in commentList" :key="item.id">
        <!-- 先放着，等有时间再处理 -->
        <el-avatar :size="36" :src="item.imgurl" class="avatar" />

        <div class="comment-body">
          <div class="comment-header">
            <span class="nickname">{{ item.name }}</span>
            <span class="time">{{ item.created_at }}</span>
            <el-icon class="delete-icon" @click="handleDelete(item.id)"><Delete /></el-icon>
          </div>
          <p class="comment-text">{{ item.content }}</p>

          <div class="comment-tags">
            <el-tag size="small" class="tag-item">专栏文章</el-tag>
            <span v-if="item.is_complained === 1" class="report-text">已投诉</span>
          </div>
        </div>
      </div>

      <!-- 当没有数据时显示占位 -->
      <el-empty v-if="commentList.length === 0" description="暂无评论" :image-size="60" />
    </div>

    <!-- 分页器区域固定在底部 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[100, 200, 300, 400]"
        size="default"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { getComments, getTotalComment, type Comment, deleteComment } from '@/api/comments'

// 分页参数
const currentPage = ref(1)
const pageSize = ref(5)
let total = ref(0)
// 当前展示的评论数据
const commentList = ref<Comment[]>([])
// 模拟从后端根据页码获取数据的函数
const fetchComments = async (page: number) => {
  const totalRes = await getTotalComment()
  total.value = totalRes.data.total
  const res = await getComments({ pageNum: page, pageSize: pageSize.value })
  commentList.value = res.data.comments
  console.dir(total.value)
  console.dir(res)
}

// 监听页码变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchComments(currentPage.value)
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchComments(val)
}

// 删除评论
const handleDelete = async (id: number) => {
  await deleteComment(id)
  fetchComments(currentPage.value)
}
// 初始化
onMounted(() => {
  fetchComments(currentPage.value)
})
</script>

<style scoped lang="scss">
.comments-card {
  background-color: $my-bg-card;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px $my-shadow-color;
  display: flex;
  flex-direction: column;
  height: 100%; /* 关键：高度 100% 与左侧对齐 */
  overflow: hidden; /* 防止内容溢出圆角卡片 */
  transition:
    background-color 0.3s,
    box-shadow 0.3s;

  .card-header {
    margin-bottom: 16px;
    flex-shrink: 0; /* 头部固定不压缩 */
    .title {
      font-size: 16px;
      font-weight: 600;
      color: $my-text-main;
    }
  }

  .comment-list {
    flex: 1; /* 占据剩余全部空间 */
    overflow-y: auto; /* 内部独立滚动 */
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-right: 4px; /* 为滚动条留一点空间 */
    margin-bottom: 16px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
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
          .report-text {
            font-size: 12px;
            color: #f56c6c;
          }
        }
      }
    }
  }

  .pagination-wrapper {
    flex-shrink: 0; /* 分页器固定不压缩 */
    display: flex;
    justify-content: flex-end;

    :deep(.el-pagination.is-background .el-pager li.is-active) {
      background-color: #2b5cff;
    }
  }
}
</style>
