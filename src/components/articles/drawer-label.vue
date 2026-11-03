<template>
  <el-drawer
    v-model="visible"
    title="管理标签"
    size="400px"
    class="label-drawer"
    :show-close="false"
    @close="handleClose">
    <!-- 顶部搜索 -->
    <div class="search-wrap">
      <el-input
        v-model="searchQuery"
        placeholder="输入 ID 或名称搜索标签"
        clearable
        :prefix-icon="Search"
        @keyup.enter="handleSearch(searchQuery)"
        class="custom-input" />
    </div>

    <!-- 1. 未选择区域（可滚动） -->
    <div class="label-section available-section">
      <div class="section-title">全部标签</div>
      <div class="scroll-box">
        <el-tag
          v-for="label in searchResults.length ? searchResults : originalLabels"
          :key="label.id"
          class="tag-item"
          type="info"
          effect="plain"
          @click="handleSelect(label)">
          {{ label.label_name }}
        </el-tag>
        <el-empty
          v-if="originalLabels.length === 0"
          description="没有找到相关标签"
          :image-size="60" />
      </div>
    </div>

    <!-- 2. 已选择区域 -->
    <div class="label-section selected-section">
      <div class="section-title">已选择的标签 ({{ editLabels.length }})</div>
      <div class="scroll-box">
        <div v-for="label in editLabels" :key="label.id" class="selected-item">
          <!-- 编辑模式 -->
          <el-input
            v-if="editingId === label.id"
            v-model="editingValue"
            size="small"
            class="edit-input"
            @blur="saveEdit(label)"
            @keyup.esc="cancelEdit"
            @keyup.enter="saveEdit(label)" />

          <!-- 展示模式 -->
          <template v-else>
            <span class="name-text" @dblclick="startEdit(label)">{{ label.label_name }}</span>
            <el-icon class="remove-icon" @click="handleRemove(label)"><Close /></el-icon>
          </template>
        </div>
        <div v-if="editLabels.length === 0" class="empty-tip">暂无选择</div>
      </div>
    </div>

    <!-- 3. 已选择删除区域 -->
    <div class="label-section selected-section">
      <div class="section-title">已选择删除的标签 ({{ deletedLabels.length }})</div>
      <div class="scroll-box">
        <div v-for="label in deletedLabels" :key="label.id" class="selected-item">
          <span class="name-text" @dblclick="CancelHandleRemove(label)">{{
            label.label_name
          }}</span>
        </div>
        <div v-if="deletedLabels.length === 0" class="empty-tip">暂无选择</div>
      </div>
    </div>

    <!-- 底部确认 -->
    <template #footer>
      <div class="drawer-footer">
        <el-button class="btn-confirm" type="primary" :loading="submitting" @click="handleConfirm">
          确认提交
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
// 这里根据你实际使用的 API 替换
import { getLabels, updateLabels, deleteLabels, type Labels } from '@/api/labels'

const props = defineProps<{
  modelValue: boolean
  originalLabels: Labels[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'refresh'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 状态管理
//originalLabels + editLabels + searchResults + deletedLabels
//初始标签，编辑标签，搜索结果，删除标签
const searchQuery = ref('')
const originalLabels = computed(() => props.originalLabels)
const searchResults = ref<Labels[]>([])
const editLabels = ref<Labels[]>([])
const deletedLabels = ref<Labels[]>([])
const submitting = ref(false)

// 编辑状态
const editingId = ref<string | null>(null)
const editingValue = ref('')

// 监听抽屉打开，初始化数据
watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      searchQuery.value = ''
      editingId.value = null
      deletedLabels.value = []
      editLabels.value = []
      searchResults.value = []
    }
  }
)

// 获取标签
const handleSearch = async (query: string) => {
  const res = await getLabels({ keyword: query })
  searchResults.value = res.data
}

// 选择标签
const handleSelect = (label: Labels) => {
  //过滤id，不能有相同的进入
  if (editLabels.value.some((item) => item.id === label.id)) {
    return
  }
  //把选择的标签添加进入
  editLabels.value.push(label)
}

// 移除标签（标记删除）
const handleRemove = (label: Labels) => {
  editLabels.value = editLabels.value.filter((i) => i.id !== label.id)
  if (deletedLabels.value.some((i) => i.id === label.id)) {
    ElMessage.warning('标签已选择')
  }
  deletedLabels.value.push(label)
  console.log(deletedLabels.value)
}

const CancelHandleRemove = (label: Labels) => {
  // 从已删除中移除
  deletedLabels.value = deletedLabels.value.filter((item) => item.id !== label.id)
  // 添加回已选中
  if (!editLabels.value.some((i) => i.id === label.id)) {
    editLabels.value.push(label)
  }
}

// 开启编辑
const startEdit = (label: Labels) => {
  editingId.value = label.id
  editingValue.value = label.label_name
}

// 保存编辑
const saveEdit = (label: Labels) => {
  const trimmed = editingValue.value.trim()
  if (!trimmed) {
    ElMessage.warning('标签名不能为空')
    return
  }
  // 不原地改 props 引用,用新对象替换
  const idx = editLabels.value.findIndex((item) => item.id === label.id)
  if (idx !== -1) {
    editLabels.value[idx] = { ...editLabels.value[idx], label_name: trimmed }
  }
  editingId.value = null
  editingValue.value = ''
}
const cancelEdit = () => {
  editingId.value = null
  editingValue.value = ''
}

// 确认提交
const handleConfirm = async () => {
  submitting.value = true
  try {
    const updateQueue: Promise<any>[] = []
    // 1. 处理删除逻辑
    for (const label of deletedLabels.value) {
      updateQueue.push(
        deleteLabels({ id: label.id }).catch((e) =>
          console.error(`删除标签${label.label_name}失败`, e)
        )
      )
    }
    // 2. 处理更新逻辑（比较原数据）
    for (const label of editLabels.value) {
      const original = originalLabels.value.find((item) => item.id === label.id)
      if (original && original.label_name !== label.label_name) {
        updateQueue.push(
          updateLabels({
            id: label.id,
            label_name: label.label_name,
          })
        )
      }
    }
    await Promise.all(updateQueue)
    ElMessage.success('标签操作全部完成')
    emit('refresh') // 通知父组件刷新
    visible.value = false // 关闭抽屉
  } catch (error) {
    ElMessage.error('部分操作失败，请检查网络')
  } finally {
    submitting.value = false
  }
}

// 关闭时清理状态
const handleClose = () => {
  editingId.value = null
  searchQuery.value = ''
}
</script>

<style lang="scss" scoped>
@use '@/style/variables.scss' as *;

.label-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 20px 20px 10px;
    color: $my-text-main;
    font-weight: 600;
  }
  :deep(.el-drawer__body) {
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: hidden;
  }
}

.search-wrap {
  .custom-input {
    :deep(.el-input__wrapper) {
      background-color: $my-bg-hover;
      box-shadow: none;
      border-radius: 8px;
    }
  }
}

.label-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow: hidden;

  .section-title {
    font-size: 13px;
    color: $my-text-sub;
    font-weight: 500;
  }

  // 虚线框设计
  .scroll-box {
    flex: 1;
    border: 1px dashed $my-border-color;
    border-radius: 8px;
    padding: 12px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 8px;

    // 限制高度，不超过 5 行
    max-height: 220px;
    min-height: 100px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: $my-border-color;
      border-radius: 4px;
    }
  }
}

// 可选标签样式
.available-section {
  flex: 0 0 auto;
  .tag-item {
    cursor: pointer;
    background-color: $my-bg-hover;
    border-color: transparent;
    color: $my-text-main;
    transition: all 0.2s;
    max-width: 100%;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }
}

// 已选标签样式
.selected-section {
  flex: 1;

  .scroll-box {
    align-content: flex-start;
    flex-direction: column; // 竖排，方便展示编辑框
    flex-wrap: nowrap;
  }

  .selected-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    background-color: $my-bg-hover;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(144, 147, 153, 0.15);
      .remove-icon {
        opacity: 1;
      }
    }

    .name-text {
      font-size: 13px;
      color: $my-text-main;
      flex: 1;
      user-select: none;
    }

    .remove-icon {
      font-size: 14px;
      color: $my-text-sub;
      opacity: 0;
      transition: all 0.2s;

      &:hover {
        color: var(--el-color-danger);
      }
    }

    .edit-input {
      width: 100%;
    }
  }

  .empty-tip {
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: $my-text-sub;
    margin-top: 20px;
  }
}

.drawer-footer {
  padding: 0 20px 20px;

  .btn-confirm {
    width: 100%;
    border-radius: 8px;
    height: 40px;
  }
}
</style>
