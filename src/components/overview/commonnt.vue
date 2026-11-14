<template>
  <div class="guestbook-card">
    <div class="card-header">
      <span class="title">留言 {{ total }}</span>
    </div>

    <!-- 发表留言：只要称呼 + 内容 -->
    <div class="write-box">
      <div class="write-row">
        <el-input
          v-model="form.nickname"
          maxlength="30"
          placeholder="你的称呼"
          class="nick-input" />
        <el-button type="primary" size="small" :loading="submitting" @click="handleSubmit">
          发表
        </el-button>
      </div>
      <el-input
        v-model="form.content"
        type="textarea"
        :rows="2"
        maxlength="500"
        placeholder="说点什么..."
        class="content-input" />
    </div>

    <!-- 留言列表：内部独立滚动 -->
    <div class="guestbook-list">
      <div v-for="item in list" :key="item.id" class="guestbook-item">
        <div class="avatar">{{ item.nickname.slice(0, 1) }}</div>

        <div class="body">
          <div class="header-row">
            <span class="nickname">{{ item.nickname }}</span>
            <span class="time">{{ formatTime(item.created_at) }}</span>
            <el-icon class="delete-icon" @click="handleDelete(item.id)"><Delete /></el-icon>
          </div>
          <p class="content">{{ item.content }}</p>
        </div>
      </div>

      <el-empty v-if="list.length === 0" description="还没有留言" :image-size="60" />
    </div>

    <!-- 分页器固定在底部 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        layout="prev, pager, next"
        :total="total"
        small
        @current-change="fetchList"
        @size-change="handleSizeChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import {
  getGuestbook,
  getTotalGuestbook,
  insertGuestbook,
  deleteGuestbook,
  type Guestbook,
} from '@/api/guestbook'
import formatTime from '@/utils/formatTime'

const list = ref<Guestbook[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(5)
const submitting = ref(false)
const form = ref({ nickname: '', content: '' })

const fetchList = async () => {
  const [listRes, totalRes] = await Promise.all([
    getGuestbook({ pageNum: pageNum.value, pageSize: pageSize.value }),
    getTotalGuestbook(),
  ])
  list.value = listRes.data.guestbooks
  total.value = totalRes.data.total
}

const handleSizeChange = () => {
  pageNum.value = 1
  fetchList()
}

// 发表留言
const handleSubmit = async () => {
  const nickname = form.value.nickname.trim()
  const content = form.value.content.trim()

  if (!nickname) {
    ElMessage.warning('请填写你的称呼')
    return
  }
  if (!content) {
    ElMessage.warning('留言内容不能为空')
    return
  }

  submitting.value = true
  try {
    await insertGuestbook({ nickname, content })
    ElMessage.success('留言成功')
    form.value = { nickname: '', content: '' }
    pageNum.value = 1 // 新留言在最前面，回到第一页
    await fetchList()
  } finally {
    submitting.value = false
  }
}

// 删除留言
const handleDelete = async (id: string) => {
  const confirm = await ElMessageBox.confirm('确定删除这条留言吗？', '提示', {
    type: 'warning',
  }).catch(() => false)
  if (!confirm) return

  await deleteGuestbook(id)
  ElMessage.success('已删除')
  await fetchList()
}

onMounted(fetchList)
</script>

<style scoped lang="scss">
.guestbook-card {
  background-color: $my-bg-card;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px $my-shadow-color;
  display: flex;
  flex-direction: column;
  height: 100%; /* 高度 100% 与左侧图表对齐 */
  overflow: hidden;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;

  .card-header {
    margin-bottom: 12px;
    flex-shrink: 0;

    .title {
      font-size: 16px;
      font-weight: 600;
      color: $my-text-main;
    }
  }

  /* 写留言 */
  .write-box {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid $my-border-color;

    .write-row {
      display: flex;
      gap: 8px;

      .nick-input {
        flex: 1;
      }
    }

    .content-input {
      :deep(.el-textarea__inner) {
        resize: none;
      }
    }
  }

  /* 留言列表 */
  .guestbook-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-right: 4px;
    margin-bottom: 12px;

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

    .guestbook-item {
      display: flex;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid $my-border-color;

      &:last-child {
        border-bottom: none;
      }

      /* 用称呼首字做头像，免去上传头像 */
      .avatar {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
      }

      .body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;

        .header-row {
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

        .content {
          font-size: 13px;
          color: $my-text-main;
          margin: 0;
          line-height: 1.5;
          word-break: break-word;
        }
      }
    }
  }

  .pagination-wrapper {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;

    :deep(.el-pagination.is-background .el-pager li.is-active) {
      background-color: #2b5cff;
    }
  }
}
</style>
