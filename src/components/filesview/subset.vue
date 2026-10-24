<template>
  <div class="category-tabs-container">
    <!-- 左侧：可滚动的标签列表 -->
    <div class="tabs-scroll">
      <div
        v-for="item in subsets"
        :key="item.name"
        class="tab-item"
        :class="{ active: subset_active === item.id }"
        @click="handleSelect(item.id)">
        {{ item.name }}
        <el-icon v-if="deleteRef" @click="subsetDelete(item.id)" class="delete-icon"
          ><CloseBold
        /></el-icon>
      </div>
    </div>

    <!-- 右侧：固定操作按钮 -->
    <div class="action-area">
      <el-button link type="primary" class="action-btn" @click="create">
        <el-icon><CirclePlus /></el-icon>新建
      </el-button>
      <el-button
        link
        type="primary"
        class="action-btn"
        @click="deleteRef = !deleteRef"
        v-if="!deleteRef">
        <el-icon><Setting /></el-icon>管理分组
      </el-button>
      <div v-else>
        <el-button link type="primary" class="action-btn" @click="apisubsetDelete">
          <el-icon><Setting /></el-icon>确认删除
        </el-button>
        <el-button link type="primary" class="action-btn" @click="cancelDelete">
          <el-icon><Setting /></el-icon>取消
        </el-button>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title="新建分组"
    width="380px"
    class="custom-create-dialog"
    align-center
    :show-close="false"
    destroy-on-close>
    <div class="dialog-content">
      <el-input
        v-model="inputValue"
        placeholder="请输入"
        :maxlength="6"
        show-word-limit
        class="custom-input" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="btn-cancel" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" class="btn-confirm" @click="confirmCreate">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { CirclePlus, Setting, CloseBold } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { getCategoryIdByPath } from '@/utils/category'
import { type SubsetRef, getSubset, insertSubset, deleteSubset } from '@/api/subsets'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()
const subsets = ref<SubsetRef[]>([])
const subset_active = ref<string | undefined>()
const category = ref<string | undefined>()
const deleteRef = ref<boolean>(false)
const subsetDeleteArr = ref<string[]>([])

// --- 新增：弹窗相关状态 ---
const dialogVisible = ref(false)
const inputValue = ref('')

const a = async () => {
  category.value = await getCategoryIdByPath(router.currentRoute.value.path)
  if (category.value) {
    const res = await getSubset({ category_id: category.value })
    subsets.value = res.data
  }
}
a()
// Props & Emits
const emit = defineEmits<{
  (e: 'subset_id', value: string | undefined): void
}>()

// 切换标签
const handleSelect = (id: string | undefined) => {
  subset_active.value = id
  emit('subset_id', id)
}

// 新建分组
const create = () => {
  inputValue.value = ''
  dialogVisible.value = true
}
const confirmCreate = async () => {
  if (!inputValue.value.trim()) return

  try {
    const res = await insertSubset({ category_id: category.value, name: inputValue.value })
    if (res.code === 200) {
      ElMessage.success('新建成功')
    } else {
      ElMessage.error(res.data[0].message || '新建失败')
    }
    a()
  } catch (error: any) {
    ElMessage.error(error.response.data.data.message || '新建失败')
  } finally {
    dialogVisible.value = false
  }
}

// 删除分组
const subsetDelete = async (id: string) => {
  try {
    subsetDeleteArr.value.push(id)
    subsets.value = subsets.value.filter((item) => !subsetDeleteArr.value.includes(item.id))
  } catch (error: any) {
    ElMessage.error(error.response.data.data.message || '删除失败')
  }
}
const apisubsetDelete = async () => {
  try {
    let res: any = null
    if (subsetDeleteArr.value.length === 0) return ElMessage.warning('请选择要删除的分组')
    for (let i = 0; i < subsetDeleteArr.value.length; i++) {
      res = await deleteSubset({ id: subsetDeleteArr.value[i] })
    }
    if (res.code === 200) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(res.data[0].message || '删除失败')
    }
    a()
  } catch (error: any) {
    if (error.response.data.code === 400) {
      console.log(error.response.data.data)
      ElMessage.error(error.response.data.data.message || '删除失败')
      a()
    } else {
      ElMessage.error(error.response.data.data.message || '删除失败')
    }
  } finally {
    deleteRef.value = false
    subsetDeleteArr.value = []
  }
}
//取消删除
const cancelDelete = () => {
  deleteRef.value = false
  subsetDeleteArr.value = []
  a()
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.category-tabs-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 8px;
  gap: 20px;
  background-color: $my-bg-card;

  // 左侧滚动区域
  .tabs-scroll {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    overflow-x: auto;

    // 隐藏滚动条（保持界面清爽）
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
    .delete-icon {
      margin: 2px 0 0 4px;
      font-size: 16px;
      color: $my-text-sub;
    }

    .tab-item {
      display: flex;
      align-items: center;
      padding: 6px 16px;
      border-radius: 20px; // 胶囊形状
      font-size: 14px;
      color: $my-text-sub; // 次要文字颜色
      background-color: $my-bg-hover; // 亮色灰底/暗色深底，刚好作为未选中背景
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      user-select: none;

      &:hover {
        // 悬浮时稍微加深一点背景，适配亮暗色
        background-color: rgba(144, 147, 153, 0.15);
        color: #2b5cff;
      }

      .count {
        margin-left: 4px;
        font-size: 13px;
        opacity: 0.9;
      }

      // 选中状态
      &.active {
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
        font-weight: 500;

        // 根据 ElementPlus 变量，暗黑模式下会自动变为深蓝半透明底
        :deep(.el-icon) {
          color: var(--el-color-primary);
        }
      }
    }
  }

  // 右侧操作区域（保证不被挤压）
  .action-area {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;

    .action-btn {
      font-size: 14px;

      .el-icon {
        margin-right: 4px;
        font-size: 16px; // 图标稍微大一点更精致
      }
    }
  }
}

/* --- 新增：弹窗样式定制 --- */
:deep(.custom-create-dialog) {
  background-color: $my-bg-card;
  border-radius: 12px;

  .el-dialog__header {
    padding: 20px 20px 10px;
    margin-right: 0;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: $my-text-main;
    }
  }

  .el-dialog__body {
    padding: 10px 20px 20px;
  }

  .el-dialog__footer {
    padding: 0 20px 20px;
  }

  // 输入框定制
  .custom-input {
    :deep(.el-input__wrapper) {
      background-color: $my-bg-hover; // 使用主题的悬浮色/灰底色
      box-shadow: none; // 去除默认边框
      border-radius: 8px;
      padding: 6px 12px;

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }

    :deep(.el-input__inner) {
      color: $my-text-main;
      &::placeholder {
        color: $my-text-sub;
      }
    }

    :deep(.el-input__count) {
      background: transparent; // 让字数统计背景透明
      color: $my-text-sub;
    }
  }

  // 底部按钮区域
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .btn-cancel {
      background-color: $my-bg-hover;
      border: none;
      color: $my-text-main;

      &:hover {
        background-color: rgba(144, 147, 153, 0.15);
      }
    }

    .btn-confirm {
      border-radius: 6px;
      // 如果觉得 ElementPlus 默认蓝色不够，可以在这里覆盖背景色，比如 background-color: #2b5cff;
    }
  }
}
</style>
