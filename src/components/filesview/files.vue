<template>
  <div class="files-container">
    <!-- 顶部操作栏 -->
    <div class="header-actions">
      <div class="left-actions">
        <el-checkbox
          v-model="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll">
          全选
        </el-checkbox>
        <span class="selected-text">
          已选择 <span class="highlight">{{ selectedIds.length }}</span> 项内容
        </span>
        <el-button
          v-if="selectedIds.length > 0"
          link
          type="primary"
          class="clear-btn"
          @click="clearSelection">
          取消选择
        </el-button>
      </div>

      <div class="right-actions" v-if="selectedIds.length > 0">
        <el-tooltip content="删除" placement="top">
          <el-icon class="action-icon delete-icon" @click="handleBatchDelete">
            <Delete />
          </el-icon>
        </el-tooltip>
        <el-tooltip content="移动" placement="top">
          <el-icon class="action-icon" @click="handleBatchMove">
            <Switch />
          </el-icon>
        </el-tooltip>
      </div>
    </div>

    <!-- 文件网格列表 (去除 currentPageFiles，直接使用 files) -->
    <div class="file-grid">
      <div
        v-for="file in files"
        :key="file.id"
        class="file-card"
        :class="{ 'is-selected': selectedIds.includes(file.id) }"
        @click="toggleSelect(file.id)">
        <!-- 图片/预览区 -->
        <div class="image-wrapper">
          <el-image :src="file.url" fit="contain" class="preview-img">
            <template #error>
              <div class="image-error">加载失败</div>
            </template>
          </el-image>

          <!-- 左上角复选框 (选中时或悬浮时显示) -->
          <div class="checkbox-wrapper" @click.stop>
            <el-checkbox
              :model-value="selectedIds.includes(file.id)"
              @change="toggleSelect(file.id)" />
          </div>

          <!-- 底部悬浮操作栏 -->
          <div class="hover-actions" @click.stop>
            <el-icon class="hover-icon" @click="handleSingleDelete(file)"><Delete /></el-icon>
            <el-icon class="hover-icon" @click="handleSingleMove(file)"><Switch /></el-icon>
          </div>
        </div>

        <!-- 文件名 (根据接口字段名改为 file_name) -->
        <div class="file-name" :title="file.file_name">
          {{ file.file_name }}
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-if="files.length === 0" description="暂无数据" />

    <!-- 分页 (total 改为后端的 total) -->
    <div class="pagination-wrapper" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="prev, pager, next, jumper"
        background />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Delete, Switch } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 导入真实的接口和类型 (假设文件路径为 @/api/files)
import { getFiles, getTotalFile } from '@/api/files'
import type { FileItem } from '@/api/files'

// 数据状态
const files = ref<FileItem[]>([])
const total = ref(0)

// 选中的 ID 列表
const selectedIds = ref<string[]>([])

// 分页逻辑
const currentPage = ref(1)
const pageSize = ref(10) // 默认值改为10，与 page-sizes 匹配

// 获取数据方法
const fetchFiles = async () => {
  try {
    // 1. 获取文件列表
    const res = await getFiles({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    })
    files.value = res.data.files || []

    // 清空选择，防止跨页保留
    selectedIds.value = []

    // 2. 获取总数
    const totalRes = await getTotalFile()
    total.value = totalRes.data.total || 0
  } catch (error) {
    console.error('获取文件失败', error)
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  fetchFiles()
})

// 监听页码和页大小变化，重新请求数据
watch([currentPage, pageSize], () => {
  fetchFiles()
})

// 全选相关逻辑 (针对当前页)
const isAllSelected = computed({
  get: () => {
    return files.value.length > 0 && selectedIds.value.length === files.value.length
  },
  set: () => {},
})

const isIndeterminate = computed(() => {
  return selectedIds.value.length > 0 && selectedIds.value.length < files.value.length
})

// 切换全选
const handleSelectAll = (val: boolean | string | number) => {
  if (val) {
    selectedIds.value = files.value.map((f) => f.id)
  } else {
    selectedIds.value = []
  }
}

// 单个选择/取消选择
const toggleSelect = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

// 清空选择
const clearSelection = () => {
  selectedIds.value = []
}

/*




后端分页下，删除成功后应该重新调用 fetchFiles() 刷新列表
*/

// 单个删除 (悬浮按钮触发)
const handleSingleDelete = (file: FileItem) => {
  ElMessageBox.confirm(`确定要删除 "${file.file_name}" 吗？`, '提示', {
    type: 'warning',
  })
    .then(() => {
      files.value = files.value.filter((f) => f.id !== file.id)
      total.value -= 1 // 总数减一
      selectedIds.value = selectedIds.value.filter((id) => id !== file.id)
      ElMessage.success('删除成功(前端模拟)')
    })
    .catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) return
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个文件吗？`, '提示', {
    type: 'warning',
  })
    .then(() => {
      // 记录删除数量
      const deleteCount = selectedIds.value.length
      files.value = files.value.filter((f) => !selectedIds.value.includes(f.id))
      total.value -= deleteCount // 总数扣除
      selectedIds.value = []
      ElMessage.success('批量删除成功(前端模拟)')
    })
    .catch(() => {})
}

// 单个移动 / 批量移动 (占位方法)
const handleSingleMove = (file: FileItem) => {
  ElMessage.info(`准备移动文件: ${file.file_name}`)
}
const handleBatchMove = () => {
  ElMessage.info(`准备移动 ${selectedIds.value.length} 个文件`)
}
</script>

<style lang="scss" scoped>
/* 样式保持原样，未作任何修改 */
@use '@/style/variables.scss' as *;

.files-container {
  padding: 20px;
  background-color: $my-bg-card;
  border-radius: 8px;
  min-height: calc(100vh - 100px);
}

/* 顶部操作栏 */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: $my-bg-page;
  border-radius: 8px;
  margin-bottom: 20px;

  .left-actions {
    display: flex;
    align-items: center;
    gap: 16px;

    .selected-text {
      font-size: 14px;
      color: $my-text-sub;

      .highlight {
        color: var(--el-color-primary);
        font-weight: 600;
      }
    }

    .clear-btn {
      font-size: 14px;
    }
  }

  .right-actions {
    display: flex;
    align-items: center;
    gap: 16px;

    .action-icon {
      font-size: 18px;
      color: $my-text-sub;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        color: var(--el-color-primary);
      }

      &.delete-icon:hover {
        color: var(--el-color-danger);
      }
    }
  }
}

/* 网格布局 */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 24px;
  margin-bottom: 30px;

  .file-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    cursor: pointer;

    &.is-selected {
      background-color: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary);

      .checkbox-wrapper {
        opacity: 1;
      }
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 140px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 12px;
      border-radius: 6px;
      overflow: hidden;

      .preview-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .image-error {
        font-size: 12px;
        color: $my-text-sub;
      }

      .checkbox-wrapper {
        position: absolute;
        top: 8px;
        left: 8px;
        z-index: 2;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .hover-actions {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 32px;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        opacity: 0;
        transition: opacity 0.2s;

        .hover-icon {
          color: #fff;
          font-size: 16px;
          cursor: pointer;

          &:hover {
            color: var(--el-color-primary-light-5);
          }
        }
      }
    }

    &:hover {
      background-color: $my-bg-hover;

      .checkbox-wrapper,
      .hover-actions {
        opacity: 1;
      }
    }

    .file-name {
      width: 100%;
      text-align: center;
      font-size: 13px;
      color: $my-text-main;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>
