<template>
  <el-drawer
    v-model="visible"
    :with-header="true"
    size="400px"
    class="message-drawer"
    @open="handleOpen">
    <!-- 自定义头部 -->
    <template #header>
      <div class="drawer-header">
        <span class="title">私信{{ total }}</span>
      </div>
    </template>

    <!-- 消息列表 -->
    <div class="message-list" v-loading="loading">
      <template v-if="messages.length > 0">
        <div
          class="message-item"
          v-for="item in messages"
          :key="item.id"
          :class="{ 'is-unread': !item.is_read }"
          @click="handleRead(item.id)">
          <!-- 头像 -->
          <el-avatar :size="40" :src="item.sender_imgurl || defaultAvatar" class="avatar" />

          <!-- 内容区域 -->
          <div class="content-box">
            <div class="top-row">
              <span class="sender-name">{{ item.sender_name || '未知用户' }}</span>
              <span class="time">{{ formatTime(item.created_at) }}</span>
            </div>

            <!-- 渲染 content 和 msg_type -->
            <div class="message-text">
              <template v-if="item.msg_type === 1">{{ item.content }}</template>
              <template v-else-if="item.msg_type === 2">[图片消息]</template>
              <template v-else>[其他类型消息]</template>
            </div>

            <!-- 底部操作栏：说明 & 举报 & 编辑状态!!!!!!!!!!!!!!!!待补充 -->
            <div class="bottom-actions" @click.stop>
              <!-- 如果更新时间和创建时间不一致，说明改过，渲染 updated_at 相关说明 -->
              <span v-if="item.updated_at !== item.created_at" class="edit-tag">已编辑</span>
              <span class="action-btn">说明</span>
              <span class="action-btn report">举报</span>
            </div>
          </div>

          <!-- 悬浮删除按钮 -->
          <div class="delete-btn" @click.stop="handleDelete(item)">
            <el-icon><Delete /></el-icon>
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <el-empty v-else-if="!loading" description="暂无私信" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getMessage, type getMessageRef, getTotalMessage, readMessage } from '@/api/Message'
import formatTime from '@/utils/formatTime'

// 定义消息项类型
// Props & Emits
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'delete', id: number): void
}>()

// 控制抽屉显示
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 状态
const loading = ref(false)
const messages = ref<getMessageRef[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(20)
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 监听抽屉打开，加载数据
const handleOpen = async () => {
  if (messages.value.length === 0) {
    await fetchTotal()
    await fetchMessages()
  }
}

// 获取总数
const fetchTotal = async () => {
  try {
    const res = await getTotalMessage()
    total.value = res.data.total
  } catch (error) {
    console.error('获取私信总数失败', error)
  }
}

// 获取列表
const fetchMessages = async () => {
  loading.value = true
  try {
    const res = await getMessage({ pageNum: pageNum.value, pageSize: pageSize.value })
    messages.value = res.data.messages
  } catch (error) {
    console.error('获取私信列表失败', error)
  } finally {
    loading.value = false
  }
}

// 标记为已读
const handleRead = async (id: number) => {
  try {
    const res = await readMessage({ id })
    ElMessage.success(res.data.message)
  } catch (error) {
    console.error('标记已读失败', error)
    ElMessage.error('标记已读失败')
  }
}

// 删除私信（接口文档中暂未提供删除接口，预留事件）
const handleDelete = (item: getMessageRef) => {
  // 如果后端有删除接口，请在这里调用 API
  messages.value = messages.value.filter((msg) => msg.id !== item.id)
  total.value = Math.max(0, total.value - 1)
  ElMessage.success('删除成功')
  emit('delete', item.id)
}
</script>

<style lang="scss" scoped>
@import '@/style/variables.scss'; // 假设你的全局变量存放路径

.message-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 16px 20px;
    border-bottom: 1px solid $my-border-color;
    color: $my-text-main;
  }

  :deep(.el-drawer__body) {
    padding: 0;
    background-color: $my-bg-page;
  }

  .drawer-header {
    display: flex;
    align-items: center;
    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .message-list {
    height: 100%;
    overflow-y: auto;

    .message-item {
      position: relative;
      display: flex;
      padding: 16px 20px;
      cursor: pointer;
      border-bottom: 1px solid $my-border-color;
      background-color: $my-bg-card;
      transition: background-color 0.2s;

      &:hover {
        background-color: $my-bg-hover;

        .delete-btn {
          opacity: 1;
          visibility: visible;
        }
      }

      &.is-unread {
        .sender-name {
          font-weight: bold;
          color: $my-text-main;
        }
        .message-text {
          color: $my-text-main;
        }
      }

      .avatar {
        flex-shrink: 0;
        margin-right: 12px;
      }

      .content-box {
        flex: 1;
        min-width: 0; // 防止文本溢出 flex 盒子
        display: flex;
        flex-direction: column;
        justify-content: center;

        .top-row {
          display: flex;
          flex-direction: column; /* 改为纵向排列 */
          align-items: flex-start; /* 左对齐 */
          margin-bottom: 4px;
          padding-right: 28px; /* 关键：给右上角的删除按钮留出空间，防止名字太长被挡住 */

          .sender-name {
            width: 100%;
            font-size: 14px;
            color: $my-text-main;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .time {
            font-size: 12px;
            color: $my-text-sub;
            margin-left: 0; /* 清除之前的左边距 */
            margin-top: 2px; /* 让时间与名字有一点上下间距 */
          }
        }

        .message-text {
          font-size: 13px;
          color: $my-text-sub;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2; // 最多显示2行
          -webkit-box-orient: vertical;
          line-height: 1.4;
        }
        .bottom-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 6px;
          font-size: 12px;
          color: $my-text-sub;

          .edit-tag {
            color: #e6a23c; // 编辑状态的橙色提示
          }

          .action-btn {
            cursor: pointer;
            transition: color 0.2s;

            &:hover {
              color: $my-text-main;
            }

            &.report:hover {
              color: #f56c6c; // 举报按钮悬浮变红
            }
          }
        }
      }

      .delete-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        color: $my-text-sub;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s;
        background-color: rgba(0, 0, 0, 0.05); // 悬浮背景框

        &:hover {
          color: #f56c6c;
          background-color: rgba(245, 108, 108, 0.1);
        }

        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
