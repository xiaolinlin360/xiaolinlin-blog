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
        <span class="title">私信：{{ total }}</span>
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
          @click="handleRead(item)">
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

            <!-- 悬浮删除按钮 -->
            <div class="delete-btn" @click.stop="handleDelete(item)">
              <el-icon><Delete /></el-icon>
            </div>
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
  (e: 'delete', id: string): void
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
    console.log(messages.value)
  } catch (error) {
    console.error('获取私信列表失败', error)
  } finally {
    loading.value = false
  }
}

// 标记为已读
const handleRead = async (item: getMessageRef) => {
  try {
    const res = await readMessage({ id: item.id })
    item.is_read = true
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
@use '@/style/variables.scss' as *;

.message-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05); // 适配暗黑模式，更柔和
    color: $my-text-main;
    background-color: $my-bg-card;
  }

  :deep(.el-drawer__body) {
    padding: 0;
    background-color: $my-bg-page;
    // 优化滚动条样式（针对暗黑模式）
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
  }

  .drawer-header {
    display: flex;
    align-items: center;
    .title {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 1px;
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
      border-bottom: 1px solid rgba(255, 255, 255, 0.03); // 极细的分割线
      background-color: transparent; // 继承底色，更显轻盈
      transition: all 0.25s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.04); // 悬浮微亮，替代原有的 $my-bg-hover

        .delete-btn {
          opacity: 1;
          transform: translateY(-50%) scale(1);
        }

        .bottom-actions {
          opacity: 1; // 悬浮时操作栏完全显现
        }
      }

      // 未读消息样式
      &.is-unread {
        .sender-name {
          font-weight: 600;
          color: #fff; // 未读名字高亮
        }
        .message-text {
          color: rgba(255, 255, 255, 0.9);
        }
        // 增加一个未读小红点提示
        &::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          background-color: #f56c6c;
          border-radius: 50%;
        }
      }

      .avatar {
        flex-shrink: 0;
        margin-right: 14px;
        border: 1px solid rgba(255, 255, 255, 0.1); // 头像加个边框，增加层次感
      }

      .content-box {
        flex: 1;
        min-width: 0; // 防止文本溢出 flex 盒子
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-right: 24px; // 给右侧删除按钮留出整体空间

        .top-row {
          display: flex;
          flex-direction: row; /* 改为横向排列 */
          justify-content: space-between; /* 两端对齐 */
          align-items: center;
          margin-bottom: 6px;

          .sender-name {
            max-width: 60%; // 防止名字太长顶掉时间
            font-size: 14px;
            font-weight: 500;
            color: $my-text-main;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .time {
            font-size: 12px;
            color: $my-text-sub;
            flex-shrink: 0;
          }
        }

        .message-text {
          font-size: 13px;
          color: $my-text-sub;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2; // 最多显示2行
          line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }

        .bottom-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
          font-size: 12px;
          color: $my-text-sub;
          opacity: 0.6; // 默认降低透明度，减少视觉干扰
          transition: opacity 0.2s;

          .edit-tag {
            color: #e6a23c;
            background: rgba(230, 162, 60, 0.1);
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 11px;
          }

          .action-btn {
            cursor: pointer;
            transition: color 0.2s;
            position: relative;

            // 给按钮之间加点分隔小圆点
            &:not(:last-child)::after {
              content: '·';
              position: absolute;
              right: -10px;
              color: rgba(255, 255, 255, 0.2);
            }

            &:hover {
              color: #fff;
            }

            &.report:hover {
              color: #f56c6c;
            }
          }
        }
      }

      // 优化删除按钮：垂直居中，默认隐藏缩小
      .delete-btn {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%) scale(0.8);
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%; // 圆形按钮
        color: $my-text-sub;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        background-color: rgba(255, 255, 255, 0.08);

        &:hover {
          color: #fff;
          background-color: #f56c6c; // 直接变红，警示性更强
        }

        .el-icon {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
